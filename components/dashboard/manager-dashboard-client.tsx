'use client'

import { 
  FolderKanban, 
  Users, 
  Briefcase, 
  ArrowRight, 
  Plus,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { ProgramBasic, ApplicationBasic, StartupBasic } from '@/types/dashboard'

interface ManagerDashboardClientProps {
  programs: ProgramBasic[]
  applications: ApplicationBasic[]
  startups: StartupBasic[]
  userName: string
}

export function ManagerDashboardClient({ 
  programs, 
  applications, 
  startups,
  userName
}: ManagerDashboardClientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const pendingApps = applications.filter(a => a.status === 'pending' || a.status === 'under_review')
  const activePrograms = programs.length // For now

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Program Control, {userName}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            You have {pendingApps.length} applications awaiting architectural review.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/manager/programs/new"
            className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Initialize Program
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm group hover:border-black/5 transition-all">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Active Programs</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">{activePrograms}</h2>
            <span className="text-xs font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-lg">Operational</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <FolderKanban className="w-3 h-3" />
            Venture Cohorts
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm group hover:border-black/5 transition-all">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Total Applicants</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">{applications.length}</h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded-lg">Pipeline</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Users className="w-3 h-3" />
            Global Dealflow
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm group hover:border-black/5 transition-all">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Cohort Health</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">94%</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg">Optimal</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <BarChart3 className="w-3 h-3 text-emerald-500" />
            Engagement Index
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Programs List */}
        <div className="col-span-1 lg:col-span-8 bg-card border border-border rounded-[2.5rem] p-6 md:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl md:text-2xl font-black text-foreground">Program Management</h3>
            <Link href="/manager/programs" className="text-xs md:text-sm font-bold text-muted-foreground hover:text-black transition-colors flex items-center gap-1 group">
              Manage All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.length > 0 ? programs.map((program) => (
              <div 
                key={program.id}
                className="p-6 rounded-[2rem] border border-[#f1f3f4] hover:border-black/10 hover:bg-background transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-card rounded-xl border border-[#f1f3f4] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    <FolderKanban className="w-6 h-6 text-foreground" />
                  </div>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-500/10 px-2 py-1 rounded-md uppercase tracking-tighter">
                    {program.cohort}
                  </span>
                </div>
                <h4 className="text-lg font-black text-foreground mb-1 truncate">{program.name}</h4>
                <p className="text-xs font-medium text-muted-foreground mb-6">
                  {program.max_startups || 20} Venture Slots • {program.start_date ? new Date(program.start_date).getFullYear() : '2024'}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#f1f3f4]">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-black text-white flex items-center justify-center text-[8px] font-bold">
                      +12
                    </div>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-foreground hover:underline">
                    Monitor
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center">
                <div className="w-16 h-16 bg-secondary text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FolderKanban className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-400">No active programs.</p>
              </div>
            )}
          </div>
        </div>

        {/* Application Sidebar */}
        <div className="col-span-1 lg:col-span-4 space-y-8">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-foreground">Review Queue</h3>
              <span className="text-[10px] font-black text-white bg-black px-2 py-1 rounded-md">
                {pendingApps.length} NEW
              </span>
            </div>

            <div className="space-y-4">
              {pendingApps.length > 0 ? pendingApps.slice(0, 5).map((app) => (
                <div key={app.id} className="p-4 rounded-2xl border border-transparent hover:border-[#f1f3f4] hover:bg-background transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-black text-foreground truncate">{app.startups?.name}</h4>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-blue-600">Pending</span>
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-3">{app.programs?.name}</p>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 py-2 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                      Review
                    </button>
                    <button className="p-2 rounded-lg bg-secondary hover:bg-gray-200">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-400">Queue is clear.</p>
                </div>
              )}
            </div>

            <Link 
              href="/manager/applications"
              className="mt-6 w-full py-4 bg-secondary text-foreground rounded-2xl font-black text-[10px] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              View Full Pipeline
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-black text-white rounded-[2.5rem] p-8 shadow-xl shadow-black/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-card/5 rounded-bl-[5rem] group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black mb-2 relative z-10">Cohort Report</h3>
            <p className="text-xs font-medium text-white/60 mb-6 relative z-10 leading-relaxed">
              Export the latest performance metrics for your active venture cohorts.
            </p>
            <button className="w-full py-4 bg-card text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all relative z-10">
              Generate PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
