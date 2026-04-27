'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react'
import { initializeDefaultSettings, updateAdminSetting } from './actions'

interface AdminSetting {
  key: string
  value: string | null
  description: string | null
}

interface SettingsClientProps {
  initialSettings: AdminSetting[]
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [draftValues, setDraftValues] = useState<Record<string, string>>(
    Object.fromEntries(initialSettings.map((setting) => [setting.key, setting.value ?? '']))
  )
  const [successKey, setSuccessKey] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pendingSettingKey, setPendingSettingKey] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleUpdate = (key: string, value: string) => {
    setErrorMessage(null)
    setPendingSettingKey(key)

    startTransition(async () => {
      try {
        await updateAdminSetting(key, value)
        setSettings((previous) =>
          previous.map((setting) => (setting.key === key ? { ...setting, value } : setting))
        )
        setDraftValues((previous) => ({ ...previous, [key]: value }))
        setSuccessKey(key)
        setTimeout(() => setSuccessKey(null), 2000)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to update setting.')
      } finally {
        setPendingSettingKey(null)
      }
    })
  }

  const handleInitializeDefaults = () => {
    setErrorMessage(null)

    startTransition(async () => {
      try {
        await initializeDefaultSettings()
        const nextSettings = [
          {
            key: 'platform_registration_open',
            value: 'true',
            description: 'Allow new founders to register on the platform.'
          },
          {
            key: 'applications_review_mode',
            value: 'manual',
            description: 'Controls how startup applications are reviewed.'
          },
          {
            key: 'founder_profile_required_fields',
            value: 'name,startup_name,sector,stage',
            description: 'Comma-separated founder profile fields required before submission.'
          },
          {
            key: 'system_maintenance_banner',
            value: 'off',
            description: 'Set to "on" to show a maintenance notice across dashboards.'
          }
        ]
        setSettings(nextSettings)
        setDraftValues(Object.fromEntries(nextSettings.map((setting) => [setting.key, setting.value ?? ''])))
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize settings.')
      }
    })
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {settings.length === 0 ? (
        <div className="py-20 text-center bg-white border border-dashed border-border rounded-3xl space-y-4">
          <AlertCircle className="w-10 h-10 text-slate-200 mx-auto" />
          <p className="text-muted-foreground font-medium">No system settings found in the database.</p>
          <button
            type="button"
            onClick={handleInitializeDefaults}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-black/90 transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Initialize default settings
          </button>
        </div>
      ) : (
        settings.map((setting) => (
          <div key={setting.key} className="bg-white border border-border/50 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-black text-[#202124] flex items-center gap-2">
                  {setting.key
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                  {successKey === setting.key ? <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in zoom-in" /> : null}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{setting.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={draftValues[setting.key] ?? ''}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 font-bold text-sm min-w-[240px]"
                  onChange={(event) => {
                    const nextValue = event.target.value
                    setDraftValues((previous) => ({
                      ...previous,
                      [setting.key]: nextValue
                    }))
                  }}
                  onBlur={(event) => {
                    if (event.target.value !== (setting.value ?? '')) {
                      handleUpdate(setting.key, event.target.value)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleUpdate(setting.key, draftValues[setting.key] ?? '')}
                  disabled={pendingSettingKey === setting.key}
                  className="p-2.5 bg-black text-white rounded-xl hover:bg-black/90 transition-all disabled:opacity-50"
                >
                  {pendingSettingKey === setting.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
