'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Layers,
  Activity,
  Target,
  Lightbulb,
  DollarSign,
  TrendingUp,
  Star,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  BookmarkX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { upsertInterestAction, removeInterestAction } from '@/lib/actions/investor-interest'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface InvestorStartupDetailProps {
  startup: {
    id: string
    name: string
    sector: string | null
    stage: string | null
    status: string | null
    elevator_pitch: string | null
    target_market: string | null
    competitive_advantage: string | null
    revenue_model: string | null
    created_at: string | null
    active_round_name: string | null
    funding_goal: number | null
    round_status: string | null
  }
  latestAdminScore: {
    team_score: number | null
    market_score: number | null
    traction_score: number | null
    uniqueness_score: number | null
    overall_comment: string | null
    scored_at: string | null
  } | null
  initialInterest: {
    signal_type: string | null
    note: string | null
  } | null
  investorId: string
}

type SignalType = 'watching' | 'interested' | 'committed'

// ---------------------------------------------------------------------------
// Helpers
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground leading-relaxed">{value}</p>
      </div>
    </div>
  )
}

function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <span className="text-sm text-muted-foreground">—</span>
  const pct = (score / 10) * 100
  const color =
    score >= 8 ? 'bg-emerald-500/100' :
    score >= 5 ? 'bg-amber-500/100' :
    'bg-rose-500/100'
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-foreground w-8 shrink-0">{score}/10</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function InvestorStartupDetail({
  startup,
  latestAdminScore,
  initialInterest,
}: InvestorStartupDetailProps) {
  // ── Interest form state ────────────────────────────────────────────────────
  const [signalType, setSignalType] = useState<SignalType>(
    (initialInterest?.signal_type as SignalType) ?? 'watching'
  )
  const [note, setNote] = useState(initialInterest?.note ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [hasInterest, setHasInterest] = useState(initialInterest !== null)

  // ── Handlers ───────────────────────────────────────────────────────────────
  async function handleSave() {
    setIsSaving(true)
    setFeedback(null)
    try {
      const result = await upsertInterestAction({ startupId: startup.id, signalType, note: note || undefined })
      if (result.success) {
        setHasInterest(true)
        setFeedback({ type: 'success', message: 'Interest saved successfully.' })
      } else {
        setFeedback({ type: 'error', message: result.error ?? 'Failed to save interest.' })
      }
    } catch {
      setFeedback({ type: 'error', message: 'An unexpected error occurred.' })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRemove() {
    setIsRemoving(true)
    setFeedback(null)
    try {
      const result = await removeInterestAction({ startupId: startup.id })
      if (result.success) {
        setHasInterest(false)
        setSignalType('watching')
        setNote('')
        setFeedback({ type: 'success', message: 'Interest removed.' })
      } else {
        setFeedback({ type: 'error', message: result.error ?? 'Failed to remove interest.' })
      }
    } catch {
      setFeedback({ type: 'error', message: 'An unexpected error occurred.' })
    } finally {
      setIsRemoving(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/investor/portfolio"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>
      </div>

      {/* Header */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary border border-border/50 flex items-center justify-center text-xl font-black text-slate-400 shrink-0">
              {startup.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{startup.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {startup.sector && (
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {startup.sector}
                  </span>
                )}
                {startup.stage && (
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {startup.stage}
                  </span>
                )}
                <StatusBadge status={startup.status} />
              </div>
            </div>
          </div>
          {startup.created_at && (
            <p className="text-xs text-muted-foreground font-medium shrink-0">
              Listed {new Date(startup.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>

        {startup.elevator_pitch && (
          <p className="mt-4 text-sm text-foreground leading-relaxed border-t border-border/50 pt-4">
            {startup.elevator_pitch}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: profile details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Public profile */}
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">
              Startup Profile
            </h2>
            <div className="space-y-5">
              <InfoRow
                icon={<Target className="w-4 h-4" />}
                label="Target Market"
                value={startup.target_market}
              />
              <InfoRow
                icon={<Lightbulb className="w-4 h-4" />}
                label="Competitive Advantage"
                value={startup.competitive_advantage}
              />
              <InfoRow
                icon={<DollarSign className="w-4 h-4" />}
                label="Revenue Model"
                value={startup.revenue_model}
              />
            </div>
          </div>

          {/* Funding round */}
          {(startup.active_round_name || startup.funding_goal || startup.round_status) && (
            <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">
                Active Funding Round
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {startup.active_round_name && (
                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Round
                    </p>
                    <p className="text-sm font-bold text-foreground">{startup.active_round_name}</p>
                  </div>
                )}
                {startup.funding_goal !== null && (
                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Funding Goal
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(startup.funding_goal)}
                    </p>
                  </div>
                )}
                {startup.round_status && (
                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Round Status
                    </p>
                    <p className="text-sm font-bold text-foreground capitalize">{startup.round_status}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin scores — read-only, only when present */}
          {latestAdminScore !== null && (
            <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Admin Review Scores
                </h2>
                {latestAdminScore.scored_at && (
                  <span className="text-xs text-muted-foreground font-medium">
                    Scored {new Date(latestAdminScore.scored_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Team',       score: latestAdminScore.team_score       },
                    { label: 'Market',     score: latestAdminScore.market_score     },
                    { label: 'Traction',   score: latestAdminScore.traction_score   },
                    { label: 'Uniqueness', score: latestAdminScore.uniqueness_score },
                  ].map(({ label, score }) => (
                    <div key={label} className="bg-secondary rounded-xl p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {label}
                      </p>
                      <ScoreBar score={score} />
                    </div>
                  ))}
                </div>

                {latestAdminScore.overall_comment && (
                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Reviewer Comment
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{latestAdminScore.overall_comment}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column: interest tracking */}
        <div className="space-y-4">
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Track Interest
              </h2>
            </div>

            <div className="space-y-4">
              {/* Signal type selector */}
              <div>
                <label
                  htmlFor="signal-type"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
                >
                  Signal Type
                </label>
                <div className="relative">
                  <select
                    id="signal-type"
                    value={signalType}
                    onChange={(e) => setSignalType(e.target.value as SignalType)}
                    className="h-10 w-full appearance-none rounded-xl border border-border/60 bg-card px-3 pr-8 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                    aria-label="Select signal type"
                  >
                    <option value="watching">Watching</option>
                    <option value="interested">Interested</option>
                    <option value="committed">Committed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted-foreground">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Note textarea */}
              <div>
                <label
                  htmlFor="interest-note"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
                >
                  Note <span className="normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  id="interest-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a private note about this startup…"
                  rows={4}
                  className="w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors resize-none"
                />
              </div>

              {/* Feedback message */}
              {feedback && (
                <div
                  className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    feedback.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-700'
                      : 'bg-rose-500/10 text-rose-700'
                  }`}
                  role="alert"
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  )}
                  {feedback.message}
                </div>
              )}

              {/* Save button */}
              <Button
                onClick={handleSave}
                disabled={isSaving || isRemoving}
                className="w-full rounded-xl font-semibold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save Interest
                  </>
                )}
              </Button>

              {/* Remove button — only shown when interest exists */}
              {hasInterest && (
                <Button
                  variant="outline"
                  onClick={handleRemove}
                  disabled={isSaving || isRemoving}
                  className="w-full rounded-xl font-semibold text-rose-600 border-rose-200 hover:bg-rose-500/10 hover:text-rose-700 hover:border-rose-300"
                >
                  {isRemoving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Removing…
                    </>
                  ) : (
                    <>
                      <BookmarkX className="w-4 h-4 mr-2" />
                      Remove Interest
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              At a Glance
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sector</p>
                  <p className="text-sm font-medium text-foreground">{startup.sector ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Stage</p>
                  <p className="text-sm font-medium text-foreground">{startup.stage ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
                  <p className="text-sm font-medium text-foreground capitalize">{startup.status ?? '—'}</p>
                </div>
              </div>
              {startup.active_round_name && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Round</p>
                    <p className="text-sm font-medium text-foreground">{startup.active_round_name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
