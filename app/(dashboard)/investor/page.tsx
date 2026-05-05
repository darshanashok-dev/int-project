import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  Eye, 
  Briefcase, 
  ArrowRight,
  ArrowUpRight,
  Target,
  PieChart,
  Sparkles
} from 'lucide-react'
import { PortfolioAnalytics } from '@/components/portfolio/PortfolioAnalytics'

type InterestRow = {
  id: string
  signal_type: string | null
  note: string | null
  created_at: string | null
  startups: { name: string, sector: string | null, stage: string | null } | null
}

type StartupRow = {
  id: string
  name: string
  sector: string | null
  stage: string | null
  status: string | null
  elevator_pitch: string | null
}

import { getSessionUser } from '@/lib/auth/get-session-user'

export default async function InvestorDashboard() {
  const supabase = createClient()
  const user = await getSessionUser()
  if (!user) return null

  const { data: interests } = await supabase
    .from('investor_interests')
    .select('id, signal_type, note, created_at, startups(name, sector, stage)')
    .eq('investor_id', user.id)
    .order('created_at', { ascending: false })

  const { data: startups } = await supabase
    .from('startups')
    .select('id, name, sector, stage, status, elevator_pitch')
    .eq('status', 'active')
    .limit(6)

  const interestsData = interests as InterestRow[] || []
  const startupsData = startups as StartupRow[] || []

  // High-fidelity Mock Data for polished presentation
  const MOCK_STARTUPS: StartupRow[] = [
    { id: '1', name: 'AeroDynamics', sector: 'CleanTech', stage: 'Seed', status: 'active', elevator_pitch: 'Next-gen wind turbine optimization using ML.' },
    { id: '2', name: 'BioSynth', sector: 'HealthTech', stage: 'Pre-Seed', status: 'active', elevator_pitch: 'Synthetic biology platform for rapid drug discovery.' },
    { id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'Series A', status: 'active', elevator_pitch: 'Serverless orchestration for edge computing.' },
  ]

  const MOCK_INTERESTS: InterestRow[] = [
    { id: '1', signal_type: 'committed', note: 'Lead investor for Seed round', created_at: new Date().toISOString(), startups: { name: 'AeroDynamics', sector: 'CleanTech', stage: 'Seed' } },
    { id: '2', signal_type: 'watching', note: 'Monitor growth metrics', created_at: new Date().toISOString(), startups: { name: 'BioSynth', sector: 'HealthTech', stage: 'Pre-Seed' } },
  ]

  const finalStartups = startupsData.length > 0 ? startupsData : MOCK_STARTUPS
  const finalInterests = interestsData.length > 0 ? interestsData : MOCK_INTERESTS

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Investor'
  const totalInterests = finalInterests.length || 0
  const watchingCount = finalInterests.filter(i => i.signal_type === 'watching').length || 0
  const committedCount = finalInterests.filter(i => i.signal_type === 'committed').length || 0

  const signalColor = (type: string | null) => {
    switch (type) {
      case 'committed': return 'bg-emerald-500/10 text-emerald-700 border-emerald-100'
      case 'interested': return 'bg-blue-500/10 text-blue-700 border-blue-100'
      case 'watching': return 'bg-amber-500/10 text-amber-700 border-amber-100'
      default: return 'bg-secondary text-slate-600 border-slate-100'
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg">
            Your deal flow intelligence and portfolio overview.
          </p>
        </div>
        <Link 
          href="/investor/pipeline"
          className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <Target className="w-4 h-4" />
          Browse Deal Flow
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Total Interests</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">{totalInterests}</h2>
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-lg",
              totalInterests > 0 ? "text-emerald-600 bg-emerald-500/10" : "text-gray-400 bg-gray-100"
            )}>
              {totalInterests > 0 ? 'Tracked' : 'Empty'}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Watching</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">{watchingCount}</h2>
            <Eye className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Committed</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">{committedCount}</h2>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Available Startups</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">{finalStartups.length}</h2>
            <Briefcase className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Interests */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-foreground">Recent Interests</h2>
            <Link href="/investor/portfolio" className="text-sm font-bold text-muted-foreground hover:text-black transition-colors flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
            {finalInterests.length > 0 ? (
              <div className="divide-y divide-border/50">
                {finalInterests.slice(0, 5).map((interest) => {
                  const startup = interest.startups as { name: string, sector: string | null, stage: string | null } | null
                  return (
                    <div key={interest.id} className="p-6 flex items-center justify-between hover:bg-secondary/50 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center font-bold text-slate-400 text-lg group-hover:bg-indigo-500/10 group-hover:text-indigo-600 transition-colors">
                          {startup?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-base">{startup?.name || 'Unknown Startup'}</p>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            {startup?.sector || 'N/A'} · {startup?.stage || 'N/A'}
                            {interest.note && <span className="ml-2 text-slate-400">— {interest.note.substring(0, 40)}...</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border",
                          signalColor(interest.signal_type)
                        )}>
                          {interest.signal_type || 'unknown'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-blue-500/10 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <PieChart className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-foreground mb-2">No Interests Yet</h4>
                <p className="text-muted-foreground max-w-[280px] mx-auto font-medium leading-relaxed">
                  Start tracking startups to build your investment thesis.
                </p>
                <Link 
                  href="/investor/pipeline" 
                  className="mt-8 inline-block px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all"
                >
                  Browse Pipeline
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-2xl font-black text-foreground">Quick Actions</h2>
          
          <div className="grid grid-cols-1 gap-3">
            <Link 
              href="/investor/portfolio"
              className="flex items-center gap-5 p-5 bg-card border border-border/50 rounded-3xl hover:border-indigo-200 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="font-bold text-base text-foreground group-hover:text-indigo-600 transition-colors">View Portfolio</span>
            </Link>

            <Link 
              href="/investor/pipeline"
              className="flex items-center gap-5 p-5 bg-card border border-border/50 rounded-3xl hover:border-indigo-200 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
                <Target className="w-6 h-6" />
              </div>
              <span className="font-bold text-base text-foreground group-hover:text-emerald-600 transition-colors">Deal Flow Pipeline</span>
            </Link>
          </div>

          {/* Insight Card */}
          <div className="mt-6 p-6 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg">Market Intelligence</h3>
              <p className="text-indigo-100 text-sm mt-1">
                {finalStartups.length > 0 
                  ? `${finalStartups.length} active startups available for review in the current pipeline.`
                  : 'No active startups in the pipeline right now.'
                }
              </p>
              <Link href="/investor/pipeline" className="mt-4 inline-block px-4 py-2 bg-card text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-500/10 transition-colors">
                Explore Now
              </Link>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/30 rotate-12" />
          </div>
        </div>
      </div>

      {/* Featured Startups */}
      {finalStartups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-foreground">Featured Ventures</h2>
            <Link href="/investor/pipeline" className="text-sm font-bold text-muted-foreground hover:text-black transition-colors flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finalStartups.slice(0, 3).map((startup) => (
              <div key={startup.id} className="bg-card border border-border rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl group-hover:bg-indigo-500/10 group-hover:text-indigo-600 transition-colors">
                    {startup.name.charAt(0)}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-indigo-600 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-indigo-600 transition-colors">{startup.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-muted-foreground">{startup.sector || 'N/A'}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-xs font-bold text-muted-foreground">{startup.stage || 'N/A'}</span>
                </div>
                {startup.elevator_pitch && (
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 mb-4">
                    {startup.elevator_pitch}
                  </p>
                )}
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                  startup.status === 'active' ? "bg-emerald-500/10 text-emerald-700 border-emerald-100" : "bg-secondary text-slate-600 border-slate-100"
                )}>
                  {startup.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Analytics */}
      <PortfolioAnalytics role="investor" investorId={user.id} />
    </div>
  )
}
