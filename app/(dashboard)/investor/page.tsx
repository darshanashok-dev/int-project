'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'
import { LoadingState } from '@/components/shared/loading-state'
import { ErrorState } from '@/components/shared/error-state'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'
import { Eye, ShieldAlert, TrendingUp, Landmark, Calendar, Target, Briefcase } from 'lucide-react'

export default function InvestorDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['investor', 'ecosystem'],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        return {
          startups: [
            { id: '1', name: 'AeroDynamics', sector: 'Aerospace', stage: 'seed', status: 'active', elevator_pitch: 'Autonomous drone logistics for instant local delivery network hubs.' },
            { id: '2', name: 'BioSynth', sector: 'Healthtech', stage: 'series-a', status: 'active', elevator_pitch: 'Synthetic biology and genomics software accelerating therapeutics discovery.' },
            { id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'seed', status: 'active', elevator_pitch: 'Automated cloud resource allocator scaling underlying container clusters effortlessly.' },
            { id: '4', name: 'DeFiX', sector: 'Fintech', stage: 'series-a', status: 'active', elevator_pitch: 'Global unified liquidity protocols for decentralized institutional finance platforms.' }
          ],
          milestones: [
            { id: 'm1', startup_id: '1', status: 'completed', title: 'Beta Test Launch', completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'm2', startup_id: '1', status: 'completed', title: 'FAA License Approved', completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'm3', startup_id: '2', status: 'completed', title: 'Initial Clinical Trials', completed_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'm4', startup_id: '3', status: 'pending', title: 'Series A Closing', completed_at: null },
            { id: 'm5', startup_id: '4', status: 'completed', title: 'Liquidity Engine V2', completed_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          funding: [
            { id: 'f1', startup_id: '1', amount: 120000000, type: 'seed', date: '2026-01-10' }, 
            { id: 'f2', startup_id: '2', amount: 250000000, type: 'series-a', date: '2026-02-15' },
            { id: 'f3', startup_id: '3', amount: 80000000, type: 'pre-seed', date: '2026-03-20' },
            { id: 'f4', startup_id: '4', amount: 450000000, type: 'series-a', date: '2026-04-05' }
          ]
        }
      }

      // Fetch startups with explicitly declared columns
      const { data: startups, error: startupsError } = await (supabase.from('startups') as any)
        .select(`
          id,
          name,
          sector,
          stage,
          status,
          elevator_pitch
        `)
        .eq('status', 'active')
      if (startupsError) throw startupsError

      // Fetch milestones with explicitly declared columns
      const { data: milestones, error: milestonesError } = await (supabase.from('milestones') as any)
        .select('id, startup_id, status, title, completed_at, due_date')
      if (milestonesError) throw milestonesError

      // Fetch funding with explicitly declared columns
      const { data: funding, error: fundingError } = await (supabase.from('funding') as any)
        .select('id, startup_id, amount, type, date')
      if (fundingError) throw fundingError

      return { startups: startups || [], milestones: milestones || [], funding: funding || [] }
    },
    staleTime: 30_000,
  })

  if (isLoading) return <LoadingState message="Assembling market intelligence..." />
  if (isError) return <ErrorState message={error?.message || 'Failed to load investor intelligence'} onRetry={refetch} />

  const startups = data?.startups ?? []
  const milestones = data?.milestones ?? []
  const funding = data?.funding ?? []

  // Process data for dashboard
  const startupsWithMetrics = startups.map((s: any) => {
    const sMilestones = milestones.filter((m: any) => m.startup_id === s.id)
    const completedM = sMilestones.filter((m: any) => m.status === 'completed').length
    const totalM = sMilestones.length

    const sFunding = funding.filter((f: any) => f.startup_id === s.id)
    const totalF = sFunding.reduce((sum: number, f: any) => sum + Number(f.amount || 0), 0)

    return {
      ...s,
      completed_milestones: completedM,
      total_milestones: totalM,
      milestone_rate: totalM > 0 ? Number(((completedM / totalM) * 100).toFixed(0)) : 0,
      total_funding: totalF,
    }
  })

  const totalEcosystemFunding = funding.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0)
  
  // Completed milestones over time data for LineChart
  const completedMilestones = milestones
    .filter((m: any) => m.status === 'completed' && m.completed_at)
    .sort((a: any, b: any) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime())

  let cumulativeCount = 0
  const chartData = completedMilestones.map((m: any) => {
    cumulativeCount++
    return {
      date: new Date(m.completed_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      achieved: cumulativeCount,
      title: m.title
    }
  })

  // Fallback for empty milestone dates
  const finalChartData = chartData.length > 0 ? chartData : [
    { date: 'Jan 15', achieved: 0 },
    { date: 'Feb 15', achieved: 1 },
    { date: 'Mar 15', achieved: 2 },
    { date: 'Apr 15', achieved: 4 },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          Deal Flow Intelligence
        </h1>
        <p className="text-muted-foreground mt-2 font-medium text-lg">
          Observer interface and portfolio telemetry tracking active cohorts.
        </p>
      </div>

      {/* Prominent Read-Only Advisory Alert Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2rem] p-6 flex items-start gap-4 text-amber-800 dark:text-amber-200">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider">Read-Only Advisory Mode</h3>
          <p className="text-xs font-medium mt-1 text-muted-foreground leading-relaxed">
            Your credentials grant secure observer privileges. Data insertion, setting updates, or status modifications are disabled inside this portal. Please contact administrative support to request structural variations.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Total Capital Tracked</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-foreground">
              {totalEcosystemFunding.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </h2>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Monitored Startups</p>
          <div className="flex items-center justify-between">
            <h2 className="text-5xl font-black text-foreground">{startups.length}</h2>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Logged Milestones</p>
          <div className="flex items-center justify-between">
            <h2 className="text-5xl font-black text-foreground">{milestones.length}</h2>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Completed Milestones</p>
          <div className="flex items-center justify-between">
            <h2 className="text-5xl font-black text-foreground">
              {milestones.filter((m: any) => m.status === 'completed').length}
            </h2>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Startup Telemetry List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-foreground">Ecosystem Ventures</h2>
            <span className="text-xs font-bold text-muted-foreground px-3 py-1 bg-secondary rounded-full uppercase tracking-wider">Active</span>
          </div>

          <div className="space-y-4">
            {startupsWithMetrics.map((s: any) => (
              <Card key={s.id} className="rounded-[2rem] p-6 shadow-sm border border-border bg-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{s.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-secondary text-foreground rounded">{s.sector}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-secondary text-foreground rounded uppercase">{s.stage}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-wider">Total Funding</p>
                    <p className="text-sm font-bold text-indigo-600 mt-0.5">
                      {s.total_funding.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                {s.elevator_pitch && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6 font-medium">
                    {s.elevator_pitch}
                  </p>
                )}

                <div className="space-y-2 border-t border-border/50 pt-4">
                  <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                    <span>Milestones Completed</span>
                    <span>{s.completed_milestones} / {s.total_milestones} ({s.milestone_rate}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${s.milestone_rate}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recharts Completion Line Chart */}
        <div className="lg:col-span-5">
          <Card className="rounded-[2.5rem] p-6 shadow-sm border border-border h-full flex flex-col justify-between">
            <CardHeader className="px-4 pb-4">
              <CardTitle className="text-xl font-bold">Milestone Achievement Velocity</CardTitle>
              <CardDescription>Ecosystem milestone completion trajectory across tracked cohorts.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={finalChartData} margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Completed Milestones', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 } }} />
                  <Tooltip formatter={(v, name) => [v, 'Cumulative Milestones']} />
                  <Line type="monotone" dataKey="achieved" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
