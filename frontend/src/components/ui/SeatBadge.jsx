import { seatLabel, seatTone } from '../../lib/format'

const tones = {
  low: 'text-seat-low',
  mid: 'text-seat-mid',
  ok: 'text-seat-ok',
  sold: 'text-muted',
}

export default function SeatBadge({ seats, className = '' }) {
  return <span className={`text-xs font-semibold ${tones[seatTone(seats)]} ${className}`}>{seatLabel(seats)}</span>
}
