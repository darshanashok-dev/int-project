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
  Coins
} from 'lucide-react'
import StartupReviewActions from './StartupReviewActions'

export default async function StartupReviewPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role =
    (typeof user.app_metadata?.role === 'string' && user.app_metadata.role) ||
    (typeof user.user_metadata?.role === 'string' && user.user_metadata.role) ||
    null

  if (role !== 'admin') {
    redirect('/login')
  }
  
  const { data: startup } = await supabase
    .from('startups')
    .select(`
      *,
      founder:users(email, full_name)
    `)
    .eq('id', params.id)
    .single()

  if (!startup) {
    notFound()
  }

  const { data: applications } = await supabase
    .from('applications')
    .select('id, submitted_at, status')
    .eq('startup_id', params.id)
    .order('submitted_at', { ascending: false })

  const latestApplicationId = applications?.[0]?.id ?? null

  let latestReview: {
    overall_comment: string | null
    scored_at: string | null
    reviewer_id: string | null
    team_score: number | null
    market_score: number | null
    traction_score: number | null
    uniqueness_score: number | null
  } | null = null

  if (latestApplicationId) {
    const { data: latestReviewData } = await supabase
      .from('application_scores')
      .select('overall_comment, scored_at, reviewer_id, team_score, market_score, traction_score, uniqueness_score')
      .eq('application_id', latestApplicationId)
      .order('scored_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    latestReview = latestReviewData
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/startups"
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-muted-foreground hover:text-[#202124]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#202124] tracking-tight">Review Venture</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Evaluate {startup.name}&apos;s profile and trajectory</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content: Startup Context */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Identity & Core Info */}
          <div className="bg-white border border-border/50 rounded-3xl p-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-3xl text-slate-400 shrink-0">
                {startup.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-2xl font-bold text-[#202124]">{startup.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f1f3f4] text-[#202124] rounded-lg text-xs font-black uppercase tracking-wider">
                      {startup.sector || 'Unspecified Sector'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f1f3f4] text-[#202124] rounded-lg text-xs font-black uppercase tracking-wider">
                      {startup.stage || 'Pre-seed'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                   <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Founder
                    </p>
                    <p className="font-bold text-sm text-[#202124]">{startup.founder?.full_name || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> Contact
                    </p>
                    <p className="font-bold text-sm text-[#202124]">{startup.founder?.email || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Founded Date
                    </p>
                    <p className="font-bold text-sm text-[#202124]">{startup.founded_date || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Elevator Pitch */}
          <div className="bg-white border border-border/50 rounded-3xl p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Elevator Pitch
            </h3>
            <p className="text-lg text-[#202124] font-medium leading-relaxed bg-[#f1f3f4]/50 p-6 rounded-2xl">
              {startup.elevator_pitch || 'No elevator pitch provided.'}
            </p>
          </div>

          {/* Strategy & Market */}
          <div className="bg-white border border-border/50 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" /> Problem & Solution
              </h3>
              <p className="text-[#202124] font-medium leading-relaxed whitespace-pre-wrap">
                {startup.strategy_summary || 'No strategy summary provided.'}
              </p>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-border/50">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-500" /> Target Market
              </h3>
              <p className="text-[#202124] font-medium leading-relaxed whitespace-pre-wrap">
                {startup.target_market || 'No market details provided.'}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border/50">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-500" /> Competitive Advantage
              </h3>
              <p className="text-[#202124] font-medium leading-relaxed whitespace-pre-wrap">
                {startup.competitive_advantage || 'No competitive advantage provided.'}
              </p>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-border/50">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Coins className="w-4 h-4 text-rose-500" /> Revenue Model
              </h3>
              <p className="text-[#202124] font-medium leading-relaxed whitespace-pre-wrap">
                {startup.revenue_model || 'No revenue model provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Review Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <StartupReviewActions
            startup={startup}
            latestReviewNote={latestReview?.overall_comment ?? ''}
            latestReviewAt={latestReview?.scored_at ?? null}
            applicationsCount={applications?.length ?? 0}
            latestApplicationStatus={applications?.[0]?.status ?? null}
            latestScores={latestReview ? {
              team_score:       latestReview.team_score,
              market_score:     latestReview.market_score,
              traction_score:   latestReview.traction_score,
              uniqueness_score: latestReview.uniqueness_score,
            } : null}
          />
          
          {/* Funding Snapshot */}
          <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-[#202124] flex items-center gap-2 mb-4">
              <Rocket className="w-4 h-4 text-blue-600" /> Current Funding Status
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-muted-foreground">Active Round</span>
                <span className="text-sm font-bold text-[#202124]">{startup.active_round_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs font-bold text-muted-foreground">Funding Goal</span>
                <span className="text-sm font-bold text-[#202124]">
                  ${Number(startup.funding_goal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-muted-foreground">Status</span>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">{startup.round_status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
