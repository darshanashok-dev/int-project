import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { InvestorStartupDetail } from '@/components/portfolio/InvestorStartupDetail'

export default async function InvestorStartupDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (err) {
    console.error('Auth check failed:', err)
  }

  if (!user) {
    redirect('/login')
  }

  const rawRole = (user.user_metadata?.role || user.app_metadata?.role || '').toLowerCase()
  if (!rawRole.includes('investor') && !rawRole.includes('admin')) {
    redirect('/login')
  }

  // Fetch startup public fields only — no founder_id, email, or full_name
  const { data: startup, error: startupError } = await supabase
    .from('startups')
    .select(
      'id, name, sector, stage, status, elevator_pitch, target_market, competitive_advantage, revenue_model, created_at, active_round_name, funding_goal, round_status'
    )
    .eq('id', params.id)
    .single()

  if (startupError || !startup) {
    notFound()
  }

  // Fetch the most recent application_scores record for this startup
  const { data: latestAdminScore } = await supabase
    .from('application_scores')
    .select('team_score, market_score, traction_score, uniqueness_score, overall_comment, scored_at')
    .eq('startup_id', params.id)
    .order('scored_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fetch the investor's existing interest record for this startup
  const { data: initialInterest } = await supabase
    .from('investor_interests')
    .select('signal_type, note')
    .eq('investor_id', user.id)
    .eq('startup_id', params.id)
    .maybeSingle()

  return (
    <InvestorStartupDetail
      startup={startup}
      latestAdminScore={latestAdminScore ?? null}
      initialInterest={initialInterest ?? null}
      investorId={user.id}
    />
  )
}
