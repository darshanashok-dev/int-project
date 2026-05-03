import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import { StartupBasic } from '@/types/dashboard'

// Disabling SSR for the dashboard client to permanently resolve the persistent hydration mismatch
// caused by environment/state differences between server and browser.
const FounderDashboardClient = dynamic(
  () => import('@/components/dashboard/founder-dashboard-client').then(mod => mod.FounderDashboardClient),
  { ssr: false }
)

export default async function FounderDashboard() {
  const supabase = createClient()
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (err) {
    console.error('Auth check failed:', err)
  }
  if (!user) return null

  const { data: startups } = await supabase
    .from('startups')
    .select('id, name, sector, stage, status')
    .eq('founder_id', user.id)

  const startupsData = (startups as unknown as StartupBasic[]) || []
  
  const MOCK_STARTUPS = [
    { id: 'mock-1', name: 'Quantum Leap', sector: 'DeepTech', stage: 'Seed', status: 'active' },
    { id: 'mock-2', name: 'AeroDynamics', sector: 'CleanTech', stage: 'Pre-Seed', status: 'active' },
    { id: 'mock-3', name: 'BioSynth', sector: 'HealthTech', stage: 'Series A', status: 'active' },
    { id: 'mock-4', name: 'CloudScale', sector: 'SaaS', stage: 'Seed', status: 'active' }
  ]
  const finalStartups = startupsData.length > 0 ? startupsData : MOCK_STARTUPS

  const { data: funding } = await supabase
    .from('funding')
    .select('amount')
    .in('startup_id', finalStartups.map(s => s.id))

  const fundingData = funding as { amount: string | number }[] | null
  
  let totalRaised = fundingData?.reduce((acc: number, curr: { amount: string | number }) => acc + Number(curr.amount), 0) || 0
  
  // If we are using mock startups and funding is 0, provide mock funding
  if (startupsData.length === 0 && totalRaised === 0) {
    totalRaised = 1500000 // $1.5M mock raised
  }

  const hasVentures = finalStartups && finalStartups.length > 0
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Founder'
  
  const greeting = `${hasVentures ? 'Welcome back,' : 'Welcome to Polaris,'} ${firstName}`
  const subtitle = hasVentures 
    ? "Here's what's happening across your ventures today." 
    : "Your strategic journey begins here. Let's initialize your first venture."

  return (
    <FounderDashboardClient 
      startups={finalStartups} 
      totalRaised={totalRaised}
      greeting={greeting}
      subtitle={subtitle}
    />
  )
}
