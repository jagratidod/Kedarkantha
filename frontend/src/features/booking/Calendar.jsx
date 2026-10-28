import { ChevronLeft, ChevronRight } from 'lucide-react'

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/**
 * Month grid. `available` maps ISO date -> departure; only those days are clickable.
 * `cursor` is {y, m}; `onMonth(delta)` moves it (disabled flags control the arrows).
 */
export default function Calendar({ cursor, available, selectedDate, onSelect, onMonth, canPrev, canNext }) {
  const first = new Date(cursor.y, cursor.m, 1).getDay()
  const days = new Date(cursor.y, cursor.m + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const iso = (d) => `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  return (
    <div className="rounded-xl border border-white/10 bg-[#132A3E] p-4 text-white">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => onMonth(-1)} className="rounded p-1 text-white/70 hover:bg-white/10 disabled:opacity-30">
          <ChevronLeft size={18} />
        </button>
        <p className="text-sm font-bold" aria-live="polite">{NAMES[cursor.m]} {cursor.y}</p>
        <button type="button" aria-label="Next month" disabled={!canNext} onClick={() => onMonth(1)} className="rounded p-1 text-white/70 hover:bg-white/10 disabled:opacity-30">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DOW.map((d) => <span key={d} className="py-1 font-semibold text-[#8FAEC5]">{d}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />
          const date = iso(d)
          const dep = available[date]
          const selected = date === selectedDate
          if (!dep) return <span key={date} className="py-2 text-white/30">{d}</span>
          return (
            <button
              key={date}
              type="button"
              disabled={dep.seats <= 0}
              aria-pressed={selected}
              aria-label={`${d} ${NAMES[cursor.m]}, ${dep.seats} seats left`}
              onClick={() => onSelect(dep)}
              className={`rounded-md py-2 font-semibold ${selected ? 'bg-[#4F87A8] text-white shadow' : 'bg-white/10 text-white hover:bg-[#1F4663]'} disabled:opacity-40`}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}
