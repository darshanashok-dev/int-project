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
export const createMockClient = () => {
  const isBrowser = typeof window !== 'undefined'
  
  // In Mock Mode, we always return the mock user for a seamless experience
  const getMockUser = () => MOCK_USER

  return {
    auth: {
      getUser: async () => ({ data: { user: getMockUser() }, error: null }),
      signInWithPassword: async () => {
        if (isBrowser) document.cookie = "mock-auth=true; path=/;"
        return { data: { user: MOCK_USER, session: { access_token: 'mock-token' } }, error: null }
      },
      signUp: async () => {
        if (isBrowser) document.cookie = "mock-auth=true; path=/;"
        return { data: { user: MOCK_USER, session: { access_token: 'mock-token' } }, error: null }
      },
      signOut: async () => {
        if (isBrowser) document.cookie = "mock-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        return { error: null }
      }
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => {
            if (table === 'startups') return { data: MOCK_STARTUP, error: null }
            return { data: null, error: null }
          },
          order: () => ({
             then: (cb: (arg0: { data: any; error: any }) => any) => {
               if (table === 'funding') return cb({ data: MOCK_FUNDING, error: null })
               if (table === 'milestones') return cb({ data: MOCK_MILESTONES, error: null })
               return cb({ data: [], error: null })
             }
          }),
          then: (cb: (arg0: { data: any; error: any }) => any) => {
             if (table === 'startups') return cb({ data: [MOCK_STARTUP], error: null })
             if (table === 'funding') return cb({ data: MOCK_FUNDING, error: null })
             if (table === 'milestones') return cb({ data: MOCK_MILESTONES, error: null })
             if (table === 'applications') return cb({ data: [], error: null })
             return cb({ data: [], error: null })
          }
        }),
        in: () => ({
          then: (cb: any) => cb({ data: MOCK_FUNDING, error: null })
        }),
        then: (cb: any) => cb({ data: [], error: null })
      }),
      update: (data: any) => ({
        eq: () => ({
          then: (cb: (arg0: { data: any; error: any }) => any) => cb({ data, error: null })
        })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({ data: { ...data, id: 'new-id' }, error: null })
        })
      })
    })
  } as unknown as any
}
