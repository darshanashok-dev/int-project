import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

export function useMentors() {
  return useQuery({
    queryKey: ['mentors', 'list'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('mentors') as any)
        .select(`
          id, expertise, bio,
          users (full_name, email)
        `)
      if (error) throw error
      return data
    },
  })
}

export function useAssignMentor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ mentorId, startupId }: { mentorId: string; startupId: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await (supabase.from('mentor_assignments') as any)
        .insert({
          mentor_id: mentorId,
          startup_id: startupId,
          assigned_by: user.id
        })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['startups'] })
    },
  })
}
