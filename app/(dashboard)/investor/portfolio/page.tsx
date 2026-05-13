import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Briefcase } from 'lucide-react'
import { InvestorPortfolioList, StartupRow } from '@/components/portfolio/InvestorPortfolioList'

export default async function PortfolioPage() {
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
  let startupsData: StartupRow[] = []

  if (isMock) {
    startupsData = [
      { id: '1', name: 'AeroDynamics', sector: 'Aerospace', stage: 'seed', status: 'active', elevator_pitch: 'Autonomous drone logistics for instant local delivery network hubs.' },
      { id: '2', name: 'BioSynth', sector: 'Healthtech', stage: 'series-a', status: 'active', elevator_pitch: 'Synthetic biology and genomics software accelerating therapeutics discovery.' },
      { id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'seed', status: 'active', elevator_pitch: 'Automated cloud resource allocator scaling underlying container clusters effortlessly.' },
      { id: '4', name: 'DeFiX', sector: 'Fintech', stage: 'series-a', status: 'active', elevator_pitch: 'Global unified liquidity protocols for decentralized institutional finance platforms.' }
    ] as any[]
  } else {
    const { data: startups } = await supabase
      .from('startups')
      .select('id, name, sector, stage, status, elevator_pitch')
      .order('created_at', { ascending: false })

    startupsData = (startups as StartupRow[] | null) ?? []
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/investor"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Startup Portfolio
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 text-lg">
            Browse and filter all ventures in the portfolio.
          </p>
        </div>
        <Link
          href="/investor/pipeline"
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-black/10 transition-all active:scale-95"
        >
          <Briefcase className="w-4 h-4" />
          Explore Pipeline
        </Link>
      </div>

      {/* Filterable startup list */}
      <InvestorPortfolioList initialStartups={startupsData} />
    </div>
  )
}
