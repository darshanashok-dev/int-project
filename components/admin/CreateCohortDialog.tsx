'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { programSchema, type ProgramFormData } from '@/lib/validations/program'
import { useCreateProgram } from '@/lib/hooks/use-programs'
import { toast } from 'sonner'

export function CreateCohortDialog() {
  const [open, setOpen] = useState(false)
  const { mutate: createProgram, isPending } = useCreateProgram()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      max_startups: 20,
    }
  })

  const onSubmit = (data: ProgramFormData) => {
    createProgram(data, {
      onSuccess: () => {
        toast.success('Cohort created successfully')
        setOpen(false)
        reset()
      },
      onError: (error) => {
        toast.error('Failed to create cohort')
        console.error(error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl font-bold gap-2">
          <Plus className="h-4 w-4" />
          Create Cohort
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Cohort</DialogTitle>
            <DialogDescription>
              Set up a new incubation program cohort.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Program Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. Summer Accelerator" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cohort">Cohort Year/Batch</Label>
              <Input id="cohort" {...register('cohort')} placeholder="e.g. 2024" />
              {errors.cohort && <p className="text-xs text-red-500">{errors.cohort.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" {...register('start_date')} />
                {errors.start_date && <p className="text-xs text-red-500">{errors.start_date.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" {...register('end_date')} />
                {errors.end_date && <p className="text-xs text-red-500">{errors.end_date.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_startups">Max Startups</Label>
              <Input id="max_startups" type="number" {...register('max_startups', { valueAsNumber: true })} />
              {errors.max_startups && <p className="text-xs text-red-500">{errors.max_startups.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Cohort'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
