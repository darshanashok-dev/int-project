import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

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

describe('LogoutButton', () => {
  const mocks = (globalThis as any).__mocks__

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mock mode
    process.env.NEXT_PUBLIC_MOCK_MODE = 'false'
  })

  it('should render the logout button text', () => {
    render(<LogoutButton />)
    expect(screen.getByText('Account Logout')).toBeInTheDocument()
  })

  it('should render the description text', () => {
    render(<LogoutButton />)
    expect(screen.getByText(/Securely end your current Polaris session/)).toBeInTheDocument()
  })

  it('should call supabase.auth.signOut() in real mode', async () => {
    render(<LogoutButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to "/" after logout', async () => {
    render(<LogoutButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mocks.router.push).toHaveBeenCalledWith('/')
      expect(mocks.router.refresh).toHaveBeenCalled()
    })
  })

  it('should clear mock cookies in mock mode', async () => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'true'

    // Spy on document.cookie setter
    const cookieSpy = jest.spyOn(document, 'cookie', 'set')

    render(<LogoutButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(cookieSpy).toHaveBeenCalled()
      expect(mocks.router.push).toHaveBeenCalledWith('/')
    })

    cookieSpy.mockRestore()
  })

  it('should not call supabase signOut in mock mode', async () => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'true'

    render(<LogoutButton />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockSignOut).not.toHaveBeenCalled()
    })
  })
})
