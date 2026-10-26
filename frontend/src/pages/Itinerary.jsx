import AsyncView from '../components/ui/AsyncView'
import ItineraryScrollCanvas from '../components/sections/ItineraryScrollCanvas'
import CTABanner from '../components/layout/CTABanner'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getItinerary } from '../features/trek/api'

export default function Itinerary({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Treki Travels - Trust, Support & Safety', description: 'Certified Himalayan Guides, 24/7 mountain assistance, and verified alpine safety standards.' })

  return (
    <>
      <ItineraryScrollCanvas embedded={embedded} />
      {!embedded && <CTABanner title="Ready for the Adventure?" text="Secure your spot for the next Kedarkantha trek." label="View Departure Dates" to="/departures" />}
    </>
  )
}
