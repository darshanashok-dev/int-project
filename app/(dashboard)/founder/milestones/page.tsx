'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Flag, 
  ChevronRight, 
  Download, 
  Send,
  MessageCircle,
  TrendingUp,
  Activity,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MilestonesPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [milestones, setMilestones] = useState<unknown[]>([])
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [shareWith, setShareWith] = useState('All')

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
            .from('milestones')
            .select('*')
            .eq('startup_id', startup.id)
            .order('due_date', { ascending: true })
          
          if (error) throw error
          if (data) setMilestones(data)
        }
      } catch (err) {
        console.error('Error loading milestones data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])

  const handleAction = (type: string) => {
    setShowSuccess(type)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="space-y-8 relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#202124] text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              {showSuccess === 'Export' ? <Download className="w-5 h-5 text-white" /> : 
               showSuccess === 'Archive' ? <Activity className="w-5 h-5 text-white" /> : 
               <Send className="w-5 h-5 text-white" />}
            </div>
            <div>
              <p className="font-bold text-sm">
                {showSuccess === 'Export' ? 'Report Exported' : 
                 showSuccess === 'Archive' ? 'Premium Required' :
                 'Update Broadcasted'}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {showSuccess === 'Export' ? 'Downloaded to your system' : 
                 showSuccess === 'Archive' ? 'Archive coming soon to Polaris Premium' :
                 'Shared with ' + shareWith}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            <span>Polaris Platform</span>
            <ChevronRight className="w-3 h-3" />
            <span>Milestones</span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#202124]">Milestones & Momentum</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your journey from seed to exit. Track key business objectives and share verified progress.</p>
        </div>
        <button 
          onClick={() => handleAction('Export')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-200 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Timeline Column */}
        <div className="col-span-8 space-y-8">
          {/* Active Phase Card */}
          <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-start gap-8">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center p-5">
                <TrendingUp className="w-full h-full" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-black text-[#202124]">Scale Series A Operations</h2>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-[#202124] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Active Phase
                  </span>
                </div>
                <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                  Current objective: Complete hiring for the engineering lead and secure first 100 enterprise pilots.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-[#202124] uppercase tracking-widest">Progress to Completion</p>
                    <span className="text-4xl font-black italic tracking-tighter">64%</span>
                  </div>
                  <div className="h-4 bg-[#f1f3f4] rounded-full overflow-hidden">
                    <div className="h-full bg-black w-[64%] rounded-full shadow-[0_0_12px_rgba(0,0,0,0.1)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Roadmap */}
          <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-extrabold text-[#202124]">Historical Roadmap</h3>
              <button 
                onClick={() => handleAction('Archive')}
                className="text-sm font-bold text-muted-foreground hover:text-black transition-colors underline underline-offset-4"
              >
                View All Archive
              </button>
            </div>

            <div className="space-y-12 relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100"></div>

              {milestones.length > 0 ? (milestones as { status: string, title: string, due_date: string }[]).map((m, i) => (
                <div key={i} className="flex gap-8 relative group">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center z-10 shrink-0 shadow-sm border-2",
                    m.status === 'completed' ? "bg-black border-black text-white" : 
                    m.status === 'in-progress' ? "bg-white border-black text-black" : "bg-gray-50 border-gray-200 text-gray-300"
                  )}>
                    {m.status === 'completed' && <CheckCircle2 className="w-6 h-6" />}
                    {m.status === 'in-progress' && <Flag className="w-6 h-6 fill-current" />}
                    {m.status === 'pending' && <Circle className="w-6 h-6" />}
                  </div>
                  <div className="space-y-2">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      m.status === 'completed' ? "text-muted-foreground" : "text-blue-600"
                    )}>
                      {m.status === 'completed' ? 'COMPLETED' : m.status.toUpperCase()} • Q{Math.floor(new Date(m.due_date).getMonth() / 3) + 1} {new Date(m.due_date).getFullYear()}
                    </p>
                    <h4 className="text-lg font-extrabold text-[#202124]">{m.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-lg">
                      Successfully reached target milestones and secured necessary validation.
                    </p>
                    {m.status === 'in-progress' && (
                      <div className="flex gap-3 pt-2">
                        <span className="px-3 py-1 bg-[#f1f3f4] text-[10px] font-black uppercase tracking-widest rounded-lg">Infrastructure</span>
                        <span className="px-3 py-1 bg-[#f1f3f4] text-[10px] font-black uppercase tracking-widest rounded-lg">Hiring</span>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-muted-foreground">No milestones defined yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Form and Insights Column */}
        <div className="col-span-4 space-y-8">
          {/* Publish Update Form */}
          <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#202124] mb-2">Publish Update</h3>
            <p className="text-sm font-medium text-muted-foreground mb-8">Share key wins or blockers with investors.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">Update Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Hiring Milestone Achieved"
                  className="w-full h-12 px-4 bg-[#f1f3f4] rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">Impact Area</label>
                <select className="w-full h-12 px-4 bg-[#f1f3f4] rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-black/5 appearance-none">
                  <option>Product Development</option>
                  <option>Sales & Marketing</option>
                  <option>Operations</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">The Narrative</label>
                <textarea 
                  rows={4}
                  className="w-full p-4 bg-[#f1f3f4] rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-black/5 resize-none"
                  placeholder="What happened this week? Be concise."
                />
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center mb-4">Share With</p>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {['Mentors', 'Investors', 'All'].map(target => (
                    <button 
                      key={target} 
                      onClick={() => setShareWith(target)}
                      className={cn(
                        "py-2 text-[10px] font-black uppercase tracking-widest border transition-all rounded-lg",
                        shareWith === target ? "bg-black text-white border-black" : "border-border hover:bg-black/5"
                      )}
                    >
                      {target}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => handleAction('Broadcast')}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Broadcast Update
                </button>
              </div>
            </div>
          </div>

          {/* Mentor Insight Card */}
          <div className="bg-[#1a1c1e] text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              Mentor Insight
              <MessageCircle className="w-4 h-4" />
            </h3>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-700 shrink-0"></div>
              <blockquote className="italic text-sm text-gray-300 font-medium leading-relaxed">
                &ldquo;Focus on the enterprise pilots this month. Your conversion data is the strongest signal for the upcoming board meeting.&rdquo;
              </blockquote>
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">
              — Sarah Chen, Managing Director
            </p>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-2xl p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Velocity</p>
              <p className="text-2xl font-black text-[#202124]">+12.4%</p>
            </div>
            <div className="bg-white border border-border rounded-2xl p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Health</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <p className="text-sm font-black text-[#202124]">Nominal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Circle(props: { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}
