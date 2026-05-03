import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventsClient from './EventsClient'

export default async function EventsPage() {
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

  const [{ data: events }, { data: programs }, { data: registrations }] = await Promise.all([
    supabase
      .from('events')
      .select('id, program_id, title, type, date, location, created_at')
      .order('date', { ascending: true }),
    supabase.from('programs').select('id, name, cohort').order('name', { ascending: true }),
    supabase.from('event_registrations').select('event_id')
  ])

  const registrationsByEvent = (registrations as { event_id: string }[] || []).reduce<Record<string, number>>((acc, row) => {
    acc[row.event_id] = (acc[row.event_id] || 0) + 1
    return acc
  }, {})

  const programNameById = new Map((programs as { id: string, name: string, cohort: string }[] || []).map((program) => [program.id, `${program.name} (${program.cohort})`]))

  const normalizedEvents = (events as { id: string, program_id: string | null, title: string, type: string | null, date: string, location: string | null, created_at: string | null }[] || []).map((event) => ({
    ...event,
    created_at: event.created_at || new Date().toISOString(),
    registrationsCount: registrationsByEvent[event.id] || 0,
    programName: event.program_id ? programNameById.get(event.program_id) || 'Unknown Program' : 'No Program'
  }))

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Events Management</h1>
        <p className="text-muted-foreground mt-1">Schedule and manage cohort events, demo days, and workshops</p>
      </div>

      <EventsClient initialEvents={normalizedEvents} programs={programs || []} />
    </div>
  )
}
