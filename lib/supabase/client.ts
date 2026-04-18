import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { createMockClient } from './mock-client'

export function createClient() {
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
  
  if (isMock) {
    return createMockClient()
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
