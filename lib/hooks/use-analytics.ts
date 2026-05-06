import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

export function useMilestoneStats() {
  return useQuery({
    queryKey: ['analytics', 'milestones'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('milestones') as any)
        .select('id, status')
      if (error) throw error
      
      const counts: Record<string, number> = { completed: 0, in_progress: 0, pending: 0 }
      data?.forEach((m: any) => {
        const statusKey = m.status === 'in-progress' ? 'in_progress' : m.status
        if (counts[statusKey] !== undefined) {
          counts[statusKey]++
        }
      })
      return [
        { name: 'Completed', value: counts.completed },
        { name: 'In Progress', value: counts.in_progress },
        { name: 'Pending', value: counts.pending }
      ]
    },
    staleTime: 30_000,
  })
}

export function useFundingByStartup() {
  return useQuery({
    queryKey: ['analytics', 'funding'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('funding') as any)
        .select('id, amount, startups(name)')
      if (error) throw error

      const fundingByStartupMap: Record<string, number> = {}
      data?.forEach((f: any) => {
        const startupName = f.startups?.name || 'Unknown'
        const amt = Number(f.amount || 0)
        fundingByStartupMap[startupName] = (fundingByStartupMap[startupName] || 0) + amt
      })

      return Object.entries(fundingByStartupMap).map(([startup_name, total_amount]) => ({
        startup_name,
        total_amount,
      }))
    },
    staleTime: 30_000,
  })
}

export function useSessionEngagement() {
  return useQuery({
    queryKey: ['analytics', 'sessions'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('sessions') as any)
        .select('id, rating, startups(name)')
      if (error) throw error

      const statsMap: Record<string, { count: number, totalRating: number }> = {}
      data?.forEach((s: any) => {
        const startupName = s.startups?.name || 'Unknown'
        if (!statsMap[startupName]) {
          statsMap[startupName] = { count: 0, totalRating: 0 }
        }
        statsMap[startupName].count++
        statsMap[startupName].totalRating += Number(s.rating || 0)
      })

      return Object.entries(statsMap).map(([startup_name, stats]) => ({
        startup_name,
        session_count: stats.count,
        avg_rating: stats.count > 0 ? Number((stats.totalRating / stats.count).toFixed(1)) : 0
      }))
    },
    staleTime: 30_000,
  })
}
