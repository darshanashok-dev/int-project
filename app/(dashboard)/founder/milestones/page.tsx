'use client'

import { useMyStartup } from '@/lib/hooks/use-startups'
import { useMilestones, useUpdateMilestone, useCreateMilestone } from '@/lib/hooks/use-milestones'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { milestoneSchema, type MilestoneFormData } from '@/lib/validations/milestone'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Plus, CheckCircle2, Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/browser'
import { ErrorState } from '@/components/shared/error-state'


export default function FounderMilestonesPage() {
  const { data: startupData, isLoading: startupLoading, isError: startupError, error: sError, refetch: refetchStartup } = useMyStartup()
  const startup = startupData as any
  const { data: milestones, isLoading: milestonesLoading, isError: milestonesError, error: mError, refetch: refetchMilestones } = useMilestones(startup?.id || '')
  const { mutate: updateMilestone } = useUpdateMilestone(startup?.id || '')
  const { mutate: createMilestone } = useCreateMilestone(startup?.id || '')
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      status: 'pending'
    }
  })

  useEffect(() => {
    if (!startup?.id) return

    const channel = supabase
      .channel(`realtime-milestones-${startup.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'milestones',
          filter: `startup_id=eq.${startup.id}`
        },
        () => {
          refetchMilestones()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [startup?.id, refetchMilestones])

  const onToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    updateMilestone({ id, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null })
  }

  const onCreateSubmit = (data: MilestoneFormData) => {
    createMilestone(data, {
      onSuccess: () => {
        toast.success('Milestone added')
        setIsDialogOpen(false)
        reset()
      }
    })
  }

  if (startupLoading || milestonesLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full rounded-3xl" />
        </div>
      </div>
    )
  }
  if (startupError || milestonesError) {
    return (
      <ErrorState 
        message={sError?.message || mError?.message} 
        onRetry={() => {
          refetchStartup()
          refetchMilestones()
        }} 
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Milestones
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-muted-foreground">Track your startup's growth and achievements.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold gap-2">
              <Plus className="h-4 w-4" /> Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>New Milestone</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...register('title')} placeholder="e.g. Beta Launch" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" {...register('due_date')} />
              </div>
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {(milestones as any[])?.map((m) => (
          <Card key={m.id} className={m.status === 'completed' ? 'bg-slate-50/50' : ''}>
            <CardContent className="p-6 flex items-center gap-4">
              <div 
                className="cursor-pointer" 
                onClick={() => onToggleStatus(m.id, m.status)}
              >
                {m.status === 'completed' ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={m.status === 'completed' ? 'line-through text-muted-foreground font-medium' : 'font-bold'}>
                  {m.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Due: {m.due_date ? format(new Date(m.due_date), 'MMM dd, yyyy') : 'No date'}
                </p>
              </div>
              {m.status === 'completed' && (
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  Completed
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
