'use client'

import { useState, useMemo } from 'react'
import { 
  Briefcase, 
  Search, 
  CheckCircle2,
  Clock,
  Building2,
  Trash2,
  XCircle,
  Loader2,
  Check,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { updateStartupStatusAction, deleteStartupAction } from './actions'

interface Startup {
  id: string
  name: string
  status: string
  sector: string | null
  stage: string | null
  created_at: string
  founder: { email: string } | null
}

export default function StartupTable({ initialStartups }: { initialStartups: Startup[] }) {
  const [startups, setStartups] = useState<Startup[]>(initialStartups)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const filteredStartups = useMemo(() => {
    return startups.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.sector?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [startups, searchQuery, statusFilter])

  const handleStatusUpdate = async (startupId: string, newStatus: string) => {
    setIsProcessing(startupId)
    try {
      const result = await updateStartupStatusAction(startupId, newStatus)
      if (result.success) {
        setStartups(startups.map(s => s.id === startupId ? { ...s, status: newStatus } : s))
      } else {
        alert(result.error || 'Failed to update status')
      }
    } catch {
      alert('An unexpected error occurred')
    } finally {
      setIsProcessing(null)
      setActiveMenu(null)
    }
  }

  const handleDelete = async (startupId: string) => {
    if (!confirm('Are you sure you want to delete this startup?')) return
    
    setIsProcessing(startupId)
    try {
      const result = await deleteStartupAction(startupId)
      if (result.success) {
        setStartups(startups.filter(s => s.id !== startupId))
      } else {
        alert(result.error || 'Failed to delete startup')
      }
    } catch {
      alert('An unexpected error occurred')
    } finally {
      setIsProcessing(null)
      setActiveMenu(null)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Ventures', value: startups.length, icon: Building2, color: 'text-blue-600' },
          { label: 'Active', value: startups.filter(s => s.status === 'active').length, icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Pending Review', value: startups.filter(s => s.status === 'pending').length, icon: Clock, color: 'text-amber-600' },
          { label: 'Waitlisted', value: startups.filter(s => s.status === 'waitlisted').length, icon: Briefcase, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-border/50 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-[#202124]">{stat.value}</p>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search startups by name or sector..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 bg-white border border-border/50 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-black/5 min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Company</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Founder</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Sector & Stage</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredStartups.map((startup) => (
                <tr key={startup.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                        {startup.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[#202124]">{startup.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {startup.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#202124]">{startup.founder?.email || 'Unknown'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#202124]">{startup.sector || 'N/A'}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{startup.stage || 'Pre-seed'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      startup.status === 'active' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      startup.status === 'pending' ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      startup.status === 'rejected' ? "bg-rose-50 text-rose-700 border border-rose-100" :
                      "bg-slate-50 text-slate-700 border border-slate-100"
                    )}>
                      {startup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isProcessing === startup.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600 ml-auto" />
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/startups/${startup.id}`}
                          className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors text-muted-foreground"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <div className="relative">
                          <button 
                            onClick={() => setActiveMenu(activeMenu === startup.id ? null : startup.id)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                          </button>
                          
                          {activeMenu === startup.id && (
                            <div className="absolute right-0 top-12 w-48 bg-white border border-border/50 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-200">
                              <div className="px-4 py-2 border-b border-border/50 mb-1">
                                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Change Status</p>
                              </div>
                              {[
                                { id: 'active', label: 'Approve / Active', icon: CheckCircle2, color: 'text-emerald-600' },
                                { id: 'pending', label: 'Mark Pending', icon: Clock, color: 'text-amber-600' },
                                { id: 'waitlisted', label: 'Waitlist', icon: Briefcase, color: 'text-purple-600' },
                                { id: 'rejected', label: 'Reject', icon: XCircle, color: 'text-rose-600' },
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => handleStatusUpdate(startup.id, item.id)}
                                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors"
                                >
                                  <span className={cn("flex items-center gap-2", item.color)}>
                                    <item.icon className="w-3 h-3" />
                                    {item.label}
                                  </span>
                                  {startup.status === item.id && <Check className="w-3 h-3 text-blue-600" />}
                                </button>
                              ))}
                              <div className="h-px bg-border/50 my-1" />
                              <button
                                onClick={() => handleDelete(startup.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete Startup
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStartups.length === 0 && (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-muted-foreground">No ventures matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
