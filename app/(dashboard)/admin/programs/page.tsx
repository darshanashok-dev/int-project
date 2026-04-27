import { createClient } from '@/lib/supabase/server'
import { 
  FolderKanban, 
  Plus, 
  Calendar, 
  Users, 
  ChevronRight,
  Layers,
  PlayCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function ProgramsManagement() {
  const supabase = createClient()

  const { data: programs } = await supabase
    .from('programs')
    .select(`
      *,
      applications(count)
    `)
    .order('created_at', { ascending: false })

  const activePrograms = programs?.filter(p => {
    const end = p.end_date ? new Date(p.end_date) : null
    return !end || end > new Date()
  }).length || 0

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#202124] tracking-tight">Accelerator Programs</h1>
          <p className="text-muted-foreground mt-1">Design cohorts, track applications, and manage curricula</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-black/10 transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            New Program
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Programs</p>
            <p className="text-3xl font-black text-[#202124] mt-1">{programs?.length || 0}</p>
          </div>
        </div>
        <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <PlayCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Cohorts</p>
            <p className="text-3xl font-black text-[#202124] mt-1">{activePrograms}</p>
          </div>
        </div>
        <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Applicants</p>
            <p className="text-3xl font-black text-[#202124] mt-1">
              {programs?.reduce((acc, p) => acc + (p.applications?.[0]?.count || 0), 0) || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs?.map((program) => {
          const isFinished = program.end_date && new Date(program.end_date) < new Date()
          return (
            <div key={program.id} className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                  isFinished ? "bg-slate-50 text-slate-500 border-slate-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                )}>
                  {isFinished ? 'Completed' : 'Active'}
                </span>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-border/50 flex flex-col items-center justify-center text-[#202124] font-black group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                  <span className="text-xs opacity-50 uppercase tracking-tighter">Cohort</span>
                  <span className="text-xl leading-none">{program.cohort}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#202124] group-hover:text-indigo-600 transition-colors">{program.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      {program.start_date ? new Date(program.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'TBD'}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                      <Users className="w-4 h-4" />
                      {program.applications?.[0]?.count || 0} Applicants
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                      U{i}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                    +
                  </div>
                </div>
                <Link 
                  href={`/admin/programs/${program.id}`}
                  className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:gap-3 transition-all"
                >
                  Manage Program
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )
        })}

        {(!programs || programs.length === 0) && (
          <div className="md:col-span-2 p-20 bg-white border border-dashed border-border rounded-3xl text-center">
            <FolderKanban className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#202124]">No programs yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">Create your first accelerator cohort to start managing startups and applications.</p>
            <button className="mt-8 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm">
              Launch New Program
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
