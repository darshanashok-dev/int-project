import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

interface Filters {
  sector?: string
  stage?: string
  search?: string
}

export function useStartupDiscovery(filters: Filters) {
  return useQuery({
    queryKey: ['startups', 'discovery', filters],
    queryFn: async () => {
      let query = supabase
        .from('startups')
        .select('id, name, sector, stage, status, strategy_summary, target_market, revenue_model, created_at')
        .eq('status', 'active')

      if (filters.sector && filters.sector !== 'all') {
        query = query.eq('sector', filters.sector)
      }
      if (filters.stage && filters.stage !== 'all') {
        query = query.eq('stage', filters.stage)
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useStartupDetail(id: string) {
  return useQuery({
    queryKey: ['startups', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startups')
        .select(`
          id, name, sector, stage, strategy_summary, target_market, revenue_model, competitive_advantage,
          milestones (id, title, status, due_date),
          funding (id, round, amount, source, date)
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
