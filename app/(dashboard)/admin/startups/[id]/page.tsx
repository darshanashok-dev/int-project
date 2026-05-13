import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Building2, 
  Mail,
  User,
  Target,
  Rocket,
  Zap,
  Briefcase,
  Calendar,
  Coins,
  GraduationCap
} from 'lucide-react'
import StartupReviewActions from './StartupReviewActions'
import { getMentorsAction } from '@/lib/actions/mentors'

export default async function StartupReviewPage({ params }: { params: { id: string } }) {
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
  if (!rawRole.includes('admin')) {
    redirect('/login')
  }
  
  const { data: startup } = await supabase
    .from('startups')
    .select(`
      *,
      founder:users(email, full_name)
    `)
    .eq('id', params.id)
    .maybeSingle()

  if (!startup) {
    notFound()
  }

  // Cast to expected shape to resolve strict Database type inference
  const startupData = startup as {
    id: string
    name: string
    sector: string | null
    stage: string | null
    status: string | null
    elevator_pitch: string | null
    strategy_summary: string | null
    target_market: string | null
    revenue_model: string | null
    competitive_advantage: string | null
    founded_date: string | null
    active_round_name: string | null
    funding_goal: number | null
    round_status: string | null
    founder: { email: string | null, full_name: string | null } | null
  }

  const { data: applications } = await supabase
    .from('applications')
    .select('id, submitted_at, status')
    .eq('startup_id', params.id)
    .order('submitted_at', { ascending: false })

  const applicationsData = applications as { id: string, submitted_at: string | null, status: string | null }[] | null

  const latestApplicationId = applicationsData?.[0]?.id ?? null

  type ReviewShape = {
    overall_comment: string | null
    scored_at: string | null
    reviewer_id: string | null
    team_score: number | null
    market_score: number | null
    traction_score: number | null
    uniqueness_score: number | null
  }

  let latestReview: ReviewShape | null = null

  if (latestApplicationId) {
    const { data: latestReviewData } = await supabase
      .from('application_scores')
      .select('overall_comment, scored_at, reviewer_id, team_score, market_score, traction_score, uniqueness_score')
      .eq('application_id', latestApplicationId)
      .order('scored_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    latestReview = latestReviewData as ReviewShape | null
  }

  // Fetch mentor assignments
  const { data: assignments } = await supabase
    .from('mentor_assignments')
    .select(`
      mentor_id,
      mentor:mentors(
        id,
        user:users(full_name, email)
      )
    `)
    .eq('startup_id', params.id)

  const assignedMentors = (assignments as any[])?.map(a => ({
    id: a.mentor.id,
    full_name: a.mentor.user.full_name,
    email: a.mentor.user.email
  })) || []

  // Fetch all available mentors for the assignment dropdown
  const mentorsResult = await getMentorsAction()
  const allMentors = mentorsResult.success ? (mentorsResult.data as any[]).map(m => ({
    id: m.id,
    full_name: m.user.full_name,
    email: m.user.email
  })) : []

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/startups"
          className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Review Venture</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Evaluate {startupData.name}&apos;s profile and trajectory</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content: Startup Context */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Identity & Core Info */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center font-bold text-3xl text-slate-400 shrink-0">
                {startupData.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{startupData.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-foreground rounded-lg text-xs font-black uppercase tracking-wider">
                      {startupData.sector || 'Unspecified Sector'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-foreground rounded-lg text-xs font-black uppercase tracking-wider">
                      {startupData.stage || 'Pre-seed'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                   <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Founder
                    </p>
                    <p className="font-bold text-sm text-foreground">{startupData.founder?.full_name || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> Contact
                    </p>
                    <p className="font-bold text-sm text-foreground">{startupData.founder?.email || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Founded Date
                    </p>
                    <p className="font-bold text-sm text-foreground">{startupData.founded_date || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Elevator Pitch */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Elevator Pitch
            </h3>
            <p className="text-lg text-foreground font-medium leading-relaxed bg-secondary/50 p-6 rounded-2xl">
              {startupData.elevator_pitch || 'No elevator pitch provided.'}
            </p>
          </div>

          {/* Strategy & Market */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" /> Problem & Solution
              </h3>
              <p className="text-foreground font-medium leading-relaxed whitespace-pre-wrap">
                {startupData.strategy_summary || 'No strategy summary provided.'}
              </p>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-border/50">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-500" /> Target Market
              </h3>
              <p className="text-foreground font-medium leading-relaxed whitespace-pre-wrap">
                {startupData.target_market || 'No market details provided.'}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border/50">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-500" /> Competitive Advantage
              </h3>
              <p className="text-foreground font-medium leading-relaxed whitespace-pre-wrap">
                {startupData.competitive_advantage || 'No competitive advantage provided.'}
              </p>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-border/50">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Coins className="w-4 h-4 text-rose-500" /> Revenue Model
              </h3>
              <p className="text-foreground font-medium leading-relaxed whitespace-pre-wrap">
                {startupData.revenue_model || 'No revenue model provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Review Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <StartupReviewActions
            startup={{ id: startupData.id, status: startupData.status || 'pending' }}
            latestReviewNote={latestReview?.overall_comment ?? ''}
            latestReviewAt={latestReview?.scored_at ?? null}
            applicationsCount={applicationsData?.length ?? 0}
            latestApplicationStatus={applicationsData?.[0]?.status ?? null}
            latestScores={latestReview ? {
              team_score:       latestReview.team_score,
              market_score:     latestReview.market_score,
              traction_score:   latestReview.traction_score,
              uniqueness_score: latestReview.uniqueness_score,
            } : null}
            assignedMentors={assignedMentors}
            allMentors={allMentors}
          />
          
          {/* Funding Snapshot */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Rocket className="w-4 h-4 text-blue-600" /> Current Funding Status
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-muted-foreground">Active Round</span>
                <span className="text-sm font-bold text-foreground">{startupData.active_round_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-muted-foreground">Funding Goal</span>
                <span className="text-sm font-bold text-foreground">
                  ${Number(startupData.funding_goal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-muted-foreground">Status</span>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">{startupData.round_status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
