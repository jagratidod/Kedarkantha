import { ArrowRight, Clock, Gauge, MapPin, Mountain, Play } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Img from '../components/ui/Img'
import Icon from '../components/ui/Icon'
import AsyncView from '../components/ui/AsyncView'
import Itinerary from './Itinerary'
import Departures from './Departures'
import Gallery from './Gallery'
import About from './About'
import Inclusions from './Inclusions'
import PickupDrop from './PickupDrop'
import Difficulty from './Difficulty'
import ThingsToCarry from './ThingsToCarry'
import BestTime from './BestTime'
import Faqs from './Faqs'
import Reviews from './Reviews'
import JourneyMap from '../components/sections/JourneyMap'
import ScrollHero from '../components/sections/ScrollHero'
import TrekHighlightsCinematic from '../components/sections/TrekHighlightsCinematic'
import AboutTrekFullscreen from '../components/sections/AboutTrekFullscreen'
import TrekOverviewPinned from '../components/sections/TrekOverviewPinned'
import CTABanner from '../components/layout/CTABanner'
import { useSeo } from '../hooks/useSeo'
import { useAsync } from '../hooks/useAsync'
import { getHome } from '../features/trek/api'

const heroFacts = [
  { Icon: Clock, value: '5-6 Days', label: 'Duration' },
  { Icon: Mountain, value: '12,500 ft', label: 'Max Altitude' },
  { Icon: Gauge, value: 'Easy-Moderate', label: 'Difficulty' },
  { Icon: MapPin, value: 'Sankri', label: 'Base Location' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: 'Kedarkantha Trek',
  description: 'Guided 5-6 day winter trek to Kedarkantha summit (12,500 ft) from Sankri, Uttarakhand.',
  provider: { '@type': 'TravelAgency', name: 'Treki Travels' },
  offers: { '@type': 'Offer', priceCurrency: 'INR', price: 7999 },
}

function Hero({ trek }) {
  return (
    <ScrollHero>
      <div className="container-page flex h-full flex-col justify-end pb-6 text-white sm:justify-center sm:pb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/90 sm:text-sm">{trek.name}</p>
        <h1 className="mt-2 max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{trek.tagline}</h1>
        <p className="mt-4 max-w-md text-sm text-white/85 sm:text-base">{trek.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button to="/book" variant="cta" size="lg">Book Your Trek</Button>
          {/* No video asset yet - jumps to the gallery until a video URL is provided. */}
          <Button to="/#gallery" variant="outline" size="lg"><Play size={14} aria-hidden="true" /> Watch Video</Button>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 sm:grid-cols-4">
          {heroFacts.map(({ Icon: I, value, label }) => (
            <li key={label} className="flex items-center gap-3">
              <I size={22} className="shrink-0 text-white/90" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{value}</p>
                <p className="text-xs text-white/70">{label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ScrollHero>
  )
}
// Sections that share the continuous 'long bg.png' background (from Upcoming Departure Dates up to before FAQs)
const LONG_BG_SECTIONS = [
  ['departures', Departures],
  ['inclusions', Inclusions],
  ['pickup-drop', PickupDrop],
  ['difficulty', Difficulty],
  ['things-to-carry', ThingsToCarry],
  ['best-time', BestTime],
]

function HomeSections() {
  return (
    <>
      {/* CONTINUOUS LONG BG SECTION: From Upcoming Departures to before FAQs */}
      <div className="relative w-full overflow-hidden">
        {/* Continuous Long Background Image */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-repeat-y bg-cover bg-top"
          style={{
            backgroundImage: "url('/long bg.png')",
          }}
        >
          {/* Subtle overlay so all text and cards remain crystal-clear and readable */}
          <div className="absolute inset-0 bg-[#F5F6F2]/30 backdrop-blur-[1px]" />

          {/* Top fade melt from preceding Highlights section */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F5F6F2] to-transparent" />

          {/* Bottom fade melt into FAQs section */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F5F6F2] to-transparent" />
        </div>

        {LONG_BG_SECTIONS.map(([id, Section]) => (
          <div key={id} id={id} className="relative z-10 scroll-mt-16">
            <Section embedded />
          </div>
        ))}
      </div>

      {/* FAQS SECTION */}
      <div id="faqs" className="relative z-10 scroll-mt-16">
        <Faqs embedded />
      </div>

      {/* REVIEWS SECTION */}
      <div id="reviews" className="relative z-10 scroll-mt-16">
        <Reviews embedded />
      </div>
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
            <Hero trek={trek} />

            {/* Pinned middle Trek Overview with 3 cards from Left & 3 cards from Right */}
            <div>
              <TrekOverviewPinned stats={trek.stats} />
            </div>

            {/* We Support Every Journey Map section */}
            <div>
              <JourneyMap />
            </div>

            {/* Full-Screen Animated About Kedarkantha Trek with Scroll Dissolve & Text Transition */}
            <div>
              <AboutTrekFullscreen trek={trek} />
            </div>

            {/* Day-by-Day Expedition Itinerary directly under Discover Treki Travels */}
            <div id="itinerary" className="scroll-mt-16">
              <Itinerary embedded />
            </div>

            {/* Photo Gallery directly under Day-by-Day Expedition Itinerary */}
            <div id="gallery" className="relative z-30 scroll-mt-16">
              <Gallery embedded />
            </div>

            {/* Cinematic Trek Highlights Carousel (Foxico Style with BACKGROUNDIMAGE.png & Auto Animation) */}
            <div>
              <TrekHighlightsCinematic highlights={highlights} />
            </div>
          </>
        )}
      </AsyncView>

      <HomeSections />
    </>
  )
}
