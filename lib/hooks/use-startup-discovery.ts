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
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        return [
          { id: '1', name: 'AeroDynamics', sector: 'Aerospace', stage: 'seed', status: 'active', strategy_summary: 'Next generation of drone logistics.', target_market: 'B2B', revenue_model: 'SaaS', created_at: new Date().toISOString() },
          { id: '2', name: 'BioSynth', sector: 'Healthtech', stage: 'series-a', status: 'active', strategy_summary: 'Synthetic biology solutions.', target_market: 'Enterprise', revenue_model: 'Licensing', created_at: new Date().toISOString() },
          { id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'seed', status: 'active', strategy_summary: 'Optimized database scaling.', target_market: 'B2B Developers', revenue_model: 'Usage-based', created_at: new Date().toISOString() }
        ]
      }

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

      if (!data || data.length === 0) {
        return [
          { id: '1', name: 'AeroDynamics', sector: 'Aerospace', stage: 'seed', status: 'active', strategy_summary: 'Next generation of drone logistics.', target_market: 'B2B', revenue_model: 'SaaS', created_at: new Date().toISOString() },
          { id: '2', name: 'BioSynth', sector: 'Healthtech', stage: 'series-a', status: 'active', strategy_summary: 'Synthetic biology solutions.', target_market: 'Enterprise', revenue_model: 'Licensing', created_at: new Date().toISOString() },
          { id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'seed', status: 'active', strategy_summary: 'Optimized database scaling.', target_market: 'B2B Developers', revenue_model: 'Usage-based', created_at: new Date().toISOString() }
        ]
      }

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
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
