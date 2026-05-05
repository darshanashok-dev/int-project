import { createClient } from '@/lib/supabase/server'

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  link?: string
) {
  const supabase = createClient()
  const { error } = await (supabase.from('notifications') as any).insert({
    user_id: userId,
    type,
    title,
    body,
    link,
  })
  if (error) console.error('Error creating notification:', error)
}
