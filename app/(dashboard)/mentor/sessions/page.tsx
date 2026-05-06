'use client'

import { useState } from 'react'
import { useSessions, useCreateSession } from '@/lib/hooks/use-sessions'
import { useStartupDiscovery } from '@/lib/hooks/use-startup-discovery'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Plus, Calendar, Clock, MessageSquare } from 'lucide-react'
import { LoadingState } from '@/components/shared/loading-state'
import { ErrorState } from '@/components/shared/error-state'


export default function MentorSessionsPage() {
  const { data: sessions, isLoading, isError, error, refetch } = useSessions()
  const { data: startups } = useStartupDiscovery({ sector: 'all', stage: 'all', search: '' })
  const { mutate: createSession, isPending } = useCreateSession()
  const [open, setOpen] = useState(false)

  if (isLoading) return <LoadingState message="Loading sessions..." />
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      startup_id: formData.get('startup_id'),
      title: formData.get('title'),
      scheduled_at: formData.get('date'),
      duration_minutes: parseInt(formData.get('duration') as string),
      notes: formData.get('notes'),
    }

    createSession(data, {
      onSuccess: () => {
        toast.success('Session logged successfully')
        setOpen(false)
      },
      onError: () => toast.error('Failed to log session')
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Mentoring Sessions</h1>
          <p className="text-muted-foreground">Keep track of your interactions with startups.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold gap-2">
              <Plus className="h-4 w-4" /> Log Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Log New Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Startup</Label>
                <Select name="startup_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Startup" />
                  </SelectTrigger>
                  <SelectContent>
                    {(startups as any[])?.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Session Title</Label>
                <Input name="title" required placeholder="e.g. Product Strategy Sync" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input name="date" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label>Duration (mins)</Label>
                  <Input name="duration" type="number" required defaultValue="60" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea name="notes" placeholder="What was discussed?" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? 'Logging...' : 'Save Session'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {sessions?.length === 0 ? (
          <p className="text-muted-foreground">No sessions logged yet.</p>
        ) : (
          (sessions as any[])?.map((session) => (
            <Card key={session.id} className="border-l-4 border-l-indigo-600">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black">{session.title}</h3>
                    <p className="text-sm font-bold text-indigo-600">with {(session.startups as any)?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(session.scheduled_at), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                      <Clock className="h-4 w-4" />
                      {session.duration_minutes} mins
                    </div>
                  </div>
                </div>
                {session.notes && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-1 text-slate-400" />
                      <p className="text-sm text-slate-600 italic">{session.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
