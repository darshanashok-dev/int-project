'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Save, 
  ChevronRight, 
  Zap,
  Clock,
  CheckCircle2,
  Circle,
  Rocket,
  Upload,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STAGES = [
  { id: 'pre-seed', name: 'Pre-Seed', desc: 'Ideation & MVP Development' },
  { id: 'seed', name: 'Seed', desc: 'Market Validation' },
  { id: 'series-a', name: 'Series A', desc: 'Scaling & Optimization' },
  { id: 'series-b', name: 'Series B+', desc: 'Expansion & Growth' },
]

export default function StartupDetailsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [startup, setStartup] = useState<{ 
    id: string, 
    name: string, 
    sector: string, 
    stage: string, 
    strategy_summary?: string,
    founded_date?: string,
    elevator_pitch?: string,
    active_round_name?: string,
    funding_goal?: number,
    logo_url?: string
  } | null>(null)
  const [originalStartup, setOriginalStartup] = useState<{ 
    id: string, 
    name: string, 
    sector: string, 
    stage: string, 
    strategy_summary?: string,
    founded_date?: string,
    elevator_pitch?: string,
    active_round_name?: string,
    funding_goal?: number,
    logo_url?: string
  } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('founder_id', user.id)
          .single()

        if (error) throw error
        if (data) {
          setStartup(data)
          setOriginalStartup(data)
        }
      } catch (err) {
        console.error('Error loading startup data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !startup) return

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-logo-${startup.id}-${Math.random()}.${fileExt}`
      const filePath = fileName

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setStartup({ ...startup, logo_url: publicUrl })
    } catch (err: any) {
      console.error('Error uploading logo:', err)
      alert('Error uploading logo: ' + (err.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    if (!startup) return
    setSaving(true)
    const { error } = await supabase
      .from('startups')
      .update({
        name: startup.name,
        sector: startup.sector,
        strategy_summary: startup.strategy_summary,
        stage: startup.stage,
        founded_date: startup.founded_date,
        elevator_pitch: startup.elevator_pitch,
        active_round_name: startup.active_round_name,
        funding_goal: startup.funding_goal,
        logo_url: startup.logo_url
      })
      .eq('id', startup.id)
    
    if (!error) {
      setOriginalStartup(startup)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
    setSaving(false)
  }

  const handleDiscard = () => {
    if (originalStartup) {
      setStartup({...originalStartup})
    }
  }

  const hasChanges = JSON.stringify(startup) !== JSON.stringify(originalStartup)

  if (loading) return <div className="p-8">Loading...</div>
  if (!startup) return <div className="p-8 text-muted-foreground">No startup found. Please launch a venture first.</div>

  return (
    <div className="space-y-8 relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#202124] text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Venture Updated</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Changes synced to Polaris</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            <span>Organization</span>
            <ChevronRight className="w-3 h-3" />
            <span>Profile Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#202124]">Venture Core Details</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">Maintain your startup&apos;s identity across the Polaris network.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDiscard}
            disabled={!hasChanges || saving}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-foreground hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-1 md:col-span-8 space-y-8">
          {/* Identity Branding Section */}
          <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-start gap-6 mb-8">
              <div className="relative group/logo">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center text-white p-4 overflow-hidden border border-border/10 shadow-xl">
                  {startup.logo_url ? (
                    <img src={startup.logo_url} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Rocket className="w-full h-full fill-current" />
                  )}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-6 h-6 text-white mb-1" />
                    <span className="text-[8px] font-black uppercase text-white tracking-widest">Update</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={saving} />
                  </label>
                </div>
                {saving && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#202124] mb-1">Identity Branding</h2>
                <p className="text-muted-foreground font-medium">Update your public-facing logo and brand name.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">Startup Venture Name</label>
                <input 
                  type="text" 
                  value={startup.name}
                  onChange={e => setStartup({...startup, name: e.target.value})}
                  className="w-full h-14 px-6 bg-[#f1f3f4] rounded-xl border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">Core Sector</label>
                <select 
                  value={startup.sector}
                  onChange={e => setStartup({...startup, sector: e.target.value})}
                  className="w-full h-14 px-6 bg-[#f1f3f4] rounded-xl border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5 appearance-none"
                >
                  <option value="SaaS">SaaS</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Healthtech">Healthtech</option>
                  <option value="AI">AI/ML</option>
                  <option value="Biotech">Biotech</option>
                  <option value="Edtech">Edtech</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Web3">Web3/Crypto</option>
                  <option value="Aerospace">Aerospace</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Energy">Energy</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">Founded Date</label>
                <input 
                  type="text" 
                  value={startup.founded_date || ''}
                  onChange={e => setStartup({...startup, founded_date: e.target.value})}
                  placeholder="January 2023"
                  className="w-full h-14 px-6 bg-[#f1f3f4] rounded-xl border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">Active Funding Round</label>
                <input 
                  type="text" 
                  value={startup.active_round_name || ''}
                  onChange={e => setStartup({...startup, active_round_name: e.target.value})}
                  placeholder="e.g. Series A Alpha"
                  className="w-full h-14 px-6 bg-[#f1f3f4] rounded-xl border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">Funding Goal (USD)</label>
                <input 
                  type="number" 
                  value={startup.funding_goal || ''}
                  onChange={e => setStartup({...startup, funding_goal: parseFloat(e.target.value) || 0})}
                  placeholder="e.g. 4000000"
                  className="w-full h-14 px-6 bg-[#f1f3f4] rounded-xl border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>
          </div>

          {/* Detailed Narrative Section */}
          <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#202124] mb-1">Detailed Narrative</h2>
            <p className="text-muted-foreground font-medium mb-8">Craft the story that investors and partners see first.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">One-Sentence Elevator Pitch</label>
                <input 
                  type="text" 
                  value={startup.elevator_pitch || ''}
                  onChange={e => setStartup({...startup, elevator_pitch: e.target.value})}
                  placeholder="Describe your one-sentence elevator pitch..."
                  className="w-full h-14 px-6 bg-[#f1f3f4] rounded-xl border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2 px-1">Full Mission Statement</label>
                <textarea 
                  rows={6}
                  value={startup.strategy_summary || ''}
                  onChange={e => setStartup({...startup, strategy_summary: e.target.value})}
                  className="w-full p-6 bg-[#f1f3f4] rounded-xl border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5 resize-none leading-relaxed"
                  placeholder="Describe your mission..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="col-span-1 md:col-span-4 space-y-8">
          {/* Operational Status Card */}
          <div className="bg-black text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Operational Status
                <BarChart className="w-4 h-4" />
              </h3>
              <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Phase</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold bg-white/10 px-3 py-1 rounded-full capitalize">{startup.stage}</span>
                  <Zap className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Incubation Health</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black italic tracking-tighter">Active</span>
                  <div className="flex gap-1 h-6 items-end pb-1">
                    <div className="w-1.5 h-3 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-5 bg-blue-400 rounded-full"></div>
                    <div className="w-1.5 h-4 bg-white/30 rounded-full animate-pulse delay-75"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Rocket className="w-32 h-32 rotate-12" />
            </div>
          </div>

          {/* Update Venture Stage */}
          <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-extrabold text-[#202124] mb-6">Update Venture Stage</h3>
            <div className="space-y-4">
              {STAGES.map(stage => {
                const isActive = startup.stage === stage.id
                return (
                  <button 
                    key={stage.id}
                    onClick={() => setStartup({...startup, stage: stage.id})}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      isActive 
                        ? "border-black bg-black/5 shadow-inner" 
                        : "border-[#f1f3f4] hover:border-gray-300"
                    )}
                  >
                    <div className="flex-1">
                      <p className="font-extrabold text-sm text-[#202124]">{stage.name}</p>
                      <p className="text-[11px] font-medium text-muted-foreground">{stage.desc}</p>
                    </div>
                    {isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-blue-700 leading-relaxed">
              Changing your startup&apos;s stage might affect the types of funding opportunities visible in your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function BarChart(props: { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}
