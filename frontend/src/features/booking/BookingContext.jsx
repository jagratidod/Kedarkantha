import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'treki.draft'
const empty = { departureId: null, traveller: { fullName: '', email: '', phone: '' }, travellers: 1, method: null }

const load = () => {
  try { return { ...empty, ...JSON.parse(sessionStorage.getItem(KEY) || '{}') } } catch { return empty }
}

const Ctx = createContext(null)

/** Booking draft shared across the steps; persisted in sessionStorage so refresh keeps progress. */
export function BookingProvider({ children }) {
  const [draft, setDraft] = useState(load)

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(draft)) } catch { /* storage unavailable */ }
  }, [draft])

  const update = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), [])
  const reset = useCallback(() => setDraft(empty), [])
  const value = useMemo(() => ({ draft, update, reset }), [draft, update, reset])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useBooking() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useBooking must be used inside BookingProvider')
  return v
}
