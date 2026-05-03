'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMentorsAction() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('mentors')
    .select(`
      *,
      user:users(full_name, email)
    `)
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function assignMentorAction(startupId: string, mentorId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('mentor_assignments')
    .upsert({
      startup_id: startupId,
      mentor_id: mentorId,
      assigned_by: user.id,
      assigned_at: new Date().toISOString()
    } as any)

  if (error) return { success: false, error: error.message }
  
  revalidatePath(`/admin/startups/${startupId}`)
  return { success: true }
}

export async function removeMentorAssignmentAction(startupId: string, mentorId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('mentor_assignments')
    .delete()
    .match({ startup_id: startupId, mentor_id: mentorId })

  if (error) return { success: false, error: error.message }
  
  revalidatePath(`/admin/startups/${startupId}`)
  return { success: true }
}
