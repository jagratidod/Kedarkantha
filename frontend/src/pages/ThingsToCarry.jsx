import { useState } from 'react'
import PageHero from '../components/layout/PageHero'
import AsyncView from '../components/ui/AsyncView'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'
import Chips from '../components/ui/Chips'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getThingsToCarry } from '../features/trek/api'

const TABS = ['Mandatory Items', 'Optional Items']

export default function ThingsToCarry({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Things to Carry', description: 'Packing list for the Kedarkantha trek: mandatory gear and optional extras.' })
  const state = useAsync(getThingsToCarry)
  const [tab, setTab] = useState(TABS[0])
  return (
    <>
      <PageHero embedded={embedded} title="Things to Carry" subtitle="Pack smart for the snow." focus="25% 55%" />
      <section className="container-page py-8 sm:py-12">
        <AsyncView state={state}>
          {(d) => {
            const items = tab === TABS[0] ? d.mandatory : d.optional
            return (
              <>
                <Chips options={TABS} value={tab} onChange={setTab} label="Item type" className="mb-5" />
                <Card className="p-5 sm:p-6">
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {items.map((i) => (
                      <li key={i.text} className="flex items-center gap-3 text-sm text-muted">
                        <Icon name={i.icon} size={20} className="shrink-0 text-ink" /> {i.text}
                      </li>
                    ))}
                  </ul>
                </Card>
              </>
            )
          }}
        </AsyncView>
      </section>
    </>
  )
}
