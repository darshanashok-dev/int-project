import { createClient } from '@/lib/supabase/server'

export default async function ManagerDashboard() {
  const supabase = createClient()

  const [{ data: programs }, { data: applications }] = await Promise.all([
    supabase.from('programs').select('id, name, cohort, start_date, end_date, max_startups'),
    supabase.from('applications').select('id, status, startups(name), programs(name)').limit(20),
  ])

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-1">Manager Dashboard</h1>
      <p className="text-muted-foreground mb-6">Manage programs and review applications</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Programs</h2>
          {programs && programs.length > 0 ? (
            <ul className="divide-y divide-border">
              {programs.map((p: { id: string, name: string, cohort: string }) => (
                <li key={p.id} className="py-3">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">Cohort: {p.cohort}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No programs created yet.</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Recent Applications</h2>
          {applications && applications.length > 0 ? (
            <ul className="divide-y divide-border">
              {applications.map((a) => (
                <li key={a.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{(a.startups as unknown as { name: string })?.name}</p>
                    <p className="text-sm text-muted-foreground">{(a.programs as unknown as { name: string })?.name}</p>
                  </div>
                  <span className="text-xs capitalize bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
