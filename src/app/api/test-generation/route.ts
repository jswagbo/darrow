import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { testOpenAIConnection } from '@/lib/openai'

export async function GET(request: NextRequest) {
  try {
    const tests: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      deployment: 'updated-api-key-v2',
      tests: {}
    }

    // Test 1: OpenAI Connection
    try {
      const openaiTest = await testOpenAIConnection()
      tests.tests.openai = {
        success: openaiTest.success,
        error: openaiTest.error,
        apiKey: process.env.OPENAI_API_KEY ? 'SET' : 'MISSING',
        model: (process.env.OPENAI_MODEL || 'DEFAULT').trim()
      }
    } catch (error) {
      tests.tests.openai = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 2: Supabase Database Connection
    try {
      const { data, error } = await supabaseAdmin
        .from('docs')
        .select('count(*)', { count: 'exact', head: true })
        .limit(1)

      tests.tests.database = {
        success: !error,
        error: error?.message,
        count: data?.length || 0
      }
    } catch (error) {
      tests.tests.database = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 3: Database Functions
    try {
      const testUserId = '123e4567-e89b-12d3-a456-426614174000'
      const { data, error } = await supabaseAdmin
        .rpc('can_create_doc', { uid: testUserId })

      tests.tests.functions = {
        success: !error,
        error: error?.message,
        result: data
      }
    } catch (error) {
      tests.tests.functions = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 4: Storage Bucket
    try {
      const { data, error } = await supabaseAdmin.storage
        .from('documents')
        .list('', { limit: 1 })

      tests.tests.storage = {
        success: !error,
        error: error?.message,
        accessible: true
      }
    } catch (error) {
      tests.tests.storage = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    return NextResponse.json(tests)

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Use GET method to run tests'
  }, { status: 405 })
}