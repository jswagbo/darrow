'use client'

import { useRouter } from 'next/navigation'

interface ErrorComponentProps {
  error: Error
  reset?: () => void
}

export function DefaultCatchBoundary({ error, reset }: ErrorComponentProps) {
  const router = useRouter()

  console.error("DefaultCatchBoundary Error:", error)

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-light mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            if (reset) {
              reset()
            } else {
              window.location.reload()
            }
          }}
          className="rounded bg-silver px-4 py-2 font-medium text-black hover:bg-gray-light transition-colors"
        >
          Try Again
        </button>
        
        <button
          onClick={() => router.push('/')}
          className="rounded bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-500 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}