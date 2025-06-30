import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateDocument } from '@/lib/openai'
import { canCreateDocServer, rateLimitError } from '@/lib/rateLimit'
import { generateDocx } from '@/lib/docx'
import { generatePdf } from '@/lib/pdf'
import { DocumentType, DOCUMENT_TYPES } from '@/lib/utils'

interface GenerateRequest {
  title: string
  docType: DocumentType
  userInput: string
  additionalContext?: string
}

interface GenerateResponse {
  success: boolean
  data?: {
    documentId: string
    content: string
    docxUrl?: string
    pdfUrl?: string
  }
  error?: string
  code?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    // Parse request body
    const body: GenerateRequest = await request.json()
    const { title, docType, userInput, additionalContext } = body

    // Validate input
    if (!title?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Document title is required',
        code: 'INVALID_INPUT'
      }, { status: 400 })
    }

    if (!docType || !Object.keys(DOCUMENT_TYPES).includes(docType)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid document type',
        code: 'INVALID_DOC_TYPE'
      }, { status: 400 })
    }

    if (!userInput?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'User input is required for document generation',
        code: 'INVALID_INPUT'
      }, { status: 400 })
    }

    // Get authenticated user
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid authentication token',
        code: 'UNAUTHORIZED'
      }, { status: 401 })
    }

    // Check rate limit
    const canCreate = await canCreateDocServer(user.id)
    if (!canCreate) {
      return NextResponse.json({
        success: false,
        ...rateLimitError()
      }, { status: 429 })
    }

    // Create document record (draft status)
    const { data: document, error: createError } = await supabaseAdmin
      .from('docs')
      .insert({
        user_id: user.id,
        title: title.trim(),
        doc_type: docType,
        content: '',
        status: 'generating'
      })
      .select()
      .single()

    if (createError || !document) {
      console.error('Error creating document:', createError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create document record',
        code: 'DATABASE_ERROR'
      }, { status: 500 })
    }

    try {
      // Generate document content using OpenAI
      const generationResult = await generateDocument(docType, userInput, additionalContext)

      if (!generationResult.success || !generationResult.content) {
        // Update document status to error
        await supabaseAdmin
          .from('docs')
          .update({ status: 'error' })
          .eq('id', document.id)

        return NextResponse.json({
          success: false,
          error: generationResult.error || 'Failed to generate document content',
          code: 'GENERATION_ERROR'
        }, { status: 500 })
      }

      const generatedContent = generationResult.content

      // Generate DOCX file
      let docxUrl: string | undefined
      try {
        const docxBuffer = await generateDocx({
          title: title.trim(),
          content: generatedContent,
          docType,
          metadata: {
            author: user.email || 'AI Law Agent User',
            created: new Date()
          }
        })

        // Upload DOCX to Supabase Storage
        const docxFileName = `${document.id}.docx`
        const { data: docxUpload, error: docxUploadError } = await supabaseAdmin.storage
          .from('documents')
          .upload(docxFileName, docxBuffer, {
            contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            upsert: true
          })

        if (!docxUploadError && docxUpload) {
          const { data: docxUrlData } = await supabaseAdmin.storage
            .from('documents')
            .createSignedUrl(docxFileName, 3600) // 1 hour expiry

          docxUrl = docxUrlData?.signedUrl
        }
      } catch (docxError) {
        console.error('Error generating DOCX:', docxError)
        // Continue without DOCX - not a fatal error
      }

      // Generate PDF file
      let pdfUrl: string | undefined
      try {
        const pdfBuffer = await generatePdf({
          title: title.trim(),
          content: generatedContent,
          metadata: {
            author: user.email || 'AI Law Agent User',
            creator: 'AI Law Agent MVP'
          }
        })

        // Upload PDF to Supabase Storage
        const pdfFileName = `${document.id}.pdf`
        const { data: pdfUpload, error: pdfUploadError } = await supabaseAdmin.storage
          .from('documents')
          .upload(pdfFileName, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true
          })

        if (!pdfUploadError && pdfUpload) {
          const { data: pdfUrlData } = await supabaseAdmin.storage
            .from('documents')
            .createSignedUrl(pdfFileName, 3600) // 1 hour expiry

          pdfUrl = pdfUrlData?.signedUrl
        }
      } catch (pdfError) {
        console.error('Error generating PDF:', pdfError)
        // Continue without PDF - not a fatal error
      }

      // Update document with generated content and file URLs
      const { error: updateError } = await supabaseAdmin
        .from('docs')
        .update({
          content: generatedContent,
          status: 'completed',
          docx_url: docxUrl,
          pdf_url: pdfUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.id)

      if (updateError) {
        console.error('Error updating document:', updateError)
        return NextResponse.json({
          success: false,
          error: 'Failed to save generated document',
          code: 'DATABASE_ERROR'
        }, { status: 500 })
      }

      // Return success response
      return NextResponse.json({
        success: true,
        data: {
          documentId: document.id,
          content: generatedContent,
          docxUrl,
          pdfUrl
        }
      })

    } catch (generationError) {
      console.error('Error in document generation process:', generationError)

      // Update document status to error
      await supabaseAdmin
        .from('docs')
        .update({ status: 'error' })
        .eq('id', document.id)

      return NextResponse.json({
        success: false,
        error: 'An error occurred during document generation',
        code: 'GENERATION_ERROR'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Unhandled error in generate API:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
    code: 'METHOD_NOT_ALLOWED'
  }, { status: 405 })
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed', 
    code: 'METHOD_NOT_ALLOWED'
  }, { status: 405 })
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
    code: 'METHOD_NOT_ALLOWED'
  }, { status: 405 })
}