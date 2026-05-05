'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, MissingAdminEnvError } from '@/lib/supabase/admin'

type EventInput = {
  programId: string
  title: string
  type: string
  date: string
  location: string
}

function mapActionError(error: unknown, fallbackMessage: string) {
  if (error instanceof MissingAdminEnvError) {
    if (error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return 'System is missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local and restart the server.'
    }
    return 'Supabase admin configuration is incomplete.'
  }

  console.error('Events Action Error:', error)
  return fallbackMessage
}

async function assertAdminAccess() {
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

  if (role !== 'admin') {
    throw new Error('Unauthorized')
  }
}

export async function createEventAction(input: EventInput) {
  try {
    await assertAdminAccess()

    if (!input.programId || !input.title.trim() || !input.date) {
      return { success: false, error: 'Program, title, and date are required.' }
    }

    const supabase = createAdminClient()
    const { error } = await (supabase.from('events') as any).insert({
      program_id: input.programId,
      title: input.title.trim(),
      type: input.type.trim() || null,
      date: input.date,
      location: input.location.trim() || null
    })

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/events')
    return { success: true }
  } catch (error: unknown) {
    return {
      success: false,
      error: mapActionError(error, 'An unexpected error occurred while creating the event.')
    }
  }
}

export async function deleteEventAction(eventId: string) {
  try {
    await assertAdminAccess()
    const supabase = createAdminClient()

    const { error } = await (supabase.from('events') as any).delete().eq('id', eventId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/events')
    return { success: true }
  } catch (error: unknown) {
    return {
      success: false,
      error: mapActionError(error, 'An unexpected error occurred while deleting the event.')
    }
  }
}

export async function rescheduleEventAction(eventId: string, date: string) {
  try {
    await assertAdminAccess()

    if (!date) {
      return { success: false, error: 'New date is required.' }
    }

    const supabase = createAdminClient()
    const { error } = await (supabase.from('events') as any).update({ date }).eq('id', eventId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/events')
    return { success: true }
  } catch (error: unknown) {
    return {
      success: false,
      error: mapActionError(error, 'An unexpected error occurred while rescheduling the event.')
    }
  }
}
