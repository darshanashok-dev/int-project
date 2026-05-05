import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'
import type { ScoreFormData } from '@/lib/validations/application'

export function useApplications() {
  return useQuery({
    queryKey: ['applications', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications' as any)
        .select(`
          id, status, submitted_at,
          startups (id, name, sector)
        `)
        .order('submitted_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['applications', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications' as any)
        .select(`
          id, status, submitted_at,
          startups (id, name, sector, stage, strategy_summary, founder_id, users (email)),
          application_scores (id, team_score, market_score, traction_score, uniqueness_score, overall_comment)
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useUpdateApplicationStatus(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (status: string) => {
      const { error } = await (supabase.from('applications') as any)
        .update({ status })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useScoreApplication(applicationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ScoreFormData) => {
      const { error: scoreError } = await (supabase.from('application_scores') as any)
        .insert({ ...data, application_id: applicationId })
      if (scoreError) throw scoreError

      const { error: statusError } = await (supabase.from('applications') as any)
        .update({ status: 'scored' })
        .eq('id', applicationId)
      if (statusError) throw statusError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { program_id: string; startup_id: string }) => {
      const { error } = await (supabase.from('applications') as any)
        .insert({
          ...data,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
