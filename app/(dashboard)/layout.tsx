import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'

// Disabling SSR for interactive layout components ensures that the Sidebar and TopBar
// only activate once the browser has synchronized the user session, effectively
// silencing all hydration mismatched caused by icons and metadata-driven text.
const Sidebar = dynamic(() => import('@/components/shared/sidebar').then(mod => mod.Sidebar), { ssr: false })
const MobileNavigation = dynamic(() => import('@/components/shared/mobile-navigation').then(mod => mod.MobileNavigation), { ssr: false })

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (err) {
    console.error('Auth check failed:', err)
    return redirect('/login?error=connection')
  }

  if (!user) redirect('/login')

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const displayRole = user.user_metadata?.role || 'Founder'

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex">
        <Sidebar 
          user={user} 
          displayName={displayName} 
          displayRole={displayRole} 
        />
      </div>

      {/* Mobile Nav Trigger */}
      <MobileNavigation 
        user={user} 
        displayName={displayName} 
        displayRole={displayRole} 
      />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <main className="h-full overflow-y-auto bg-background p-4 md:p-12">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
