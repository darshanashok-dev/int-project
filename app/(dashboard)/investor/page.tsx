import { createClient } from '@/lib/supabase/server'

export default async function InvestorDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: interests } = await supabase
    .from('investor_interests')
    .select('id, signal_type, note, created_at, startups(name, sector, stage)')
    .eq('investor_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: startups } = await supabase
    .from('startups')
    .select('id, name, sector, stage, status')
    .limit(20)

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-1">Investor Dashboard</h1>
      <p className="text-muted-foreground mb-6">Explore startups and track your interests</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Your Interests</h2>
          {interests && interests.length > 0 ? (
            <ul className="divide-y divide-border">
              {interests.map((i: any) => (
                <li key={i.id} className="py-3">
                  <p className="font-medium text-foreground">{i.startups?.name}</p>
                  <p className="text-sm text-muted-foreground">{i.signal_type}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No interests tracked yet.</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Browse Startups</h2>
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
            <p className="text-sm text-muted-foreground">No startups available.</p>
          )}
        </div>
      </div>
    </div>
  )
}
