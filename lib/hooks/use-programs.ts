import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'
import type { ProgramFormData } from '@/lib/validations/program'

export function usePrograms() {
  return useQuery({
    queryKey: ['programs', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs' as any)
        .select('id, name, cohort, start_date, end_date, demo_day_date, max_startups')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useProgram(id: string) {
  return useQuery({
    queryKey: ['programs', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs' as any)
        .select(`
          id, name, cohort, start_date, end_date, demo_day_date, max_startups,
          applications (
            id, status, 
            startups (id, name, sector)
          )
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ProgramFormData) => {
      const { error } = await (supabase.from('programs') as any).insert(data)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs', 'list'] })
    },
  })
}

export function useUpdateProgram(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ProgramFormData>) => {
      const { error } = await (supabase.from('programs') as any).update(data).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['programs', 'detail', id] })
    },
  })
}
