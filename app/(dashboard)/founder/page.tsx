import { createClient } from '@/lib/supabase/server'

export default async function FounderDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: startups } = await supabase
    .from('startups')
    .select('*')
    .eq('founder_id', user!.id)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-1">Founder Dashboard</h1>
      <p className="text-muted-foreground mb-6">Manage your startups and track progress</p>

      <div className="grid gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Your Startups</h2>
          {startups && startups.length > 0 ? (
            <ul className="divide-y divide-border">
              {startups.map(s => (
                <li key={s.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.sector} · {s.stage}</p>
                  </div>
                  <span className="text-xs capitalize bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No startups yet. Create your first one to get started.</p>
          )}
        </div>
      </div>
    </div>
  )
}
