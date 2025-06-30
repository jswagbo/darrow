import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface DocumentsResponse {
  success: boolean
  data?: any
  error?: string
  code?: string
  pagination?: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

// Get user's documents with pagination
export async function GET(request: NextRequest): Promise<NextResponse<DocumentsResponse>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Max 50 per page
    const status = searchParams.get('status')
    const docType = searchParams.get('docType')
    const search = searchParams.get('search')

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

    // Build query
    let query = supabaseAdmin
      .from('docs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)

    // Add filters
    if (status) {
      query = query.eq('status', status)
    }
    if (docType) {
      query = query.eq('doc_type', docType)
    }
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    // Add pagination
    const offset = (page - 1) * limit
    query = query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: documents, error: fetchError, count } = await query

    if (fetchError) {
      console.error('Error fetching documents:', fetchError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch documents',
        code: 'FETCH_ERROR'
      }, { status: 500 })
    }

    const total = count || 0
    const hasMore = offset + limit < total

    return NextResponse.json({
      success: true,
      data: documents || [],
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    })

  } catch (error) {
    console.error('Error in documents API:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// Create new document (draft)
export async function POST(request: NextRequest): Promise<NextResponse<DocumentsResponse>> {
  try {
    const body = await request.json()
    const { title, docType } = body

    // Validate input
    if (!title?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Document title is required',
        code: 'INVALID_INPUT'
      }, { status: 400 })
    }

    if (!docType) {
      return NextResponse.json({
        success: false,
        error: 'Document type is required',
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

    // Create document
    const { data: document, error: createError } = await supabaseAdmin
      .from('docs')
      .insert({
        user_id: user.id,
        title: title.trim(),
        doc_type: docType,
        content: '',
        status: 'draft'
      })
      .select()
      .single()

    if (createError || !document) {
      console.error('Error creating document:', createError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create document',
        code: 'CREATE_ERROR'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: document
    })

  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}