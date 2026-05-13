import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'
import type { ProgramFormData } from '@/lib/validations/program'

export function usePrograms() {
  return useQuery({
    queryKey: ['programs', 'list'],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        return [
          {
            id: 'mock-prog-1',
            name: 'Global Fintech Accelerator',
            cohort: 'W26',
            start_date: '2026-01-15',
            end_date: '2026-04-30',
            demo_day_date: '2026-04-28',
            max_startups: 20
          },
          {
            id: 'mock-prog-2',
            name: 'Sustainability Launchpad',
            cohort: 'S26',
            start_date: '2026-05-01',
            end_date: '2026-10-31',
            demo_day_date: '2026-10-28',
            max_startups: 15
          },
          {
            id: 'mock-prog-3',
            name: 'AI & Deep Tech Venture Lab',
            cohort: 'F26',
            start_date: '2026-09-01',
            end_date: '2027-02-28',
            demo_day_date: '2027-02-25',
            max_startups: 25
          }
        ]
      }

      const { data, error } = await supabase
        .from('programs' as any)
        .select('id, name, cohort, start_date, end_date, demo_day_date, max_startups')
        .order('created_at', { ascending: false })
      if (error) throw error

      if (!data || data.length === 0) {
        return [
          {
            id: 'mock-prog-1',
            name: 'Global Fintech Accelerator',
            cohort: 'W26',
            start_date: '2026-01-15',
            end_date: '2026-04-30',
            demo_day_date: '2026-04-28',
            max_startups: 20
          },
          {
            id: 'mock-prog-2',
            name: 'Sustainability Launchpad',
            cohort: 'S26',
            start_date: '2026-05-01',
            end_date: '2026-10-31',
            demo_day_date: '2026-10-28',
            max_startups: 15
          },
          {
            id: 'mock-prog-3',
            name: 'AI & Deep Tech Venture Lab',
            cohort: 'F26',
            start_date: '2026-09-01',
            end_date: '2027-02-28',
            demo_day_date: '2027-02-25',
            max_startups: 25
          }
        ]
      }

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
        .maybeSingle()
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
