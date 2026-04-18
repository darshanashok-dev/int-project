'use client'

import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, ChevronRight } from 'lucide-react'

const SETTINGS_PAGES = [
  { id: 'profile', name: 'Profile Identity', desc: 'Manage your public founder persona.', icon: User },
  { id: 'notifications', name: 'Alert Preferences', desc: 'Configure how you receive platform updates.', icon: Bell },
  { id: 'security', name: 'Auth & Security', desc: 'Secure your account with 2FA and keys.', icon: Shield },
  { id: 'billing', name: 'Billing & Tiers', desc: 'Manage your subscription and usage.', icon: CreditCard },
]

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-[#202124] tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground mt-2 font-medium">Fine-tune your Polaris experience and founder profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SETTINGS_PAGES.map((page) => (
          <button 
            key={page.id}
            onClick={() => alert(`${page.name} configuration coming soon.`)}
            className="bg-white border border-border rounded-[2rem] p-8 text-left hover:bg-[#f8f9fa] hover:border-black/10 transition-all group shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#f1f3f4] rounded-2xl flex items-center justify-center text-[#202124] group-hover:bg-black group-hover:text-white transition-colors">
                <page.icon className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-xl font-bold text-[#202124]">{page.name}</h4>
            <p className="text-sm font-medium text-muted-foreground mt-1 leading-relaxed">{page.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 text-center">
        <p className="text-sm font-bold text-blue-700">Looking for workspace-specific settings?</p>
        <p className="text-xs font-medium text-blue-600 mt-1 italic">Venture-level configurations can be found in the "My Startup" section.</p>
      </div>
    </div>
  )
}
