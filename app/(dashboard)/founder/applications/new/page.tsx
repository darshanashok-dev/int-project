'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  ChevronRight, 
  Save, 
  ArrowLeft,
  Rocket,
  Shield,
  FileText,
  Zap,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NewApplicationPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [programs, setPrograms] = useState<any[]>([])
  const [startups, setStartups] = useState<any[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    startup_id: '',
    program_id: '',
    pitch: '',
    team_summary: '',
    traction: ''
  })

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const [programsRes, startupsRes] = await Promise.all([
          supabase.from('programs').select('*').order('created_at', { ascending: false }),
          supabase.from('startups').select('*').eq('founder_id', user.id)
        ])

        if (startupsRes.data) {
          setStartups(startupsRes.data)
          if (startupsRes.data.length > 0) {
            setFormData(prev => ({ ...prev, startup_id: startupsRes.data[0].id }))
          }
        }

        if (programsRes.data && programsRes.data.length > 0) {
          setPrograms(programsRes.data)
          setFormData(prev => ({ ...prev, program_id: programsRes.data[0].id }))
        } else {
          // Fallback dummy programs if DB is empty
          const fallbacks = [
            { id: 'p1', name: 'Polaris Alpha', cohort: 'Spring 2024' },
            { id: 'p2', name: 'Polaris Beta', cohort: 'Summer 2024' }
          ]
          setPrograms(fallbacks)
          setFormData(prev => ({ ...prev, program_id: fallbacks[0].id }))
        }
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])

  const handleSave = async () => {
    if (!formData.startup_id || !formData.program_id) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          startup_id: formData.startup_id,
          program_id: formData.program_id,
          status: 'draft'
        })

      if (error) throw error

      setShowSuccess(true)
      setTimeout(() => {
        router.push('/founder/applications')
      }, 2000)
    } catch (err) {
      console.error('Error saving application:', err)
      alert('Error saving application')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black text-[#202124]">Draft Initialized</h2>
            <p className="text-muted-foreground font-medium">Redirecting to your application suite...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-black transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Suite
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-2xl font-black text-sm shadow-2xl shadow-black/10 hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Initialize Draft
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
          <span>Drafting Workspace</span>
          <ChevronRight className="w-3 h-3" />
          <span>New Submission</span>
        </div>
        <h1 className="text-5xl font-black text-[#202124] tracking-tight">Begin New Application</h1>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl">
          Craft your venture narrative for the upcoming Polaris cohort. Your progress is auto-saved as you draft.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Form */}
        <div className="col-span-8 space-y-8">
          <div className="bg-white border border-border rounded-[3rem] p-10 shadow-sm space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#202124]">Core Venture Identity</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Select Startup</label>
                  <select 
                    value={formData.startup_id}
                    onChange={(e) => setFormData({ ...formData, startup_id: e.target.value })}
                    className="w-full h-14 px-6 bg-[#f1f3f4] rounded-2xl border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5 appearance-none"
                  >
                    {startups.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Target Cohort</label>
                  <select 
                    value={formData.program_id}
                    onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                    className="w-full h-14 px-6 bg-[#f1f3f4] rounded-2xl border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5 appearance-none"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.cohort})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-[#f1f3f4] rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#202124]" />
                </div>
                <h3 className="text-xl font-bold text-[#202124]">Strategic Pitch</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Problem & Solution</label>
                  <textarea 
                    placeholder="Describe the core problem and how your venture solves it uniquely..."
                    className="w-full min-h-[160px] p-6 bg-[#f1f3f4] rounded-[2rem] border-none font-medium text-[#202124] focus:ring-2 focus:ring-black/5 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-4 space-y-6">
          <div className="bg-[#202124] text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Submission Tips
            </h4>
            <div className="space-y-4 text-sm text-gray-400 font-medium leading-relaxed">
              <p>• Keep your pitch concise and data-driven.</p>
              <p>• Highlight your unique competitive advantage.</p>
              <p>• Be transparent about your current milestones.</p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Polaris Selection Committee</span>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all" />
          </div>

          <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#202124] mb-2">Priority Review</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Complete your draft within 48 hours for early-access review by our investment team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
