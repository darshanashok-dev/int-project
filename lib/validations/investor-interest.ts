import { z } from 'zod'

export const investorInterestSchema = z.object({
  startupId:  z.string().uuid(),
  signalType: z.enum(['watching', 'interested', 'committed']),
  note:       z.string().optional(),
})
export type InvestorInterestData = z.infer<typeof investorInterestSchema>
