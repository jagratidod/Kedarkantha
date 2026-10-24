import { useEffect, useRef, useState } from 'react'
import Card from '../ui/Card'
import Icon from '../ui/Icon'

export default function TrekOverviewPinned({ stats }) {
  const containerRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const windowH = window.innerHeight
      const totalDist = rect.height - windowH
      if (totalDist <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0)
        return
      }
      const currentScroll = -rect.top
      const p = Math.max(0, Math.min(1, currentScroll / totalDist))
      setProgress(p)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Header fades and scales in smoothly
  const headerOpacity = Math.max(0, Math.min(1, progress / 0.35))
  const headerScale = 0.92 + headerOpacity * 0.08

  // Card slide-in animation:
  // 3 cards slide in from Left (-120px -> 0px)
  // 3 cards slide in from Right (+120px -> 0px)
  const cardsProgress = Math.max(0, Math.min(1, (progress - 0.15) / 0.65))

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[180vh] bg-gradient-to-b from-offwhite via-offwhite to-[#FAF2E4]"
      aria-labelledby="overview"
    >
      {/* Pinned directly in the middle of viewport */}
      <div className="sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-full flex flex-col justify-center items-center overflow-hidden container-page pointer-events-none">
        
        {/* Header - Stays centered */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `scale(${headerScale})`,
          }}
          className="flex flex-col items-center text-center mb-8 sm:mb-10 transition-transform duration-100 will-change-transform"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/8 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-forest ring-1 ring-forest/15">
            <span className="h-1.5 w-1.5 rounded-full bg-cta animate-pulse" />
            Key Highlights
          </span>
          <h2 id="overview" className="section-title mt-2.5">
            Trek Overview
          </h2>
          <p className="mt-1 text-sm text-muted">Essential details at a glance</p>
        </div>

        {/* 6 Cards Grid: Left 3 from left, Right 3 from right */}
        <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 pointer-events-auto">
          {stats.map((s, index) => {
            const isLeft = index < 3
            // Stagger slightly per card for wave aesthetic
            const stagger = (index % 3) * 0.08
            const cardP = Math.max(0, Math.min(1, (cardsProgress - stagger) / 0.85))
            
            // Left comes from -90px, Right comes from +90px
            const translateX = isLeft ? (1 - cardP) * -90 : (1 - cardP) * 90
            const opacity = cardP

            return (
              <li
                key={s.label}
                style={{
                  opacity,
                  transform: `translateX(${translateX}px)`,
                }}
                className="transition-transform duration-75 will-change-transform"
              >
                <Card className="flex h-full flex-col items-center gap-1 p-4 sm:p-5 text-center shadow-card hover:shadow-pop transition-shadow bg-white/95 backdrop-blur-sm ring-1 ring-forest/5">
                  <span className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-full text-forest ring-1 ring-forest/25 bg-sage/30">
                    <Icon name={s.icon} size={20} />
                  </span>
                  <p className="text-sm font-bold text-ink sm:text-base">{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </Card>
              </li>
            )
          })}
        </ul>

      </div>
    </section>
  )
}
