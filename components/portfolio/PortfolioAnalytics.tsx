'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { usePortfolioAnalytics } from '@/lib/hooks/use-portfolio-analytics'
import type {
  SectorDistributionItem,
  StageDistributionItem,
} from '@/lib/hooks/use-portfolio-analytics'

// ---------------------------------------------------------------------------
// Rich mock data — used as fallback when the DB returns empty arrays
// ---------------------------------------------------------------------------
const MOCK_SECTOR_DISTRIBUTION: SectorDistributionItem[] = [
  { sector: 'FinTech', count: 8 },
  { sector: 'HealthTech', count: 6 },
  { sector: 'EdTech', count: 5 },
  { sector: 'CleanTech', count: 4 },
  { sector: 'SaaS', count: 7 },
  { sector: 'AgriTech', count: 3 },
]

const MOCK_STAGE_DISTRIBUTION: StageDistributionItem[] = [
  { stage: 'Pre-Seed', count: 9 },
  { stage: 'Seed', count: 12 },
  { stage: 'Series A', count: 7 },
  { stage: 'Series B', count: 4 },
  { stage: 'Growth', count: 2 },
]

const MOCK_STATUS_COUNTS = {
  pending: 7,
  active: 18,
  waitlisted: 5,
  rejected: 4,
}

const MOCK_MY_INTERESTS_COUNT = 6

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface PortfolioAnalyticsProps {
  role: 'admin' | 'investor'
  investorId?: string
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stat cards row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm"
          >
            <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
            <div className="h-8 w-12 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      {/* Chart placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
          >
            <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
            <div className="h-[250px] bg-secondary rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
interface StatCardProps {
  label: string
  value: number
  colorClass: string
  bgClass: string
}

function StatCard({ label, value, colorClass, bgClass }: StatCardProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
      <div className={`mt-3 h-1.5 w-10 rounded-full ${bgClass}`} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function PortfolioAnalytics({ role, investorId }: PortfolioAnalyticsProps) {
  const {
    statusCounts,
    sectorDistribution,
    stageDistribution,
    myInterestsCount,
    isLoading,
    error,
    refetch,
  } = usePortfolioAnalytics(role, investorId)

  // Apply mock data fallback when DB returns empty arrays
  const effectiveSectors =
    sectorDistribution.length > 0 ? sectorDistribution : MOCK_SECTOR_DISTRIBUTION
  const effectiveStages =
    stageDistribution.length > 0 ? stageDistribution : MOCK_STAGE_DISTRIBUTION
  const effectiveStatusCounts =
    Object.values(statusCounts).some((v) => v > 0)
      ? statusCounts
      : MOCK_STATUS_COUNTS
  const effectiveMyInterests =
    myInterestsCount > 0 ? myInterestsCount : MOCK_MY_INTERESTS_COUNT

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section aria-label="Portfolio analytics loading">
        <h2 className="text-xl font-bold text-foreground mb-4">Portfolio Analytics</h2>
        <AnalyticsSkeleton />
      </section>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <section aria-label="Portfolio analytics error">
        <h2 className="text-xl font-bold text-foreground mb-4">Portfolio Analytics</h2>
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load analytics</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4 flex-wrap">
            <span>{error.message ?? 'An unexpected error occurred.'}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="shrink-0 gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section aria-label="Portfolio analytics">
      <h2 className="text-xl font-bold text-foreground mb-4">Portfolio Analytics</h2>

      {/* Status stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Pending"
          value={effectiveStatusCounts.pending}
          colorClass="text-amber-600"
          bgClass="bg-amber-400"
        />
        <StatCard
          label="Active"
          value={effectiveStatusCounts.active}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-400"
        />
        <StatCard
          label="Waitlisted"
          value={effectiveStatusCounts.waitlisted}
          colorClass="text-blue-600"
          bgClass="bg-blue-400"
        />
        <StatCard
          label="Rejected"
          value={effectiveStatusCounts.rejected}
          colorClass="text-rose-600"
          bgClass="bg-rose-400"
        />
      </div>

      {/* Investor-only: My Interests count card */}
      {role === 'investor' && (
        <div className="mb-6">
          <div className="bg-indigo-500/10 border border-indigo-100 rounded-2xl p-5 shadow-sm inline-block min-w-[180px]">
            <p className="text-sm font-medium text-indigo-700">My Interests</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{effectiveMyInterests}</p>
            <p className="text-xs text-indigo-500 mt-1">Interested &amp; committed</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sector distribution */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Sector Distribution</h3>
          <div
            aria-label="Sector distribution bar chart"
            role="img"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={effectiveSectors}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis
                  dataKey="sector"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stage distribution */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Stage Distribution</h3>
          <div
            aria-label="Stage distribution bar chart"
            role="img"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={effectiveStages}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
