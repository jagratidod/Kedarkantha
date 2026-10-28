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
                done || active ? 'bg-[#1F4663] text-white ring-1 ring-white/20' : 'bg-white/10 text-white/50'
              }`}
            >
              {done ? <Check size={14} /> : i + 1}
            </span>
            <span className={`hidden text-xs font-semibold sm:block ${active ? 'text-white' : 'text-white/60'}`}>{s}</span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-white/20" />}
          </li>
        )
      })}
    </ol>
  )
}
