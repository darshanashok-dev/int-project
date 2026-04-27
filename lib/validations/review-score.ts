import { z } from 'zod'

export const reviewScoreSchema = z.object({
  startupId:       z.string().uuid(),
  teamScore:       z.number().int().min(1).max(10),
  marketScore:     z.number().int().min(1).max(10),
  tractionScore:   z.number().int().min(1).max(10),
  uniquenessScore: z.number().int().min(1).max(10),
  overallComment:  z.string().min(1, 'Comment is required'),
})
export type ReviewScoreData = z.infer<typeof reviewScoreSchema>
