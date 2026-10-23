import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useBooking } from '../features/booking/BookingContext'
import { Check, Download } from 'lucide-react'
import AsyncView from '../components/ui/AsyncView'
import Button from '../components/ui/Button'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getBooking } from '../features/booking/api'
import { formatDate, formatPrice } from '../lib/format'

function downloadTicket(b) {
  const text = [
    'TREKI TRAVELS - KEDARKANTHA TREK',
    `Booking ID : ${b.id}`,
    `Name       : ${b.traveller.fullName}`,
    `Date       : ${formatDate(b.date)}`,
    `Travellers : ${b.travellers}`,
    `Amount     : ${formatPrice(b.amount)}`,
    '',
    'Please carry a valid photo ID.',
  ].join('\n')
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `ticket-${b.id}.txt` })
  a.click()
  URL.revokeObjectURL(url)
}

export default function BookingConfirmed() {
  useSeo({ title: 'Booking Confirmed' })
  const { id } = useParams()
  const { reset } = useBooking()
  // Draft is cleared here (not on payment) so the payment step doesn't redirect mid-navigation.
  useEffect(() => { reset() }, [reset])
  const state = useAsync(() => getBooking(id), [id])
  return (
    <div className="container-page max-w-md py-10">
      <AsyncView state={state}>
        {(b) => (
          <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-card">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cta text-white"><Check size={32} aria-hidden="true" /></span>
            <h1 className="mt-4 text-2xl font-bold">Booking Confirmed!</h1>
            <p className="mt-1 text-sm text-muted">Your trek has been confirmed. Details sent to {b.traveller.email}.</p>
            <dl className="mt-6 space-y-2 rounded-xl bg-offwhite p-4 text-left text-sm">
              {[['Booking ID', b.id], ['Date', formatDate(b.date)], ['Travellers', b.travellers], ['Amount', formatPrice(b.amount)]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
              ))}
            </dl>
            <Button size="lg" className="mt-6 w-full" onClick={() => downloadTicket(b)}><Download size={16} aria-hidden="true" /> Download Ticket</Button>
            <Link to="/" className="mt-4 inline-block text-sm font-semibold text-forest hover:underline">Back to home</Link>
          </div>
        )}
      </AsyncView>
    </div>
  )
}
