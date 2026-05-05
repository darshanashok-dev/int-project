import { z } from 'zod'

export const milestoneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  due_date: z.string().min(1, 'Due date is required'),
  status: z.enum(['pending', 'in_progress', 'completed']),
})

export type MilestoneFormData = z.infer<typeof milestoneSchema>
