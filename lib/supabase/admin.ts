import { createClient } from '@supabase/supabase-js'

export class MissingAdminEnvError extends Error {
  constructor(missingVars: string[]) {
    super(`Missing Supabase Admin environment variables: ${missingVars.join(', ')}`)
    this.name = 'MissingAdminEnvError'
  }
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const missingVars: string[] = []

  if (!supabaseUrl) {
    missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseServiceRoleKey) {
    missingVars.push('SUPABASE_SERVICE_ROLE_KEY')
  }

  if (missingVars.length > 0) {
    throw new MissingAdminEnvError(missingVars)
  }

  const url = supabaseUrl as string
  const serviceRoleKey = supabaseServiceRoleKey as string

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
