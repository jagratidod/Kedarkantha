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
// Every other page, stacked one after another as sections of the home page.
const SECTIONS = [
  ['itinerary', Itinerary], ['departures', Departures], ['gallery', Gallery], ['about', About],
  ['inclusions', Inclusions], ['pickup-drop', PickupDrop], ['difficulty', Difficulty],
  ['things-to-carry', ThingsToCarry], ['best-time', BestTime], ['faqs', Faqs], ['reviews', Reviews],
]

function HomeSections() {
  return (
    <>
      {SECTIONS.map(([id, Section]) => (
        <div key={id} id={id} className="scroll-mt-16">
          <Section embedded />
        </div>
      ))}
      <CTABanner title="Ready for the Adventure?" text="Secure your spot for the next Kedarkantha trek." label="Book Your Trek" to="/book" />
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

            <section className="container-page py-10" aria-labelledby="overview">
              <h2 id="overview" className="section-title mb-5">Trek Overview</h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {trek.stats.map((s) => (
                  <li key={s.label}>
                    <Card className="flex h-full flex-col items-center gap-1 p-4 text-center">
                      <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-full text-forest ring-1 ring-forest/25">
                        <Icon name={s.icon} size={18} />
                      </span>
                      <p className="text-sm font-semibold">{s.value}</p>
                      <p className="text-xs text-muted">{s.label}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>

            {/* Full-Screen Animated About Kedarkantha Trek with Scroll Dissolve & Text Transition */}
            <AboutTrekFullscreen trek={trek} />

            {/* Cinematic Trek Highlights Carousel (Foxico Style with BACKGROUNDIMAGE.png & Auto Animation) */}
            <TrekHighlightsCinematic highlights={highlights} />
          </>
        )}
      </AsyncView>

      <JourneyMap />
      <HomeSections />
    </>
  )
}
