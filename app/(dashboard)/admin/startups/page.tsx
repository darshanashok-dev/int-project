import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StartupTable from './StartupTable'

export default async function StartupsManagement() {
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

  const { data: startups } = await supabase
    .from('startups')
    .select(`
      id,
      name,
      status,
      sector,
      stage,
      created_at,
      founder:users(email)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#202124] tracking-tight">Startup Oversight</h1>
          <p className="text-muted-foreground mt-1">Review, approve, and manage venture portfolios</p>
        </div>
      </div>

      <StartupTable initialStartups={startups || []} />
    </div>
  )
}
