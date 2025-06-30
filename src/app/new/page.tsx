'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Scale, HandCoins, UserCheck, Gavel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DOCUMENT_TYPES, type DocumentType } from '@/lib/utils'

const documentTypeInfo: Record<DocumentType, {
  icon: React.ReactNode
  description: string
  features: string[]
  complexity: 'Simple' | 'Moderate' | 'Complex'
}> = {
  delaware_charter: {
    icon: <Scale className="h-6 w-6" />,
    description: 'Certificate of Incorporation for Delaware corporations',
    features: [
      'Corporate name and purpose',
      'Share structure and par value',
      'Registered agent information',
      'Initial directors'
    ],
    complexity: 'Moderate'
  },
  safe_post: {
    icon: <HandCoins className="h-6 w-6" />,
    description: 'Y Combinator Simple Agreement for Future Equity (Post-Money)',
    features: [
      'Investment amount',
      'Valuation cap',
      'Investor and company details',
      'Standard YC legal language'
    ],
    complexity: 'Complex'
  },
  offer_letter: {
    icon: <UserCheck className="h-6 w-6" />,
    description: 'Employment offer letter with compensation details',
    features: [
      'Job title and department',
      'Salary and benefits',
      'Start date and terms',
      'At-will employment clause'
    ],
    complexity: 'Simple'
  },
  rspa: {
    icon: <FileText className="h-6 w-6" />,
    description: 'Restricted Stock Purchase Agreement for employees',
    features: [
      'Stock purchase details',
      'Vesting schedule',
      'Repurchase rights',
      'Tax election guidance'
    ],
    complexity: 'Complex'
  },
  board_consent: {
    icon: <Gavel className="h-6 w-6" />,
    description: 'Board and stockholder consent resolutions',
    features: [
      'Corporate resolutions',
      'Board approvals',
      'Stockholder consents',
      'Officer authorizations'
    ],
    complexity: 'Moderate'
  }
}

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'Simple': return 'text-green-400'
    case 'Moderate': return 'text-yellow-400'
    case 'Complex': return 'text-red-400'
    default: return 'text-gray-light'
  }
}

export default function NewDocumentPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft size={16} />
                  Dashboard
                </Button>
              </Link>
              
              <div className="border-l border-gray-light pl-4">
                <h1 className="text-3xl font-bold text-white">Create Document</h1>
                <p className="text-gray-light mt-1">Choose a document type to get started</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-gray-900 border border-gray-light rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-silver bg-opacity-20 rounded-lg">
              <FileText className="h-6 w-6 text-silver" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                AI-Powered Legal Document Generation
              </h2>
              <p className="text-gray-light mb-4">
                Our AI assistant will help you create professional legal documents by asking for the necessary information. 
                All documents follow standard legal templates and best practices.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-light">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Professional templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-silver rounded-full"></div>
                  <span>AI-guided completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>DOCX & PDF export</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(DOCUMENT_TYPES).map(([type, name]) => {
            const info = documentTypeInfo[type as DocumentType]
            
            return (
              <Link 
                key={type} 
                href={`/new/${type}`}
                className="block"
              >
                <div className="card-glossy p-6 rounded-lg h-full hover:scale-105 transition-transform cursor-pointer">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-silver bg-opacity-20 rounded-lg text-silver">
                      {info.icon}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getComplexityColor(info.complexity)}`}>
                      {info.complexity}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {name}
                  </h3>
                  
                  <p className="text-gray-light text-sm mb-4 leading-relaxed">
                    {info.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-silver text-xs font-medium uppercase tracking-wider">
                      Includes:
                    </h4>
                    <ul className="space-y-1">
                      {info.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-xs text-gray-light flex items-center gap-2">
                          <div className="w-1 h-1 bg-silver rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                      {info.features.length > 3 && (
                        <li className="text-xs text-silver">
                          +{info.features.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-4 border-t border-gray-light">
                    <Button variant="outline" size="sm" className="w-full">
                      Create {name}
                    </Button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-gray-light mb-6 max-w-2xl mx-auto">
            Not sure which document type you need? Each document serves different business purposes. 
            Start with the type that matches your current business need.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="text-left p-6 bg-gray-900 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Starting a Company?</h3>
              <p className="text-gray-light text-sm mb-3">
                Begin with a Delaware Charter to incorporate your business.
              </p>
              <Link href="/new/delaware_charter">
                <Button variant="ghost" size="sm">Get Started →</Button>
              </Link>
            </div>
            
            <div className="text-left p-6 bg-gray-900 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Raising Investment?</h3>
              <p className="text-gray-light text-sm mb-3">
                Use a YC SAFE for simple, founder-friendly investment terms.
              </p>
              <Link href="/new/safe_post">
                <Button variant="ghost" size="sm">Get Started →</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}