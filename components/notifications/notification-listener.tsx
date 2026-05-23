'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'
import { toast, Toaster } from 'sonner'

export function NotificationListener() {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') return

    let channel: ReturnType<typeof supabase.channel> | null = null
    let cancelled = false

    const setupSubscription = async () => {
      try {
        // Use getSession() — reads from cache, no auth-lock network race
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user || cancelled) return

        const userId = session.user.id

        channel = supabase
          .channel(`public:notifications:user_id=eq.${userId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${userId}`,
            },
            (payload) => {
              const newNotification = payload.new as { title: string; body: string }
              queryClient.invalidateQueries({ queryKey: ['notifications'] })
              toast(newNotification.title, { description: newNotification.body })
            }
          )
          .subscribe()
      } catch (err: unknown) {
        // Swallow auth lock errors thrown when the component unmounts
        // mid-flight (e.g. "lock stolen" / AbortError)
        const isLockError =
          err instanceof Error &&
          (err.name === 'AbortError' || err.message.includes('lock'))
        if (!isLockError) {
          console.error('[NotificationListener]', err)
        }
      }
    }

    setupSubscription()

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [queryClient])

  return <Toaster position="top-right" expand={false} richColors />
}
