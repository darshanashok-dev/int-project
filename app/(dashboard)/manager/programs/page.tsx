import { createClient } from '@/lib/supabase/server'
import { FolderKanban, Plus, Search, Filter, Calendar, Users, ArrowRight, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { ProgramBasic } from '@/types/dashboard'
import { cn } from '@/lib/utils'

export default async function ManagerProgramsPage() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  if (!user) return null

  // Fetch Programs
  const { data: programs } = await supabase
    .from('programs')
    .select('id, name, cohort, start_date, end_date, max_startups')
    .order('start_date', { ascending: false })
  
  const programsData = (programs as unknown as ProgramBasic[]) || []

  // Mock data for polished look
  const MOCK_PROGRAMS: ProgramBasic[] = [
    { id: '1', name: 'Global Fintech Accelerator', cohort: 'W24', start_date: '2024-01-01', end_date: '2024-04-01', max_startups: 15 },
    { id: '2', name: 'Sustainability Launchpad', cohort: 'S24', start_date: '2024-06-01', end_date: '2024-09-01', max_startups: 20 },
    { id: '3', name: 'Web3 Infrastructure Grant', cohort: 'Q3-24', start_date: '2024-07-15', end_date: '2024-12-15', max_startups: 10 },
    { id: '4', name: 'HealthTech Innovation Hub', cohort: 'W23', start_date: '2023-11-01', end_date: '2024-02-01', max_startups: 25 },
  ]

  const finalPrograms = programsData.length > 0 ? programsData : MOCK_PROGRAMS

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Venture Programs</h1>
          <p className="text-muted-foreground mt-2 font-medium">Design and orchestrate architectural incubation cohorts.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          Initialize New Program
        </button>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search programs by name or cohort..." 
              className="w-full h-14 pl-14 pr-6 bg-secondary rounded-[1.25rem] border-none text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="h-14 px-6 rounded-2xl bg-secondary text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {finalPrograms.map((program) => (
            <div 
              key={program.id}
              className="group bg-card border border-[#f1f3f4] rounded-[2.5rem] p-8 hover:border-black/10 hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center border border-[#f1f3f4] group-hover:scale-105 transition-transform">
                  <FolderKanban className="w-8 h-8 text-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {program.cohort}
                  </span>
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-foreground mb-2 group-hover:text-blue-600 transition-colors">{program.name}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {program.start_date ? new Date(program.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024'}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {program.max_startups || 20} Slots
                </div>
              </div>

              <div className="w-full bg-secondary h-2 rounded-full mb-8 overflow-hidden">
                <div className="bg-black h-full rounded-full w-[65%] shadow-[0_0_10px_rgba(0,0,0,0.2)]" />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#f1f3f4]">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <span className="text-black font-black">12/20</span> Ventures Enrolled
                </div>
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground group/btn">
                  Manage Program
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
