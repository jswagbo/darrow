import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    // Determine the redirect URL based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://constructa-starter-min-main-jeff-nwagbos-projects-6f9cdfa7.vercel.app'
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    console.log('Magic link redirect URL:', `${baseUrl}/dashboard`)

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${baseUrl}/dashboard`
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