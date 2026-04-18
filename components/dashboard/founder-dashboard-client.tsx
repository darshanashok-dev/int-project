'use client'

import { 
  Rocket, 
  BarChart2, 
  TrendingUp, 
  ArrowRight,
  Plus,
  X,
  Zap,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface FounderDashboardClientProps {
  user: {
    user_metadata?: {
      full_name?: string
    }
  }
  startups: unknown[]
  totalRaised: number
}

export function FounderDashboardClient({ user, startups, totalRaised }: FounderDashboardClientProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const SUGGESTIONS = [
    { title: 'Optimize Cap Table', desc: 'New regulations in your region might affect your current distribution.', type: 'Legal' },
    { title: 'Series A Readiness', desc: 'Your current burn rate is 15% lower than peers. Highlight this in pitches.', type: 'Strategy' },
    { title: 'Grant Opportunity', desc: 'Sustainable Tech Grant open for Healthtech ventures until next Friday.', type: 'Funding' },
  ]

  return (
    <div className="space-y-10">
      {/* ... (Welcome Header & Overview Stats remain unchanged) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#202124] tracking-tight">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Founder'}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Here&apos;s what&apos;s happening across your ventures today.</p>
        </div>
        <Link 
          href="/founder/new"
          className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Launch New Venture
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Total Ventures</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-[#202124]">{startups?.length || 0}</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">Active</span>
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
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-[#202124]">Q2</h2>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">Operational</span>
          </div>
          <p className="mt-4 text-xs font-semibold text-muted-foreground">Target: 100% Series A Readiness</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* ... (Startups List same) */}
        <div className="col-span-8 bg-white border border-border rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-[#202124]">Your Ventures</h3>
            <Link href="/founder/startup" className="text-sm font-bold text-muted-foreground hover:text-black transition-colors flex items-center gap-1 group">
              Manage All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {startups && startups.length > 0 ? (startups as { id: string, name: string, status: string, sector: string, stage: string }[]).map((startup) => (
              <Link 
                key={startup.id} 
                href="/founder/startup"
                className="flex items-center gap-6 p-6 rounded-[2rem] border border-transparent hover:border-border hover:bg-[#f8f9fa] transition-all group"
              >
                <div className="w-16 h-16 bg-[#f1f3f4] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Rocket className="w-8 h-8 text-[#202124]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#202124]">{startup.name}</h4>
                  <p className="text-sm font-medium text-muted-foreground">{startup.sector} • {startup.stage}</p>
                </div>
                <div className="text-right">
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
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-[#f1f3f4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-10 h-10 text-muted-foreground" />
                </div>
                <h4 className="text-xl font-bold text-[#202124] mb-2">No ventures found</h4>
                <p className="text-muted-foreground mb-8">Start your journey by launching your first venture.</p>
                <Link href="/founder/new" className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-gray-800 transition-all inline-block">
                  Launch Venture
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-4 space-y-8">

          <div className="bg-[#1a1c1e] text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-lg font-bold mb-4">Incubation Insights</h3>
               <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
               &ldquo;Founders who update their milestones weekly see a 40% higher investor engagement rate on Polaris.&rdquo;
               </p>
               <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Polaris Success Team</span>
                 <BarChart2 className="w-4 h-4 text-blue-400" />
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Suggestions Drawer Overlay */}
      {showSuggestions && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowSuggestions(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#202124]">Strategic Insights</h3>
                  <p className="text-xs font-medium text-muted-foreground">Premium venture insights</p>
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
                className="w-full h-12 pl-10 pr-4 bg-[#f1f3f4] rounded-xl border-none text-sm font-bold focus:ring-2 focus:ring-black/5"
              />
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
              {SUGGESTIONS.map((s, i) => (
                <div key={i} className="p-6 bg-white border border-border rounded-3xl hover:border-black/10 hover:shadow-lg transition-all group cursor-pointer">
                  <span className="inline-block px-2 py-0.5 bg-[#f1f3f4] text-[10px] font-black uppercase tracking-widest rounded-md mb-3 text-[#202124]">
                    {s.type}
                  </span>
                  <h4 className="text-lg font-bold text-[#202124] mb-2 group-hover:text-blue-600 transition-colors">{s.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <button className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-gray-800 transition-all">
                Dismiss All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
