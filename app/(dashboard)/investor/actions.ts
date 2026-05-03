'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function signalInterest(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const startupId = formData.get('startup_id') as string
  const signalType = formData.get('signal_type') as string
  const note = formData.get('note') as string | null

  if (!startupId || !signalType) {
    return { error: 'Missing required fields' }
  }

  // Check if interest already exists for this startup
  const { data: existing } = await supabase
    .from('investor_interests')
    .select('id')
    .eq('investor_id', user.id)
    .eq('startup_id', startupId)
    .limit(1)

  const existingData = existing as { id: string }[] | null

  if (existingData && existingData.length > 0) {
    // Update existing interest
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('investor_interests') as any)
      .update({
        signal_type: signalType,
        note: note || null,
      })
      .eq('id', existingData[0].id)

    if (error) return { error: error.message }
  } else {
    // Create new interest
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('investor_interests') as any)
      .insert({
        investor_id: user.id,
        startup_id: startupId,
        signal_type: signalType,
        note: note || null,
      })

    if (error) return { error: error.message }
  }

  revalidatePath('/investor')
  revalidatePath('/investor/portfolio')
  revalidatePath('/investor/pipeline')
  return { success: true }
}

export async function removeInterest(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const interestId = formData.get('interest_id') as string
  if (!interestId) return { error: 'Missing interest ID' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('investor_interests') as any)
    .delete()
    .eq('id', interestId)
    .eq('investor_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/investor')
  revalidatePath('/investor/portfolio')
  revalidatePath('/investor/pipeline')
  return { success: true }
}
