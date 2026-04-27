'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const ALLOWED_STATUSES = ['active', 'pending', 'waitlisted', 'rejected'] as const

type AllowedStatus = (typeof ALLOWED_STATUSES)[number]

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

  return user.id
}

export async function updateStartupStatusAction(startupId: string, status: string) {
  try {
    await assertAdminAccess()

    if (!ALLOWED_STATUSES.includes(status as AllowedStatus)) {
      return { success: false, error: 'Invalid startup status provided.' }
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('startups')
      .update({ status })
      .eq('id', startupId)

    if (error) {
      console.error('Update Startup Status Error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/startups')
    return { success: true }
  } catch (error: unknown) {
    console.error('System Error:', error)
    return { success: false, error: 'An unexpected error occurred while updating startup status.' }
  }
}

export async function deleteStartupAction(startupId: string) {
  try {
    await assertAdminAccess()

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('startups')
      .delete()
      .eq('id', startupId)

    if (error) {
      console.error('Delete Startup Error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/startups')
    return { success: true }
  } catch (error: unknown) {
    console.error('System Error:', error)
    return { success: false, error: 'An unexpected error occurred while deleting the startup.' }
  }
}

export async function saveStartupReviewNoteAction(startupId: string, note: string) {
  try {
    const reviewerId = await assertAdminAccess()

    if (!note.trim()) {
      return { success: false, error: 'Review note cannot be empty.' }
    }

    const supabase = createAdminClient()

    const { data: latestApplication, error: applicationError } = await supabase
      .from('applications')
      .select('id')
      .eq('startup_id', startupId)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (applicationError) {
      console.error('Load Application Error:', applicationError)
      return { success: false, error: 'Unable to locate startup application for review notes.' }
    }

    if (!latestApplication) {
      return { success: false, error: 'No application found for this startup yet.' }
    }

    const { error: saveError } = await supabase.from('application_scores').insert({
      application_id: latestApplication.id,
      reviewer_id: reviewerId,
      overall_comment: note.trim(),
      scored_at: new Date().toISOString()
    })

    if (saveError) {
      console.error('Save Review Note Error:', saveError)
      return { success: false, error: saveError.message }
    }

    revalidatePath('/admin/startups')
    revalidatePath(`/admin/startups/${startupId}`)

    return { success: true }
  } catch (error: unknown) {
    console.error('System Error:', error)
    return { success: false, error: 'An unexpected error occurred while saving the review note.' }
  }
}
