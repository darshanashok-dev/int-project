'use client'

import { User, Bell, Shield, CreditCard, ChevronRight, LogOut, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SETTINGS_PAGES = [
  { id: 'profile', name: 'Profile Identity', desc: 'Manage your public founder persona.', icon: User },
  { id: 'notifications', name: 'Alert Preferences', desc: 'Configure how you receive platform updates.', icon: Bell },
  { id: 'security', name: 'Auth & Security', desc: 'Secure your account with 2FA and keys.', icon: Shield },
  { id: 'billing', name: 'Billing & Tiers', desc: 'Manage your subscription and usage.', icon: CreditCard },
]

export default function SettingsPage() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-extrabold text-[#202124] tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground mt-2 font-medium">Fine-tune your Polaris experience and founder profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SETTINGS_PAGES.map((page) => (
          <button 
            key={page.id}
            onClick={() => {
              if (page.id === 'profile') router.push('/founder/settings/profile')
              else alert(`${page.name} configuration coming soon.`)
            }}
            className="bg-white border border-border rounded-[2rem] p-8 text-left hover:bg-[#f8f9fa] hover:border-black/10 transition-all group shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-[#202124] group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <page.icon className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-xl font-bold text-[#202124]">{page.name}</h4>
            <p className="text-sm font-medium text-muted-foreground mt-1 leading-relaxed">{page.desc}</p>
          </button>
        ))}

        {/* Logout Section */}
        <button 
          onClick={handleLogout}
          disabled={loggingOut}
          className="bg-white border border-border rounded-[2rem] p-8 text-left hover:bg-destructive/5 hover:border-destructive/20 transition-all group shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
              {loggingOut ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogOut className="w-6 h-6" />}
            </div>
          </div>
          <h4 className="text-xl font-bold text-destructive">Account Logout</h4>
          <p className="text-sm font-medium text-muted-foreground mt-1 leading-relaxed">Securely end your current Polaris session.</p>
        </button>
      </div>

      <div className="bg-secondary border border-border/50 rounded-[2rem] p-8 text-center">
        <p className="text-sm font-bold text-muted-foreground">Looking for workspace-specific settings?</p>
        <p className="text-xs font-medium text-muted-foreground/60 mt-1 italic">Venture-level configurations can be found in the &ldquo;My Startup&rdquo; section.</p>
      </div>
    </div>
  )
}
