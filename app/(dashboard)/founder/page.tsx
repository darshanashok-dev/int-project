import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

// Disabling SSR for the dashboard client to permanently resolve the persistent hydration mismatch
// caused by environment/state differences between server and browser.
const FounderDashboardClient = dynamic(
  () => import('@/components/dashboard/founder-dashboard-client').then(mod => mod.FounderDashboardClient),
  { ssr: false }
)

export default async function FounderDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: startups } = await supabase
    .from('startups')
    .select('*')
    .eq('founder_id', user!.id)

  const { data: funding } = await supabase
    .from('funding')
    .select('amount')
    .in('startup_id', startups?.map((s: { id: string }) => s.id) || [])

  const totalRaised = funding?.reduce((acc: number, curr: { amount: string | number }) => acc + Number(curr.amount), 0) || 0

  const hasVentures = startups && startups.length > 0
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Founder'
  
  const greeting = `${hasVentures ? 'Welcome back,' : 'Welcome to Polaris,'} ${firstName}`
  const subtitle = hasVentures 
    ? "Here's what's happening across your ventures today." 
    : "Your strategic journey begins here. Let's initialize your first venture."

  return (
    <FounderDashboardClient 
      user={user} 
      startups={startups || []} 
      totalRaised={totalRaised}
      greeting={greeting}
      subtitle={subtitle}
    />
  )
}
