import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        // Return static mock data when in mock mode
        return [
          {
            id: 'mock-notif-1',
            type: 'info',
            title: 'Welcome to Polaris',
            body: 'Explore your incubation metrics and project tools.',
            link: '#',
            read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: 'mock-notif-2',
            type: 'success',
            title: 'Demo Mode Active',
            body: 'You are securely logged in using a simulated mock environment.',
            link: '#',
            read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          }
        ]
      }

      const { data, error } = await supabase
        .from('notifications' as any)
        .select('id, type, title, body, link, read, created_at')
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(20)
      if (error) throw error
      return data
    },
  })
}

export function useMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') return
      const { error } = await (supabase.from('notifications') as any)
        .update({ read: true })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await (supabase.from('notifications') as any)
        .update({ read: true })
        .eq('user_id', user.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

