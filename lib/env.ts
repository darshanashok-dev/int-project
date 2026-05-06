import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({ message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL' }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, { message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required' }),
  NEXT_PUBLIC_MOCK_MODE: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
})

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_MOCK_MODE: process.env.NEXT_PUBLIC_MOCK_MODE,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format())
  throw new Error('Invalid environment variables config. Please check your .env.local file.')
}

// Ensure server-only variables are warning-logged on the server if missing, but do not block build or client bundling
if (typeof window === 'undefined' && !parsed.data.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Warning: SUPABASE_SERVICE_ROLE_KEY is missing in server context.')
}

export const env = parsed.data
export type EnvType = z.infer<typeof envSchema>
