import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import dynamic from 'next/dynamic'
import { NotificationListener } from '@/components/notifications/notification-listener'

// Disabling SSR for interactive layout components ensures that the Sidebar and TopBar
// only activate once the browser has synchronized the user session, effectively
// silencing all hydration mismatched caused by icons and metadata-driven text.
const Sidebar = dynamic(() => import('@/components/shared/sidebar').then(mod => mod.Sidebar), { ssr: false })
const MobileNavigation = dynamic(() => import('@/components/shared/mobile-navigation').then(mod => mod.MobileNavigation), { ssr: false })
import { TopBar } from '@/components/shared/top-bar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
  const cookieStore = cookies()
  const mockAuth = cookieStore.get('mock-auth')?.value === 'true'

  let user = null
  let displayName = 'User'
  let displayRole = 'Founder'

  if (isMock && mockAuth) {
    const mockRole = cookieStore.get('mock-role')?.value || 'founder'
    displayName = 'Mock User'
    displayRole = mockRole.charAt(0).toUpperCase() + mockRole.slice(1)
    user = {
      id: 'mock-id',
      email: 'mock@example.com',
      user_metadata: { full_name: displayName, role: displayRole },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as any
  } else {
    const supabase = createClient()
    try {
      const { data } = await supabase.auth.getUser()
      user = data?.user
      if (user) {
        const { data: profileData } = await supabase
          .from('users')
          .select('full_name, role')
          .eq('id', user.id)
          .maybeSingle()
        
        const profile = profileData as any
        displayName = profile?.full_name || user.email?.split('@')[0] || 'User'
        displayRole = profile?.role || 'Founder'
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      return redirect('/login?error=connection')
    }
  }

  if (!user) redirect('/login')

  // Onboarding check
  if (!isMock && user) {
    const supabase = createClient()
    const { data: profileData } = await supabase
      .from('users')
      .select('onboarding_completed, role')
      .eq('id', user.id)
      .maybeSingle()
    
    const profile = profileData as any

    const headersList = headers()
    const currentUrl = headersList.get('x-url') || ''
    const pathname = new URL(currentUrl, 'http://localhost').pathname
    
    if (profile && !profile.onboarding_completed && !pathname.includes('/onboarding')) {
      redirect(`/${profile.role.toLowerCase()}/onboarding`)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans flex-col md:flex-row">
      <NotificationListener />
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
        <TopBar />
        <main className="h-full overflow-y-auto bg-background p-4 md:p-12">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
