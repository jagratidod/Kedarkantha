import PageHero from '../components/layout/PageHero'
import AsyncView from '../components/ui/AsyncView'
import Card from '../components/ui/Card'
import Img from '../components/ui/Img'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getBestTime } from '../features/trek/api'

export default function BestTime({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Best Time to Visit', description: 'The best months for the Kedarkantha trek: snow from December to February, clear views in March and April.' })
  const state = useAsync(getBestTime)
  return (
    <>
      <PageHero embedded={embedded} title="Best Time to Visit" subtitle="Choose the season that suits you." focus="55% 30%" />
      <section className="container-page py-8 sm:py-12">
        <AsyncView state={state}>
          {(d) => (
            <>
              <ul className="space-y-4">
                {d.seasons.map((s) => (
                  <li key={s.months}>
                    <Card className="flex items-center gap-4 p-3 sm:p-4">
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-36"><Img focus={s.focus} sizes="150px" /></div>
                      <div>
                        <h2 className="font-bold">{s.months}</h2>
                        <p className="text-sm text-muted">{s.note}</p>
                        <p className="text-xs text-muted">{s.temp}</p>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted">{d.disclaimer}</p>
            </>
          )}
        </AsyncView>
      </section>
    </>
  )
}
