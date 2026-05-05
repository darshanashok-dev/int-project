import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'
import type { MilestoneFormData } from '@/lib/validations/milestone'

export function useMilestones(startupId: string) {
  return useQuery({
    queryKey: ['milestones', startupId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('milestones') as any)
        .select('id, title, due_date, status, completed_at')
        .eq('startup_id', startupId)
        .order('due_date', { ascending: true })
      if (error) throw error
      return data
    },
    staleTime: 30_000,
    enabled: !!startupId,
  })
}

export function useCreateMilestone(startupId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: MilestoneFormData) => {
      const { error } = await (supabase.from('milestones') as any)
        .insert({ ...data, startup_id: startupId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', startupId] })
    },
  })
}

export function useUpdateMilestone(startupId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await (supabase.from('milestones') as any)
        .update(data)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', startupId] })
    },
  })
}
