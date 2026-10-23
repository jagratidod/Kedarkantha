import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import SeatBadge from '../ui/SeatBadge'
import Button from '../ui/Button'
import { formatDate, formatPrice } from '../../lib/format'

/** Compact card used on the Home page. */
export default function DepartureCard({ departure }) {
  const sold = departure.seats <= 0
  return (
    <Card className="relative flex flex-col gap-2 p-4">
      {departure.popular && (
        <span className="absolute -top-2.5 left-3 rounded bg-forest px-2 py-0.5 text-[10px] font-bold uppercase text-white">Most Popular</span>
      )}
      <p className="text-sm font-semibold">{formatDate(departure.date)}</p>
      <SeatBadge seats={departure.seats} />
      <p className="mt-1 text-xl font-bold">
        {formatPrice(departure.price)} <span className="text-[11px] font-normal text-muted">per person</span>
      </p>
      <Button to={`/book/date?departure=${departure.id}`} size="sm" className={`mt-2 w-full ${sold ? 'pointer-events-none opacity-50' : ''}`} aria-disabled={sold}>
        Book Now
      </Button>
    </Card>
  )
}

export function DepartureRow({ departure }) {
  const sold = departure.seats <= 0
  return (
    <Card className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 p-4 sm:grid-cols-[1.2fr_1fr_auto_auto] sm:gap-6 sm:p-5">
      <div>
        <p className="font-semibold">{formatDate(departure.date)}</p>
        <SeatBadge seats={departure.seats} />
      </div>
      <div className="text-right sm:text-left">
        <p className="text-lg font-bold">{formatPrice(departure.price)}</p>
        <p className="text-[11px] text-muted">per person</p>
      </div>
      <Link to="/itinerary" className="hidden text-sm text-muted hover:text-ink sm:block">View Details</Link>
      <Button
        to={`/book/date?departure=${departure.id}`}
        className={`col-span-2 sm:col-span-1 ${sold ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={sold}
      >
        {sold ? 'Sold Out' : 'Book Now'}
      </Button>
    </Card>
  )
}
