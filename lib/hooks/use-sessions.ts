import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data: mentorData } = await (supabase.from('mentors') as any)
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      const mentor = mentorData as any

      if (!mentor) return []

      const { data, error } = await (supabase.from('sessions') as any)
        .select(`
          *,
          startups (id, name)
        `)
        .eq('mentor_id', mentor.id)
        .order('scheduled_at', { ascending: false })
      
      if (error) throw error
      return data
    },
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: mentorData } = await (supabase.from('mentors') as any)
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      const mentor = mentorData as any
      
      if (!mentor) throw new Error('Mentor profile not found')

      const { error } = await (supabase.from('sessions') as any)
        .insert({ ...data, mentor_id: mentor.id })
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}
