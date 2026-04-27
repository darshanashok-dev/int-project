'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  FileSignature, 
  Milestone, 
  Coins, 
  Settings, 
  HelpCircle,
  User,
  Users,
  FolderKanban,
  GraduationCap,
  Calendar,
  BarChart3
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/logo'
import { useState, useEffect } from 'react'

const navConfigs: Record<string, { name: string, href: string, icon: LucideIcon }[]> = {
  founder: [
    { name: 'Dashboard', href: '/founder', icon: LayoutDashboard },
    { name: 'My Startup', href: '/founder/startup', icon: Briefcase },
    { name: 'Applications', href: '/founder/applications', icon: FileSignature },
    { name: 'Milestones', href: '/founder/milestones', icon: Milestone },
    { name: 'Funding', href: '/founder/funding', icon: Coins },
  ],
  admin: [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Startups', href: '/admin/startups', icon: Briefcase },
    { name: 'Programs', href: '/admin/programs', icon: FolderKanban },
    { name: 'Mentors', href: '/admin/mentors', icon: GraduationCap },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  ],
  investor: [
    { name: 'Dashboard', href: '/investor', icon: LayoutDashboard },
    { name: 'Portfolio', href: '/investor/portfolio', icon: Briefcase },
    { name: 'Pipeline', href: '/investor/pipeline', icon: FileSignature },
  ],
  manager: [
    { name: 'Dashboard', href: '/manager', icon: LayoutDashboard },
    { name: 'Programs', href: '/manager/programs', icon: FolderKanban },
    { name: 'Startups', href: '/manager/startups', icon: Briefcase },
  ],
  mentor: [
    { name: 'Dashboard', href: '/mentor', icon: LayoutDashboard },
    { name: 'Sessions', href: '/mentor/sessions', icon: Users },
    { name: 'Startups', href: '/mentor/startups', icon: Briefcase },
  ]
}

interface SidebarProps {
  user: {
    user_metadata?: {
      avatar_url?: string | null
    }
  } | null
  displayName: string
  displayRole: string
}

export function Sidebar({ user, displayName = 'User', displayRole = 'Founder' }: SidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const role = (displayRole?.toLowerCase() || 'founder') as keyof typeof navConfigs
  const navItems = navConfigs[role] || navConfigs.founder
  const dashboardPath = role === 'founder' ? '/founder' : `/${role}`

  return (
    <div className="w-64 h-full bg-[#f8f9fa] border-r border-border flex flex-col p-5 overflow-y-auto shrink-0 transition-all duration-300">
      {/* Branding Section */}
      <div className="mb-6">
        <Link href={dashboardPath} className="flex items-center gap-3 py-1">
          <Logo className="w-8 h-8" iconClassName="w-5 h-5" />
          <div>
            <h1 className="font-bold text-base leading-tight text-[#202124]">Polaris</h1>
            <p className="text-[9px] font-black text-muted-foreground tracking-widest uppercase opacity-80">
              {role === 'admin' ? 'Admin Control' : role === 'founder' ? 'Founder Suite' : `${role} Dashboard`}
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== dashboardPath && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-white shadow-sm ring-1 ring-black/5 text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profile & Bottom Section */}
      <div className="mt-auto pt-6 flex flex-col gap-1 border-t border-border/60">
        
        {/* User Profile Block - Protected by mounted state */}
        <Link 
          href={`/${role}/settings/profile`}
          className="px-3 py-4 mb-2 flex items-center gap-3 rounded-2xl bg-white/50 border border-transparent hover:border-border hover:bg-white transition-all group/profile"
        >
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-black/10 shrink-0 group-hover/profile:scale-105 transition-transform overflow-hidden">
            {mounted && user?.user_metadata?.avatar_url ? (
              <Image src={user.user_metadata.avatar_url} alt="Avatar" fill className="object-cover" />
            ) : mounted ? (
              displayName?.charAt(0) || 'U'
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-[#202124] truncate min-h-[1.25rem]">
              {mounted ? displayName : ''}
            </p>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider truncate opacity-70 min-h-[0.75rem]">
              {mounted ? displayRole : ''}
            </p>
          </div>
        </Link>

        <Link 
          href={`/${role}/settings`} 
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
            pathname === `/${role}/settings` 
              ? "bg-black text-white" 
              : "text-muted-foreground hover:text-foreground hover:bg-black/5"
          )}
        >
          <Settings className={cn("w-5 h-5", pathname === `/${role}/settings` ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
          <span className="text-sm font-semibold">Settings</span>
        </Link>
        
        <Link 
          href={`/${role}/support`} 
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
            pathname === `/${role}/support` 
              ? "bg-black text-white" 
              : "text-muted-foreground hover:text-foreground hover:bg-black/5"
          )}
        >
          <HelpCircle className={cn("w-5 h-5", pathname === `/${role}/support` ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
          <span className="text-sm font-semibold">Support</span>
        </Link>
      </div>
    </div>
  )
}

