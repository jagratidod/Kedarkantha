import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import mountains from '../../assets/images/footer-mountains.webp'

/* =========================================================================
   Closing Scene: Behind the Mountains
   Single normal-scroll section:
   - Giant majestic KEDARKANTHA in the starry sky above the mountain peaks
   - Primary CTA Button styled in brand alpine blue / bright gradient
   - Foreground mountain ridge that flows into footer
========================================================================= */

const LETTERS = 'KEDARKANTHA'.split('')

// Ambient stars across the night sky
const STARS = Array.from({ length: 45 }, (_, i) => {
  const h = (n) => {
    const s = Math.sin(n * 91.7 + 12.3) * 43758.5
    return s - Math.floor(s)
  }
  return {
    x: h(i) * 100,
    y: h(i + 77) * 55,
    r: 0.8 + h(i + 150) * 1.5,
    o: 0.25 + h(i + 220) * 0.65,
  }
})

export default function BehindMountains() {
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setNarrow(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  return (
    <section
      id="behind-the-mountains"
      aria-label="Kedarkantha Grand Finale"
      className="relative bg-transparent min-h-[90svh] lg:min-h-screen overflow-hidden flex flex-col justify-between select-none"
    >


      {/* Ambient Twinkling Stars in Sky */}
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.r}px`,
              height: `${s.r}px`,
              opacity: s.o,
              animationDuration: `${2.5 + (i % 4)}s`,
              boxShadow: s.r > 1.3 ? '0 0 6px rgba(255,255,255,0.7)' : undefined,
            }}
          />
        ))}
      </div>

      {/* Subtle Alpenglow Horizon */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] -z-10"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% 90%, rgba(59, 130, 166, 0.35) 0%, rgba(31, 70, 99, 0.2) 45%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* 1. TOP TITLE: GIANT KEDARKANTHA IN THE SKY */}
      <div className="w-full flex justify-center pt-8 sm:pt-14 px-4 z-0">
        <h2
          className="flex select-none uppercase tracking-[0.06em] sm:tracking-[0.1em] md:tracking-[0.14em] font-black justify-center"
          style={{
            fontFamily: 'Montserrat, Inter, system-ui, sans-serif',
            fontSize: narrow ? 'clamp(32px, 11.5vw, 64px)' : 'clamp(52px, 9.8vw, 150px)',
            lineHeight: 1,
          }}
        >
          {LETTERS.map((ch, i) => (
            <span
              key={i}
              className="inline-block bg-gradient-to-b from-[#082138] via-[#103D61] to-[#2B6D9E] bg-clip-text text-transparent"
              style={{
                filter: 'drop-shadow(0 4px 28px rgba(16, 61, 97, 0.25))',
              }}
            >
              {ch}
            </span>
          ))}
        </h2>
      </div>

      {/* 2. MIDDLE CONTENT: CALL TO ACTION BUTTON */}
      <div className="relative z-30 mx-auto w-full max-w-xl px-4 text-center my-auto py-4">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <Link
            to="/book"
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#3B82A6] via-[#4F87A8] to-[#7EB5D6] px-8 py-3.5 sm:px-10 sm:py-4 text-sm sm:text-base font-extrabold uppercase tracking-widest text-white shadow-[0_0_35px_rgba(59,130,166,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(126,181,214,0.7)]"
          >
            <span>Book Your Kedarkantha Trek</span>
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <span className="text-[11px] sm:text-xs text-[#0E3555] font-bold tracking-wide">
            Next Batch Starting Soon · Limited 15 Slots Per Team
          </span>
        </div>
      </div>

      {/* 3. BOTTOM: SNOW MOUNTAIN RIDGE */}
      <div
        className="pointer-events-none relative z-10 w-full overflow-hidden"
        style={{ height: narrow ? '40svh' : '48svh' }}
      >
        <img
          src={mountains}
          alt=""
          decoding="async"
          className="h-full w-full object-cover object-bottom"
          style={{
            filter: 'drop-shadow(0 -8px 20px rgba(0, 0, 0, 0.4))',
          }}
          draggable="false"
        />

        {/* Atmospheric Mist rolling across the ridge */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[12%] h-[30%] opacity-40 mix-blend-screen"
          style={{
            background:
              'radial-gradient(ellipse 100% 60% at 50% 50%, rgba(200, 230, 255, 0.4) 0%, rgba(79, 135, 168, 0.15) 50%, transparent 80%)',
          }}
          aria-hidden="true"
        />

        {/* Melt seamlessly into Footer */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#091724] via-[#091724]/80 to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
