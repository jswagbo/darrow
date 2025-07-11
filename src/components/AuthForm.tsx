'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function AuthForm() {
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
      // Get the correct redirect URL for production
      const getRedirectUrl = () => {
        if (typeof window !== 'undefined') {
          // In browser, use current origin
          return `${window.location.origin}/dashboard`
        }
        
        // Server-side fallback
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                       process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                       'http://localhost:3000'
        return `${baseUrl}/dashboard`
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: getRedirectUrl()
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
      <div className="card-glossy p-8 rounded-lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-light" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-black border border-gray-light rounded-lg text-white placeholder-gray-light focus:border-silver focus:ring-2 focus:ring-silver focus:ring-opacity-20 outline-none transition-colors"
                placeholder="Enter your email"
                disabled
              />
            </div>
          </div>
          <Button disabled className="w-full py-3">
            Loading...
          </Button>
        </div>
      </div>
    )
  }

  return (
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
  )
}