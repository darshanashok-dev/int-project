import { z } from 'zod'

export const startupSchema = z.object({
  name: z.string().min(2, 'Name required'),
  sector: z.string().min(2, 'Sector required'),
  stage: z.enum(['idea', 'mvp', 'early_traction', 'growth']),
  strategy_summary: z.string().min(10, 'Provide a short strategy summary'),
  target_market: z.string().min(5),
  revenue_model: z.string().min(5),
  competitive_advantage: z.string().min(5),
})
export type StartupFormData = z.infer<typeof startupSchema>
