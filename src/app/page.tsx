import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          AI Law Agent
          <span className="block text-silver mt-2">MVP</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-light mb-8 max-w-2xl mx-auto">
          Generate professional legal documents with AI assistance. 
          Streamlined, secure, and built for modern legal practice.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth-simple" 
            className="btn-silver px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center justify-center"
          >
            Get Started
          </Link>
          
          <Link 
            href="/auth-simple" 
            className="btn-silver-outline px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-glossy p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-silver">5 Document Types</h3>
            <p className="text-gray-light">
              Delaware Charter, YC SAFEs, Offer Letters, RSPA, and Board Consents
            </p>
          </div>
          
          <div className="card-glossy p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-silver">In-App Editor</h3>
            <p className="text-gray-light">
              Rich-text editing with professional DOCX and PDF export
            </p>
          </div>
          
          <div className="card-glossy p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-silver">Secure & Simple</h3>
            <p className="text-gray-light">
              Magic-link authentication with rate limiting for security
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}