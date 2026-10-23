import { request, ApiError } from '../../lib/apiClient'
import { departures } from '../departures/data'

const KEY = 'treki.bookings'
const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
const write = (v) => {
  try { localStorage.setItem(KEY, JSON.stringify(v)) } catch { /* storage unavailable */ }
}

const makeId = () => `TK${Date.now().toString().slice(-7)}${Math.floor(Math.random() * 90 + 10)}`

/** Mock payment + booking in one step. Replace with POST /bookings + payment gateway later. */
export const createBooking = (payload) =>
  request('/bookings', {
    method: 'POST',
    body: payload,
    mock: ({ departureId, travellers, traveller, method }) => {
      const dep = departures.find((d) => d.id === departureId)
      if (!dep) throw new ApiError('This departure is no longer available.', 404)
      if (travellers > dep.seats) throw new ApiError(`Only ${dep.seats} seats left for this date.`, 409)
      if (!method) throw new ApiError('Choose a payment method.', 400)
      const booking = {
        id: makeId(),
        departureId,
        date: dep.date,
        travellers,
        amount: dep.price * travellers,
        method,
        traveller,
        createdAt: new Date().toISOString(),
      }
      const all = read()
      all[booking.id] = booking
      write(all)
      return booking
    },
  })

export const getBooking = (id) =>
  request(`/bookings/${id}`, {
    mock: () => {
      const b = read()[id]
      if (!b) throw new ApiError('Booking not found.', 404)
      return b
    },
  })
