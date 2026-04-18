import { createClient } from '@/lib/supabase/server'

export default async function MentorDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: mentor } = await supabase
    .from('mentors')
    .select('id, expertise, bio')
    .eq('user_id', user!.id)
    .single()

  const { data: sessions } = mentor
    ? await supabase
        .from('sessions')
        .select('id, scheduled_at, status, startups(name)')
        .eq('mentor_id', mentor.id)
        .order('scheduled_at', { ascending: true })
        .limit(10)
    : { data: null }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-1">Mentor Dashboard</h1>
      <p className="text-muted-foreground mb-6">Your sessions and assigned startups</p>

      {mentor && (
        <div className="bg-card border border-border rounded-xl p-5 mb-4">
          <p className="text-sm text-muted-foreground">Expertise</p>
          <p className="text-foreground font-medium">{mentor.expertise || 'Not set'}</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Upcoming Sessions</h2>
        {sessions && sessions.length > 0 ? (
          <ul className="divide-y divide-border">
            {sessions.map((s: { id: string, scheduled_at: string, status: string, startups?: { name: string } }) => (
              <li key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{s.startups?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(s.scheduled_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs capitalize bg-accent text-accent-foreground px-2 py-1 rounded-full">
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No sessions scheduled.</p>
        )}
      </div>
    </div>
  )
}
