'use client'

import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  ChevronRight, 
  Rocket, 
  FileText, 
  Globe,
  Settings as SettingsIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LogoutButton } from '@/components/shared/LogoutButton'

const FOUNDER_SETTINGS = [
  { 
    id: 'profile', 
    name: 'Founder Persona', 
    desc: 'Manage your public identity and career trajectory.', 
    icon: User,
    color: 'bg-blue-500/10 text-blue-600'
  },
  { 
    id: 'startup-dna', 
    name: 'Startup DNA', 
    desc: 'Configure default mission, vision, and core values.', 
    icon: Rocket,
    color: 'bg-emerald-500/10 text-emerald-600'
  },
  { 
    id: 'deck-settings', 
    name: 'Pitch Suite', 
    desc: 'Manage pitch deck permissions and view tracking.', 
    icon: FileText,
    color: 'bg-amber-500/10 text-amber-600'
  },
  { 
    id: 'notifications', 
    name: 'Signal Preferences', 
    desc: 'Customize alerts for investor interests and mentor feedback.', 
    icon: Bell,
    color: 'bg-purple-500/10 text-purple-600'
  },
  { 
    id: 'security', 
    name: 'Vault Security', 
    desc: 'Multi-factor authentication and data room access keys.', 
    icon: Shield,
    color: 'bg-rose-500/10 text-rose-600'
  },
  { 
    id: 'billing', 
    name: 'Resource Tier', 
    desc: 'Manage your Polaris subscription and cloud credits.', 
    icon: CreditCard,
    color: 'bg-indigo-500/10 text-indigo-600'
  },
]

export default function FounderSettingsPage() {
  const router = useRouter()

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Founder Settings</h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg italic">Fine-tune your Polaris Command Center for optimal venture growth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FOUNDER_SETTINGS.map((page) => (
          <button 
            key={page.id}
            onClick={() => {
              if (page.id === 'profile') router.push('/founder/settings/profile')
              else alert(`${page.name} module is being initialized in your current cohort.`)
            }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/50">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4">Venture Collaboration</h3>
            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
              Enable public visibility for your ventures to attract top-tier investors and expert mentors.
            </p>
            <button className="px-8 py-3 bg-card text-black rounded-xl font-black text-sm hover:scale-105 transition-all">
              Manage Visibility
            </button>
          </div>
          <Globe className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
        </div>
        
        <div className="flex flex-col justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
