import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

export function useMyStartup() {
  return useQuery({
    queryKey: ['my-startup'],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        return {
          id: '1',
          name: 'AeroDynamics',
          sector: 'Aerospace',
          stage: 'seed',
          founder_id: 'mock-id'
        }
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('startups' as any)
        .select('*')
        .eq('founder_id', user.id)
        .maybeSingle()
      
      if (error && error.code !== 'PGRST116') throw error

      if (!data) {
        return {
          id: '1',
          name: 'AeroDynamics',
          sector: 'Aerospace',
          stage: 'seed',
          founder_id: 'mock-id'
        }
      }

      return data
    },
  })
}
