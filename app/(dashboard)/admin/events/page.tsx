import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventsClient from './EventsClient'

export default async function EventsPage() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role =
    (typeof user.app_metadata?.role === 'string' && user.app_metadata.role) ||
    (typeof user.user_metadata?.role === 'string' && user.user_metadata.role) ||
    null

  if (role !== 'admin') {
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

  const registrationsByEvent = (registrations || []).reduce<Record<string, number>>((acc, row) => {
    acc[row.event_id] = (acc[row.event_id] || 0) + 1
    return acc
  }, {})

  const programNameById = new Map((programs || []).map((program) => [program.id, `${program.name} (${program.cohort})`]))

  const normalizedEvents = (events || []).map((event) => ({
    ...event,
    registrationsCount: registrationsByEvent[event.id] || 0,
    programName: event.program_id ? programNameById.get(event.program_id) || 'Unknown Program' : 'No Program'
  }))

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#202124] tracking-tight">Events Management</h1>
        <p className="text-muted-foreground mt-1">Schedule and manage cohort events, demo days, and workshops</p>
      </div>

      <EventsClient initialEvents={normalizedEvents} programs={programs || []} />
    </div>
  )
}
