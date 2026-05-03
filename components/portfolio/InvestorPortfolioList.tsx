'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Building2, Layers, Activity, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type StartupRow = {
  id: string
  name: string
  sector: string | null
  stage: string | null
  status: string | null
  elevator_pitch: string | null
}

interface InvestorPortfolioListProps {
  initialStartups: StartupRow[]
}

// ---------------------------------------------------------------------------
// Rich mock data — used as fallback when initialStartups is empty
// ---------------------------------------------------------------------------
const MOCK_STARTUPS: StartupRow[] = [
  {
    id: 'mock-1',
    name: 'NovaPay',
    sector: 'FinTech',
    stage: 'Seed',
    status: 'active',
    elevator_pitch: 'Instant cross-border payments for emerging markets using stablecoin rails.',
  },
  {
    id: 'mock-2',
    name: 'MediScan AI',
    sector: 'HealthTech',
    stage: 'Series A',
    status: 'active',
    elevator_pitch: 'AI-powered diagnostic imaging that detects anomalies 40% faster than radiologists.',
  },
  {
    id: 'mock-3',
    name: 'LearnLoop',
    sector: 'EdTech',
    stage: 'Pre-Seed',
    status: 'pending',
    elevator_pitch: 'Adaptive micro-learning platform that personalises curricula for K-12 students.',
  },
  {
    id: 'mock-4',
    name: 'GreenGrid',
    sector: 'CleanTech',
    stage: 'Seed',
    status: 'waitlisted',
    elevator_pitch: 'Peer-to-peer renewable energy trading platform for residential solar owners.',
  },
  {
    id: 'mock-5',
    name: 'FleetOps',
    sector: 'SaaS',
    stage: 'Series A',
    status: 'active',
    elevator_pitch: 'Fleet management SaaS that reduces fuel costs by 22% through predictive routing.',
  },
  {
    id: 'mock-6',
    name: 'HarvestIQ',
    sector: 'AgriTech',
    stage: 'Pre-Seed',
    status: 'rejected',
    elevator_pitch: 'IoT soil sensors and ML models that optimise irrigation for smallholder farmers.',
  },
  {
    id: 'mock-7',
    name: 'CipherVault',
    sector: 'FinTech',
    stage: 'Series B',
    status: 'active',
    elevator_pitch: 'Zero-knowledge proof identity layer for compliant DeFi onboarding.',
  },
  {
    id: 'mock-8',
    name: 'CareConnect',
    sector: 'HealthTech',
    stage: 'Seed',
    status: 'pending',
    elevator_pitch: 'Telehealth platform connecting rural patients with specialist physicians in real time.',
  },
]

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active:     { bg: 'bg-emerald-500/10',  text: 'text-emerald-700', dot: 'bg-emerald-500/100' },
  pending:    { bg: 'bg-amber-500/10',    text: 'text-amber-700',   dot: 'bg-amber-500/100'   },
  waitlisted: { bg: 'bg-blue-500/10',     text: 'text-blue-700',    dot: 'bg-blue-500/100'    },
  rejected:   { bg: 'bg-rose-500/10',     text: 'text-rose-700',    dot: 'bg-rose-500/100'    },
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status?.toLowerCase() ?? ''
  const styles = STATUS_STYLES[s] ?? { bg: 'bg-secondary', text: 'text-slate-600', dot: 'bg-slate-400' }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Unknown'}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Filter select
// ---------------------------------------------------------------------------
interface FilterSelectProps {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  icon: React.ReactNode
}

function FilterSelect({ value, onChange, options, placeholder, icon }: FilterSelectProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-border/60 bg-card pl-9 pr-8 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted-foreground">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function InvestorPortfolioList({ initialStartups }: InvestorPortfolioListProps) {
  const router = useRouter()

  // Use mock data when no real data is provided
  const sourceData = initialStartups.length > 0 ? initialStartups : MOCK_STARTUPS

  // ── Filter state ───────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]   = useState('')
  const [sectorFilter, setSectorFilter] = useState('')
  const [stageFilter, setStageFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // ── Derive unique filter options from data ─────────────────────────────────
  const sectors = useMemo(
    () => Array.from(new Set(sourceData.map((s) => s.sector).filter(Boolean) as string[])).sort(),
    [sourceData],
  )
  const stages = useMemo(
    () => Array.from(new Set(sourceData.map((s) => s.stage).filter(Boolean) as string[])).sort(),
    [sourceData],
  )
  const statuses = useMemo(
    () => Array.from(new Set(sourceData.map((s) => s.status).filter(Boolean) as string[])).sort(),
    [sourceData],
  )

  // ── Client-side filtering ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return sourceData.filter((startup) => {
      if (q && !startup.name.toLowerCase().includes(q)) return false
      if (sectorFilter && startup.sector !== sectorFilter) return false
      if (stageFilter && startup.stage !== stageFilter) return false
      if (statusFilter && startup.status !== statusFilter) return false
      return true
    })
  }, [sourceData, searchQuery, sectorFilter, stageFilter, statusFilter])

  const hasActiveFilters = searchQuery || sectorFilter || stageFilter || statusFilter

  function clearFilters() {
    setSearchQuery('')
    setSectorFilter('')
    setStageFilter('')
    setStatusFilter('')
  }

  function handleRowClick(id: string) {
    router.push(`/investor/portfolio/${id}`)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Filters bar */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name…"
              aria-label="Search startups by name"
              className="h-10 w-full rounded-xl border border-border/60 bg-card pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Sector */}
          <div className="w-full md:w-44">
            <FilterSelect
              value={sectorFilter}
              onChange={setSectorFilter}
              options={sectors}
              placeholder="All Sectors"
              icon={<Building2 className="h-4 w-4" />}
            />
          </div>

          {/* Stage */}
          <div className="w-full md:w-40">
            <FilterSelect
              value={stageFilter}
              onChange={setStageFilter}
              options={stages}
              placeholder="All Stages"
              icon={<Layers className="h-4 w-4" />}
            />
          </div>

          {/* Status */}
          <div className="w-full md:w-40">
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statuses}
              placeholder="All Statuses"
              icon={<Activity className="h-4 w-4" />}
            />
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Result count */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>
            Showing{' '}
            <span className="font-semibold text-foreground">{filtered.length}</span>
            {' '}of{' '}
            <span className="font-semibold text-foreground">{sourceData.length}</span>
            {' '}startups
          </span>
        </div>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <ul role="list" className="divide-y divide-border/50">
            {filtered.map((startup) => (
              <li key={startup.id}>
                <button
                  type="button"
                  onClick={() => handleRowClick(startup.id)}
                  className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-secondary/80 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                  aria-label={`View details for ${startup.name}`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border/50 flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors shrink-0">
                    {startup.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + pitch */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-indigo-600 transition-colors truncate">
                      {startup.name}
                    </p>
                    {startup.elevator_pitch && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {startup.elevator_pitch}
                      </p>
                    )}
                  </div>

                  {/* Sector */}
                  <div className="hidden sm:block w-28 shrink-0">
                    <span className="text-xs font-medium text-muted-foreground truncate block">
                      {startup.sector ?? '—'}
                    </span>
                  </div>

                  {/* Stage */}
                  <div className="hidden md:block w-24 shrink-0">
                    <span className="text-xs font-medium text-muted-foreground truncate block">
                      {startup.stage ?? '—'}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="shrink-0">
                    <StatusBadge status={startup.status} />
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center shadow-sm">
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No results found</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            No startups match your current filters. Try adjusting your search or clearing the filters.
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-5 rounded-xl"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
