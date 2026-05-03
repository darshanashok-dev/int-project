import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StartupTable, { Startup } from './StartupTable'

export default async function StartupsManagement() {
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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Startup Oversight</h1>
          <p className="text-muted-foreground mt-1">Review, approve, and manage venture portfolios</p>
        </div>
      </div>

      <StartupTable initialStartups={(startups as unknown as Startup[]) || []} />
    </div>
  )
}
