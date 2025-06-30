'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Download, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Editor from '@/components/Editor'
import { supabase } from '@/lib/supabase'
import { generateDocx, downloadDocx } from '@/lib/docx'
import { generatePdf, downloadPdf } from '@/lib/pdf'
import { getDocumentTypeName, type DocumentType } from '@/lib/utils'

interface Document {
  id: string
  title: string
  doc_type: DocumentType
  content: string
  status: 'draft' | 'generating' | 'completed' | 'error'
  created_at: string
  updated_at: string
  docx_url?: string
  pdf_url?: string
}

export default function EditDocumentPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const [document, setDocument] = useState<Document | null>(null)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await fetchDocument(user.id)
      } else {
        router.push('/auth')
      }
      
      setLoading(false)
    }

    getUser()
  }, [documentId, router])

  // Track unsaved changes
  useEffect(() => {
    if (document) {
      const hasChanges = title !== document.title || content !== document.content
      setHasUnsavedChanges(hasChanges)
    }
  }, [title, content, document])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const fetchDocument = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .eq('id', documentId)
        .eq('user_id', userId)
        .single()

      if (error) throw error

      if (!data) {
        setError('Document not found')
        return
      }

      setDocument(data)
      setTitle(data.title)
      setContent(data.content)
    } catch (error: any) {
      console.error('Error fetching document:', error)
      setError(error.message || 'Failed to load document')
    }
  }

  const saveDocument = async () => {
    if (!document || !user) return

    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('docs')
        .update({
          title: title.trim(),
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      setDocument({
        ...document,
        title: title.trim(),
        content,
        updated_at: new Date().toISOString()
      })

      setHasUnsavedChanges(false)
    } catch (error: any) {
      console.error('Error saving document:', error)
      setError(error.message || 'Failed to save document')
    } finally {
      setSaving(false)
    }
  }

  const exportDocx = async () => {
    if (!document) return

    setExporting(true)

    try {
      const docxBuffer = await generateDocx({
        title: title.trim(),
        content,
        docType: document.doc_type,
        metadata: {
          author: user?.email || 'AI Law Agent User',
          created: new Date(document.created_at)
        }
      })

      downloadDocx(docxBuffer, `${title.trim().replace(/\s+/g, '_')}.docx`)
    } catch (error: any) {
      console.error('Error exporting DOCX:', error)
      setError(error.message || 'Failed to export DOCX')
    } finally {
      setExporting(false)
    }
  }

  const exportPdf = async () => {
    if (!document) return

    setExporting(true)

    try {
      const pdfBuffer = await generatePdf({
        title: title.trim(),
        content,
        metadata: {
          author: user?.email || 'AI Law Agent User',
          creator: 'AI Law Agent MVP'
        }
      })

      downloadPdf(pdfBuffer, `${title.trim().replace(/\s+/g, '_')}.pdf`)
    } catch (error: any) {
      console.error('Error exporting PDF:', error)
      setError(error.message || 'Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse-silver text-silver">Loading document...</div>
      </div>
    )
  }

  if (error && !document) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-light mb-6">{error}</p>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-light mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Document Not Found</h1>
          <p className="text-gray-light mb-6">The document you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-light sticky top-0 bg-black z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft size={16} />
                  Dashboard
                </Button>
              </Link>
              
              <div className="border-l border-gray-light pl-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-silver" />
                  <div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-transparent text-lg font-semibold text-white border-none outline-none focus:ring-2 focus:ring-silver rounded px-2 py-1"
                      placeholder="Document title..."
                    />
                    <p className="text-sm text-gray-light">
                      {getDocumentTypeName(document.doc_type)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="text-yellow-400 text-sm">Unsaved changes</span>
              )}
              
              <Button
                onClick={saveDocument}
                disabled={saving || !hasUnsavedChanges}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  onClick={exportDocx}
                  disabled={exporting}
                  size="sm"
                  className="gap-2"
                >
                  <Download size={16} />
                  DOCX
                </Button>
                
                <Button
                  onClick={exportPdf}
                  disabled={exporting}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download size={16} />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900 border-b border-red-500 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-red-100">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto text-red-100 hover:text-white"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Document Info */}
          <div className="card-glossy p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Document Details</h2>
                <p className="text-gray-light text-sm mt-1">
                  Created {new Date(document.created_at).toLocaleDateString()} • 
                  Last updated {new Date(document.updated_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  document.status === 'completed' ? 'bg-green-900 text-green-400' :
                  document.status === 'draft' ? 'bg-yellow-900 text-yellow-400' :
                  document.status === 'error' ? 'bg-red-900 text-red-400' :
                  'bg-gray-900 text-gray-400'
                }`}>
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Editor */}
          <Editor
            content={content}
            onChange={setContent}
            placeholder="Start editing your document..."
            className="min-h-[600px]"
          />
        </div>
      </main>
    </div>
  )
}