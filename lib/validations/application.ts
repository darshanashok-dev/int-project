import { z } from 'zod'

export const scoreSchema = z.object({
  team_score: z.number().int().min(1).max(10),
  market_score: z.number().int().min(1).max(10),
  traction_score: z.number().int().min(1).max(10),
  uniqueness_score: z.number().int().min(1).max(10),
  overall_comment: z.string().min(10, 'Comment must be at least 10 characters'),
})

export type ScoreFormData = z.infer<typeof scoreSchema>
