'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  FileCheck, 
  BarChart, 
  DollarSign, 
  Plus,
  Search,
  Zap,
  ArrowRight,
  Calendar,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ApplicationTrackingPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<unknown[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('All')

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
            .select('*, programs(name, cohort)')
            .eq('startup_id', startup.id)
            .order('submitted_at', { ascending: false })
          
          if (error) throw error
          if (data) setApplications(data)
        }
      } catch (err) {
        console.error('Error loading applications data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])

  const handleDraft = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const filteredApplications = (applications as { status: string }[]).filter(app => {
    if (activeTab === 'All') return true
    if (activeTab === 'Pending') return app.status === 'submitted'
    if (activeTab === 'Approved') return app.status === 'approved'
    return true
  })

  if (loading) return <div className="p-8">Loading...</div>

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

      {/* ... (Stats Cards unchanged) */}
      <div className="grid grid-cols-3 gap-8">
        {[
          { label: 'Active Reviews', value: '04', sub: '+2 this week', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Success Rate', value: '82%', sub: 'Industry High', icon: BarChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pipeline Value', value: '$2.4M', sub: 'Projected', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
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
              {filteredApplications.length > 0 ? (filteredApplications as { status: string, programs?: { name: string, cohort: string } }[]).map((app, i) => (
                <div key={i} className="flex items-center gap-6 p-6 border border-transparent rounded-[2rem] hover:bg-[#f1f3f4]/50 hover:border-border transition-all group">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-lg text-[#202124]">{app.programs?.name}</h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{app.programs?.cohort || 'Q4 Program'}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Requested</p>
                    <p className="font-bold text-sm text-[#202124]">$500,000 Equity-free</p>
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

          {/* ... (Deadlines section unchanged) */}
          <div className="bg-[#f8f9fa] border border-border rounded-[2.5rem] p-10 relative overflow-hidden group">
            <h3 className="text-2xl font-black text-[#202124] mb-8 relative z-10">Upcoming Funding Deadlines</h3>
            <div className="space-y-8 relative z-10">
              {[
                { date: 'OCT 24', title: 'Horizon BioTech Challenge', desc: 'Open for innovative synthetic biology startups. $50k non-dilutive.' },
                { date: 'NOV 12', title: 'Global SaaS Summit Prep', desc: 'Presentation deadline for main stage incubator pitch.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group/item">
                  <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm border border-border group-hover/item:scale-110 transition-transform">
                    <span className="text-[10px] font-black text-muted-foreground leading-none">{item.date.split(' ')[0]}</span>
                    <span className="text-xl font-black text-[#202124] leading-tight">{item.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#202124] group-hover/item:text-blue-600 transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
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
          <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
               <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                 <Plus className="w-5 h-5" />
               </div>
            </div>
            <div className="w-16 h-16 bg-[#202124] text-white rounded-[2rem] flex items-center justify-center p-4 shadow-xl group-hover:rotate-12 transition-transform">
              <Award className="w-full h-full fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#202124]">Strategic Matching Engine</h3>
              <p className="text-sm text-muted-foreground font-medium mt-4 leading-relaxed">
                Our platform has analyzed your pitch deck. You have a <span className="text-black font-black italic">94% match</span> with the <span className="italic">Green Horizon Grant</span> criteria. Submit now to capitalize on the momentum.
              </p>
            </div>
            <div className="w-full pt-6">
               <button 
                onClick={handleDraft}
                className="w-full py-5 bg-black text-white rounded-3xl font-extrabold text-sm shadow-xl hover:bg-gray-800 transition-all group-hover:scale-[1.02] active:scale-[0.98]"
               >
                 Begin Instant Draft
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
