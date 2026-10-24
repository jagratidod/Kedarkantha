import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Compass, Mountain, ShieldCheck } from 'lucide-react'
import Button from '../ui/Button'
import Img from '../ui/Img'

/**
 * AboutTrekFullscreen Component
 * 
 * Flow:
 * - Spans full screen width & height with sticky scroll interaction
 * - Starts as an immersive full-screen mountain image with subtle drift/zoom
 * - As the user scrolls, the image smoothly dissolves / fades out
 * - In its place, the clean off-white background appears, and the typography,
 *   badge, narrative, key features and CTA animate in smoothly with staggered translation
 */
export default function AboutTrekFullscreen({ trek }) {
  const containerRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const windowH = window.innerHeight
      const totalDist = rect.height - windowH
      if (totalDist <= 0) return

      const currentScroll = -rect.top
      const p = Math.max(0, Math.min(1, currentScroll / totalDist))
      setProgress(p)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic scroll animation:
  // Starts with full crisp mountain image & caption
  // As user scrolls, the image softens into an atmospheric faded mountain backdrop (opacity 1.0 -> 0.38)
  // so the beautiful snowy mountain background stays visible behind the text, avoiding plain blank background.
  const imageOpacity = Math.max(0.38, 1 - progress * 0.62)
  const imageScale = 1.0 + progress * 0.09 // cinematic drift

  const contentOpacity = Math.max(0, Math.min(1, (progress - 0.25) / 0.45))
  const contentTranslateY = Math.max(0, (1 - Math.min(1, (progress - 0.25) / 0.45)) * 36)

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[220vh] sm:h-[250vh]"
      aria-labelledby="about-trek-title"
    >
      {/* Sticky full-screen stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-offwhite flex items-center justify-center">

        {/* Soft atmospheric mist overlay so text stays razor-sharp over the faded mountain background */}
        <div 
          style={{ opacity: Math.min(0.85, progress * 1.05) }}
          className="absolute inset-0 z-10 bg-offwhite/80 backdrop-blur-[2px] transition-opacity duration-200 pointer-events-none"
        />

        
        {/* ================= 1. FULL-SCREEN IMAGE LAYER (Dissolves on scroll) ================= */}
        <div
          style={{
            opacity: imageOpacity,
            visibility: imageOpacity > 0 ? 'visible' : 'hidden',
          }}
          className="absolute inset-0 z-20 w-full h-full pointer-events-none transition-opacity duration-150 ease-out will-change-[opacity]"
        >
          <div
            style={{
              transform: `scale(${imageScale})`,
            }}
            className="w-full h-full will-change-transform"
          >
            <Img
              image={trek?.image}
              focus="60% 45%"
              alt="About Kedarkantha Trek"
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Cinematic subtle contrast gradient with top mist dissolving into JourneyMap parchment */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF2E4]/40 via-transparent to-black/65" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FAF2E4] via-[#FAF2E4]/50 to-transparent" />

          {/* Foreground Title overlay on the full-screen image */}
          <div
            style={{
              opacity: Math.max(0, 1 - progress * 2.5),
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white pointer-events-none"
          >
            <span className="backdrop-blur-md bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/25 mb-4 shadow-sm">
              Discover Treki Travels
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] max-w-4xl">
              Himalayan Adventures
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/95 max-w-xl font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Your gateway to unforgettable trekking journeys across the Himalayas
            </p>
          </div>

          {/* Bottom scroll prompt */}
          <div
            style={{
              opacity: Math.max(0, 1 - progress * 3.5),
            }}
            className="absolute bottom-10 inset-x-0 flex flex-col items-center text-white/95 drop-shadow-md text-xs font-semibold tracking-widest uppercase transition-opacity duration-200"
          >
            <span className="backdrop-blur-sm bg-black/30 px-4 py-1.5 rounded-full border border-white/20">
              Scroll down to discover details
            </span>
            <div className="mt-3 h-7 w-4 rounded-full border-2 border-white/80 flex justify-center pt-1.5">
              <div className="h-1.5 w-1 rounded-full bg-white animate-bounce" />
            </div>
          </div>
        </div>

        {/* ================= 2. CLEAN BACKGROUND + TEXT LAYER (Fades in in-place of image) ================= */}
        <div
          style={{
            opacity: contentOpacity,
            transform: `translateY(${contentTranslateY}px)`,
            visibility: contentOpacity > 0 ? 'visible' : 'hidden',
          }}
          className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center justify-center transition-all duration-200 ease-out"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-forest/15 text-forest mb-4 border border-forest/25 shadow-xs">
            Your Gateway to Unforgettable Himalayan Adventures
          </div>

          <h2
            id="about-trek-title"
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink leading-[1.08] drop-shadow-xs"
          >
            Discover Treki Travels
          </h2>

          <div className="mt-6 sm:mt-8 space-y-4 text-base sm:text-lg leading-relaxed text-ink/85 max-w-3xl font-medium mx-auto">
            <p>
              Treki Travels brings you closer to the beauty of the Himalayas through exciting trekking adventures, breathtaking mountain landscapes, and memorable travel experiences. From the snowy trails of Kedarkantha to the scenic routes of Hampta Pass and Har Ki Dun, discover journeys that connect you with nature and adventure.
            </p>
            <p className="text-sm sm:text-base text-ink/80">
              With guided trekking experiences, thoughtfully planned itineraries, and travel support tailored to each package, Treki Travels helps make your Himalayan journey memorable.
            </p>
            <p className="text-sm sm:text-base font-bold text-forest tracking-wide pt-1">
              Explore the mountains. Embrace the adventure. Create memories that last a lifetime.
            </p>
          </div>

          {/* Action CTA */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              to="/about"
              size="lg"
              variant="cta"
              className="!bg-forest !text-white shadow-md hover:!bg-forest/90 font-bold !px-8 !py-3.5"
            >
              Explore Treki Travels <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <Button
              to="/itinerary"
              size="lg"
              variant="outlineDark"
              className="!bg-white/95 !border-forest/30 !text-forest hover:!bg-white shadow-sm font-bold !px-7 !py-3.5"
            >
              Explore Day-by-Day Route
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}
