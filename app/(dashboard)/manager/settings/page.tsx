'use client'

import { 
  User, 
  Bell, 
  Shield, 
  ChevronRight, 
  FolderKanban, 
  ClipboardList, 
  Users,
  Settings as SettingsIcon
} from 'lucide-react'
import { LogoutButton } from '@/components/shared/LogoutButton'

const MANAGER_SETTINGS = [
  { 
    id: 'profile', 
    name: 'Manager Profile', 
    desc: 'Manage your internal identity and program assignments.', 
    icon: User,
    color: 'bg-indigo-500/10 text-indigo-600'
  },
  { 
    id: 'cohorts', 
    name: 'Cohort Visibility', 
    desc: 'Configure which startups and mentors appear in your active view.', 
    icon: Users,
    color: 'bg-emerald-500/10 text-emerald-600'
  },
  { 
    id: 'program-params', 
    name: 'Program Parameters', 
    desc: 'Set default application windows and scoring criteria.', 
    icon: FolderKanban,
    color: 'bg-amber-500/10 text-amber-600'
  },
  { 
    id: 'notifications', 
    name: 'Alert Preferences', 
    desc: 'Customize notifications for cohort milestones.', 
    icon: Bell,
    color: 'bg-purple-500/10 text-purple-600'
  },
  { 
    id: 'reporting', 
    name: 'Report Intervals', 
    desc: 'Configure automated PDF report generation for stakeholders.', 
    icon: ClipboardList,
    color: 'bg-rose-500/10 text-rose-600'
  },
  { 
    id: 'security', 
    name: 'Vault Security', 
    desc: 'MFA and permission management for sensitive documents.', 
    icon: Shield,
    color: 'bg-blue-500/10 text-blue-600'
  },
]

export default function ManagerSettingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Manager Settings</h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg italic">Administer your cohort ecosystem with precision and clarity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MANAGER_SETTINGS.map((page) => (
          <button 
            key={page.id}
            onClick={() => alert(`${page.name} configuration is locked for the current cycle.`)}
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
