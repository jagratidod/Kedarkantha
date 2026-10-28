import AsyncView from '../components/ui/AsyncView'
import Itinerary from './Itinerary'
import Departures from './Departures'
import PhotoStory from '../components/sections/PhotoStory'
import FullscreenMoments from '../components/sections/FullscreenMoments'
import BehindMountains from '../components/sections/BehindMountains'
import HorizontalGallery from '../components/sections/HorizontalGallery'
import ThingsCarryShowcase from '../components/sections/ThingsCarryShowcase'
import About from './About'
import Inclusions from './Inclusions'
import PickupDrop from './PickupDrop'
import Difficulty from './Difficulty'
import BestTimeShowcase from '../components/sections/BestTimeShowcase'
import Faqs from './Faqs'
import Reviews from './Reviews'
import RaggedBridge from '../components/layout/RaggedBridge'
import ItineraryJourney from '../components/sections/ItineraryJourney'
import ScrollHero from '../components/sections/ScrollHero'
import CTABanner from '../components/layout/CTABanner'
import { useSeo } from '../hooks/useSeo'
import { useAsync } from '../hooks/useAsync'
import { getHome } from '../features/trek/api'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: 'Kedarkantha Trek',
  description: 'Guided 5-6 day winter trek to Kedarkantha summit (12,500 ft) from Sankri, Uttarakhand.',
  provider: { '@type': 'TravelAgency', name: 'Treki Travels' },
  offers: { '@type': 'Offer', priceCurrency: 'INR', price: 7999 },
}

function Hero({ trek, highlights }) {
  return <ScrollHero trek={trek} stats={trek.stats} photos={highlights.slice(0, 3)} />
}
// Sections that share the continuous 'long bg.png' background
const LONG_BG_SECTIONS = [
  ['difficulty', Difficulty],
]

function HomeSections() {
  return (
    <>
      {/* BEST TIME TO VISIT: framed full-screen photo, one step per season (outside the overflow-hidden wrapper so it can pin) */}
      <div id="best-time" className="relative z-10">
        <BestTimeShowcase />
      </div>

      {/* FAQS SECTION - Just above Footer */}
      <div id="faqs" className="relative z-10 scroll-mt-16">
        <Faqs embedded />
      </div>

      {/* CLOSING SCENE: mountains at the bottom, giant KEDARKANTHA rising from behind them */}
      <BehindMountains />
    </>
  )
}

export default function Home() {
  useSeo({
    title: 'Kedarkantha Trek - Where Snow Meets Serenity',
    description: 'Book the Kedarkantha winter trek with Treki Travels. 5-6 days, 12,500 ft, easy-moderate. Snowy trails, pine forests and summit views.',
    jsonLd,
  })
  const home = useAsync(getHome)

  return (
    <>
      <AsyncView state={home}>
        {({ trek, highlights }) => (
          <>
            <Hero trek={trek} highlights={highlights} />

            {/* Photo Story: 3 photos + Headline text animation */}
            <div id="about" className="relative z-30 scroll-mt-16">
              <PhotoStory />
            </div>

            {/* Day-by-day itinerary drawn along the hand-drawn route map */}
            <ItineraryJourney />
            <RaggedBridge />

            {/* DIFFICULTY & FITNESS: interactive quiz - placed directly above Why Treki */}
            <div id="difficulty" className="relative z-30 scroll-mt-16">
              <Difficulty embedded />
            </div>

            {/* Why Treki Travels: Trust, Support & Safety */}
            <div id="itinerary" className="scroll-mt-16">
              <Itinerary embedded />
            </div>

            {/* Next Independent Section: Expanding Fullscreen Image Animation with Marquee */}
            <div className="relative z-30">
              <FullscreenMoments />
            </div>

            {/* Horizontal photo gallery: vertical scroll slides the photos sideways */}
            <div id="gallery" className="relative z-30 scroll-mt-16">
              <HorizontalGallery />
            </div>

            {/* Things to carry, on a full-screen framed photo */}
            <div id="things-to-carry" className="relative z-30 scroll-mt-0">
              <ThingsCarryShowcase />
            </div>


          </>
        )}
      </AsyncView>

      <HomeSections />
    </>
  )
}
