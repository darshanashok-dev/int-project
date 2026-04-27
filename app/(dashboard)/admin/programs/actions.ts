'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createProgramAction(formData: { 
  name: string, 
  cohort: string, 
  start_date: string, 
  end_date: string,
  max_startups: number 
}) {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('programs')
      .insert([
        {
          name: formData.name,
          cohort: formData.cohort,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          max_startups: formData.max_startups
        }
      ])

    if (error) {
      console.error('Create Program Error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/programs')
    return { success: true }
  } catch (error: unknown) {
    console.error('System Error:', error)
    return { success: false, error: 'An unexpected error occurred while creating the program.' }
  }
}
