'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Zap, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RateLimitModal, { UsageIndicator } from '@/components/RateLimitModal'
import { supabase } from '@/lib/supabase'
import { getDailyUsage, canCreateDoc } from '@/lib/rateLimit'
import { DOCUMENT_TYPES, getDocumentTypeName, type DocumentType } from '@/lib/utils'

export default function CreateDocumentPage() {
  const params = useParams()
  const router = useRouter()
  const docType = params.type as DocumentType

  const [title, setTitle] = useState('')
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [dailyUsage, setDailyUsage] = useState({ docs_created: 0, docs_remaining: 3 })
  const [showRateLimit, setShowRateLimit] = useState(false)

  // Document type specific prompts
  const documentPrompts: Record<DocumentType, {
    title: string
    description: string
    placeholder: string
    examples: string[]
  }> = {
    delaware_charter: {
      title: 'Delaware Certificate of Incorporation',
      description: 'Provide your company details to create a Delaware incorporation document.',
      placeholder: 'Enter your company information...\n\nExample:\nCompany Name: Acme Technologies Inc.\nBusiness Purpose: Software development and technology services\nIncorporator: John Smith, 123 Main St, San Francisco, CA 94105\nRegistered Agent: Corporation Service Company\nTotal Shares: 10,000,000\nPar Value: $0.001',
      examples: [
        'Company name and business purpose',
        'Incorporator name and address', 
        'Share structure (total shares, par value)',
        'Registered agent information'
      ]
    },
    safe_post: {
      title: 'YC SAFE (Post-Money)',
      description: 'Provide investment details for your Simple Agreement for Future Equity.',
      placeholder: 'Enter investment information...\n\nExample:\nInvestor: John Smith\nCompany: Acme Technologies Inc.\nInvestment Amount: $100,000\nValuation Cap: $10,000,000\nInvestor Address: 123 Investor St, San Francisco, CA 94105\nCompany Address: 456 Startup Ave, San Francisco, CA 94105',
      examples: [
        'Investor and company names',
        'Investment amount',
        'Valuation cap',
        'Complete addresses for both parties'
      ]
    },
    offer_letter: {
      title: 'Employment Offer Letter',
      description: 'Provide employment details to create a professional offer letter.',
      placeholder: 'Enter employment details...\n\nExample:\nCandidate: Jane Doe\nCompany: Acme Technologies Inc.\nPosition: Senior Software Engineer\nSalary: $150,000 per year\nStart Date: January 15, 2024\nManager: John Smith, Engineering Manager\nDepartment: Engineering\nBenefits: Health, dental, vision insurance, 401k matching',
      examples: [
        'Candidate name and position',
        'Salary and compensation details',
        'Start date and reporting structure',
        'Benefits and company policies'
      ]
    },
    rspa: {
      title: 'Restricted Stock Purchase Agreement',
      description: 'Provide stock purchase details for your equity agreement.',
      placeholder: 'Enter stock purchase information...\n\nExample:\nPurchaser: Jane Doe\nCompany: Acme Technologies Inc.\nShares: 50,000 shares\nPrice per Share: $0.10\nTotal Purchase Price: $5,000\nVesting: 25% after 1 year, then monthly over 3 years\nPayment: Cash payment at signing',
      examples: [
        'Purchaser and company names',
        'Number of shares and purchase price',
        'Vesting schedule',
        'Payment terms'
      ]
    },
    board_consent: {
      title: 'Board & Stockholder Consent',
      description: 'Provide resolution details for board and stockholder actions.',
      placeholder: 'Enter resolution information...\n\nExample:\nCompany: Acme Technologies Inc.\nResolution 1: Approve employment agreement with Jane Doe as CTO\nResolution 2: Authorize issuance of 100,000 shares to employee stock pool\nResolution 3: Approve amendment to company bylaws\nDirectors: John Smith, Mary Johnson, Bob Wilson\nStockholders: John Smith (5,000,000 shares), Mary Johnson (3,000,000 shares)',
      examples: [
        'Company name and resolutions',
        'Director names',
        'Stockholder names and share counts',
        'Specific actions to approve'
      ]
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      setUser(user)
      
      // Get daily usage
      const usage = await getDailyUsage(user.id)
      setDailyUsage(usage)
    }

    getUser()
  }, [router])

  useEffect(() => {
    // Validate document type
    if (docType && !Object.keys(DOCUMENT_TYPES).includes(docType)) {
      router.push('/new')
    }
  }, [docType, router])

  const handleGenerate = async () => {
    if (!title.trim() || !userInput.trim()) {
      setError('Please provide both a title and document details')
      return
    }

    if (!user) {
      router.push('/auth')
      return
    }

    // Check rate limit
    const canCreate = await canCreateDoc(user.id)
    if (!canCreate) {
      setShowRateLimit(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }

      // Call generation API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          docType,
          userInput: userInput.trim()
        })
      })

      const result = await response.json()

      if (!result.success) {
        if (result.code === 'RATE_LIMIT_EXCEEDED') {
          setShowRateLimit(true)
          return
        }
        throw new Error(result.error || 'Failed to generate document')
      }

      // Redirect to document editor
      router.push(`/doc/${result.data.documentId}/edit`)

    } catch (error: any) {
      console.error('Generation error:', error)
      setError(error.message || 'Failed to generate document')
    } finally {
      setLoading(false)
    }
  }

  if (!docType || !Object.keys(DOCUMENT_TYPES).includes(docType)) {
    return null // Will redirect in useEffect
  }

  const promptInfo = documentPrompts[docType]

  return (
    <div className="min-h-screen bg-black">
      {/* Rate Limit Modal */}
      <RateLimitModal
        isOpen={showRateLimit}
        onClose={() => setShowRateLimit(false)}
        docsCreated={dailyUsage.docs_created}
        docsRemaining={dailyUsage.docs_remaining}
      />

      {/* Header */}
      <header className="border-b border-gray-light sticky top-0 bg-black z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/new">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft size={16} />
                  Back
                </Button>
              </Link>
              
              <div className="border-l border-gray-light pl-4">
                <h1 className="text-xl font-semibold text-white">
                  {promptInfo.title}
                </h1>
                <p className="text-sm text-gray-light">
                  {getDocumentTypeName(docType)}
                </p>
              </div>
            </div>

            <UsageIndicator
              docsCreated={dailyUsage.docs_created}
              docsRemaining={dailyUsage.docs_remaining}
              compact
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Description */}
          <div className="card-glossy p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-silver bg-opacity-20 rounded-lg">
                <FileText className="h-6 w-6 text-silver" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  {promptInfo.description}
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-light text-sm">
                    Please provide the following information:
                  </p>
                  <ul className="space-y-1">
                    {promptInfo.examples.map((example, index) => (
                      <li key={index} className="text-sm text-gray-light flex items-center gap-2">
                        <div className="w-1 h-1 bg-silver rounded-full"></div>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400" />
                <span className="text-red-400 font-medium">Error</span>
              </div>
              <p className="text-red-100 mt-1">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Document Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                Document Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-light rounded-lg text-white placeholder-gray-light focus:border-silver focus:ring-2 focus:ring-silver focus:ring-opacity-20 outline-none transition-colors"
                placeholder={`Enter title for your ${getDocumentTypeName(docType).toLowerCase()}`}
                disabled={loading}
              />
            </div>

            {/* User Input */}
            <div>
              <label htmlFor="userInput" className="block text-sm font-medium text-white mb-2">
                Document Details
              </label>
              <textarea
                id="userInput"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-light rounded-lg text-white placeholder-gray-light focus:border-silver focus:ring-2 focus:ring-silver focus:ring-opacity-20 outline-none transition-colors resize-y min-h-[300px]"
                placeholder={promptInfo.placeholder}
                disabled={loading}
              />
              <p className="text-xs text-gray-light mt-2">
                Provide as much detail as possible for the best results. The AI will use this information to fill out your legal document.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-light">
              <div className="text-sm text-gray-light">
                {dailyUsage.docs_remaining === 0 ? (
                  <span className="text-red-400">Daily limit reached</span>
                ) : (
                  <span>
                    {dailyUsage.docs_remaining} document{dailyUsage.docs_remaining !== 1 ? 's' : ''} remaining today
                  </span>
                )}
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !title.trim() || !userInput.trim() || dailyUsage.docs_remaining === 0}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Generate Document
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}