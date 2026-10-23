const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const formatPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const parse = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m: m - 1, d }
}

/** "2025-01-10" -> "10 Jan 2025" */
export function formatDate(iso) {
  const { y, m, d } = parse(iso)
  return `${String(d).padStart(2, '0')} ${MONTHS[m]} ${y}`
}

export const monthName = (iso) => MONTH_FULL[parse(iso).m]

/** Seat tone: red <=8, amber <=10, green otherwise */
export function seatTone(seats) {
  if (seats <= 0) return 'sold'
  if (seats <= 8) return 'low'
  if (seats <= 10) return 'mid'
  return 'ok'
}

export const seatLabel = (seats) => (seats <= 0 ? 'Sold out' : `${seats} Seats Left`)
