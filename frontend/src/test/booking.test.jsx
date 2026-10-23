import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from '../app/router'

const renderAt = (path) => render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>)

beforeEach(() => { sessionStorage.clear(); localStorage.clear() })

describe('booking flow', () => {
  it('redirects to step 1 when skipping ahead', async () => {
    renderAt('/book/payment')
    expect(await screen.findByRole('heading', { name: /choose your date/i })).toBeInTheDocument()
  })

  it('completes date -> traveller -> payment -> confirmation', async () => {
    const user = userEvent.setup()
    renderAt('/book/date?departure=d2')
    await user.click(await screen.findByRole('button', { name: /continue/i }))

    await user.type(await screen.findByLabelText(/full name/i), 'Asha Rao')
    await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
    await user.type(screen.getByLabelText(/phone/i), '9876543210')
    await user.click(screen.getByRole('button', { name: /pay now/i }))

    await user.click(await screen.findByLabelText(/upi/i))
    await user.click(screen.getByRole('button', { name: /pay now/i }))

    expect(await screen.findByRole('heading', { name: /booking confirmed/i }, { timeout: 3000 })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('17 Jan 2025')).toBeInTheDocument())
  })

  it('shows validation errors for empty traveller form', async () => {
    const user = userEvent.setup()
    renderAt('/book/date?departure=d2')
    await user.click(await screen.findByRole('button', { name: /continue/i }))
    await user.click(await screen.findByRole('button', { name: /pay now/i }))
    expect(await screen.findAllByRole('alert')).not.toHaveLength(0)
  })
})
