'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FolderKanban, 
  ArrowLeft, 
  Calendar, 
  Layers, 
  Users,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { createProgramAction } from '../actions'

export default function NewProgramPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    cohort: '',
    start_date: '',
    end_date: '',
    max_startups: 20
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await createProgramAction(formData)
      
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/admin/programs')
          router.refresh()
        }, 2000)
      } else {
        setError(result.error || 'Failed to create program')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link 
        href="/admin/programs" 
        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Programs
      </Link>

      <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-bl-[5rem] -mr-10 -mt-10 opacity-50" />
        
        <div className="relative z-10 mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-200">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Launch New Program</h1>
          <p className="text-muted-foreground mt-2 font-medium">Define a new accelerator cohort and enrollment parameters.</p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Program Created Successfully</h2>
            <p className="text-muted-foreground mt-2">The new cohort is now active and ready for applications.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Program Name</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Summer Batch 2024"
                    className="w-full pl-12 pr-4 py-4 bg-secondary border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-card transition-all font-medium text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Cohort Number/Label</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground/30 text-lg">#</div>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. 05"
                    className="w-full pl-12 pr-4 py-4 bg-secondary border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-card transition-all font-medium text-sm"
                    value={formData.cohort}
                    onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                  <input 
                    type="date" 
                    className="w-full pl-12 pr-4 py-4 bg-secondary border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-card transition-all font-medium text-sm"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                  <input 
                    type="date" 
                    className="w-full pl-12 pr-4 py-4 bg-secondary border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-card transition-all font-medium text-sm"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-foreground ml-1">Max Startups</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                  <input 
                    type="number" 
                    className="w-full pl-12 pr-4 py-4 bg-secondary border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-card transition-all font-medium text-sm"
                    value={formData.max_startups}
                    onChange={(e) => setFormData({ ...formData, max_startups: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Launching Program...
                  </>
                ) : (
                  'Create Accelerator Program'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
