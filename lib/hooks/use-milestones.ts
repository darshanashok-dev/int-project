import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'
import type { MilestoneFormData } from '@/lib/validations/milestone'

export function useMilestones(startupId: string) {
  return useQuery({
    queryKey: ['milestones', startupId],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        return [
          {
            id: 'mock-mile-1',
            title: 'Incorporate Entity & Founder Agreements',
            due_date: '2026-01-15',
            status: 'completed',
            completed_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'mock-mile-2',
            title: 'Interactive High-Fidelity Prototype v1.0',
            due_date: '2026-03-30',
            status: 'completed',
            completed_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'mock-mile-3',
            title: 'Beta Program Launch with First 10 Users',
            due_date: '2026-06-15',
            status: 'pending',
            completed_at: null
          },
          {
            id: 'mock-mile-4',
            title: 'Finalize Pitch Materials for Demo Day',
            due_date: '2026-08-01',
            status: 'pending',
            completed_at: null
          }
        ]
      }

      const { data, error } = await (supabase.from('milestones') as any)
        .select('id, title, due_date, status, completed_at')
        .eq('startup_id', startupId)
        .order('due_date', { ascending: true })
      if (error) throw error

      if (!data || data.length === 0) {
        return [
          {
            id: 'mock-mile-1',
            title: 'Incorporate Entity & Founder Agreements',
            due_date: '2026-01-15',
            status: 'completed',
            completed_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'mock-mile-2',
            title: 'Interactive High-Fidelity Prototype v1.0',
            due_date: '2026-03-30',
            status: 'completed',
            completed_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'mock-mile-3',
            title: 'Beta Program Launch with First 10 Users',
            due_date: '2026-06-15',
            status: 'pending',
            completed_at: null
          },
          {
            id: 'mock-mile-4',
            title: 'Finalize Pitch Materials for Demo Day',
            due_date: '2026-08-01',
            status: 'pending',
            completed_at: null
          }
        ]
      }

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
