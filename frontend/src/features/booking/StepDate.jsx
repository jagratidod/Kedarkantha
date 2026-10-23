import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AsyncView from '../../components/ui/AsyncView'
import Button from '../../components/ui/Button'
import SeatBadge from '../../components/ui/SeatBadge'
import { useAsync } from '../../hooks/useAsync'
import { useSeo } from '../../hooks/useSeo'
import { getDepartures } from '../departures/api'
import { formatDate, formatPrice } from '../../lib/format'
import { useBooking } from './BookingContext'
import Calendar from './Calendar'

const ym = (iso) => iso.slice(0, 7)

function Picker({ items }) {
  const { draft, update } = useBooking()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const months = useMemo(() => [...new Set(items.map((d) => ym(d.date)))].sort(), [items])
  const byDate = useMemo(() => Object.fromEntries(items.map((d) => [d.date, d])), [items])

  // Preselect from ?departure=ID (Book Now buttons) once.
  useEffect(() => {
    const id = params.get('departure')
    if (id && items.some((d) => d.id === id && d.seats > 0)) update({ departureId: id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selected = items.find((d) => d.id === draft.departureId)
  const [monthKey, setMonthKey] = useState(() => {
    const fromUrl = items.find((d) => d.id === params.get('departure'))
    return ym((fromUrl ?? selected ?? items[0]).date)
  })
  const idx = months.indexOf(monthKey)
  const [y, m] = monthKey.split('-').map(Number)
  const available = useMemo(() => Object.fromEntries(items.filter((d) => ym(d.date) === monthKey).map((d) => [d.date, d])), [items, monthKey])
  const inMonth = Object.values(available)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Choose Your Date</h1>
      <Calendar
        cursor={{ y, m: m - 1 }}
        available={byDate}
        selectedDate={selected?.date}
        onSelect={(d) => update({ departureId: d.id, travellers: Math.min(draft.travellers, d.seats) })}
        onMonth={(delta) => setMonthKey(months[idx + delta])}
        canPrev={idx > 0}
        canNext={idx < months.length - 1}
      />
      <ul className="space-y-2" aria-label="Departures this month">
        {inMonth.map((d) => {
          const on = d.id === draft.departureId
          return (
            <li key={d.id}>
              <button
                type="button"
                disabled={d.seats <= 0}
                aria-pressed={on}
                onClick={() => update({ departureId: d.id, travellers: Math.min(draft.travellers, d.seats) })}
                className={`flex w-full items-center justify-between rounded-xl border bg-white p-4 text-left disabled:opacity-50 ${on ? 'border-forest ring-2 ring-forest/20' : 'border-line'}`}
              >
                <span>
                  <span className="block text-sm font-semibold">{formatDate(d.date)}</span>
                  <SeatBadge seats={d.seats} />
                </span>
                <span className="text-right">
                  <span className="block font-bold">{formatPrice(d.price)}</span>
                  <span className="text-[11px] text-muted">per person</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <Button size="lg" className="w-full" disabled={!selected} onClick={() => navigate('/book/travellers')}>
        Continue <ArrowRight size={16} aria-hidden="true" />
      </Button>
    </div>
  )
}

export default function StepDate() {
  useSeo({ title: 'Book Your Trek - Select Date' })
  const state = useAsync(getDepartures)
  return <AsyncView state={state}>{({ items }) => <Picker items={items} />}</AsyncView>
}
