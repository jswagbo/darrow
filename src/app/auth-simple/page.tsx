import Link from 'next/link'
import { ArrowLeft, Zap, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthSimplePageProps {
  searchParams: { sent?: string }
}

export default function AuthSimplePage({ searchParams }: AuthSimplePageProps) {
  const emailSent = searchParams.sent === 'true'
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
              <h1 className="text-2xl font-bold text-white">Darrow</h1>
            </div>
            <p className="text-gray-light">
              Sign in to access your legal document workspace
            </p>
          </div>

          {/* Auth Form */}
          <div className="card-glossy p-8 rounded-lg">
            {emailSent ? (
              <div className="text-center">
                <div className="mb-4 p-4 rounded-lg bg-green-900 bg-opacity-20 border border-green-500 text-green-400">
                  ✓ Check your email for a magic link to sign in!
                </div>
                <p className="text-gray-light text-sm">
                  We've sent you a secure link to sign in instantly.
                  <br />
                  Check your email and click the link to continue.
                </p>
              </div>
            ) : (
              <>
                <form action="/api/auth/signin" method="POST" className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-light" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-black border border-gray-light rounded-lg text-white placeholder-gray-light focus:border-silver focus:ring-2 focus:ring-silver focus:ring-opacity-20 outline-none transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3"
                  >
                    Send Magic Link
                  </Button>
                </form>

                {/* Info */}
                <div className="mt-6 text-center">
                  <p className="text-gray-light text-sm">
                    We'll send you a secure link to sign in instantly.
                    <br />
                    No passwords required.
                  </p>
                </div>
              </>
            )}
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