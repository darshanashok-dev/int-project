import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export function createClient() {
  const cookieStore = cookies()
  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) =>
          c.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  )

  // Universal patch for mock mode across all routes
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true' && cookieStore.get('mock-auth')?.value === 'true') {
    const mockRole = cookieStore.get('mock-role')?.value || 'founder'
    
    // We only override getUser to satisfy standard auth checks
    // Typing workaround using 'any' cast
    const originalAuth = client.auth;
    client.auth = {
      ...originalAuth,
      getUser: async () => {
        return {
          data: {
            user: {
              id: 'mock-id',
              email: `${mockRole}@example.com`,
              user_metadata: { role: mockRole, full_name: 'Mock User' },
              app_metadata: { role: mockRole },
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            } as any
          },
          error: null
        }
      }
    } as any
  }

  return client
}
