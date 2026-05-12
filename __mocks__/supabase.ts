/**
 * Shared Supabase mock factory for all test layers.
 *
 * Usage in tests:
 *   import { createMockSupabaseClient, createMockAuthUser } from '@/../__mocks__/supabase'
 */

// ── Auth user factory ──────────────────────────────────────────────────────
export function createMockAuthUser(overrides: Record<string, any> = {}) {
  return {
    id: 'user-uuid-1234',
    email: 'test@polaris.com',
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
    user_metadata: { full_name: 'Test User', role: 'founder', ...overrides.user_metadata },
    app_metadata: { role: 'founder', ...overrides.app_metadata },
    ...overrides,
  }
}

// ── Chainable query builder ────────────────────────────────────────────────
export function createMockQueryBuilder(resolvedData: any = [], resolvedError: any = null) {
  const builder: any = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: resolvedData, error: resolvedError }),
    maybeSingle: jest.fn().mockResolvedValue({ data: resolvedData, error: resolvedError }),
    then: undefined as any, // allow await on the builder
  }

  // When awaited directly (no .single() / .maybeSingle()), resolve the data
  builder.then = (resolve: any, reject: any) =>
    Promise.resolve({ data: resolvedData, error: resolvedError }).then(resolve, reject)

  // Make every chained method also return the builder so chains work
  for (const key of Object.keys(builder)) {
    if (typeof builder[key] === 'function' && !['then', 'single', 'maybeSingle'].includes(key)) {
      builder[key].mockReturnValue(builder)
    }
  }

  return builder
}

// ── Full Supabase client mock ──────────────────────────────────────────────
export function createMockSupabaseClient(options: {
  user?: any
  queryData?: any
  queryError?: any
} = {}) {
  const { user = createMockAuthUser(), queryData = [], queryError = null } = options

  const queryBuilder = createMockQueryBuilder(queryData, queryError)

  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user, session: {} }, error: null }),
      signUp: jest.fn().mockResolvedValue({ data: { user, session: {} }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      exchangeCodeForSession: jest.fn().mockResolvedValue({ data: { session: {} }, error: null }),
    },
    from: jest.fn(() => queryBuilder),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    })),
    removeChannel: jest.fn(),
    // Expose the builder for test-specific assertions
    __queryBuilder: queryBuilder,
  }
}
