'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { reviewScoreSchema } from '@/lib/validations/review-score'

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

export async function saveReviewScoreAction(input: {
  startupId: string
  teamScore: number
  marketScore: number
  tractionScore: number
  uniquenessScore: number
  overallComment: string
}) {
  try {
    const reviewerId = await assertAdminAccess()

    const parsed = reviewScoreSchema.safeParse(input)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid input'
      return { success: false, error: firstError }
    }

    const { startupId, teamScore, marketScore, tractionScore, uniquenessScore, overallComment } =
      parsed.data

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
      return { success: false, error: 'Unable to locate startup application.' }
    }

    if (!latestApplication) {
      return { success: false, error: 'No application found for this startup.' }
    }

    const { error: saveError } = await supabase.from('application_scores').insert({
      application_id:   latestApplication.id,
      reviewer_id:      reviewerId,
      team_score:       teamScore,
      market_score:     marketScore,
      traction_score:   tractionScore,
      uniqueness_score: uniquenessScore,
      overall_comment:  overallComment,
      scored_at:        new Date().toISOString(),
    })

    if (saveError) {
      console.error('Save Review Score Error:', saveError)
      return { success: false, error: saveError.message }
    }

    revalidatePath('/admin/startups')
    revalidatePath(`/admin/startups/${startupId}`)

    return { success: true }
  } catch (error: unknown) {
    console.error('System Error:', error)
    return { success: false, error: 'An unexpected error occurred while saving the review score.' }
  }
}
