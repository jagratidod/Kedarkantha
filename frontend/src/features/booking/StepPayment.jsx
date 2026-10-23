import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Building2, CreditCard, Loader2, Smartphone, Wallet } from 'lucide-react'
import AsyncView from '../../components/ui/AsyncView'
import Button from '../../components/ui/Button'
import { useAsync } from '../../hooks/useAsync'
import { useSeo } from '../../hooks/useSeo'
import { getDeparture } from '../departures/api'
import { createBooking } from './api'
import { formatPrice } from '../../lib/format'
import { useBooking } from './BookingContext'

const METHODS = [
  { id: 'UPI', label: 'UPI', Icon: Smartphone },
  { id: 'Card', label: 'Credit/Debit Card', Icon: CreditCard },
  { id: 'NetBanking', label: 'Net Banking', Icon: Building2 },
  { id: 'Wallet', label: 'Wallets', Icon: Wallet },
]

function Pay({ departure }) {
  const { draft, update } = useBooking()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const total = departure.price * draft.travellers

  const pay = async () => {
    setBusy(true)
    setError('')
    try {
      // Mock payment: always succeeds if seats are available.
      const b = await createBooking({ departureId: departure.id, travellers: draft.travellers, traveller: draft.traveller, method: draft.method })
      navigate(`/booking/confirmed/${b.id}`, { replace: true })
    } catch (e) {
      setError(e.message || 'Payment failed. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Payment Details</h1>
      <div className="rounded-xl bg-sage p-4">
        <p className="text-xs text-muted">Total Amount</p>
        <p className="text-3xl font-bold">{formatPrice(total)}</p>
        <p className="text-xs text-muted">for {draft.travellers} traveller{draft.travellers > 1 ? 's' : ''}</p>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Payment Method</legend>
        <div className="space-y-2">
          {METHODS.map(({ id, label, Icon }) => (
            <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4 text-sm font-semibold ${draft.method === id ? 'border-forest ring-2 ring-forest/20' : 'border-line'}`}>
              <input type="radio" name="method" className="sr-only" checked={draft.method === id} onChange={() => update({ method: id })} />
              <Icon size={18} className="text-forest" aria-hidden="true" /> {label}
            </label>
          ))}
        </div>
      </fieldset>
      {error && <p role="alert" className="rounded-lg bg-seat-low/10 px-4 py-3 text-sm text-seat-low">{error}</p>}
      <Button size="lg" className="w-full" disabled={!draft.method || busy} onClick={pay}>
        {busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Processing...</> : <>Pay Now · {formatPrice(total)}</>}
      </Button>
      <p className="text-center text-xs text-muted">Demo mode: no real payment is taken.</p>
    </div>
  )
}

export default function StepPayment() {
  useSeo({ title: 'Book Your Trek - Payment' })
  const { draft } = useBooking()
  const ready = draft.departureId && draft.traveller.fullName
  const state = useAsync(() => (ready ? getDeparture(draft.departureId) : Promise.resolve(null)), [draft.departureId])
  if (!draft.departureId) return <Navigate to="/book/date" replace />
  if (!draft.traveller.fullName) return <Navigate to="/book/travellers" replace />
  return <AsyncView state={state}>{(dep) => (dep ? <Pay departure={dep} /> : null)}</AsyncView>
}
