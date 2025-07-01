import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'

// Dynamic import to prevent SSR issues
const AuthForm = dynamic(() => import('@/components/AuthForm').then(mod => ({ default: mod.AuthForm })), {
  ssr: false,
  loading: () => (
    <div className="card-glossy p-8 rounded-lg">
      <div className="space-y-6">
        <div>
          <div className="block text-sm font-medium text-white mb-2">Email Address</div>
          <div className="w-full px-4 py-3 bg-black border border-gray-light rounded-lg text-gray-light">
            Loading...
          </div>
        </div>
        <div className="w-full py-3 bg-gray-light text-center rounded-lg">
          Loading...
        </div>
      </div>
    </div>
  )
})

export default function AuthPage() {
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
          <AuthForm />

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