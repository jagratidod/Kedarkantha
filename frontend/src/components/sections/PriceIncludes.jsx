import Icon from '../ui/Icon'
import { departureFeatures } from '../../features/trek/data'

export default function PriceIncludes() {
  return (
    <section className="rounded-[var(--radius-card)] bg-sage p-5 sm:p-8" aria-labelledby="inc-title">
      <h2 id="inc-title" className="mb-5 flex items-center gap-2 text-base font-bold sm:text-lg">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-forest text-[10px] text-forest">?</span>
        What&apos;s Included in the Price?
      </h2>
      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {departureFeatures.map((f) => (
          <li key={f.title} className="flex items-start gap-2.5">
            <Icon name={f.icon} size={22} className="mt-0.5 shrink-0 text-forest" />
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-muted">{f.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
