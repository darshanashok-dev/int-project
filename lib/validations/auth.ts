import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['founder', 'mentor', 'investor', 'manager']),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
})
export type RegisterFormData = z.infer<typeof registerSchema>
