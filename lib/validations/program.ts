import { z } from 'zod'

export const programSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  cohort: z.string().min(1, 'Cohort is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  demo_day_date: z.string().optional(),
  max_startups: z.number().int().min(1).max(50),
})

export type ProgramFormData = z.infer<typeof programSchema>
