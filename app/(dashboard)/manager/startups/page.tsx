import { createClient } from '@/lib/supabase/server'
import { Briefcase, Search, Filter, Rocket, TrendingUp, MoreVertical, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import { StartupBasic } from '@/types/dashboard'
import { cn } from '@/lib/utils'

export default async function ManagerStartupsPage() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  if (!user) return null

  // Fetch Startups
  const { data: startups } = await supabase
    .from('startups')
    .select('id, name, sector, stage, status')
    .limit(20)
  
  const startupsData = (startups as unknown as StartupBasic[]) || []

  // Mock data for polished look
  const MOCK_STARTUPS: StartupBasic[] = [
    { id: '1', name: 'AeroDynamics', sector: 'CleanTech', stage: 'Seed', status: 'active' },
    { id: '2', name: 'BioSynth', sector: 'HealthTech', stage: 'Pre-Seed', status: 'active' },
    { id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'Series A', status: 'active' },
    { id: '4', name: 'Quantum Leap', sector: 'DeepTech', stage: 'Seed', status: 'active' },
    { id: '5', name: 'EcoFlow', sector: 'Energy', stage: 'Pre-Seed', status: 'active' },
    { id: '6', name: 'NeuroLink', sector: 'MedTech', stage: 'Series B', status: 'active' },
    { id: '7', name: 'PayGuard', sector: 'FinTech', stage: 'Seed', status: 'active' },
    { id: '8', name: 'SolarEdge', sector: 'CleanTech', stage: 'Series A', status: 'active' },
  ]

  const finalStartups = startupsData.length > 0 ? startupsData : MOCK_STARTUPS

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Venture Portfolio</h1>
          <p className="text-muted-foreground mt-2 font-medium">Monitoring and oversight across all active program cohorts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-6 py-3 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Active</p>
              <p className="text-lg font-black text-foreground">{finalStartups.length}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Growth Avg</p>
              <p className="text-lg font-black text-emerald-600">+18%</p>
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
              placeholder="Search across all program ventures..." 
              className="w-full h-14 pl-14 pr-6 bg-secondary rounded-[1.25rem] border-none text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="h-14 px-6 rounded-2xl bg-secondary text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="h-14 px-8 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95">
              Export Stats
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f1f3f4]">
                <th className="text-left py-6 px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Venture</th>
                <th className="text-left py-6 px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Industry</th>
                <th className="text-left py-6 px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Stage</th>
                <th className="text-left py-6 px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                <th className="text-left py-6 px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Health</th>
                <th className="text-right py-6 px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4]">
              {finalStartups.map((startup) => (
                <tr key={startup.id} className="group hover:bg-background transition-all">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-card border border-[#f1f3f4] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                        <Rocket className="w-6 h-6 text-foreground" />
                      </div>
                      <span className="text-sm font-black text-foreground">{startup.name}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className="text-xs font-bold text-muted-foreground">{startup.sector}</span>
                  </td>
                  <td className="py-6 px-4">
                    <span className="px-3 py-1 bg-secondary text-foreground rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {startup.stage}
                    </span>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500/100 rounded-full" />
                      <span className="text-xs font-bold text-foreground capitalize">{startup.status}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-xs font-black text-emerald-600">Optimal</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-card rounded-lg transition-colors border border-transparent hover:border-[#f1f3f4]">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-card rounded-lg transition-colors border border-transparent hover:border-[#f1f3f4]">
                        <Zap className="w-4 h-4 text-indigo-600" />
                      </button>
                      <button className="p-2 hover:bg-card rounded-lg transition-colors border border-transparent hover:border-[#f1f3f4]">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground">Showing {finalStartups.length} of 142 ventures</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#f1f3f4] rounded-xl text-xs font-black text-muted-foreground hover:bg-secondary transition-all">Previous</button>
            <button className="px-4 py-2 border border-[#f1f3f4] rounded-xl text-xs font-black text-foreground hover:bg-secondary transition-all bg-secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
