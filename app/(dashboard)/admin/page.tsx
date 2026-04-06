import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = createClient()

  const [{ data: startups }, { data: programs }, { data: users }] = await Promise.all([
    supabase.from('startups').select('id, name, status'),
    supabase.from('programs').select('id, name, cohort'),
    supabase.from('users').select('id'),
  ])

  const stats = [
    { label: 'Total Users', value: users?.length ?? 0 },
    { label: 'Startups', value: startups?.length ?? 0 },
    { label: 'Programs', value: programs?.length ?? 0 },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-1">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">Platform overview and management</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-semibold text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Recent Startups</h2>
        {startups && startups.length > 0 ? (
          <ul className="divide-y divide-border">
            {startups.slice(0, 10).map(s => (
              <li key={s.id} className="py-3 flex items-center justify-between">
                <p className="font-medium text-foreground">{s.name}</p>
                <span className="text-xs capitalize bg-accent text-accent-foreground px-2 py-1 rounded-full">
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No startups registered yet.</p>
        )}
      </div>
    </div>
  )
}
