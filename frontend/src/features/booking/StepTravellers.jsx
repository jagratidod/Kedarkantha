import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import AsyncView from '../../components/ui/AsyncView'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
import { useAsync } from '../../hooks/useAsync'
import { useSeo } from '../../hooks/useSeo'
import { getDeparture } from '../departures/api'
import { formatDate, formatPrice } from '../../lib/format'
import { travellerSchema, validate } from '../../lib/validation'
import { useBooking } from './BookingContext'

function Form({ departure }) {
  const { draft, update } = useBooking()
  const navigate = useNavigate()
  const [form, setForm] = useState(draft.traveller)
  const [count, setCount] = useState(Math.min(draft.travellers, departure.seats))
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const r = validate(travellerSchema, { ...form, travellers: count })
    setErrors(r.errors)
    if (!r.ok) return
    const { travellers, ...traveller } = r.data
    update({ traveller, travellers })
    navigate('/book/payment')
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <h1 className="text-2xl font-bold">Traveller Information</h1>
      <p className="rounded-lg bg-sage px-4 py-3 text-sm">
        {formatDate(departure.date)} · {formatPrice(departure.price)} per person · {departure.seats} seats left
      </p>
      <Field label="Full Name" placeholder="Enter full name" autoComplete="name" value={form.fullName} onChange={set('fullName')} error={errors.fullName} />
      <Field label="Email" type="email" placeholder="Enter email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
      <Field label="Phone" type="tel" inputMode="numeric" placeholder="Enter phone number" autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
      <div>
        <p className="mb-1.5 text-sm font-semibold">Number of Travellers</p>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Decrease travellers" disabled={count <= 1} onClick={() => setCount((c) => c - 1)} className="rounded-lg border border-line bg-white p-3 disabled:opacity-40"><Minus size={16} /></button>
          <span className="w-10 text-center text-lg font-bold" aria-live="polite">{count}</span>
          <button type="button" aria-label="Increase travellers" disabled={count >= Math.min(10, departure.seats)} onClick={() => setCount((c) => c + 1)} className="rounded-lg border border-line bg-white p-3 disabled:opacity-40"><Plus size={16} /></button>
          <span className="ml-auto text-sm text-muted">Total <b className="text-ink">{formatPrice(departure.price * count)}</b></span>
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full">Pay Now <ArrowRight size={16} aria-hidden="true" /></Button>
    </form>
  )
}

export default function StepTravellers() {
  useSeo({ title: 'Book Your Trek - Traveller Details' })
  const { draft } = useBooking()
  const state = useAsync(() => (draft.departureId ? getDeparture(draft.departureId) : Promise.resolve(null)), [draft.departureId])
  if (!draft.departureId) return <Navigate to="/book/date" replace />
  return <AsyncView state={state}>{(dep) => (dep ? <Form departure={dep} /> : null)}</AsyncView>
}
