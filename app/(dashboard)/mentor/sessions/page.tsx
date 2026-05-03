import { createClient } from '@/lib/supabase/server'
import { Calendar, Clock, MapPin, Search, Filter, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SessionBasic } from '@/types/dashboard'
import { cn } from '@/lib/utils'

export default async function MentorSessionsPage() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  if (!user) return null

  // Fetch Mentor ID
  const { data: mentor } = await (supabase
    .from('mentors')
    .select('id')
    .eq('user_id', user.id)
    .single() as any)

  const mentorId = mentor?.id

  let sessionsData: SessionBasic[] = []
  if (mentorId) {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, scheduled_at, status, startup:startups(name)')
      .eq('mentor_id', mentorId)
      .order('scheduled_at', { ascending: false })
    
    sessionsData = (sessions as any[])?.map(s => ({
      ...s,
      startups: s.startup
    })) || []
  }

  // Mock data if empty
  const MOCK_SESSIONS: SessionBasic[] = [
    { id: '1', scheduled_at: new Date(Date.now() + 86400000).toISOString(), status: 'scheduled', startups: { name: 'AeroDynamics' } },
    { id: '2', scheduled_at: new Date(Date.now() + 172800000).toISOString(), status: 'scheduled', startups: { name: 'BioSynth' } },
    { id: '3', scheduled_at: new Date(Date.now() - 86400000).toISOString(), status: 'completed', startups: { name: 'Quantum Leap' } },
    { id: '4', scheduled_at: new Date(Date.now() - 259200000).toISOString(), status: 'completed', startups: { name: 'CloudScale' } },
  ]

  const finalSessions = sessionsData.length > 0 ? sessionsData : MOCK_SESSIONS

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Mentorship Sessions</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your schedule and advisory meetings.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]">
          <Calendar className="w-4 h-4" />
          Request New Slot
        </button>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search sessions..." 
              className="w-full h-12 pl-12 pr-4 bg-secondary rounded-xl border-none text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-xs font-bold hover:bg-gray-200 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold shadow-lg">
              Upcoming
            </button>
            <button className="px-4 py-2 rounded-xl text-muted-foreground text-xs font-bold hover:bg-secondary transition-colors">
              History
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {finalSessions.map((session) => (
            <div 
              key={session.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] border border-[#f1f3f4] hover:border-black/10 hover:bg-background transition-all"
            >
              <div className="flex items-center gap-8 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-card border border-[#f1f3f4] rounded-3xl flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    {new Date(session.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-3xl font-black text-foreground">
                    {new Date(session.scheduled_at).toLocaleDateString('en-US', { day: 'numeric' })}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground mb-2">{session.startups?.name || 'Venture Advisory'}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-[#f1f3f4]">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {new Date(session.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-[#f1f3f4]">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      Virtual Meeting
                    </span>
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      session.status === 'completed' ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                    )}>
                      {session.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {session.status === 'scheduled' ? (
                  <button className="flex-1 md:flex-none px-8 py-4 bg-black text-white rounded-2xl font-black text-xs shadow-xl shadow-black/10 hover:shadow-2xl transition-all active:scale-[0.98]">
                    Join Call
                  </button>
                ) : (
                  <button className="flex-1 md:flex-none px-8 py-4 bg-secondary text-foreground rounded-2xl font-black text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                    Review Notes
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
