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
  
  // Determine which nav config to show based on the current path context
  const pathParts = pathname.split('/')
  const pathRole = pathParts[1]
  const isNavContextMatch = navConfigs[pathRole as keyof typeof navConfigs]
  const activeNavRole = (isNavContextMatch ? pathRole : role) as keyof typeof navConfigs
  
  const navItems = navConfigs[activeNavRole] || navConfigs.founder
  const dashboardPath = activeNavRole === 'founder' ? '/founder' : `/${activeNavRole}`

  return (
    <div className="w-full h-full bg-card flex flex-col p-5 overflow-y-auto shrink-0 transition-all duration-300 md:w-64 md:border-r md:border-border">
      {/* Branding Section */}
      <div className="mb-6">
        <Link href={dashboardPath} className="flex items-center gap-3 py-1">
          <div>
            <h1 className="font-bold text-base leading-tight text-foreground text-indigo-600">Polaris</h1>
            <p className="text-[9px] font-black text-muted-foreground tracking-widest uppercase opacity-80">
              {activeNavRole === 'admin' ? 'Admin Control' : activeNavRole === 'founder' ? 'Founder Suite' : activeNavRole === 'investor' ? 'Investor Suite' : `${activeNavRole} Dashboard`}
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                isActive 
                  ? "bg-card text-foreground shadow-sm font-bold border border-border/40" 
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-colors",
                isActive ? "text-foreground" : "group-hover:text-foreground"
              )} />
              <span className="text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 flex flex-col gap-1 border-t border-border/60">
        <Link 
          href={`/${role}/settings/profile`}
          className="px-3 py-4 mb-2 flex items-center gap-3 rounded-2xl bg-card/50 border border-transparent hover:border-border hover:bg-card transition-all group/profile"
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
            <p className="font-bold text-sm text-foreground truncate min-h-[1.25rem]">
              {mounted ? displayName : ''}
            </p>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider truncate opacity-70 min-h-[0.75rem]">
              {mounted ? displayRole : ''}
            </p>
          </div>
        </Link>


        <div className="flex items-center gap-2">
          <Link 
            href={`/${role}/settings`} 
            className={cn(
              "flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
              pathname === `/${role}/settings` 
                ? "bg-card text-black shadow-sm font-bold border border-border/40" 
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>

        <Link 
          href="/help" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Help Center</span>
        </Link>
      </div>
    </div>
  )
}
