import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock supabase browser client
const mockSignOut = jest.fn().mockResolvedValue({ error: null })
jest.mock('@/lib/supabase/browser', () => ({
  supabase: {
    auth: {
      signOut: mockSignOut,
    },
  },
}))

import { LogoutButton } from '@/components/shared/LogoutButton'

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('LogoutButton', () => {
  const mocks = (globalThis as any).__mocks__

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mock mode
    process.env.NEXT_PUBLIC_MOCK_MODE = 'false'
  })

  it('should render the logout button text', () => {
    renderWithProviders(<LogoutButton />)
    expect(screen.getByText('Account Logout')).toBeInTheDocument()
  })

  it('should render the description text', () => {
    renderWithProviders(<LogoutButton />)
    expect(screen.getByText(/Securely end your current Polaris session/)).toBeInTheDocument()
  })

  it('should call supabase.auth.signOut() in real mode', async () => {
    renderWithProviders(<LogoutButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to "/login" after logout', async () => {
    renderWithProviders(<LogoutButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mocks.router.push).toHaveBeenCalledWith('/login')
      expect(mocks.router.refresh).toHaveBeenCalled()
    })
  })

  it('should clear mock cookies in mock mode', async () => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'true'

    // Spy on document.cookie setter
    const cookieSpy = jest.spyOn(document, 'cookie', 'set')

    renderWithProviders(<LogoutButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(cookieSpy).toHaveBeenCalled()
      expect(mocks.router.push).toHaveBeenCalledWith('/login')
    })

    cookieSpy.mockRestore()
  })

  it('should not call supabase signOut in mock mode', async () => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'true'

    renderWithProviders(<LogoutButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockSignOut).not.toHaveBeenCalled()
    })
  })
})
