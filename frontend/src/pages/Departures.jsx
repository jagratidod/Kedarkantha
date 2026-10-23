import { useState } from 'react'
import PageHero from '../components/layout/PageHero'
import AsyncView from '../components/ui/AsyncView'
import Chips from '../components/ui/Chips'
import PriceIncludes from '../components/sections/PriceIncludes'
import { DepartureRow } from '../components/sections/DepartureCard'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getDepartures } from '../features/departures/api'
import { monthName } from '../lib/format'

export default function Departures({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Upcoming Departure Dates', description: 'Choose your preferred Kedarkantha trek date. Prices from ₹7,999 per person, with seats left shown live.' })
  const state = useAsync(getDepartures)
  const [month, setMonth] = useState('January')

  return (
    <>
      <PageHero embedded={embedded} title="Upcoming Departure Dates" subtitle="Choose your preferred date and book your Kedarkantha trek." focus="50% 35%" />
      <div className="container-page space-y-6 py-8 sm:py-12">
        <AsyncView state={state}>
          {({ items, months }) => {
            const options = ['All Months', ...months]
            const list = month === 'All Months' ? items : items.filter((d) => monthName(d.date) === month)
            return (
              <>
                <Chips options={options} value={month} onChange={setMonth} label="Filter by month" />
                {list.length === 0 ? (
                  <p className="rounded-xl bg-white p-8 text-center text-muted shadow-card">No departures in {month}. Try another month.</p>
                ) : (
                  <ul className="space-y-3">
                    {list.map((d) => <li key={d.id}><DepartureRow departure={d} /></li>)}
                  </ul>
                )}
              </>
            )
          }}
        </AsyncView>
        <PriceIncludes />
      </div>
    </>
  )
}
