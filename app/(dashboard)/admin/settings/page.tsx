import { redirect } from 'next/navigation'
import { Settings, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SettingsClient } from './settings-client'

export default async function AdminSettingsPage() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login')
  }

  const { data: settings } = await supabase
    .from('admin_settings')
    .select('key, value, description')
    .order('key', { ascending: true })

  return (
    <div className="max-w-[800px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#202124] tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground font-medium">Global platform controls and feature flags</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-900">Administrative Access</p>
          <p className="text-xs text-amber-700 mt-1">
            These settings affect the entire platform. Changes are logged and applied immediately to all users.
          </p>
        </div>
      </div>

      <SettingsClient initialSettings={settings ?? []} />
    </div>
  )
}
