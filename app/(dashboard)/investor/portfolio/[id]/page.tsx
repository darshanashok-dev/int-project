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

  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

  let startup: any = null
  let latestAdminScore: any = null
  let initialInterest: any = null

  if (isMock) {
    const mockStartupsMap: Record<string, any> = {
      '1': { 
        id: '1', name: 'AeroDynamics', sector: 'Aerospace', stage: 'seed', status: 'active', 
        elevator_pitch: 'Autonomous drone logistics for instant local delivery network hubs.',
        target_market: 'Regional Ecommerce Hubs', competitive_advantage: 'Advanced FAA-ready collision avoidance flight engines',
        revenue_model: 'Per-delivery operational fee sharing', created_at: new Date().toISOString(),
        active_round_name: 'Seed Plus', funding_goal: 50000000, round_status: 'active'
      },
      '2': { 
        id: '2', name: 'BioSynth', sector: 'Healthtech', stage: 'series-a', status: 'active', 
        elevator_pitch: 'Synthetic biology and genomics software accelerating therapeutics discovery.',
        target_market: 'Global Biotech Labs', competitive_advantage: 'Proprietary CRISPR simulation algorithms',
        revenue_model: 'Enterprise SaaS / IP Royalties', created_at: new Date().toISOString(),
        active_round_name: 'Series A', funding_goal: 150000000, round_status: 'active'
      },
      '3': { 
        id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'seed', status: 'active', 
        elevator_pitch: 'Automated cloud resource allocator scaling underlying container clusters effortlessly.',
        target_market: 'Mid-Market Enterprises', competitive_advantage: 'Zero-configuration smart agent instrumentation',
        revenue_model: 'Consumption-based pricing grid', created_at: new Date().toISOString(),
        active_round_name: 'Pre-Series A', funding_goal: 45000000, round_status: 'active'
      },
      '4': { 
        id: '4', name: 'DeFiX', sector: 'Fintech', stage: 'series-a', status: 'active', 
        elevator_pitch: 'Global unified liquidity protocols for decentralized institutional finance platforms.',
        target_market: 'Alternative Fund Managers', competitive_advantage: 'Multi-jurisdiction zero-knowledge compliance KYC bridges',
        revenue_model: 'Protocol swap fees / Custodial assets basis points', created_at: new Date().toISOString(),
        active_round_name: 'Series B Extension', funding_goal: 200000000, round_status: 'active'
      }
    }

    startup = mockStartupsMap[params.id] || mockStartupsMap['1']
    latestAdminScore = {
      team_score: 9, market_score: 8, traction_score: 9, uniqueness_score: 10, 
      overall_comment: 'Extremely strong founding team and technical defensibility.', scored_at: new Date().toISOString()
    }
    initialInterest = { signal_type: 'high', note: 'Strong candidate for next tranche.' }
  } else {
    // Fetch startup public fields only — no founder_id, email, or full_name
    const { data, error: startupError } = await supabase
      .from('startups')
      .select(
        'id, name, sector, stage, status, elevator_pitch, target_market, competitive_advantage, revenue_model, created_at, active_round_name, funding_goal, round_status'
      )
      .eq('id', params.id)
      .single()

    if (startupError || !data) {
      notFound()
    }
    startup = data

    // Fetch the most recent application_scores record for this startup
    const { data: score } = await supabase
      .from('application_scores')
      .select('team_score, market_score, traction_score, uniqueness_score, overall_comment, scored_at')
      .eq('startup_id', params.id)
      .order('scored_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    latestAdminScore = score

    // Fetch the investor's existing interest record for this startup
    const { data: interest } = await supabase
      .from('investor_interests')
      .select('signal_type, note')
      .eq('investor_id', user.id)
      .eq('startup_id', params.id)
      .maybeSingle()
    initialInterest = interest
  }

  return (
    <InvestorStartupDetail
      startup={startup}
      latestAdminScore={latestAdminScore ?? null}
      initialInterest={initialInterest ?? null}
      investorId={user.id}
    />
  )
}
