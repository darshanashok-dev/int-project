'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  FileCheck, 
  BarChart, 
  DollarSign, 
  Plus,
  Search,
  Zap,
  ArrowRight,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Application {
  id: string
  status: string
  submitted_at: string
  programs?: {
    name: string
    cohort: string
    funding_amount: string
    funding_type: string
  }
}

interface Program {
  id: string
  name: string
  cohort: string
  cohort_start: string
}

export default function ApplicationTrackingPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [showSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('All')

  const [upcomingPrograms, setUpcomingPrograms] = useState<Program[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data: startup, error: startupError } = await supabase
          .from('startups')
          .select('id')
          .eq('founder_id', user.id)
          .single()

        if (startupError) throw startupError

        if (startup) {
          const { data, error } = await supabase
            .from('applications')
            .select('*, programs(name, cohort, funding_amount, funding_type)')
            .eq('startup_id', startup.id)
            .order('submitted_at', { ascending: false })
          
          if (error) throw error
          if (data) setApplications(data)
        }

        // Fetch upcoming programs for deadlines
        const { data: programs, error: programsError } = await supabase
          .from('programs')
          .select('*')
          .gte('cohort_start', new Date().toISOString().split('T')[0])
          .order('cohort_start', { ascending: true })
          .limit(2)
        
        if (!programsError && programs) {
          setUpcomingPrograms(programs)
        }
      } catch (err) {
        console.error('Error loading applications data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'All') return true
    if (activeTab === 'Pending') return app.status === 'submitted'
    if (activeTab === 'Approved') return app.status === 'approved'
    return true
  })

  if (loading) return <div className="p-8">Loading...</div>

  const activeReviews = applications.filter((app) => app.status === 'submitted').length
  const approvedApps = applications.filter((app) => app.status === 'approved').length
  const successRate = applications.length > 0 ? Math.round((approvedApps / applications.length) * 100) : 0
  const pipelineValue = applications.length * 150000 // Placeholder logic: $150k per application

  return (
    <div className="space-y-8 relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#202124] text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Draft Created</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">New submission started</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#202124]">Application Tracking</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your journey through incubation cycles and secure venture capital funding from a centralized command center.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-8">
        {[
          { label: 'Active Reviews', value: activeReviews.toString().padStart(2, '0'), sub: 'Pending Review', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Success Rate', value: `${successRate}%`, sub: 'Approved Status', icon: BarChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pipeline Value', value: `$${(pipelineValue / 1000000).toFixed(1)}M`, sub: 'Estimated Value', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-black text-[#202124] tracking-tighter">{stat.value}</h2>
                  <span className="text-xs font-bold text-muted-foreground">{stat.sub}</span>
                </div>
              </div>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          {/* Recent Submissions List */}
          <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-[#202124]">Recent Submissions</h3>
              <div className="flex gap-2">
                {['All', 'Pending', 'Approved'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                      activeTab === tab ? "bg-[#f1f3f4] text-[#202124]" : "text-muted-foreground hover:bg-black/5"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredApplications.length > 0 ? filteredApplications.map((app, i) => (
                <div key={i} className="flex items-center gap-6 p-6 border border-transparent rounded-[2rem] hover:bg-[#f1f3f4]/50 hover:border-border transition-all group">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-lg text-[#202124]">{app.programs?.name}</h4>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {app.programs?.funding_amount ? `${app.programs.funding_amount} ${app.programs.funding_type}` : (app.programs?.cohort || 'Q4 Program')}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Date</p>
                    <p className="font-bold text-sm text-[#202124]">{new Date(app.submitted_at).toLocaleDateString()}</p>
                  </div>
                  <div className="w-32">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2",
                      app.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      app.status === 'rejected' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", 
                        app.status === 'approved' ? "bg-emerald-500" : 
                        app.status === 'rejected' ? "bg-red-500" : "bg-blue-500"
                      )}></span>
                      {app.status === 'submitted' ? 'Pending Review' : app.status}
                    </span>
                  </div>
                  <button className="text-sm font-bold text-[#202124] hover:underline underline-offset-4 decoration-2">
                    {app.status === 'approved' ? 'View Roadmap' : 'Manage Submission'}
                  </button>
                </div>
              )) : (
                <div className="text-center py-20 bg-[#f8f9fa] rounded-3xl border border-dashed border-gray-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                    <Search className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-[#202124]">No {activeTab.toLowerCase()} submissions found</p>
                  <p className="text-xs text-muted-foreground mt-1">Adjust your filters or start a new submission.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#f8f9fa] border border-border rounded-[2.5rem] p-10 relative overflow-hidden group">
            <h3 className="text-2xl font-black text-[#202124] mb-8 relative z-10">Upcoming Funding Deadlines</h3>
            <div className="space-y-8 relative z-10">
              {upcomingPrograms.length > 0 ? upcomingPrograms.map((item, i) => (
                <div key={i} className="flex gap-6 items-start group/item">
                  <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm border border-border group-hover/item:scale-110 transition-transform">
                    <span className="text-[10px] font-black text-muted-foreground leading-none">{new Date(item.cohort_start).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-xl font-black text-[#202124] leading-tight">{new Date(item.cohort_start).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#202124] group-hover/item:text-blue-600 transition-colors">{item.name}</h4>
                    <p className="text-sm text-muted-foreground font-medium mt-1 leading-relaxed">{item.cohort} cycle. Apply to secure your spot.</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground font-medium">No upcoming deadlines found at this time.</p>
              )}
            </div>
            <button className="mt-10 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#202124] group/btn">
              Browse all opportunities
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Calendar className="w-full h-full text-black" />
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="col-span-4">
          <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm flex flex-col space-y-6">
            <div>
              <h3 className="text-xl font-black text-[#202124]">Application Suite</h3>
              <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
                Start a new submission for the {upcomingPrograms[0]?.name || 'current'} cohort.
              </p>
            </div>
            <Link 
              href="/founder/applications/new"
              className="w-full py-5 bg-black text-white rounded-3xl font-extrabold text-sm shadow-xl hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Begin New Draft
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
