import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeaderSkeleton } from '@/components/ui/skeleton'

// Dynamic import to prevent SSR issues
const DashboardContent = dynamic(() => import('@/components/DashboardContent'), {
  ssr: false,
  loading: () => (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-glossy p-4 lg:p-6 rounded-lg">
            <div className="h-4 w-24 bg-gray-light rounded animate-pulse mb-2"></div>
            <div className="h-8 w-16 bg-gray-light rounded animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="card-glossy rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-light">
          <div className="h-6 w-48 bg-gray-light rounded animate-pulse" />
        </div>
        <div className="p-12 text-center">
          <div className="text-gray-light">Loading dashboard...</div>
        </div>
      </div>
    </div>
  )
})

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-light mt-1">Manage your legal documents</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/new">
                <Button className="gap-2">
                  <Plus size={16} />
                  New Document
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardContent />
      </main>
    </div>
  )
}