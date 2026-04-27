'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Flag, 
  ChevronRight, 
  Download, 
  Send,
  TrendingUp,
  Activity,
  CheckCircle2,
  Circle,
  Zap,
  Loader2,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Milestone {
  id: string
  title: string
  due_date: string | null
  status: string
}

export default function MilestonesPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [milestones, setMilestones] = useState<Milestone[]>([])
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

        if (startupError && startupError.code !== 'PGRST116') throw startupError

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

  const [broadcastTitle, setBroadcastTitle] = useState('')
  const [broadcastArea, setBroadcastArea] = useState('Product Development')
  const [broadcastContent, setBroadcastContent] = useState('')
  const [broadcasting, setBroadcasting] = useState(false)

  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ title: '', due_date: '', status: 'pending' })
  const [savingMilestone, setSavingMilestone] = useState(false)

  const handleAction = (type: string) => {
    setShowSuccess(type)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleAddMilestone = async () => {
    if (!newMilestone.title) return
    setSavingMilestone(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('founder_id', user.id)
        .single()

      if (!startup) return

      const { error } = await supabase
        .from('milestones')
        .insert({
          startup_id: startup.id,
          title: newMilestone.title,
          due_date: newMilestone.due_date || null,
          status: newMilestone.status
        })

      if (error) throw error

      handleAction('Milestone')
      setShowMilestoneModal(false)
      setNewMilestone({ title: '', due_date: '', status: 'pending' })
      
      // Refresh milestones
      const { data } = await supabase
        .from('milestones')
        .select('*')
        .eq('startup_id', startup.id)
        .order('due_date', { ascending: true })
      
      if (data) setMilestones(data)
    } catch (err) {
      console.error('Error adding milestone:', err)
      alert('Error adding milestone')
    } finally {
      setSavingMilestone(false)
    }
  }

  const handleBroadcast = async () => {
    if (!broadcastTitle || !broadcastContent) return
    setBroadcasting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('founder_id', user.id)
        .single()

      const { error } = await supabase
        .from('broadcasts')
        .insert({
          startup_id: startup?.id,
          founder_id: user.id,
          title: broadcastTitle,
          area: broadcastArea,
          content: broadcastContent,
          audience: shareWith
        })

      if (error) throw error

      handleAction('Broadcast')
      setBroadcastTitle('')
      setBroadcastContent('')
    } catch (err) {
      console.error('Error sending broadcast:', err)
    } finally {
      setBroadcasting(false)
    }
  }

  const inProgressMilestone = milestones.find(m => m.status === 'in-progress')
  const completedCount = milestones.filter(m => m.status === 'completed').length
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <Zap className="w-8 h-8 animate-pulse text-muted-foreground" />
    </div>
  )

  return (
    <div className="space-y-8 relative animate-in fade-in duration-700">
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
                 showSuccess === 'Milestone' ? 'Milestone Recorded' :
                 'Update Broadcasted'}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {showSuccess === 'Export' ? 'Downloaded to your system' : 
                 showSuccess === 'Milestone' ? 'Added to your roadmap' :
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
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowMilestoneModal(true)}
            className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Record Milestone
          </button>
          {milestones.length > 0 && (
            <button 
              onClick={() => handleAction('Export')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-200 transition-all shadow-sm active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Timeline Column */}
        <div className="col-span-1 md:col-span-8 space-y-8">
          {/* Active Phase Card - CONDITIONALLY RENDERED */}
          {inProgressMilestone ? (
            <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-start gap-8">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center p-5">
                  <TrendingUp className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h2 className="text-2xl font-black text-[#202124] truncate">{inProgressMilestone.title}</h2>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[#202124] text-white text-[10px] font-black uppercase tracking-widest rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Active Phase
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium mb-8 leading-relaxed italic">
                    Focusing on immediate operational scaling and team optimization for the current lifecycle.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-[#202124] uppercase tracking-widest">Progress to Completion</p>
                      <span className="text-4xl font-black italic tracking-tighter">{progress}%</span>
                    </div>
                    <div className="h-4 bg-[#f1f3f4] rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full shadow-[0_0_12px_rgba(0,0,0,0.1)]" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-border rounded-[2.5rem] p-12 shadow-sm text-center">
              <div className="w-16 h-16 bg-[#f1f3f4] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Flag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-[#202124] mb-2">No Active Roadmap</h3>
              <p className="text-muted-foreground max-w-[320px] mx-auto text-sm font-medium mb-10">Add your first milestones to track progress and sync your velocity with the Polaris Platform.</p>
              <button 
                onClick={() => setShowMilestoneModal(true)}
                className="px-10 py-4 bg-black text-white rounded-2xl font-black text-sm shadow-2xl shadow-black/10 hover:bg-gray-800 transition-all"
              >
                Create First Milestone
              </button>
            </div>
          )}

          {/* Historical Roadmap */}
          <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-extrabold text-[#202124]">Lifecycle Roadmap</h3>
              {milestones.length > 0 && (
                <button 
                  onClick={() => handleAction('Archive')}
                  className="text-sm font-bold text-muted-foreground hover:text-black transition-colors underline underline-offset-4"
                >
                  View Archive
                </button>
              )}
            </div>

            <div className="space-y-12 relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100"></div>

              {milestones.length > 0 ? milestones.map((m, i) => (
                <div key={i} className="flex gap-8 relative group">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center z-10 shrink-0 shadow-sm border-2 transition-colors",
                    m.status === 'completed' ? "bg-black border-black text-white" : 
                    m.status === 'in-progress' ? "bg-white border-black text-black" : "bg-gray-50 border-gray-200 text-gray-300"
                  )}>
                    {m.status === 'completed' && <CheckCircle2 className="w-6 h-6" />}
                    {m.status === 'in-progress' && <Flag className="w-6 h-6 fill-current" />}
                    {m.status === 'pending' && <Circle className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      m.status === 'completed' ? "text-muted-foreground" : "text-blue-600"
                    )}>
                      {m.status.toUpperCase()} • {m.due_date ? `Q${Math.floor(new Date(m.due_date).getUTCMonth() / 3) + 1} ${new Date(m.due_date).getUTCFullYear()}` : 'Date Pending'}
                    </p>
                    <h4 className="text-lg font-extrabold text-[#202124]">{m.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-lg">
                      {m.status === 'completed' ? 'Successfully reached target milestones and secured necessary validation.' : 'Pending execution and progress updates.'}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-[#f8f9fa] rounded-3xl border border-dashed border-gray-200">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ready for your roadmap</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="col-span-1 md:col-span-4 space-y-8">
          {/* Publish Update Form */}
          <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#202124] mb-2 tracking-tight">Venture Broadcast</h3>
            <p className="text-sm font-medium text-muted-foreground mb-8">Share key wins or blockers with your network.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1 opacity-70">Update Title</label>
                <input 
                  type="text" 
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Hiring Milestone Achieved"
                  className="w-full h-12 px-4 bg-[#f1f3f4] rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-black/5 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1 opacity-70">Focus Area</label>
                <select 
                  value={broadcastArea}
                  onChange={(e) => setBroadcastArea(e.target.value)}
                  className="w-full h-12 px-4 bg-[#f1f3f4] rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-black/5 appearance-none"
                >
                  <option>Product Development</option>
                  <option>Sales & Marketing</option>
                  <option>Capital Allocation</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1 opacity-70">The Update</label>
                <textarea 
                  rows={4}
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  className="w-full p-4 bg-[#f1f3f4] rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-black/5 resize-none transition-all"
                  placeholder="Quick summary of progress..."
                />
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center mb-4 opacity-50">Audience Selection</p>
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
                  onClick={handleBroadcast}
                  disabled={broadcasting || !broadcastTitle || !broadcastContent}
                  className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {broadcasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Broadcast Update
                </button>
              </div>
            </div>
          </div>



          {/* Mini Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Velocity</p>
              <p className="text-2xl font-black text-[#202124] tracking-tighter">{progress}%</p>
            </div>
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Health</p>
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", progress > 50 ? "bg-emerald-500" : progress > 0 ? "bg-amber-500" : "bg-gray-300")}></span>
                <p className="text-sm font-black text-[#202124] uppercase tracking-tighter">
                  {progress > 50 ? 'Stable' : progress > 0 ? 'Action Req' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Milestone Creation Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowMilestoneModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-500">
            <h3 className="text-3xl font-black text-[#202124] mb-2">Record Milestone</h3>
            <p className="text-muted-foreground font-medium mb-8">Define a key business objective to track your venture velocity.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#202124]">Milestone Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Beta Launch, Seed Round Close..."
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="w-full h-14 px-6 bg-[#f1f3f4] rounded-2xl border-none font-bold focus:ring-2 focus:ring-black/5 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#202124]">Target Date</label>
                  <input 
                    type="date"
                    value={newMilestone.due_date}
                    onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                    className="w-full h-14 px-6 bg-[#f1f3f4] rounded-2xl border-none font-bold focus:ring-2 focus:ring-black/5 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#202124]">Initial Status</label>
                  <select 
                    value={newMilestone.status}
                    onChange={(e) => setNewMilestone({ ...newMilestone, status: e.target.value })}
                    className="w-full h-14 px-6 bg-[#f1f3f4] rounded-2xl border-none font-bold focus:ring-2 focus:ring-black/5 transition-all appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setShowMilestoneModal(false)}
                  className="flex-1 py-4 bg-[#f1f3f4] text-[#202124] rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddMilestone}
                  disabled={savingMilestone || !newMilestone.title}
                  className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-sm shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {savingMilestone ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Save Milestone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


