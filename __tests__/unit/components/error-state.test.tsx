import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorState } from '@/components/shared/error-state'

describe('ErrorState', () => {
  it('should render the default error message', () => {
    render(<ErrorState />)
    expect(screen.getByText('Telemetry Error')).toBeInTheDocument()
    expect(screen.getByText('An error occurred while loading this view.')).toBeInTheDocument()
  })

  it('should render a custom error message', () => {
    render(<ErrorState message="Supabase connection timeout" />)
    expect(screen.getByText('Supabase connection timeout')).toBeInTheDocument()
  })

  it('should show retry button when onRetry is provided', () => {
    const onRetry = jest.fn()
    render(<ErrorState onRetry={onRetry} />)
    const retryButton = screen.getByText(/Reconnect Telemetry/)
    expect(retryButton).toBeInTheDocument()
  })

  it('should NOT show retry button when onRetry is absent', () => {
    render(<ErrorState />)
    expect(screen.queryByText(/Reconnect Telemetry/)).not.toBeInTheDocument()
  })

  it('should call onRetry when the retry button is clicked', () => {
    const onRetry = jest.fn()
    render(<ErrorState onRetry={onRetry} />)
    fireEvent.click(screen.getByText(/Reconnect Telemetry/))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should display the error details section', () => {
    render(<ErrorState message="Custom error detail" />)
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('Custom error detail')).toBeInTheDocument()
  })
})
