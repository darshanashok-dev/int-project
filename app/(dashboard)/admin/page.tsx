import { createClient } from '@/lib/supabase/server'
import { 
  Users, 
  Briefcase, 
  FolderKanban, 
  TrendingUp, 
  Clock, 
  PlusCircle,
  UserPlus,
  BarChart3,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function AdminDashboard() {
  const supabase = createClient()

  const [
    { data: startups }, 
    { data: programs }, 
    { data: users },
    { data: funding },
    { data: applications }
  ] = await Promise.all([
    supabase.from('startups').select('id, name, status, created_at'),
    supabase.from('programs').select('id, name, cohort'),
    supabase.from('users').select('id'),
    supabase.from('funding').select('amount'),
    supabase.from('applications').select('id, status')
  ])

  const totalFunding = funding?.reduce((acc, f) => acc + (Number(f.amount) || 0), 0) ?? 0
  const pendingStartups = startups?.filter(s => s.status === 'pending').length ?? 0
  const activeApplications = applications?.filter(a => a.status === 'submitted').length ?? 0

  const stats = [
    { 
      label: 'Total Users', 
      value: users?.length ?? 0, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      description: 'Active platform members',
      href: '/admin/users'
    },
    { 
      label: 'Startups', 
      value: startups?.length ?? 0, 
      icon: Briefcase, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      description: 'Registered ventures',
      href: '/admin/startups'
    },
    { 
      label: 'Programs', 
      value: programs?.length ?? 0, 
      icon: FolderKanban, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      description: 'Active cohorts',
      href: '/admin/programs'
    },
    { 
      label: 'Total Funding', 
      value: `$${(totalFunding / 1000000).toFixed(1)}M`, 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      description: 'Cumulative investment',
      href: '/admin/reports'
    },
    { 
      label: 'Pending Approval', 
      value: pendingStartups, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      description: 'Startups awaiting review',
      href: '/admin/startups'
    },
    { 
      label: 'New Applications', 
      value: activeApplications, 
      icon: BarChart3, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50',
      description: 'Unprocessed submissions',
      href: '/admin/applications'
    },
  ]

  const quickActions = [
    { name: 'Add New User', icon: UserPlus, href: '/admin/users/new', color: 'bg-blue-600' },
    { name: 'Create Program', icon: PlusCircle, href: '/admin/programs/new', color: 'bg-indigo-600' },
    { name: 'Review Applications', icon: BarChart3, href: '/admin/applications', color: 'bg-purple-600' },
  ]

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#202124] tracking-tight">Admin Command Center</h1>
        <p className="text-muted-foreground mt-1 text-lg">Real-time platform intelligence and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group block">
            <div className="flex items-start justify-between">
              <div className={cn("p-3 rounded-xl", s.bg)}>
                <s.icon className={cn("w-6 h-6", s.color)} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-indigo-600 transition-all" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-bold text-[#202124] mt-1">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                {s.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Startups */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#202124]">Recent Startups</h2>
            <Link href="/admin/startups" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View all</Link>
          </div>
          <div className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm">
            {startups && startups.length > 0 ? (
              <div className="divide-y divide-border/50">
                {startups.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5).map((s) => (
                  <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#202124]">{s.name}</p>
                        <p className="text-xs text-muted-foreground">Joined {new Date(s.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full",
                      s.status === 'active' ? "bg-emerald-50 text-emerald-700" :
                      s.status === 'pending' ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-muted-foreground">No startups registered yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#202124]">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => (
              <Link 
                key={action.name} 
                href={action.href}
                className="flex items-center gap-5 p-5 bg-white border border-border/50 rounded-3xl hover:border-indigo-200 hover:shadow-md transition-all group"
              >
                <div className={cn("w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg", action.color)}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-base text-[#202124] group-hover:text-indigo-600 transition-colors">{action.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-6 p-6 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg">Platform Health</h3>
              <p className="text-indigo-100 text-sm mt-1">All systems are operational. No critical issues reported in the last 24h.</p>
              <Link href="/admin/reports" className="mt-4 inline-block px-4 py-2 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                View Reports
              </Link>
            </div>
            <BarChart3 className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/30 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  )
}
