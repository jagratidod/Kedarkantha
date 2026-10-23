import { CheckCircle2, XCircle } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import CTABanner from '../components/layout/CTABanner'
import AsyncView from '../components/ui/AsyncView'
import Card from '../components/ui/Card'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getInclusions } from '../features/trek/api'

function List({ title, items, Icon, tone }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-3 text-sm text-muted">
            <Icon size={18} className={`mt-0.5 shrink-0 ${tone}`} aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function Inclusions({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Inclusions & Exclusions', description: 'See what is included in the Kedarkantha trek price and what you need to arrange yourself.' })
  const state = useAsync(getInclusions)
  return (
    <>
      <PageHero embedded={embedded} title="Inclusions & Exclusions" subtitle="Know exactly what your trek price covers." focus="30% 70%" />
      <section className="container-page py-8 sm:py-12">
        <AsyncView state={state}>
          {(d) => (
            <div className="grid gap-5 md:grid-cols-2">
              <List title="What's Included" items={d.included} Icon={CheckCircle2} tone="text-seat-ok" />
              <List title="What's Not Included" items={d.excluded} Icon={XCircle} tone="text-seat-low" />
            </div>
          )}
        </AsyncView>
      </section>
      {!embedded && <CTABanner title="Ready for the Adventure?" text="Secure your spot for the next Kedarkantha trek." label="View Departure Dates" to="/departures" />}
    </>
  )
}
