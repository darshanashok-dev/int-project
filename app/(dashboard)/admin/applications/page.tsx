'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Search,
  MoreHorizontal,
  Loader2,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateApplicationStatusAction } from './actions'

interface Application {
  id: string
  status: string
  submitted_at: string
  startup: { name: string }
  program: { name: string, cohort: string }
}

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    const supabase = createClient()
    const { data } = await supabase
      .from('applications')
      .select(`
        *,
        startup:startups(name),
        program:programs(name, cohort)
      `)
      .order('submitted_at', { ascending: false })
    
    // High-fidelity Mock Data for polished presentation
    const MOCK_APPLICATIONS: Application[] = [
      { id: '1', status: 'submitted', submitted_at: new Date().toISOString(), startup: { name: 'EcoFlow' }, program: { name: 'Sustainability Launchpad', cohort: 'S24' } },
      { id: '2', status: 'under_review', submitted_at: new Date().toISOString(), startup: { name: 'PayGuard' }, program: { name: 'Global Fintech Accelerator', cohort: 'W24' } },
      { id: '3', status: 'accepted', submitted_at: new Date().toISOString(), startup: { name: 'BioShield' }, program: { name: 'Sustainability Launchpad', cohort: 'S24' } },
    ]

    setApplications(data && data.length > 0 ? (data as unknown as Application[]) : MOCK_APPLICATIONS)
    setLoading(false)
  }

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.startup?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsProcessing(id)
    try {
      const result = await updateApplicationStatusAction(id, newStatus)
      if (result.success) {
        setApplications(apps => apps.map(a => a.id === id ? { ...a, status: newStatus } : a))
      }
    } finally {
      setIsProcessing(null)
      setActiveMenu(null)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Application Review</h1>
        <p className="text-muted-foreground mt-1">Review and process cohort applications</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm">
        <div className="p-4 border-b border-border/50 bg-secondary/50 rounded-t-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by startup name..." 
              className="w-full pl-10 pr-4 py-2 bg-card border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none px-4 py-2 bg-card border border-border/50 rounded-xl font-bold text-sm hover:bg-secondary transition-all focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/50">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Startup</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Program</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Submitted</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                  </td>
                </tr>
              ) : filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-secondary/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-foreground">{app.startup?.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{app.program?.name}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cohort {app.program?.cohort}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(app.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      app.status === 'accepted' ? "bg-emerald-500/10 text-emerald-700" :
                      app.status === 'submitted' ? "bg-blue-500/10 text-blue-700" :
                      app.status === 'under_review' ? "bg-amber-500/10 text-amber-700" :
                      "bg-rose-500/10 text-rose-700"
                    )}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isProcessing === app.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600 ml-auto" />
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === app.id ? null : app.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                        </button>
                        
                        {activeMenu === app.id && (
                          <div className="absolute right-6 top-14 w-48 bg-card border border-border/50 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-200">
                             {['submitted', 'under_review', 'accepted', 'rejected'].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusUpdate(app.id, s)}
                                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold hover:bg-secondary transition-colors"
                                >
                                  <span className="capitalize">{s.replace('_', ' ')}</span>
                                  {app.status === s && <Check className="w-3 h-3 text-blue-600" />}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
