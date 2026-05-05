'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'
import { toast, Toaster } from 'sonner'

export function NotificationListener() {
  const queryClient = useQueryClient()

  useEffect(() => {
    let channel: any

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel(`public:notifications:user_id=eq.${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotification = payload.new as any
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            toast(newNotification.title, {
              description: newNotification.body,
            })
          }
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [queryClient])

  return <Toaster position="top-right" expand={false} richColors />
}
