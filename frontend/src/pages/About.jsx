import CTABanner from '../components/layout/CTABanner'
import AsyncView from '../components/ui/AsyncView'
import Img from '../components/ui/Img'
import IconCard from '../components/sections/IconCard'
import ScrollZoomStory from '../components/sections/ScrollZoomStory'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getAbout } from '../features/trek/api'

export default function About({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'About Treki Travels', description: 'Your trusted partner for Himalayan adventures: certified guides, safe and responsible treks, transparent pricing and small groups.' })
  const state = useAsync(getAbout)

  return (
    <>
      <AsyncView state={state}>
        {(a) => (
          <>
            {/* FULL-SCREEN TO CARD ZOOM-OUT SCROLL ANIMATION FOR OUR STORY */}
            <ScrollZoomStory
              title="Our Story"
              story={a.story}
              focus="60% 55%"
            />

            <div className="container-page py-8 sm:py-12">
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {a.pillars.map((p) => <li key={p.title}><IconCard {...p} className="h-full" /></li>)}
              </ul>
            </div>

            {/* FULL-SCREEN IMAGE SCROLL FADE FOR OUR MISSION */}
            <ScrollZoomStory
              badge="Our Core Purpose"
              title="Our Mission"
              story={a.mission}
              focus="75% 35%"
              stats={[
                { value: 'Zero', label: 'Trace Left Behind' },
                { value: '100%', label: 'Local Himalayan Guides' },
                { value: '24/7', label: 'Safety & Altitude Care' },
              ]}
            />

            <div className="container-page py-8 sm:py-12">
              <section>
                <h2 className="section-title mb-6">Our Values</h2>
                <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {a.values.map((v) => <li key={v.title}><IconCard {...v} className="h-full" /></li>)}
                </ul>
              </section>
            </div>
          </>
        )}
      </AsyncView>
      {!embedded && <CTABanner title="Join Our Next Adventure" text="Let's explore the Himalayas together." label="View Departures" to="/departures" />}
    </>
  )
}
