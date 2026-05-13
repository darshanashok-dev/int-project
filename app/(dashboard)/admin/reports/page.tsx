import { createClient } from '@/lib/supabase/server'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FolderKanban, 
  CalendarDays,
  FileText,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function ReportsPage() {
  const supabase = createClient()

  const [
    { data: startups },
    { data: funding },
    { data: programs },
    { data: sessions },
    { data: reports }
  ] = await Promise.all([
    supabase.from('startups').select('id, status'),
    supabase.from('funding').select('amount'),
    supabase.from('programs').select('id, end_date'),
    supabase.from('sessions').select('id'),
    supabase.from('reports').select(`
      id,
      period,
      created_at,
      startup:startups(name),
      generator:users(full_name)
    `).order('created_at', { ascending: false }).limit(10)
  ])

  let startupsData = startups as { id: string, status: string | null }[] | null
  let fundingData = funding as { amount: number }[] | null
  let programsData = programs as { id: string, end_date: string | null }[] | null
  let sessionsData = sessions as { id: string }[] | null
  let reportsData = reports as { id: string, period: string | null, created_at: string | null, startup: unknown, generator: unknown }[] | null

  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

  if (isMock || !reportsData || reportsData.length === 0) {
    fundingData = [{ amount: 3200000 }, { amount: 4500000 }, { amount: 500000 }] // Total $8.2M
    startupsData = [
      { id: '1', status: 'active' }, { id: '2', status: 'active' }, { id: '3', status: 'active' },
      { id: '4', status: 'active' }, { id: '5', status: 'active' }, { id: '6', status: 'pending' }
    ]
    programsData = [
      { id: '1', end_date: '2026-10-31' }, { id: '2', end_date: '2027-02-28' }, { id: '3', end_date: '2026-04-30' }
    ]
    sessionsData = Array.from({ length: 42 }).map((_, i) => ({ id: `session-${i}` }))
    
    reportsData = [
      {
        id: 'mock-rep-1',
        period: 'Q1 2026',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        startup: { name: 'AeroDynamics' },
        generator: { full_name: 'System Admin' }
      },
      {
        id: 'mock-rep-2',
        period: 'April 2026',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        startup: { name: 'BioSynth' },
        generator: { full_name: 'Sarah Jenkins' }
      },
      {
        id: 'mock-rep-3',
        period: 'Platform Summary',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        startup: null,
        generator: { full_name: 'David Chen' }
      }
    ]
  }

  const totalFunding = fundingData?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0
  const activeStartups = startupsData?.filter(s => s.status === 'active').length || 0
  const activePrograms = programsData?.filter(p => !p.end_date || new Date(p.end_date) > new Date()).length || 0

  const stats = [
    {
      label: 'Total Funding Raised',
      value: `$${(totalFunding / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10'
    },
    {
      label: 'Active Ventures',
      value: activeStartups,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Active Programs',
      value: activePrograms,
      icon: FolderKanban,
      color: 'text-indigo-600',
      bg: 'bg-indigo-500/10'
    },
    {
      label: 'Mentorship Sessions',
      value: sessionsData?.length || 0,
      icon: CalendarDays,
      color: 'text-purple-600',
      bg: 'bg-purple-500/10'
    }
  ]

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1 text-lg">System-wide performance and engagement metrics</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-black/10 transition-all active:scale-95">
          <Download className="w-4 h-4" />
          Export Global Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", s.bg, s.color)}>
              <s.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-3xl font-black text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Recent Reports</h2>
          <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            {reportsData && reportsData.length > 0 ? (
              <div className="divide-y divide-border/50">
                {reportsData.map((report) => {
                  const startupObj = (Array.isArray(report.startup) ? report.startup[0] : report.startup) as { name?: string } | null
                  const generatorObj = (Array.isArray(report.generator) ? report.generator[0] : report.generator) as { full_name?: string } | null
                  
                  return (
                    <div key={report.id} className="p-5 flex items-center justify-between hover:bg-secondary transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{startupObj?.name || 'Platform Wide'} - {report.period}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                            <span>Generated by {generatorObj?.full_name || 'System'}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{new Date(report.created_at || 0).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                        View Report
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-16 text-center">
                <BarChart3 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No reports generated yet.</p>
                <p className="text-sm text-slate-400 mt-1">Detailed performance reports will appear here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Quick Tools</h2>
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="font-bold text-lg leading-tight">Need custom analytics?</h3>
              <p className="text-indigo-100 text-sm">Generate targeted reports for specific startups, investor groups, or program cohorts.</p>
              <button className="w-full py-3 bg-card text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-500/10 transition-colors active:scale-[0.98]">
                Create Custom Report
              </button>
            </div>
            <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-500/30 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  )
}
