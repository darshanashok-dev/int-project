import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

export function useInvestorInterests(investorId: string) {
  return useQuery({
    queryKey: ['investor-interests', investorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investor_interests')
        .select('investor_id, startup_id, signal_type, note, startups(name, sector, stage)')
        .eq('investor_id', investorId)
      if (error) throw error
      return data
    },
    staleTime: 30_000,
  })
}
