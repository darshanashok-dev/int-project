'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { signalInterest } from '../actions'
import { 
  Rocket,
  Eye,
  TrendingUp,
  FileText,
  CheckCircle2,
  Search,
  X,
  ArrowUpRight,
  Filter
} from 'lucide-react'

interface StartupData {
  id: string
  name: string
  sector: string | null
  stage: string | null
  status: string | null
  elevator_pitch: string | null
  created_at: string | null
}

interface InterestInfo {
  id: string
  signal_type: string | null
  note: string | null
}

interface PipelineClientProps {
  startups: StartupData[]
  interestMap: Record<string, InterestInfo>
}

export function PipelineClient({ startups, interestMap }: PipelineClientProps) {
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState<string>('all')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null)
  const [signalType, setSignalType] = useState<string>('watching')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successId, setSuccessId] = useState<string | null>(null)

  // Extract unique sectors and stages for filters
  const sectors = Array.from(new Set(startups.map(s => s.sector).filter(Boolean))) as string[]
  const stages = Array.from(new Set(startups.map(s => s.stage).filter(Boolean))) as string[]

  // Apply filters
  const filtered = startups.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.sector?.toLowerCase().includes(search.toLowerCase())) ||
      (s.elevator_pitch?.toLowerCase().includes(search.toLowerCase()))
    const matchesSector = sectorFilter === 'all' || s.sector === sectorFilter
    const matchesStage = stageFilter === 'all' || s.stage === stageFilter
    return matchesSearch && matchesSector && matchesStage
  })

  const handleSignal = async () => {
    if (!selectedStartup) return
    setSubmitting(true)
    
    const formData = new FormData()
    formData.set('startup_id', selectedStartup.id)
    formData.set('signal_type', signalType)
    if (note.trim()) formData.set('note', note.trim())
    
    const result = await signalInterest(formData)
    setSubmitting(false)
    
    if (result.success) {
      setSuccessId(selectedStartup.id)
      setSelectedStartup(null)
      setNote('')
      setSignalType('watching')
      setTimeout(() => setSuccessId(null), 3000)
    }
  }

  const signalColor = (type: string) => {
    switch (type) {
      case 'committed': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
      case 'interested': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'watching': return 'bg-amber-500/10 text-amber-700 border-amber-200'
      default: return 'bg-secondary text-slate-600 border-slate-200'
    }
  }

  return (
    <>
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search startups by name, sector, or pitch..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-card border border-border/50 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              value={sectorFilter} 
              onChange={(e) => setSectorFilter(e.target.value)}
              className="h-12 px-4 bg-card border border-border/50 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Sectors</option>
              {sectors.map(s => <option key={s} value={s!}>{s}</option>)}
            </select>
          </div>
          <select 
            value={stageFilter} 
            onChange={(e) => setStageFilter(e.target.value)}
            className="h-12 px-4 bg-card border border-border/50 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black/5 outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Stages</option>
            {stages.map(s => <option key={s} value={s!}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'startup' : 'startups'} found
        </p>
        {(sectorFilter !== 'all' || stageFilter !== 'all' || search) && (
          <button 
            onClick={() => { setSearch(''); setSectorFilter('all'); setStageFilter('all') }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Startup Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((startup) => {
            const existing = interestMap[startup.id]
            const isSuccess = successId === startup.id
            return (
              <div 
                key={startup.id} 
                className={cn(
                  "bg-card border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden",
                  isSuccess ? "border-emerald-300 ring-2 ring-emerald-100" : "border-border/50 hover:border-indigo-200"
                )}
              >
                {/* Success flash */}
                {isSuccess && (
                  <div className="absolute inset-0 bg-emerald-500/10/50 flex items-center justify-center z-10 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                      Interest Recorded
                    </div>
                  </div>
                )}

                {/* Existing signal badge */}
                {existing && (
                  <div className="absolute top-6 right-6">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                      signalColor(existing.signal_type || '')
                    )}>
                      {existing.signal_type || 'tracked'}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl shrink-0 group-hover:bg-indigo-500/10 group-hover:text-indigo-600 transition-colors">
                    {startup.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-600 transition-colors truncate">{startup.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-muted-foreground">{startup.sector || 'N/A'}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-xs font-bold text-muted-foreground">{startup.stage || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {startup.elevator_pitch && (
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3 mb-6">
                    {startup.elevator_pitch}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-medium">
                    {startup.created_at ? new Date(startup.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedStartup(startup)
                      if (existing) {
                        setSignalType(existing.signal_type || 'watching')
                        setNote(existing.note || '')
                      } else {
                        setSignalType('watching')
                        setNote('')
                      }
                    }}
                    className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {existing ? 'Update Signal' : 'Signal Interest'}
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-3xl p-20 text-center">
          <Rocket className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground">No startups match your filters</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Signal Interest Modal */}
      {selectedStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedStartup(null)} />
          <div className="relative w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl mx-4 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedStartup(null)}
              className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-xl">
                {selectedStartup.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedStartup.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{selectedStartup.sector} · {selectedStartup.stage}</p>
              </div>
            </div>

            {/* Signal Type Selection */}
            <div className="mb-6">
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Signal Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'watching', label: 'Watching', icon: Eye, color: 'amber' },
                  { value: 'interested', label: 'Interested', icon: FileText, color: 'blue' },
                  { value: 'committed', label: 'Committed', icon: TrendingUp, color: 'emerald' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSignalType(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-sm font-bold",
                      signalType === option.value 
                        ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                        : "border-border/50 text-muted-foreground hover:border-slate-300"
                    )}
                    style={signalType === option.value ? {
                      borderColor: option.color === 'amber' ? '#f59e0b' : option.color === 'blue' ? '#3b82f6' : '#10b981',
                      backgroundColor: option.color === 'amber' ? '#fffbeb' : option.color === 'blue' ? '#eff6ff' : '#ecfdf5',
                      color: option.color === 'amber' ? '#b45309' : option.color === 'blue' ? '#1d4ed8' : '#047857'
                    } : {}}
                  >
                    <option.icon className="w-5 h-5" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mb-8">
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Investment Note (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add context for your investment thesis..."
                rows={3}
                className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-2xl text-sm font-medium resize-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedStartup(null)}
                className="flex-1 py-3.5 border border-border rounded-2xl font-bold text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSignal}
                disabled={submitting}
                className="flex-1 py-3.5 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : interestMap[selectedStartup.id] ? 'Update Signal' : 'Confirm Signal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
