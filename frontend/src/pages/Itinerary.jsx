import AsyncView from '../components/ui/AsyncView'
import ItineraryScrollCanvas from '../components/sections/ItineraryScrollCanvas'
import CTABanner from '../components/layout/CTABanner'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getItinerary } from '../features/trek/api'

export default function Itinerary({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Day-wise Itinerary', description: 'A 6-day Kedarkantha trek itinerary from Dehradun to Sankri, Juda Ka Talab, Base Camp and the summit.' })
  const state = useAsync(getItinerary)

  return (
    <>
      <AsyncView state={state}>
        {(days) => <ItineraryScrollCanvas days={days} embedded={embedded} />}
      </AsyncView>
      {!embedded && <CTABanner title="Ready for the Adventure?" text="Secure your spot for the next Kedarkantha trek." label="View Departure Dates" to="/departures" />}
    </>
  )
}
