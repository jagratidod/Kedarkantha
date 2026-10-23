import { useEffect, useRef, useState } from 'react'
import Img from '../ui/Img'

/**
 * ScrollZoomStory Component
 * 
 * Flow:
 * 1. Initial State: The image appears full-screen (100vw, 100vh) edge-to-edge.
 * 2. On Scroll: The image smoothly zooms out into an elegant rounded card container with soft shadows,
 *    revealing the clean plain background (#F5F6F2 offwhite) and "Our Story" text with smooth transitions.
 */
export default function ScrollZoomStory({
  badge = 'Treki Travels Vision',
  title = 'Our Story',
  story = '',
  image = null,
  focus = '60% 55%',
  stats = [
    { value: '12,500+', label: 'Summits Reached' },
    { value: '100%', label: 'Eco-Friendly Trekking' },
    { value: '99.4%', label: 'Trekker Satisfaction' },
  ],
}) {
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
  // Progress 0.0 -> 0.25: Solid fullscreen image
  // Progress 0.25 -> 0.70: Image smoothly fades out
  // Progress 0.35 -> 0.80: Text & clean background smoothly fade in with slide-up
  const imageOpacity = Math.max(0, Math.min(1, 1 - (progress - 0.25) / 0.45))
  const imageScale = 1.0 + progress * 0.08 // subtle cinematic drift

  const textOpacity = Math.max(0, Math.min(1, (progress - 0.35) / 0.45))
  const textTranslateY = Math.max(0, (1 - Math.min(1, (progress - 0.35) / 0.45)) * 40)

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220vh] sm:h-[250vh]"
    >
      {/* Sticky full-screen stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-offwhite flex items-center justify-center">
        
        {/* ================= 1. FULL-SCREEN IMAGE LAYER (Fades out smoothly on scroll) ================= */}
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
              image={image}
              focus={focus}
              alt={title}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Cinematic subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />

          {/* Full-screen bottom scroll indicator */}
          <div
            style={{
              opacity: Math.max(0, 1 - progress * 3.5),
            }}
            className="absolute bottom-10 inset-x-0 flex flex-col items-center text-white/95 drop-shadow-md text-xs font-semibold tracking-widest uppercase transition-opacity duration-200"
          >
            <span className="backdrop-blur-sm bg-black/30 px-4 py-1.5 rounded-full border border-white/20">
              Scroll down to reveal {title.toLowerCase()}
            </span>
            <div className="mt-3 h-7 w-4 rounded-full border-2 border-white/80 flex justify-center pt-1.5">
              <div className="h-1.5 w-1 rounded-full bg-white animate-bounce" />
            </div>
          </div>
        </div>

        {/* ================= 2. CLEAN BACKGROUND + TEXT LAYER (Fades in in-place of image) ================= */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            visibility: textOpacity > 0 ? 'visible' : 'hidden',
          }}
          className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center justify-center transition-all duration-200 ease-out"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-forest/10 text-forest mb-5 border border-forest/15">
              {badge}
            </div>
          )}

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-forest leading-[1.08]">
            {title}
          </h2>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl leading-relaxed text-muted max-w-2xl font-normal mx-auto">
            {story}
          </p>

          {stats && stats.length > 0 && (
            <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-14 pt-8 border-t border-forest/10 w-full max-w-xl">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-8 sm:gap-14">
                  <div>
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-forest">{stat.value}</span>
                    <p className="text-xs text-muted uppercase tracking-wider mt-1 font-medium">{stat.label}</p>
                  </div>
                  {idx < stats.length - 1 && (
                    <div className="hidden sm:block h-10 w-px bg-forest/15" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
