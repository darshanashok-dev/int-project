'use server'

import { createAdminClient, MissingAdminEnvError } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const ALLOWED_ROLES = ['admin', 'founder', 'mentor', 'manager', 'investor'] as const

type AllowedRole = (typeof ALLOWED_ROLES)[number]

function isMissingColumnError(error: { code?: string; message?: string } | null | undefined) {
  return error?.code === 'PGRST204'
}

function mapAdminActionError(error: unknown, fallbackMessage: string) {
  if (error instanceof MissingAdminEnvError) {
    if (error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return 'System is missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local and restart the server.'
    }

    return 'Supabase admin configuration is incomplete. Please check required environment variables.'
  }

  console.error('System Error:', error)
  return fallbackMessage
}

export async function createUserAction(formData: { fullName: string, email: string, role: string }) {
  try {
    if (!ALLOWED_ROLES.includes(formData.role as AllowedRole)) {
      return { success: false, error: 'Invalid role selected.' }
    }

    const supabase = createAdminClient()

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: formData.email,
      email_confirm: true,
      user_metadata: {
        full_name: formData.fullName,
        role: formData.role
      }
    })

    if (authError) {
      console.error('Auth Error:', authError)
      return { success: false, error: authError.message }
    }

    // 2. The trigger 'on_auth_user_created' (defined in schema_setup.md) 
    // should automatically insert into public.users.
    // However, if the trigger is not set up, we do it manually here.
    if (authData.user) {
      const { error: dbError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: formData.email,
        created_at: new Date().toISOString()
      })
      
      if (dbError && dbError.code !== '23505' && !isMissingColumnError(dbError)) {
        console.error('DB Insert Error:', dbError)
        return { success: false, error: 'User created in auth, but profile creation failed.' }
      }
    }
    
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: unknown) {
    return {
      success: false,
      error: mapAdminActionError(error, 'An unexpected error occurred while creating the user.')
    }
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const supabase = createAdminClient()

    // 1. Delete from Supabase Auth (this will also delete from public.users due to CASCADE)
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Delete Auth Error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: unknown) {
    return {
      success: false,
      error: mapAdminActionError(error, 'An unexpected error occurred while deleting the user.')
    }
  }
}

export async function updateUserRoleAction(userId: string, newRole: string) {
  try {
    if (!ALLOWED_ROLES.includes(newRole as AllowedRole)) {
      return { success: false, error: 'Invalid role selected.' }
    }

    const supabase = createAdminClient()

    const { data: authUserResponse, error: authUserError } = await supabase.auth.admin.getUserById(userId)

    if (authUserError || !authUserResponse?.user) {
      return { success: false, error: authUserError?.message || 'User not found in authentication records.' }
    }

    const authUser = authUserResponse.user
    // Best-effort sync to public.users if legacy schema supports role.
    const { error: profileSyncError } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)

    if (profileSyncError && !isMissingColumnError(profileSyncError)) {
      console.error('Update Role Error:', profileSyncError)
      return { success: false, error: profileSyncError.message }
    }

    // Also update auth metadata for consistency
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...authUser.user_metadata,
        role: newRole
      },
      app_metadata: {
        ...authUser.app_metadata,
        role: newRole
      }
    })

    if (authUpdateError) {
      console.error('Update Auth Metadata Error:', authUpdateError)
      return { success: false, error: authUpdateError.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: unknown) {
    return {
      success: false,
      error: mapAdminActionError(error, 'An unexpected error occurred while updating the role.')
    }
  }
}
