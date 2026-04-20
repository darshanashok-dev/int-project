import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Menu, X } from 'lucide-react'
import { headers } from 'next/headers'

// Disabling SSR for interactive layout components ensures that the Sidebar and TopBar
// only activate once the browser has synchronized the user session, effectively
// silencing all hydration mismatched caused by icons and metadata-driven text.
const Sidebar = dynamic(() => import('@/components/shared/sidebar').then(mod => mod.Sidebar), { ssr: false })
import { MobileNavigation } from '@/components/shared/mobile-navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
        <main className="h-full overflow-y-auto bg-[#f8f9fa] p-4 md:p-12">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
