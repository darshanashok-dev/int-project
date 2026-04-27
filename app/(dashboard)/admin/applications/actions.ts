'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateApplicationStatusAction(applicationId: string, status: string) {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)

    if (error) {
      console.error('Update Application Error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/applications')
    return { success: true }
  } catch (error: unknown) {
    console.error('System Error:', error)
    return { success: false, error: 'An unexpected error occurred while updating application.' }
  }
}
