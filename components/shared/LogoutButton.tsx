'use client'

import { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    
    if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
      document.cookie = 'mock-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      document.cookie = 'mock-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    } else {
      await supabase.auth.signOut()
    }
    
    router.push('/')
    router.refresh()
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={loggingOut}
      className="w-full bg-card border border-border rounded-[2rem] p-8 text-left hover:bg-destructive/5 hover:border-destructive/20 transition-all group shadow-sm disabled:opacity-60"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
          {loggingOut ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogOut className="w-6 h-6" />}
        </div>
      </div>
      <h4 className="text-xl font-bold text-destructive">Account Logout</h4>
      <p className="text-sm font-medium text-muted-foreground mt-1 leading-relaxed">
        Securely end your current Polaris session.
      </p>
    </button>
  )
}
