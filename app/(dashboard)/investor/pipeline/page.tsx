import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PipelineClient } from './PipelineClient'

type StartupRow = {
  id: string
  name: string
  sector: string | null
  stage: string | null
  status: string | null
  elevator_pitch: string | null
  created_at: string | null
}

type InterestRow = {
  id: string
  startup_id: string | null
  signal_type: string | null
  note: string | null
}

export default async function PipelinePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
  
  let startupsData: StartupRow[] | null = null
  let interestsData: InterestRow[] | null = null

  if (isMock) {
    startupsData = [
      { id: '1', name: 'AeroDynamics', sector: 'Aerospace', stage: 'seed', status: 'active', elevator_pitch: 'Autonomous drone logistics for instant local delivery network hubs.', created_at: new Date().toISOString() },
      { id: '2', name: 'BioSynth', sector: 'Healthtech', stage: 'series-a', status: 'active', elevator_pitch: 'Synthetic biology and genomics software accelerating therapeutics discovery.', created_at: new Date().toISOString() },
      { id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'seed', status: 'active', elevator_pitch: 'Automated cloud resource allocator scaling underlying container clusters effortlessly.', created_at: new Date().toISOString() },
      { id: '4', name: 'DeFiX', sector: 'Fintech', stage: 'series-a', status: 'active', elevator_pitch: 'Global unified liquidity protocols for decentralized institutional finance platforms.', created_at: new Date().toISOString() }
    ]
    interestsData = [
      { id: 'i1', startup_id: '1', signal_type: 'high', note: 'Very interested in drone delivery telemetry tech.' },
      { id: 'i2', startup_id: '2', signal_type: 'medium', note: 'Evaluating regulatory risks in clinical pipeline.' }
    ]
  } else {
    const { data: startups } = await supabase
      .from('startups')
      .select('id, name, sector, stage, status, elevator_pitch, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    const { data: myInterests } = await supabase
      .from('investor_interests')
      .select('id, startup_id, signal_type, note')
      .eq('investor_id', user.id)

    startupsData = startups as StartupRow[] | null
    interestsData = myInterests as InterestRow[] | null
  }

  // Build a map of startup_id -> interest for quick lookup
  const interestMap: Record<string, { id: string, signal_type: string | null, note: string | null }> = {}
  interestsData?.forEach(i => {
    if (i.startup_id) {
      interestMap[i.startup_id] = { id: i.id, signal_type: i.signal_type, note: i.note }
    }
  })

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/investor" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Deal Flow Pipeline</h1>
          </div>
          <p className="text-muted-foreground mt-1 text-lg">
            Browse active ventures and signal your investment interest.
          </p>
        </div>
        <Link 
          href="/investor/portfolio"
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-black/10 transition-all active:scale-95"
        >
          View My Portfolio
        </Link>
      </div>

      <PipelineClient 
        startups={startupsData || []} 
        interestMap={interestMap}
      />
    </div>
  )
}
