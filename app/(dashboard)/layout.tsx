import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, LayoutDashboard } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const role = user.user_metadata?.role || 'founder'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-4">
        <Link href={`/${role}`} className="flex items-center gap-2 text-foreground font-semibold">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          Polaris
        </Link>
        <span className="ml-2 text-xs text-muted-foreground capitalize bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
          {role}
        </span>
        <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
          <span>{user.email}</span>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
