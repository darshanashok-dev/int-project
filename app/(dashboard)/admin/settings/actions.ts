'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const DEFAULT_ADMIN_SETTINGS = [
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

async function getAdminUserId() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return user.id
}

export async function initializeDefaultSettings() {
  const userId = await getAdminUserId()
  const supabase = createClient()

  const settingsPayload: { key: string; value: string; description: string; updated_by: string; updated_at: string }[] = 
    DEFAULT_ADMIN_SETTINGS.map((setting) => ({
      key: setting.key,
      value: setting.value,
      description: setting.description,
      updated_by: userId,
      updated_at: new Date().toISOString()
    }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('admin_settings') as any).upsert(
    settingsPayload,
    { onConflict: 'key' }
  )

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/settings')
}

export async function updateAdminSetting(key: string, value: string) {
  const userId = await getAdminUserId()
  const supabase = createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('admin_settings') as any)
    .update({
      value,
      updated_by: userId,
      updated_at: new Date().toISOString()
    })
    .eq('key', key)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/settings')
}
