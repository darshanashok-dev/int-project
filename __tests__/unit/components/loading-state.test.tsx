import React from 'react'
import { render, screen } from '@testing-library/react'
import { LoadingState } from '@/components/shared/loading-state'

describe('LoadingState', () => {
  it('should render the default loading message', () => {
    render(<LoadingState />)
    expect(screen.getByText('Synchronizing with ecosystem...')).toBeInTheDocument()
  })

  it('should render a custom message when provided', () => {
    render(<LoadingState message="Loading milestones..." />)
    expect(screen.getByText('Loading milestones...')).toBeInTheDocument()
  })

  it('should contain the helper text', () => {
    render(<LoadingState />)
    expect(
      screen.getByText(/Please keep this window open/)
    ).toBeInTheDocument()
  })

  it('should render a spinner element', () => {
    const { container } = render(<LoadingState />)
    // The component has an animate-spin div wrapping the loader
    const spinnerEl = container.querySelector('.animate-spin')
    expect(spinnerEl).toBeInTheDocument()
  })
})
