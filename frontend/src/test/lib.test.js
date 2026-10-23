import { formatDate, formatPrice, seatTone, monthName } from '../lib/format'
import { travellerSchema, validate } from '../lib/validation'

describe('format', () => {
  it('formats rupees with Indian grouping', () => {
    expect(formatPrice(7999)).toBe('₹7,999')
    expect(formatPrice(125000)).toBe('₹1,25,000')
  })
  it('formats ISO dates', () => {
    expect(formatDate('2025-01-10')).toBe('10 Jan 2025')
    expect(monthName('2025-02-07')).toBe('February')
  })
  it('classifies seat availability', () => {
    expect(seatTone(0)).toBe('sold')
    expect(seatTone(5)).toBe('low')
    expect(seatTone(20)).toBe('ok')
  })
})

describe('traveller validation', () => {
  const good = { fullName: 'Asha Rao', email: 'asha@example.com', phone: '9876543210', travellers: 2 }
  it('accepts valid input', () => {
    expect(validate(travellerSchema, good).ok).toBe(true)
  })
  it('rejects bad email, phone and count', () => {
    const r = validate(travellerSchema, { ...good, email: 'nope', phone: '12345', travellers: 0 })
    expect(r.ok).toBe(false)
    expect(Object.keys(r.errors)).toEqual(expect.arrayContaining(['email', 'phone', 'travellers']))
  })
})
