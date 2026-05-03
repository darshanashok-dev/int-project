'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Loader2, MapPin, Plus, Search, Trash2 } from 'lucide-react'
import { createEventAction, deleteEventAction, rescheduleEventAction } from './actions'

type Program = {
  id: string
  name: string
  cohort: string
}

type EventRecord = {
  id: string
  program_id: string | null
  title: string
  type: string | null
  date: string
  location: string | null
  created_at: string
  registrationsCount: number
  programName: string
}

interface EventsClientProps {
  initialEvents: EventRecord[]
  programs: Program[]
}

function formatDatetimeLocalValue(iso: string) {
  const date = new Date(iso)
  const timezoneOffset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - timezoneOffset * 60_000)
  return localDate.toISOString().slice(0, 16)
}

export default function EventsClient({ initialEvents, programs }: EventsClientProps) {
  const [events, setEvents] = useState(initialEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    programId: programs[0]?.id || '',
    title: '',
    type: 'Workshop',
    date: '',
    location: ''
  })

  const eventTypes = useMemo(() => {
    const uniqueTypes = Array.from(new Set(events.map((event) => event.type).filter(Boolean)))
    return ['all', ...uniqueTypes] as string[]
  }, [events])

  const stats = useMemo(() => {
    const now = new Date()
    const upcoming = events.filter((event) => new Date(event.date) >= now).length
    const past = events.length - upcoming
    const registrations = events.reduce((sum, event) => sum + event.registrationsCount, 0)

    return [
      { label: 'Total Events', value: events.length },
      { label: 'Upcoming', value: upcoming },
      { label: 'Completed', value: past },
      { label: 'Registrations', value: registrations }
    ]
  }, [events])

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return events.filter((event) => {
      const searchable = [event.title, event.type || '', event.location || '', event.programName].join(' ').toLowerCase()
      const matchesSearch = !query || searchable.includes(query)
      const matchesType = typeFilter === 'all' || (event.type || '').toLowerCase() === typeFilter.toLowerCase()
      return matchesSearch && matchesType
    })
  }, [events, searchQuery, typeFilter])

  const handleCreateEvent = async () => {
    setError(null)
    setIsSubmitting(true)

    const result = await createEventAction({
      programId: formData.programId,
      title: formData.title,
      type: formData.type,
      date: new Date(formData.date).toISOString(),
      location: formData.location
    })

    if (!result.success) {
      setError(result.error || 'Failed to create event.')
      setIsSubmitting(false)
      return
    }

    const selectedProgram = programs.find((program) => program.id === formData.programId)
    setEvents((prev) => [
      {
        id: `temp-${Date.now()}`,
        program_id: formData.programId,
        title: formData.title.trim(),
        type: formData.type.trim() || null,
        date: new Date(formData.date).toISOString(),
        location: formData.location.trim() || null,
        created_at: new Date().toISOString(),
        registrationsCount: 0,
        programName: selectedProgram ? `${selectedProgram.name} (${selectedProgram.cohort})` : 'Unknown Program'
      },
      ...prev
    ])

    setFormData({
      programId: programs[0]?.id || '',
      title: '',
      type: 'Workshop',
      date: '',
      location: ''
    })
    setIsSubmitting(false)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return

    setIsProcessing(eventId)
    const result = await deleteEventAction(eventId)
    if (!result.success) {
      setError(result.error || 'Failed to delete event.')
      setIsProcessing(null)
      return
    }

    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    setIsProcessing(null)
  }

  const handleRescheduleEvent = async (eventId: string, currentIsoDate: string) => {
    const proposed = prompt('Enter new schedule (YYYY-MM-DDTHH:mm)', formatDatetimeLocalValue(currentIsoDate))
    if (!proposed) return

    const parsedDate = new Date(proposed)
    if (Number.isNaN(parsedDate.getTime())) {
      setError('Invalid date format. Use YYYY-MM-DDTHH:mm.')
      return
    }

    setIsProcessing(eventId)
    const result = await rescheduleEventAction(eventId, parsedDate.toISOString())
    if (!result.success) {
      setError(result.error || 'Failed to reschedule event.')
      setIsProcessing(null)
      return
    }

    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, date: parsedDate.toISOString() } : event)))
    setIsProcessing(null)
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-foreground">Create Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Program</label>
            <select
              value={formData.programId}
              onChange={(event) => setFormData((prev) => ({ ...prev, programId: event.target.value }))}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-secondary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
            >
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.cohort})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Demo Day Kickoff"
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-secondary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Type</label>
            <input
              type="text"
              value={formData.type}
              onChange={(event) => setFormData((prev) => ({ ...prev, type: event.target.value }))}
              placeholder="Workshop"
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-secondary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-secondary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="RNSIT Incubation Hall, Bengaluru"
            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-secondary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>

        <button
          type="button"
          onClick={handleCreateEvent}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-black/90 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Event
        </button>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/50 bg-secondary/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search events by title, type, location, or program..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="appearance-none min-w-[150px] px-4 py-2 bg-card border border-border/50 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/50">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Event</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Program</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Schedule</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Registrations</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground font-medium">
                    No events found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{event.type || 'General Event'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{event.programName}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        {new Date(event.date).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {event.location || 'Location TBD'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">{event.registrationsCount}</td>
                    <td className="px-6 py-4 text-right">
                      {isProcessing === event.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600 ml-auto" />
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleRescheduleEvent(event.id, event.date)}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-secondary"
                          >
                            Reschedule
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
