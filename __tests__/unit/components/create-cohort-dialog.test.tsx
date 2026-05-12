import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the hooks and UI components
const mockCreateProgram = jest.fn()
jest.mock('@/lib/hooks/use-programs', () => ({
  useCreateProgram: () => ({
    mutate: mockCreateProgram,
    isPending: false,
  }),
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" data-open={open}>
      {typeof children === 'function' ? children() : children}
    </div>
  ),
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogTrigger: ({ children }: any) => <div data-testid="dialog-trigger">{children}</div>,
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}))

import { CreateCohortDialog } from '@/components/admin/CreateCohortDialog'

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('CreateCohortDialog', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('should render the Create Cohort trigger button', () => {
    renderWithProviders(<CreateCohortDialog />)
    // The trigger button says "Create Cohort" — but so does the submit button.
    // Use the trigger testid to scope.
    const trigger = screen.getByTestId('dialog-trigger')
    expect(trigger).toHaveTextContent('Create Cohort')
  })

  it('should render the dialog title', () => {
    renderWithProviders(<CreateCohortDialog />)
    // Since our mock Dialog always renders children, we see the form immediately
    expect(screen.getByText('Create New Cohort')).toBeInTheDocument()
  })

  it('should render all form fields', () => {
    renderWithProviders(<CreateCohortDialog />)
    expect(screen.getByText('Program Name')).toBeInTheDocument()
    expect(screen.getByText('Cohort Year/Batch')).toBeInTheDocument()
    expect(screen.getByText('Start Date')).toBeInTheDocument()
    expect(screen.getByText('End Date')).toBeInTheDocument()
    expect(screen.getByText('Max Startups')).toBeInTheDocument()
  })

  it('should render form inputs with correct types', () => {
    renderWithProviders(<CreateCohortDialog />)
    const nameInput = screen.getByPlaceholderText('e.g. Summer Accelerator')
    const cohortInput = screen.getByPlaceholderText('e.g. 2024')
    expect(nameInput).toBeInTheDocument()
    expect(cohortInput).toBeInTheDocument()

    // Date inputs
    const startDateInput = screen.getByLabelText('Start Date') as HTMLInputElement
    expect(startDateInput.type).toBe('date')

    // Number input
    const maxInput = screen.getByLabelText('Max Startups') as HTMLInputElement
    expect(maxInput.type).toBe('number')
  })

  it('should have a submit button', () => {
    renderWithProviders(<CreateCohortDialog />)
    // The submit button is inside the form, of type submit
    const submitButtons = screen.getAllByRole('button', { name: /create cohort/i })
    const submitBtn = submitButtons.find(
      (btn) => btn.getAttribute('type') === 'submit'
    )
    expect(submitBtn).toBeDefined()
  })
})
