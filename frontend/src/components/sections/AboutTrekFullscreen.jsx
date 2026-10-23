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

  // Animation timeline:
  // 0.0 -> 0.25: Solid full-screen image
  // 0.25 -> 0.70: Image smoothly dissolves away (opacity 1 -> 0)
  // 0.35 -> 0.85: Clean background & text with animations fade in
  const imageOpacity = Math.max(0, Math.min(1, 1 - (progress - 0.25) / 0.45))
  const imageScale = 1.0 + progress * 0.09 // subtle cinematic drift

  const contentOpacity = Math.max(0, Math.min(1, (progress - 0.35) / 0.45))
  const contentTranslateY = Math.max(0, (1 - Math.min(1, (progress - 0.35) / 0.45)) * 45)

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[220vh] sm:h-[250vh] my-4 sm:my-8"
      aria-labelledby="about-trek-title"
    >
      {/* Sticky full-screen stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-offwhite flex items-center justify-center">
        
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

          {/* Cinematic subtle contrast gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/35" />

          {/* Foreground Title overlay on the full-screen image */}
          <div
            style={{
              opacity: Math.max(0, 1 - progress * 2.5),
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white pointer-events-none"
          >
            <span className="backdrop-blur-md bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/20 mb-4">
              Explore Kedarkantha
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg max-w-4xl">
              About Kedarkantha Trek
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/90 max-w-xl drop-shadow">
              One of India's most celebrated winter summit adventures
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-forest/10 text-forest mb-5 border border-forest/15">
            The Crown Jewel of Winter Treks
          </div>

          <h2
            id="about-trek-title"
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-forest leading-[1.08]"
          >
            About Kedarkantha Trek
          </h2>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl leading-relaxed text-muted max-w-2xl font-normal mx-auto">
            {trek?.description ||
              'Kedarkantha is one of the most popular winter treks in India, known for its snow-covered trails, dense pine forests, and breathtaking views from the summit. Perfect for both beginners and experienced trekkers, this trek offers a complete Himalayan experience.'}
          </p>

          {/* Feature Highlights Grid */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-full bg-forest/10 flex items-center justify-center text-forest mb-2.5">
                <Mountain size={18} />
              </div>
              <h4 className="text-sm font-bold text-forest">12,500 ft Summit</h4>
              <p className="text-xs text-muted mt-1 leading-normal">
                360-degree panorama of Swargarohini, Bandarpoonch & Black Peak.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-full bg-forest/10 flex items-center justify-center text-forest mb-2.5">
                <Compass size={18} />
              </div>
              <h4 className="text-sm font-bold text-forest">Dense Pine Trails</h4>
              <p className="text-xs text-muted mt-1 leading-normal">
                Trek through enchanting Govind National Park pine & oak glades.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-full bg-forest/10 flex items-center justify-center text-forest mb-2.5">
                <ShieldCheck size={18} />
              </div>
              <h4 className="text-sm font-bold text-forest">Beginner Friendly</h4>
              <p className="text-xs text-muted mt-1 leading-normal">
                Well-graded ascents with certified mountain leaders and safe gear.
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button to="/about" size="lg" variant="primary" className="shadow-lg">
              Read Complete Story <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <Button to="/itinerary" size="lg" variant="outline">
              Explore Day-by-Day Route
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}
