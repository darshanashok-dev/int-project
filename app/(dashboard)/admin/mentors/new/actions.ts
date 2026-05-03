'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, MissingAdminEnvError } from '@/lib/supabase/admin'
import { z } from 'zod'

const createMentorSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  expertise: z.string().optional(),
  bio: z.string().optional()
})

interface CreateMentorInput {
  fullName: string
  email: string
  expertise: string
  bio: string
}

function mapActionError(error: unknown, fallbackMessage: string) {
  if (error instanceof MissingAdminEnvError) {
    if (error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return 'System is missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local and restart the server.'
    }
    return 'Supabase admin configuration is incomplete.'
  }

  console.error('Mentor Action Error:', error)
  return fallbackMessage
}

function isMissingColumnError(error: { code?: string } | null | undefined) {
  return error?.code === 'PGRST204'
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

export async function createMentorAction(input: CreateMentorInput) {
  try {
    await assertAdminAccess()
    const supabase = createAdminClient()

    const parsed = createMentorSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' }
    }

    const { fullName, email, expertise, bio } = parsed.data

    const { data: createdAuthUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'mentor'
      },
      app_metadata: {
        role: 'mentor'
      }
    })

    if (authError || !createdAuthUser.user) {
      return { success: false, error: authError?.message || 'Failed to create auth user.' }
    }

    const authUserId = createdAuthUser.user.id

    const { error: userInsertError } = await supabase.from('users').insert({
      id: authUserId,
      email
    })

    if (userInsertError && userInsertError.code !== '23505' && !isMissingColumnError(userInsertError)) {
      return { success: false, error: userInsertError.message }
    }

    const { error: mentorInsertError } = await supabase.from('mentors').insert({
      user_id: authUserId,
      expertise: expertise || null,
      bio: bio || null
    })

    if (mentorInsertError) {
      return { success: false, error: mentorInsertError.message }
    }

    revalidatePath('/admin/mentors')
    return { success: true }
  } catch (error: unknown) {
    return {
      success: false,
      error: mapActionError(error, 'An unexpected error occurred while creating the mentor.')
    }
  }
}
