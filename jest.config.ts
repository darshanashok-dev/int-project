import type { Config } from 'jest'

const sharedTransform = {
  '^.+\\.tsx?$': ['ts-jest', {
    tsconfig: {
      jsx: 'react-jsx',
      esModuleInterop: true,
      module: 'commonjs',
      moduleResolution: 'node',
    },
    diagnostics: false,
  }] as any,
}

const sharedModuleNameMapper = {
  '^@/(.*)$': '<rootDir>/$1',
  '^@mocks/(.*)$': '<rootDir>/__mocks__/$1',
}

const config: Config = {
  // Ignore Playwright e2e directory
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],

  // Coverage
  collectCoverageFrom: [
    'lib/validations/**/*.ts',
    'lib/actions/**/*.ts',
    'lib/auth/**/*.ts',
    'lib/utils.ts',
    'lib/stores/**/*.ts',
    'lib/notifications.ts',
    'lib/supabase/admin.ts',
    'components/shared/loading-state.tsx',
    'components/shared/error-state.tsx',
    'components/shared/LogoutButton.tsx',
    'components/error-boundary.tsx',
    'components/admin/CreateCohortDialog.tsx',
    'app/api/**/*.ts',
    'app/auth/**/*.ts',
  ],

  projects: [
    // JSDOM project — UI components, validations, utils, stores, actions
    {
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/__tests__'],
      testMatch: [
        '<rootDir>/__tests__/unit/**/*.test.ts',
        '<rootDir>/__tests__/unit/**/*.test.tsx',
        '<rootDir>/__tests__/integration/actions/**/*.test.ts',
        '<rootDir>/__tests__/integration/notifications/**/*.test.ts',
        '<rootDir>/__tests__/integration/supabase/**/*.test.ts',
        '<rootDir>/__tests__/integration/auth/get-session-user.test.ts',
      ],
      moduleNameMapper: sharedModuleNameMapper,
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      transform: sharedTransform,
      transformIgnorePatterns: ['/node_modules/(?!(lucide-react)/)'],
    },
    // Node project — API routes & middleware (need Request/Response globals)
    {
      displayName: 'node',
      testEnvironment: 'node',
      roots: ['<rootDir>/__tests__'],
      testMatch: [
        '<rootDir>/__tests__/api/**/*.test.ts',
        '<rootDir>/__tests__/integration/auth/middleware.test.ts',
      ],
      moduleNameMapper: sharedModuleNameMapper,
      transform: sharedTransform,
      transformIgnorePatterns: ['/node_modules/(?!(lucide-react)/)'],
    },
  ],
}

export default config
