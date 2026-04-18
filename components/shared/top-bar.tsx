'use client'

import { Bell, MessageSquare } from 'lucide-react'
import { useState } from 'react'

interface TopBarProps {
  user: {
    email?: string
    user_metadata?: {
      full_name?: string
      role?: string
    }
  }
}

export function TopBar({ user }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const role = user.user_metadata?.role || 'Founder'

  return (
    <header className="h-20 border-b border-border bg-white flex items-center px-8 justify-between sticky top-0 z-10">
      <div className="flex-1"></div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors relative group"
          >
            <Bell className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-border shadow-2xl rounded-2xl p-4 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Latest Notifications</p>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-[#202124]">New Funding Match</p>
                      <p className="text-xs text-muted-foreground font-medium">Vertex Ventures matches your profile.</p>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-[#f1f3f4]/50 rounded-xl transition-colors flex gap-3">
                    <div className="w-2 h-2 bg-gray-200 rounded-full mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-[#202124]">Milestone Update</p>
                      <p className="text-xs text-muted-foreground font-medium">Q3 Operational Roadmap is now active.</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#202124] bg-[#f1f3f4] rounded-lg hover:bg-gray-200 transition-colors">
                  View All Notifications
                </button>
              </div>
            )}
          </button>
          <button 
            onClick={() => alert('Secure Messaging: Coming Soon to Polaris Founder Suite.')}
            className="p-2 hover:bg-black/5 rounded-full transition-colors group"
          >
            <MessageSquare className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>

        <div className="h-10 w-[1px] bg-border mx-2"></div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-bold text-sm text-foreground leading-none">{fullName}</p>
            <p className="text-xs text-muted-foreground font-medium capitalize mt-1">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-black overflow-hidden relative border border-black/10">
            {/* Using a placeholder if no avatar exists */}
            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
              {fullName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
