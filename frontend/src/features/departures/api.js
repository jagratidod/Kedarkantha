import { request, ApiError } from '../../lib/apiClient'
import { departures, departureMonths } from './data'

export const getDepartures = () =>
  request('/departures', { mock: () => ({ items: departures, months: departureMonths }) })

export const getDeparture = (id) =>
  request(`/departures/${id}`, {
    mock: () => {
      const d = departures.find((x) => x.id === id)
      if (!d) throw new ApiError('Departure not found', 404)
      return d
    },
  })
