import { createClient } from '@/lib/supabase/server'
import { Briefcase, Search, Filter, Rocket, TrendingUp, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { StartupBasic } from '@/types/dashboard'
import { cn } from '@/lib/utils'

export default async function MentorStartupsPage() {
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

  // Fetch Assigned Startups
  let startupsData: StartupBasic[] = []
  if (mentor) {
    const { data: assignments } = await supabase
      .from('mentor_assignments')
      .select(`
        startup:startups(id, name, sector, stage, status)
      `)
      .eq('mentor_id', mentor.id)
    
    startupsData = (assignments as any[])
      ?.map(a => a.startup)
      .filter(Boolean) || []
  }

  // Mock data if empty
  const MOCK_STARTUPS: StartupBasic[] = [
    { id: '1', name: 'AeroDynamics', sector: 'CleanTech', stage: 'Seed', status: 'active' },
    { id: '2', name: 'BioSynth', sector: 'HealthTech', stage: 'Pre-Seed', status: 'active' },
    { id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'Series A', status: 'active' },
    { id: '4', name: 'Quantum Leap', sector: 'DeepTech', stage: 'Seed', status: 'active' },
    { id: '5', name: 'EcoFlow', sector: 'Energy', stage: 'Pre-Seed', status: 'active' },
    { id: '6', name: 'NeuroLink', sector: 'MedTech', stage: 'Series B', status: 'active' },
  ]

  const finalStartups = startupsData.length > 0 ? startupsData : MOCK_STARTUPS

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Active Portfolio</h1>
          <p className="text-muted-foreground mt-2 font-medium">Monitoring and advisory for assigned architectural ventures.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-6 py-3 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
              <p className="text-lg font-black text-foreground">{finalStartups.length}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active</p>
              <p className="text-lg font-black text-emerald-600">{finalStartups.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filter by venture name, sector or stage..." 
              className="w-full h-14 pl-14 pr-6 bg-secondary rounded-[1.25rem] border-none text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="h-14 px-6 rounded-2xl bg-secondary text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="h-14 px-8 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:shadow-2xl active:scale-95 transition-all">
              Assign New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {finalStartups.map((startup) => (
            <div 
              key={startup.id} 
              className="bg-card border border-border rounded-[2.5rem] p-8 hover:border-black/10 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50/20 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10 flex items-start justify-between mb-8">
                <div className="w-16 h-16 bg-background border border-[#f1f3f4] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform group-hover:bg-card">
                  <Rocket className="w-8 h-8 text-foreground" />
                </div>
                <div className="flex gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                    startup.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                  )}>
                    {startup.status}
                  </span>
                </div>
              </div>

              <div className="relative z-10 mb-8">
                <h3 className="text-2xl font-black text-foreground mb-1 group-hover:text-blue-600 transition-colors truncate">{startup.name}</h3>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  {startup.sector}
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  {startup.stage}
                </p>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background rounded-2xl p-4 border border-transparent group-hover:border-[#f1f3f4] transition-all">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter mb-1">Growth</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-foreground">+12.5%</span>
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
                <div className="bg-background rounded-2xl p-4 border border-transparent group-hover:border-[#f1f3f4] transition-all">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter mb-1">Health</p>
                  <div className="flex items-center gap-1 text-sm font-black text-blue-600">
                    Optimal
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-[#f1f3f4]">
                <button className="flex-1 h-12 flex items-center justify-center gap-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10">
                  Analyze
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-black hover:text-white transition-all">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#f1f3f4] text-muted-foreground hover:bg-card hover:border-black/20 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
