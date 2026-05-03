'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { investorInterestSchema } from '@/lib/validations/investor-interest'

async function assertInvestorAccess() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const role =
    (typeof user.app_metadata?.role === 'string' && user.app_metadata.role) ||
    (typeof user.user_metadata?.role === 'string' && user.user_metadata.role) ||
    null

  if (role !== 'investor') {
    throw new Error('Unauthorized')
  }

  return user.id
}

export async function upsertInterestAction(input: {
  startupId: string
  signalType: 'watching' | 'interested' | 'committed'
  note?: string
}) {
  try {
    const investorId = await assertInvestorAccess()

    const parsed = investorInterestSchema.safeParse(input)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid input'
      return { success: false, error: firstError }
    }

    const { startupId, signalType, note } = parsed.data

    const supabase = createClient()

    const { error } = await supabase
      .from('investor_interests')
      .upsert(
        {
          investor_id: investorId,
          startup_id:  startupId,
          signal_type: signalType,
          note:        note ?? null,
        } as any,
        { onConflict: 'investor_id,startup_id' }
      )

    if (error) {
      console.error('Upsert Interest Error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/investor')
    revalidatePath('/investor/portfolio')
    revalidatePath('/investor/pipeline')

    return { success: true }
  } catch (error: unknown) {
    console.error('System Error:', error)
    return { success: false, error: 'An unexpected error occurred while saving your interest.' }
  }
}

export async function removeInterestAction(input: { startupId: string }) {
  try {
    const investorId = await assertInvestorAccess()

    const parsed = investorInterestSchema.pick({ startupId: true }).safeParse(input)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid input'
      return { success: false, error: firstError }
    }

    const { startupId } = parsed.data

    const supabase = createClient()

    const { error } = await supabase
      .from('investor_interests')
      .delete()
      .eq('investor_id', investorId)
      .eq('startup_id', startupId)

    if (error) {
      console.error('Remove Interest Error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/investor')
    revalidatePath('/investor/portfolio')
    revalidatePath('/investor/pipeline')

    return { success: true }
  } catch (error: unknown) {
    console.error('System Error:', error)
    return { success: false, error: 'An unexpected error occurred while removing your interest.' }
  }
}
