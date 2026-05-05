'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from '@/components/shared/sidebar'
import { usePathname } from 'next/navigation'

interface MobileNavigationProps {
  user: {
    user_metadata?: {
      avatar_url?: string | null
    }
  } | null
  displayName: string
  displayRole: string
}

export function MobileNavigation({ user, displayName, displayRole }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border z-40">
        <div className="flex items-center gap-3">
          <span className="font-black text-lg tracking-tighter uppercase text-indigo-600">Polaris</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-secondary rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute inset-y-0 left-0 w-full max-w-[300px] bg-card shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <span className="font-black text-xl text-foreground">Menu</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-secondary rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar 
                user={user} 
                displayName={displayName} 
                displayRole={displayRole} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
