import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

/**
 * Returns the current authenticated user, supporting both mock mode and real Supabase auth.
 * Use this in any server component / page that needs user context.
 */
export async function getSessionUser() {
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
  const cookieStore = cookies()
  const mockAuth = cookieStore.get('mock-auth')?.value === 'true'

  if (isMock && mockAuth) {
    const mockRole = cookieStore.get('mock-role')?.value || 'founder'
    return {
      id: 'mock-id',
      email: 'mock@example.com',
      user_metadata: {
        full_name: 'Mock User',
        role: mockRole,
      },
      app_metadata: { role: mockRole },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    }
  }

  const supabase = createClient()
  try {
    const { data } = await supabase.auth.getUser()
    return data?.user ?? null
  } catch {
    return null
  }
}
