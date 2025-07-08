import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getFullUrl } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get the dashboard URL dynamically
    const dashboardUrl = getFullUrl('/dashboard')
    
    console.log('Magic link redirect URL:', dashboardUrl)

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: dashboardUrl
      }
    })

    if (error) {
      console.error('Auth error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Redirect back to auth page with success message
    const url = new URL('/auth-simple?sent=true', request.url)
    return NextResponse.redirect(url)

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    )
  }
}