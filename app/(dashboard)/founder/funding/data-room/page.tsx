'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Trash2,
  ChevronRight,
  Shield,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { Database } from '@/types/database'

type Document = Database['public']['Tables']['documents']['Row']

export default function DataRoomPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [uploading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadDocuments() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: startup } = await supabase
          .from('startups')
          .select('id')
          .eq('founder_id', user.id)
          .single()

        const startupRow = startup as { id: string } | null
        if (startupRow) {
          const { data } = await supabase
            .from('documents')
            .select('id, name, size_bytes, updated_at, type, url, startup_id, created_at')
            .eq('startup_id', startupRow.id)
            .order('updated_at', { ascending: false })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (data) setDocuments(data as any)
        }
      } catch (err) {
        console.error('Error loading documents:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDocuments()
  }, [supabase])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id)
      if (error) throw error
      setDocuments(documents.filter(d => d.id !== id))
    } catch (err) {
      console.error('Error deleting document:', err)
    }
  }

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            <Link href="/founder/funding" className="hover:text-black transition-colors">Funding</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Secure Data Room</span>
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Venture Data Room</h1>
          <p className="text-muted-foreground mt-2 font-medium">Securely manage and share due diligence documents with institutional investors.</p>
        </div>
        <button 
          disabled={uploading}
          className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload Document
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-xl font-bold text-sm focus:ring-2 focus:ring-black/5 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 h-12 bg-card border border-border rounded-xl font-bold text-sm hover:bg-secondary transition-all shadow-sm">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Documents Grid */}
      <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm">
        {filteredDocs.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-6 pb-4 border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              <div className="col-span-6">Document Name</div>
              <div className="col-span-2">File Type</div>
              <div className="col-span-2">Last Modified</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            <div className="divide-y divide-border/50">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-background rounded-2xl transition-colors group">
                  <div className="col-span-6 flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      doc.name.endsWith('.pdf') ? "bg-red-50 text-red-600" : "bg-emerald-500/10 text-emerald-600"
                    )}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{((doc.size_bytes || 0) / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="px-2 py-1 bg-secondary rounded-lg text-[10px] font-black uppercase tracking-widest text-foreground">
                      {doc.name.split('.').pop()?.toUpperCase() || 'FILE'}
                    </span>
                  </div>
                  <div className="col-span-2 text-xs font-bold text-muted-foreground">
                    {new Date(doc.updated_at || 0).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button className="p-2 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-card rounded-lg transition-colors text-muted-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <FileText className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-foreground tracking-tight">Vault Empty</h4>
            <p className="text-muted-foreground mt-2 max-w-[280px] mx-auto font-medium">
              Initialize your investor readiness by uploading core venture documents.
            </p>
          </div>
        )}
      </div>

      {/* Security Footer */}
      <div className="flex items-center gap-4 p-6 bg-[#1a1c1e] text-white rounded-[2rem] shadow-xl">
        <div className="w-12 h-12 bg-card/10 rounded-2xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-bold">End-to-End Encryption Active</p>
          <p className="text-xs text-gray-400 font-medium">All documents in the Polaris Data Room are encrypted at rest and in transit.</p>
        </div>
      </div>
    </div>
  )
}
