import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'
import { createMockClient } from './mock-client'

export function createClient() {
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
  
  if (isMock) {
    const cookieStore = cookies()
    const isAuthenticated = cookieStore.has('mock-auth')
    return createMockClient(isAuthenticated)
  }

  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) => {
          try {
            c.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component — middleware handles session refresh
          }
        },
      }
    }
  )
}
