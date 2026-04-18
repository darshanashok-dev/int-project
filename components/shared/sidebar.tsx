'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart2, 
  Rocket, 
  FileText, 
  Flag, 
  PieChart, 
  Settings, 
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/logo'

const navItems = [
  { name: 'Dashboard', href: '/founder', icon: BarChart2 },
  { name: 'My Startup', href: '/founder/startup', icon: Rocket },
  { name: 'Applications', href: '/founder/applications', icon: FileText },
  { name: 'Milestones', href: '/founder/milestones', icon: Flag },
  { name: 'Funding', href: '/founder/funding', icon: PieChart },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-full bg-[#f8f9fa] border-r border-border flex flex-col p-6 overflow-y-auto shrink-0">
      <div className="mb-8">
        <Link href="/founder" className="flex items-center gap-3">
          <Logo className="w-8 h-8 rounded-lg" iconClassName="w-5 h-5" />
          <div>
            <h1 className="font-bold text-lg leading-tight text-[#202124]">Polaris Platform</h1>
            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Founder Suite</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
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
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          )
        })}

      </nav>

      <div className="pt-8 border-t border-border flex flex-col gap-2">
        <Link 
          href="/founder/settings" 
          className={cn(
            "flex items-center gap-3 px-3 py-2 transition-colors",
            pathname === '/founder/settings' ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Settings className={cn("w-5 h-5", pathname === '/founder/settings' && "text-foreground")} />
          <span className="text-sm">Settings</span>
        </Link>
        <Link 
          href="/founder/support" 
          className={cn(
            "flex items-center gap-3 px-3 py-2 transition-colors",
            pathname === '/founder/support' ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <HelpCircle className={cn("w-5 h-5", pathname === '/founder/support' && "text-foreground")} />
          <span className="text-sm">Support</span>
        </Link>
      </div>
    </div>
  )
}
