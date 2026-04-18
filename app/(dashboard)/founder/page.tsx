import { createClient } from '@/lib/supabase/server'
import { FounderDashboardClient } from '@/components/dashboard/founder-dashboard-client'

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

  return (
    <FounderDashboardClient 
      user={user} 
      startups={startups || []} 
      totalRaised={totalRaised} 
    />
  )
}
