import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export function createClient() {
  const cookieStore = cookies()
  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
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
    
    // Attach mock implementation directly to auth instance to preserve other prototype methods (like getSession)
    client.auth.getUser = (async () => {
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
    }) as any

    // Also mock getSession to satisfy internal Supabase postgrest client token attachments during mutations
    client.auth.getSession = (async () => {
      return {
        data: {
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: 'bearer',
            user: {
              id: 'mock-id',
              email: `${mockRole}@example.com`,
              user_metadata: { role: mockRole, full_name: 'Mock User' },
              app_metadata: { role: mockRole },
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            } as any
          }
        },
        error: null
      }
    }) as any
  }

  return client
}
