import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

export interface StatusCounts {
  pending: number
  active: number
  waitlisted: number
  rejected: number
}

export interface SectorDistributionItem {
  sector: string
  count: number
}

export interface StageDistributionItem {
  stage: string
  count: number
}

export interface PortfolioAnalyticsResult {
  statusCounts: StatusCounts
  sectorDistribution: SectorDistributionItem[]
  stageDistribution: StageDistributionItem[]
  myInterestsCount: number
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function usePortfolioAnalytics(
  role: 'admin' | 'investor',
  investorId?: string
): PortfolioAnalyticsResult {
  const queryClient = useQueryClient()
  const queryKey = ['portfolio-analytics', role, investorId]

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      // Query startups for status, sector, and stage — never select('*')
      const { data: startups, error: startupsError } = await (supabase
        .from('startups')
        .select('status, sector, stage') as any)

      if (startupsError) throw startupsError

      const rows = startups ?? []

      // Compute status breakdown counts
      const statusCounts: StatusCounts = {
        pending: 0,
        active: 0,
        waitlisted: 0,
        rejected: 0,
      }
      for (const row of rows) {
        const s = row.status as keyof StatusCounts
        if (s in statusCounts) {
          statusCounts[s]++
        }
      }

      // Compute sector distribution
      const sectorMap = new Map<string, number>()
      for (const row of rows) {
        if (row.sector) {
          sectorMap.set(row.sector, (sectorMap.get(row.sector) ?? 0) + 1)
        }
      }
      const sectorDistribution: SectorDistributionItem[] = Array.from(
        sectorMap.entries()
      ).map(([sector, count]) => ({ sector, count }))

      // Compute stage distribution
      const stageMap = new Map<string, number>()
      for (const row of rows) {
        if (row.stage) {
          stageMap.set(row.stage, (stageMap.get(row.stage) ?? 0) + 1)
        }
      }
      const stageDistribution: StageDistributionItem[] = Array.from(
        stageMap.entries()
      ).map(([stage, count]) => ({ stage, count }))

      // For investor role, query investor_interests filtered to interested/committed
      let myInterestsCount = 0
      if (role === 'investor' && investorId) {
        const { data: interests, error: interestsError } = await supabase
          .from('investor_interests')
          .select('startup_id')
          .eq('investor_id', investorId)
          .in('signal_type', ['interested', 'committed'])

        if (interestsError) throw interestsError
        myInterestsCount = interests?.length ?? 0
      }

      return { statusCounts, sectorDistribution, stageDistribution, myInterestsCount }
    },
    staleTime: 30_000,
  })

  // Subscribe to postgres_changes on the startups table for live updates
  useEffect(() => {
    const channel = supabase
      .channel('portfolio-analytics-startups')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'startups' },
        () => {
          queryClient.invalidateQueries({ queryKey })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, investorId])

  return {
    statusCounts: data?.statusCounts ?? {
      pending: 0,
      active: 0,
      waitlisted: 0,
      rejected: 0,
    },
    sectorDistribution: data?.sectorDistribution ?? [],
    stageDistribution: data?.stageDistribution ?? [],
    myInterestsCount: data?.myInterestsCount ?? 0,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
