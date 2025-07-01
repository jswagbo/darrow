'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FileText, Download, Edit, Trash2, Calendar, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UsageIndicator } from '@/components/RateLimitModal'
import { DashboardStatsSkeleton, DocumentListSkeleton } from '@/components/ui/skeleton'
import { DocumentIdCopy } from '@/components/ui/CopyToClipboard'
import { supabase } from '@/lib/supabase'
import { getDailyUsage } from '@/lib/rateLimit'
import { getDocumentTypeName, formatDateTime, type DocumentType } from '@/lib/utils'

interface Document {
  id: string
  title: string
  doc_type: DocumentType
  status: 'draft' | 'generating' | 'completed' | 'error'
  created_at: string
  updated_at: string
  docx_url?: string
  pdf_url?: string
}

interface DashboardStats {
  totalDocs: number
  completedDocs: number
  draftDocs: number
  dailyUsage: {
    docs_created: number
    docs_remaining: number
  }
}

export default function DashboardContent() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalDocs: 0,
    completedDocs: 0,
    draftDocs: 0,
    dailyUsage: { docs_created: 0, docs_remaining: 3 }
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await Promise.all([
          fetchDocuments(user.id),
          fetchStats(user.id)
        ])
      }
      
      setLoading(false)
    }

    getUser()
  }, [])

  const fetchDocuments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  const fetchStats = async (userId: string) => {
    try {
      const [{ data: allDocs }, dailyUsage] = await Promise.all([
        supabase
          .from('docs')
          .select('status')
          .eq('user_id', userId),
        getDailyUsage(userId)
      ])

      const totalDocs = allDocs?.length || 0
      const completedDocs = allDocs?.filter(doc => doc.status === 'completed').length || 0
      const draftDocs = allDocs?.filter(doc => doc.status === 'draft').length || 0

      setStats({
        totalDocs,
        completedDocs,
        draftDocs,
        dailyUsage
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const deleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const { error } = await supabase
        .from('docs')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDocuments(documents.filter(doc => doc.id !== id))
      if (user) {
        await fetchStats(user.id)
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'generating': return 'text-yellow-400'
      case 'draft': return 'text-gray-light'
      case 'error': return 'text-red-400'
      default: return 'text-gray-light'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓'
      case 'generating': return '⏳'
      case 'draft': return '📝'
      case 'error': return '❌'
      default: return '📝'
    }
  }

  if (!mounted || loading) {
    return (
      <div>
        <DashboardStatsSkeleton />
        <div className="card-glossy rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-light">
            <div className="h-6 w-48 skeleton rounded animate-fade-in" />
          </div>
          <DocumentListSkeleton />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
        <p className="text-gray-light mb-6">You need to sign in to access your dashboard</p>
        <Link href="/auth" className="btn-silver px-6 py-3 rounded-lg">
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="card-glossy p-4 lg:p-6 rounded-lg animate-fade-in">
          <h3 className="text-silver text-sm font-medium">Total Documents</h3>
          <p className="text-2xl lg:text-3xl font-bold text-white mt-2">{stats.totalDocs}</p>
        </div>
        
        <div className="card-glossy p-4 lg:p-6 rounded-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-silver text-sm font-medium">Completed</h3>
          <p className="text-2xl lg:text-3xl font-bold text-green-400 mt-2">{stats.completedDocs}</p>
        </div>
        
        <div className="card-glossy p-4 lg:p-6 rounded-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-silver text-sm font-medium">Drafts</h3>
          <p className="text-2xl lg:text-3xl font-bold text-yellow-400 mt-2">{stats.draftDocs}</p>
        </div>
        
        <div className="card-glossy p-4 lg:p-6 rounded-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <UsageIndicator 
            docsCreated={stats.dailyUsage.docs_created}
            docsRemaining={stats.dailyUsage.docs_remaining}
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="card-glossy rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-light">
          <h2 className="text-xl font-semibold text-white">Your Documents</h2>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-light mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No documents yet</h3>
            <p className="text-gray-light mb-6">Get started by creating your first legal document</p>
            <Link href="/new">
              <Button className="gap-2">
                <Plus size={16} />
                Create Document
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-900 hover:bg-opacity-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-silver mr-3" />
                        <div>
                          <div className="text-sm font-medium text-white">{doc.title}</div>
                          <DocumentIdCopy id={doc.id} className="mt-1" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-silver">
                        {getDocumentTypeName(doc.doc_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-sm ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-light">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDateTime(doc.updated_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link href={`/doc/${doc.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye size={14} />
                          </Button>
                        </Link>
                        
                        <Link href={`/doc/${doc.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit size={14} />
                          </Button>
                        </Link>
                        
                        {doc.docx_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={doc.docx_url} download>
                              <Download size={14} />
                            </a>
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}