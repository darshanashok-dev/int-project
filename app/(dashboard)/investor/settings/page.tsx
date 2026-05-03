'use client'

import { 
  User, 
  Bell, 
  Shield, 
  ChevronRight, 
  Target, 
  Zap, 
  BarChart3,
  Settings as SettingsIcon
} from 'lucide-react'
import { LogoutButton } from '@/components/shared/LogoutButton'

const INVESTOR_SETTINGS = [
  { 
    id: 'profile', 
    name: 'Investor Profile', 
    desc: 'Manage your investor identity and credentials.', 
    icon: User,
    color: 'bg-indigo-500/10 text-indigo-600'
  },
  { 
    id: 'thesis', 
    name: 'Investment Thesis', 
    desc: 'Define your preferred sectors, stages, and ticket sizes.', 
    icon: Target,
    color: 'bg-emerald-500/10 text-emerald-600'
  },
  { 
    id: 'pipeline', 
    name: 'Pipeline Signals', 
    desc: 'Configure automated scoring for incoming deal flow.', 
    icon: Zap,
    color: 'bg-amber-500/10 text-amber-600'
  },
  { 
    id: 'notifications', 
    name: 'Alert Preferences', 
    desc: 'Customize real-time notifications for venture updates.', 
    icon: Bell,
    color: 'bg-purple-500/10 text-purple-600'
  },
  { 
    id: 'analytics', 
    name: 'Portfolio Alpha', 
    desc: 'Configure data aggregation for your tracked ventures.', 
    icon: BarChart3,
    color: 'bg-blue-500/10 text-blue-600'
  },
  { 
    id: 'security', 
    name: 'Vault Security', 
    desc: 'MFA and encrypted access for internal deal notes.', 
    icon: Shield,
    color: 'bg-rose-500/10 text-rose-600'
  },
]

export default function InvestorSettingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Investor Settings</h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg italic">Optimize your investment engine and thesis alignment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INVESTOR_SETTINGS.map((page) => (
          <button 
            key={page.id}
            onClick={() => alert(`${page.name} module is being optimized for the next fund cycle.`)}
            className="bg-card border border-border/50 rounded-[2.5rem] p-8 text-left hover:shadow-xl hover:border-black/10 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", page.color)}>
                <page.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">{page.name}</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed flex-1">{page.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                Configure <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-8 border-t border-border/50">
        <LogoutButton />
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
