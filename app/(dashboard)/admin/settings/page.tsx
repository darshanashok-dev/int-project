import { redirect } from 'next/navigation'
import { Settings, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SettingsClient } from './settings-client'
import { LogoutButton } from '@/components/shared/LogoutButton'

export default async function AdminSettingsPage() {
  const supabase = createClient()
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (err) {
    console.error('Auth check failed:', err)
  }

  if (!user) {
    redirect('/login')
  }

  const rawRole = (user.user_metadata?.role || user.app_metadata?.role || '').toLowerCase()
  if (!rawRole.includes('admin')) {
    redirect('/login')
  }

  const { data: settings } = await supabase
    .from('admin_settings')
    .select('key, value, description')
    .order('key', { ascending: true })

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg italic">Global platform controls and administrative feature flags.</p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-200/50 rounded-[2.5rem] p-10 flex gap-6 items-start relative overflow-hidden">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
          <ShieldAlert className="w-7 h-7 text-amber-600" />
        </div>
        <div className="relative z-10">
          <p className="text-xl font-bold text-amber-900">Administrative Access Required</p>
          <p className="text-sm text-amber-700 mt-2 leading-relaxed font-medium">
            These settings affect the global platform architecture. Changes are cryptographically logged and applied in real-time across all regional clusters.
          </p>
        </div>
        <ShieldAlert className="absolute -bottom-10 -right-10 w-48 h-48 text-amber-500/10 -rotate-12" />
      </div>

      <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-sm">
        <SettingsClient initialSettings={settings ?? []} />
      </div>

      <div className="flex justify-end pt-8 border-t border-border/50">
        <LogoutButton />
      </div>
    </div>
  )
}
