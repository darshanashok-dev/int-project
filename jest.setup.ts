import '@testing-library/jest-dom'

// ---------------------------------------------------------------------------
// Global env vars for all tests (safe test values — never real credentials)
// ---------------------------------------------------------------------------
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-1234567890'
process.env.NEXT_PUBLIC_MOCK_MODE = 'false'

// ---------------------------------------------------------------------------
// Mock: next/navigation
// ---------------------------------------------------------------------------
const mockPush = jest.fn()
const mockRefresh = jest.fn()
const mockReplace = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    replace: mockReplace,
    back: mockBack,
    prefetch: jest.fn(),
  }),
  usePathname: () => '/founder',
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

// ---------------------------------------------------------------------------
// Mock: next/headers
// ---------------------------------------------------------------------------
const mockCookieStore = {
  get: jest.fn(),
  getAll: jest.fn(() => []),
  set: jest.fn(),
  delete: jest.fn(),
  has: jest.fn(),
}

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => mockCookieStore),
  headers: jest.fn(() => new Map([['x-url', 'http://localhost:3000/founder']])),
}))

// ---------------------------------------------------------------------------
// Mock: next/cache
// ---------------------------------------------------------------------------
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

// ---------------------------------------------------------------------------
// Mock: next-themes (for components that use useTheme)
// ---------------------------------------------------------------------------
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// ---------------------------------------------------------------------------
// Mock: next/dynamic (return the component directly)
// ---------------------------------------------------------------------------
jest.mock('next/dynamic', () =>
  (loader: () => Promise<any>) => {
    // For tests, just execute the loader synchronously
    const Component = require('react').lazy(loader)
    return Component
  }
)

// ---------------------------------------------------------------------------
// Expose mocks so individual tests can reconfigure them
// ---------------------------------------------------------------------------
;(globalThis as any).__mocks__ = {
  router: { push: mockPush, refresh: mockRefresh, replace: mockReplace, back: mockBack },
  cookieStore: mockCookieStore,
}
