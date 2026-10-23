import { Check } from 'lucide-react'

export default function Stepper({ steps, current }) {
  return (
    <ol className="flex items-center justify-between gap-1" aria-label="Booking progress">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={s} className="flex flex-1 items-center gap-2" aria-current={active ? 'step' : undefined}>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                done || active ? 'bg-forest text-white' : 'bg-sage text-muted'
              }`}
            >
              {done ? <Check size={14} /> : i + 1}
            </span>
            <span className={`hidden text-xs font-semibold sm:block ${active ? 'text-ink' : 'text-muted'}`}>{s}</span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-line" />}
          </li>
        )
      })}
    </ol>
  )
}
