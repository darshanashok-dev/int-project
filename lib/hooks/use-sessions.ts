import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        return [
          {
            id: 'mock-sess-1',
            title: 'Q2 Roadmap & Go-to-Market Strategy',
            scheduled_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            duration_minutes: 60,
            notes: 'Discussed their B2B sales pipeline expansion. Advised focusing on mid-market SaaS first before moving into the enterprise sector. Team is aligned on Product Hunt launch timeline.',
            startups: { id: '1', name: 'AeroDynamics' }
          },
          {
            id: 'mock-sess-2',
            title: 'Technical Architecture & Scale Review',
            scheduled_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            duration_minutes: 45,
            notes: 'Reviewed their current PostgreSQL scaling limits. Recommended migrating heavy analytics logging to a dedicated OLAP store to keep the primary DB response times fast.',
            startups: { id: '3', name: 'CloudScale' }
          },
          {
            id: 'mock-sess-3',
            title: 'Pitch Deck Critique & Series A Narrative',
            scheduled_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            duration_minutes: 90,
            notes: 'Deep dive into slide flow. The product narrative is extremely strong, but their market size (TAM) slides need more precise bottom-up calculation to satisfy next-round investors.',
            startups: { id: '2', name: 'BioSynth' }
          }
        ]
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data: mentorData } = await (supabase.from('mentors') as any)
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      
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
      
      if (!data || data.length === 0) {
        return [
          {
            id: 'mock-sess-1',
            title: 'Q2 Roadmap & Go-to-Market Strategy',
            scheduled_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            duration_minutes: 60,
            notes: 'Discussed their B2B sales pipeline expansion. Advised focusing on mid-market SaaS first before moving into the enterprise sector. Team is aligned on Product Hunt launch timeline.',
            startups: { id: '1', name: 'AeroDynamics' }
          },
          {
            id: 'mock-sess-2',
            title: 'Technical Architecture & Scale Review',
            scheduled_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            duration_minutes: 45,
            notes: 'Reviewed their current PostgreSQL scaling limits. Recommended migrating heavy analytics logging to a dedicated OLAP store to keep the primary DB response times fast.',
            startups: { id: '3', name: 'CloudScale' }
          },
          {
            id: 'mock-sess-3',
            title: 'Pitch Deck Critique & Series A Narrative',
            scheduled_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            duration_minutes: 90,
            notes: 'Deep dive into slide flow. The product narrative is extremely strong, but their market size (TAM) slides need more precise bottom-up calculation to satisfy next-round investors.',
            startups: { id: '2', name: 'BioSynth' }
          }
        ]
      }
      
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
        .maybeSingle()
      
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
