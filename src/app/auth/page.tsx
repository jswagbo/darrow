'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://constructa-starter-min-main-jeff-nwagbos-projects-6f9cdfa7.vercel.app')}/dashboard`
        }
      })

      if (error) throw error

      setMessage({ 
        type: 'success', 
        text: 'Check your email for a magic link to sign in!' 
      })
    } catch (error: any) {
      console.error('Error signing in:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to send magic link' 
      })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-silver hover:text-white transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-silver" />
              <h1 className="text-2xl font-bold text-white">AI Law Agent</h1>
            </div>
            <p className="text-gray-light">
              Sign in to access your legal document workspace
            </p>
          </div>

          {/* Auth Form */}
          <div className="card-glossy p-8 rounded-lg">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-light" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-light rounded-lg text-white placeholder-gray-light focus:border-silver focus:ring-2 focus:ring-silver focus:ring-opacity-20 outline-none transition-colors"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3"
              >
                {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
              </Button>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-4 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-900 bg-opacity-20 border border-green-500 text-green-400'
                  : 'bg-red-900 bg-opacity-20 border border-red-500 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            {/* Info */}
            <div className="mt-6 text-center">
              <p className="text-gray-light text-sm">
                We'll send you a secure link to sign in instantly.
                <br />
                No passwords required.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-light">
              <div className="w-2 h-2 bg-silver rounded-full"></div>
              <span>Generate 3 documents per day</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-light">
              <div className="w-2 h-2 bg-silver rounded-full"></div>
              <span>Professional DOCX and PDF exports</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-light">
              <div className="w-2 h-2 bg-silver rounded-full"></div>
              <span>In-app rich text editing</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}