import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateDocx } from '@/lib/docx'
import { generatePdf } from '@/lib/pdf'

interface ExportRequest {
  documentId: string
  format: 'docx' | 'pdf'
  regenerate?: boolean
}

interface ExportResponse {
  success: boolean
  data?: {
    downloadUrl: string
    filename: string
    expiresAt: string
  }
  error?: string
  code?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ExportResponse>> {
  try {
    const body: ExportRequest = await request.json()
    const { documentId, format, regenerate = false } = body

    // Validate input
    if (!documentId) {
      return NextResponse.json({
        success: false,
        error: 'Document ID is required',
        code: 'INVALID_INPUT'
      }, { status: 400 })
    }

    if (!['docx', 'pdf'].includes(format)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid export format. Must be docx or pdf',
        code: 'INVALID_FORMAT'
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

    // Get document with ownership check
    const { data: document, error: fetchError } = await supabaseAdmin
      .from('docs')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json({
        success: false,
        error: 'Document not found',
        code: 'NOT_FOUND'
      }, { status: 404 })
    }

    const fileName = `${documentId}.${format}`
    let downloadUrl: string | null = null

    // Check if file already exists and is not being regenerated
    if (!regenerate) {
      const existingUrl = format === 'docx' ? document.docx_url : document.pdf_url
      
      if (existingUrl) {
        // Check if the file still exists in storage
        const { data: fileData, error: fileError } = await supabaseAdmin.storage
          .from('documents')
          .list('', { search: fileName })

        if (!fileError && fileData?.length > 0) {
          // Generate new signed URL for existing file
          const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
            .from('documents')
            .createSignedUrl(fileName, 3600) // 1 hour expiry

          if (!urlError && signedUrlData?.signedUrl) {
            return NextResponse.json({
              success: true,
              data: {
                downloadUrl: signedUrlData.signedUrl,
                filename: `${document.title.replace(/\s+/g, '_')}.${format}`,
                expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
              }
            })
          }
        }
      }
    }

    // Generate new file
    try {
      let fileBuffer: Uint8Array

      if (format === 'docx') {
        fileBuffer = await generateDocx({
          title: document.title,
          content: document.content,
          docType: document.doc_type,
          metadata: {
            author: user.email || 'AI Law Agent User',
            created: new Date(document.created_at)
          }
        })
      } else {
        fileBuffer = await generatePdf({
          title: document.title,
          content: document.content,
          metadata: {
            author: user.email || 'AI Law Agent User',
            creator: 'Darrow Legal Document Generation'
          }
        })
      }

      // Upload to Supabase Storage
      const contentType = format === 'docx' 
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/pdf'

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('documents')
        .upload(fileName, fileBuffer, {
          contentType,
          upsert: true
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        return NextResponse.json({
          success: false,
          error: 'Failed to upload file to storage',
          code: 'UPLOAD_ERROR'
        }, { status: 500 })
      }

      // Generate signed URL
      const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
        .from('documents')
        .createSignedUrl(fileName, 3600) // 1 hour expiry

      if (urlError || !signedUrlData?.signedUrl) {
        console.error('Signed URL error:', urlError)
        return NextResponse.json({
          success: false,
          error: 'Failed to generate download URL',
          code: 'URL_ERROR'
        }, { status: 500 })
      }

      downloadUrl = signedUrlData.signedUrl

      // Update document record with new file URL
      const updateField = format === 'docx' ? 'docx_url' : 'pdf_url'
      await supabaseAdmin
        .from('docs')
        .update({ 
          [updateField]: downloadUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)

      return NextResponse.json({
        success: true,
        data: {
          downloadUrl,
          filename: `${document.title.replace(/\s+/g, '_')}.${format}`,
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
        }
      })

    } catch (generationError) {
      console.error('File generation error:', generationError)
      return NextResponse.json({
        success: false,
        error: `Failed to generate ${format.toUpperCase()} file`,
        code: 'GENERATION_ERROR'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Export API error:', error)
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