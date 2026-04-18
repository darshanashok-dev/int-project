import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { createMockClient } from './mock-client'

const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

export const supabase = isMock 
  ? createMockClient() 
  : createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
