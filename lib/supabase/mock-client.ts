/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock Client Implementation

// Mock Data
const MOCK_USER = {
  id: 'mock-user-123',
  email: 'founder@example.com',
  user_metadata: {
    full_name: 'Alex Rivera',
    role: 'founder'
  }
}

const MOCK_STARTUP = {
  id: 'startup-123',
  founder_id: 'mock-user-123',
  name: 'Aether Dynamics',
  sector: 'Healthtech',
  stage: 'series-a',
  status: 'active',
  strategy_summary: 'Revolutionizing personalized healthcare through AI-driven molecular analysis.',
  created_at: new Date().toISOString()
}

const MOCK_FUNDING = [
  { id: 'f1', startup_id: 'startup-123', type: 'Seed Round', amount: 1200000, source: 'Blue Chip Partners', date: '2023-07-08', status: 'received' },
  { id: 'f2', startup_id: 'startup-123', type: 'Pre-Seed', amount: 450000, source: 'Vertex Ventures', date: '2023-01-12', status: 'received' },
  { id: 'f3', startup_id: 'startup-123', type: 'Bridge Safe', amount: 3200000, source: 'Nebula Capital', date: '2024-04-10', status: 'processing' },
]

const MOCK_MILESTONES = [
  { id: 'm1', startup_id: 'startup-123', title: 'Seed Funding Closure', status: 'completed', due_date: '2023-09-30' },
  { id: 'm2', startup_id: 'startup-123', title: 'Series A Operational Scaling', status: 'in-progress', due_date: '2023-12-31' },
  { id: 'm3', startup_id: 'startup-123', title: 'European Market Entry', status: 'pending', due_date: '2024-06-30' },
]

// Mock Client Implementation
export const createMockClient = (serverSideAuthenticated?: boolean) => {
  const isBrowser = typeof window !== 'undefined'
  
  // Dynamic auth check that works in browser and respects server state
  const isAuthenticated = () => {
    if (isBrowser) {
      return document.cookie.includes('mock-auth=true')
    }
    return serverSideAuthenticated ?? true
  }

  const createQueryChain = (table: string, data: any) => {
    const chain: any = {
      then: (cb: (arg0: { data: unknown; error: unknown }) => unknown) => cb({ data, error: null }),
      eq: () => chain,
      in: () => chain,
      order: () => chain,
      limit: () => chain,
      single: async () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
      select: () => chain
    }
    return chain
  }

  return {
    auth: {
      getUser: async () => {
        if (!isAuthenticated()) {
          return { data: { user: null }, error: null }
        }
        return { data: { user: MOCK_USER }, error: null }
      },
      signInWithPassword: async () => {
        if (isBrowser) document.cookie = "mock-auth=true; path=/;"
        return { data: { user: MOCK_USER, session: { access_token: 'mock-token' } }, error: null }
      },
      signUp: async () => {
        if (isBrowser) document.cookie = "mock-auth=true; path=/;"
        return { data: { user: MOCK_USER, session: { access_token: 'mock-token' } }, error: null }
      },
      signOut: async () => {
        if (isBrowser) {
          document.cookie = "mock-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        }
        return { error: null }
      }
    },
    from: (table: string) => ({
      select: () => {
        let data: any = []
        if (table === 'startups') data = [MOCK_STARTUP]
        if (table === 'funding') data = MOCK_FUNDING
        if (table === 'milestones') data = MOCK_MILESTONES
        if (table === 'investor_interests') data = []
        if (table === 'applications') data = []
        if (table === 'programs') data = []
        if (table === 'users') data = [MOCK_USER]
        if (table === 'mentors') data = { id: 'm1', expertise: 'Scaling', bio: 'Bio' }
        if (table === 'sessions') data = []
        
        return createQueryChain(table, data)
      },
      update: (data: unknown) => createQueryChain(table, data),
      insert: (data: unknown) => ({
        select: () => ({
          single: async () => ({ data: { ...(data as Record<string, unknown>), id: 'new-id' }, error: null })
        })
      })
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}
