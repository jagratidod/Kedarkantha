import { Clock, Info, MapPin } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import AsyncView from '../components/ui/AsyncView'
import Card from '../components/ui/Card'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getPickup } from '../features/trek/api'

// Schematic route (no map API/keys needed). Swap for an embedded map later.
function RouteMap() {
  return (
    <svg viewBox="0 0 400 200" role="img" aria-label="Route from Dehradun to Sankri" className="h-full w-full rounded-xl bg-sage">
      <path d="M0 150 Q80 120 140 140 T280 70 T400 40" stroke="#E1E6DD" strokeWidth="14" fill="none" />
      <path d="M90 128 Q150 140 200 105 T310 60" stroke="#66866A" strokeWidth="3" strokeDasharray="6 6" fill="none" />
      <circle cx="90" cy="128" r="9" fill="#D92D20" /><text x="60" y="155" fontSize="13" fontWeight="600" fill="#17231B">Dehradun</text>
      <circle cx="310" cy="60" r="9" fill="#2F7D4F" /><text x="285" y="46" fontSize="13" fontWeight="600" fill="#17231B">Sankri</text>
    </svg>
  )
}

export default function PickupDrop({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Pickup & Drop Information', description: 'Pickup points and timings in Dehradun for the Kedarkantha trek, plus return drop details.' })
  const state = useAsync(getPickup)
  return (
    <>
      <PageHero embedded={embedded} title="Pickup & Drop Information" subtitle="Convenient meeting points in Dehradun." focus="40% 80%" />
      <section className="container-page py-8 sm:py-12">
        <AsyncView state={state}>
          {(d) => (
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-bold">Pickup Points</h2>
                <ul className="space-y-4">
                  {d.points.map((p) => (
                    <li key={p.name} className="flex items-center gap-3">
                      <MapPin size={20} className="text-forest" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="flex items-center gap-1 text-xs text-muted"><Clock size={12} aria-hidden="true" /> {p.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 aspect-[2/1]"><RouteMap /></div>
              </Card>
              <Card className="h-fit p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-bold">Drop Information</h2>
                <ul className="space-y-3">
                  {d.drop.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-muted">
                      <Info size={16} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" /> {t}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </AsyncView>
      </section>
    </>
  )
}
