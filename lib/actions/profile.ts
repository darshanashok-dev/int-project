'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: any) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await (supabase.from('users') as any)
    .update(data)
    .eq('id', user.id)

  if (error) throw error

  revalidatePath('/', 'layout')
}
