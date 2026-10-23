import PageHero from '../components/layout/PageHero'
import AsyncView from '../components/ui/AsyncView'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'
import { HeartPulse, Footprints, Sprout, Users } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getDifficulty } from '../features/trek/api'

const fitnessIcons = [HeartPulse, Footprints, Sprout, Users]

export default function Difficulty({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Difficulty & Fitness', description: 'Kedarkantha is an easy-moderate trek. See the fitness level and age guidance before you book.' })
  const state = useAsync(getDifficulty)
  return (
    <>
      <PageHero embedded={embedded} title="Difficulty & Fitness" subtitle="Know what to expect before you go." focus="70% 45%" />
      <section className="container-page py-8 sm:py-12">
        <AsyncView state={state}>
          {(d) => (
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="p-5 sm:p-6">
                <h2 className="text-lg font-bold">Difficulty Level</h2>
                <p className="mt-2 flex items-center gap-2 text-xl font-bold text-forest">
                  <Icon name="gauge" size={22} /> {d.level}
                </p>
                <div className="mt-4 flex items-end gap-1.5" role="img" aria-label={`Difficulty ${d.score} out of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} style={{ height: 10 + n * 8 }} className={`w-8 rounded-sm ${n <= d.score ? 'bg-cta' : 'bg-sage'}`} />
                  ))}
                </div>
              </Card>
              <Card className="p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-bold">Fitness Requirements</h2>
                <ul className="space-y-4">
                  {d.fitness.map((t, i) => {
                    const I = fitnessIcons[i % fitnessIcons.length]
                    return (
                      <li key={t} className="flex items-center gap-3 text-sm text-muted">
                        <I size={18} className="shrink-0 text-forest" aria-hidden="true" /> {t}
                      </li>
                    )
                  })}
                </ul>
              </Card>
            </div>
          )}
        </AsyncView>
      </section>
    </>
  )
}
