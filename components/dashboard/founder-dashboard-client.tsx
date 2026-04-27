'use client'

import { 
  Rocket, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  X, 
  Zap, 
  Search
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface FounderDashboardClientProps {
  startups: {
    id: string
    name: string
    sector: string
    stage: string
    status: string
  }[]
  totalRaised: number
  greeting: string
  subtitle: string
}

export function FounderDashboardClient({ 
  startups, 
  totalRaised, 
  greeting,
  subtitle
}: FounderDashboardClientProps) {
  const [mounted, setMounted] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const hasVentures = startups && startups.length > 0

  // The 'Unified Synchronization' fix: 
  // By returning null during pre-rendering and the first client pass, 
  // we ensure 100% hydration symmetry for this dynamic subtree.
  useEffect(() => {
    setMounted(true)
    // Broadcast logic removed as it was unused
  }, [])

  if (!mounted) {
    return null
  }

  const SUGGESTIONS = [
    { title: 'Optimize Cap Table', desc: 'New regulations in your region might affect your current distribution.', type: 'Legal' },
    { title: 'Series A Readiness', desc: 'Your current burn rate is 15% lower than peers. Highlight this in pitches.', type: 'Strategy' },
    { title: 'Grant Opportunity', desc: 'Sustainable Tech Grant open for Healthtech ventures until next Friday.', type: 'Funding' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#202124] tracking-tight">
            {greeting}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            {subtitle}
          </p>
        </div>
        <Link 
          href="/founder/new"
          className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Launch New Venture
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Total Ventures</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-[#202124]">{startups?.length || 0}</h2>
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-lg",
              hasVentures ? "text-emerald-600 bg-emerald-50" : "text-gray-400 bg-gray-100"
            )}>
              {hasVentures ? 'Active' : 'Empty'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Aggregate Funding</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-[#202124]">${(totalRaised / 1000000).toFixed(1)}M</h2>
            <span className="text-xs font-bold text-blue-600">Total Raised</span>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Strategic Milestone</p>
          {hasVentures ? (
            <>
              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl font-black text-[#202124]">Q{Math.floor((new Date().getMonth() + 3) / 3)}</h2>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">Operational</span>
              </div>
              <p className="mt-4 text-xs font-semibold text-muted-foreground">Target: 100% Readiness</p>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-gray-300">No Data</div>
              <p className="text-xs font-medium text-muted-foreground">Launch your first venture to track progress.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Ventures List */}
        <div className="col-span-1 md:col-span-12 bg-white border border-border rounded-[2.5rem] p-6 md:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl md:text-2xl font-black text-[#202124]">Your Ventures</h3>
            {hasVentures && (
              <Link href="/founder/startup" className="text-xs md:text-sm font-bold text-muted-foreground hover:text-black transition-colors flex items-center gap-1 group">
                Manage All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hasVentures ? startups.map((startup) => (
              <Link 
                key={startup.id} 
                href="/founder/startup"
                className="flex items-center gap-6 p-6 rounded-[2rem] border border-transparent hover:border-border hover:bg-[#f8f9fa] transition-all group"
              >
                <div className="w-16 h-16 bg-[#f1f3f4] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Rocket className="w-8 h-8 text-[#202124]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-bold text-[#202124] truncate">{startup.name}</h4>
                  <p className="text-sm font-medium text-muted-foreground truncate">{startup.sector} • {startup.stage}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    startup.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {startup.status}
                  </span>
                  <div className="flex items-center gap-1 mt-2 text-xs font-bold text-muted-foreground">
                    <span>Performance</span>
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Rocket className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-black text-[#202124] mb-2 tracking-tight">Empty Workspace</h4>
                <p className="text-muted-foreground mb-10 max-w-[280px] mx-auto font-medium leading-relaxed">
                  Every unicorn starts with a single step. Register your first venture to unlock the Polaris Suite.
                </p>
                <Link 
                  href="/founder/new" 
                  className="px-8 py-4 bg-black text-white rounded-2xl font-black text-sm shadow-2xl shadow-black/10 hover:bg-gray-800 transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Launch Venture
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Insights Drawer (HIDDEN for new users as requested) */}
      {showSuggestions && hasVentures && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSuggestions(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#202124]">Strategic Insights</h3>
                  <p className="text-xs font-medium text-muted-foreground">Premium venture analytics</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSuggestions(false)}
                className="p-2 hover:bg-[#f1f3f4] rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search insights..." 
                className="w-full h-12 pl-10 pr-4 bg-[#f1f3f4] rounded-xl border-none text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              {SUGGESTIONS.map((s, i) => (
                <div key={i} className="p-6 bg-white border border-border rounded-3xl hover:border-black/20 hover:shadow-xl transition-all group cursor-pointer active:scale-[0.98]">
                  <span className="inline-block px-2 py-0.5 bg-[#f1f3f4] text-[10px] font-black uppercase tracking-widest rounded-md mb-3 text-[#202124]">
                    {s.type}
                  </span>
                  <h4 className="text-lg font-bold text-[#202124] mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{s.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <button className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm shadow-xl hover:bg-gray-800 transition-all active:scale-[0.98]">
                Dismiss All Insights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
