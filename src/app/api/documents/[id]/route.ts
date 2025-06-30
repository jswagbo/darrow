import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface DocumentResponse {
  success: boolean
  data?: any
  error?: string
  code?: string
}

// Get single document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<DocumentResponse>> {
  try {
    const documentId = params.id

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

    // Get document with user ownership check
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

    return NextResponse.json({
      success: true,
      data: document
    })

  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<DocumentResponse>> {
  try {
    const documentId = params.id
    const body = await request.json()
    const { title, content } = body

    // Validate input
    if (!title?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Document title is required',
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

    // Update document with user ownership check
    const { data: document, error: updateError } = await supabaseAdmin
      .from('docs')
      .update({
        title: title.trim(),
        content: content || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError || !document) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update document or document not found',
        code: 'UPDATE_FAILED'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: document
    })

  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<DocumentResponse>> {
  try {
    const documentId = params.id

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

    // Get document first to check ownership and get file URLs
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

    // Delete associated files from storage
    const filesToDelete = []
    if (document.docx_url) {
      filesToDelete.push(`${documentId}.docx`)
    }
    if (document.pdf_url) {
      filesToDelete.push(`${documentId}.pdf`)
    }

    if (filesToDelete.length > 0) {
      try {
        await supabaseAdmin.storage
          .from('documents')
          .remove(filesToDelete)
      } catch (storageError) {
        console.error('Error deleting files from storage:', storageError)
        // Continue with document deletion even if file deletion fails
      }
    }

    // Delete document record
    const { error: deleteError } = await supabaseAdmin
      .from('docs')
      .delete()
      .eq('id', documentId)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete document',
        code: 'DELETE_FAILED'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Document deleted successfully' }
    })

  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}