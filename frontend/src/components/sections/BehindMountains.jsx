import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Compass, Mountain, ShieldCheck, Sparkles } from 'lucide-react'
import mountains from '../../assets/images/footer-mountains.webp'

/* =========================================================================
   Closing Scene: Behind the Mountains
   A cinematic Himalayan sunrise where the giant KEDARKANTHA rises letter-by-letter
   from behind the snow-capped mountain ridge as you scroll.
========================================================================= */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => t * t * (3 - 2 * t)
const mix = (a, b, t) => a + (b - a) * t

const LETTERS = 'KEDARKANTHA'.split('')

// Ambient stars across the night sky
const STARS = Array.from({ length: 50 }, (_, i) => {
  const h = (n) => {
    const s = Math.sin(n * 91.7 + 12.3) * 43758.5
    return s - Math.floor(s)
  }
  return {
    x: h(i) * 100,
    y: h(i + 77) * 55,
    r: 0.8 + h(i + 150) * 1.6,
    o: 0.2 + h(i + 220) * 0.7,
  }
})

export default function BehindMountains() {
  const wrap = useRef(null)
  const els = useRef({})
  const [narrow, setNarrow] = useState(false)
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setNarrow(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    const e = els.current
    let target = reduced ? 1 : 0
    let cur = target
    let raf = 0

    const apply = () => {
      const p = cur
      // Timing phases
      const riseProgress = seg(p, 0.08, 0.65)
      const dawnWarmth = ease(seg(p, 0.35, 0.85))
      const contentFade = ease(seg(p, 0.58, 0.88))
      const hintOpacity = 1 - seg(p, 0.02, 0.12)

      // 1. Staggered Letter Ascent behind the peaks
      if (e.letters) {
        e.letters.forEach((l, i) => {
          if (!l) return
          // Wave offset based on letter index
          const offset = (i / LETTERS.length) * 0.25
          const letterP = ease(clamp((riseProgress - offset) / 0.75))

          // Y translation: starts deep behind ridge (55vh) and rises to peak height
          const startY = narrow ? 48 : 42
          const endY = narrow ? 4 : 2
          const currentY = mix(startY, endY, letterP)
          const currentOpacity = clamp(mix(0.1, 1, letterP * 1.5))
          const currentScale = mix(0.9, 1, letterP)

          l.style.transform = `translate3d(0, ${currentY}vh, 0) scale(${currentScale})`
          l.style.opacity = String(currentOpacity)
        })
      }

      // 2. Sunrise Dawn Glow
      if (e.sky) {
        e.sky.style.opacity = String(dawnWarmth)
        e.sky.style.transform = `scale(${mix(0.85, 1.15, dawnWarmth)})`
      }

      // 3. Stars fade out as dawn breaks
      if (e.stars) {
        e.stars.style.opacity = String(mix(0.65, 0, dawnWarmth))
      }

      // 4. Summit content reveal (Title, perks, CTA)
      if (e.content) {
        e.content.style.opacity = String(contentFade)
        e.content.style.transform = `translate3d(0, ${(1 - contentFade) * 35}px, 0)`
      }

      // 5. Scroll hint
      if (e.hint) {
        e.hint.style.opacity = String(hintOpacity)
      }
    }

    const tick = () => {
      cur += (target - cur) * 0.12
      if (Math.abs(target - cur) < 0.0003) cur = target
      apply()
      raf = cur === target ? 0 : requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (reduced || !wrap.current) return
      const r = wrap.current.getBoundingClientRect()
      const maxScroll = Math.max(1, wrap.current.offsetHeight - window.innerHeight)
      target = clamp(-r.top / maxScroll)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    onScroll()
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', () => {
      onScroll()
      apply()
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [narrow, reduced])

  const reg = (k) => (n) => {
    els.current[k] = n
  }

  return (
    <section
      ref={wrap}
      id="behind-the-mountains"
      aria-label="Kedarkantha Grand Finale"
      className="relative bg-[#060F17]"
      style={{ height: reduced ? '100svh' : narrow ? '280vh' : '320vh' }}
    >
      <div className="sticky top-0 h-svh overflow-hidden flex flex-col justify-between select-none">
        {/* ================= Deep Midnight Alpine Sky Backdrop ================= */}
        <div
          className="pointer-events-none absolute inset-0 -z-30"
          style={{
            background: 'linear-gradient(to bottom, #050E17 0%, #0A1A28 35%, #0F263A 70%, #153852 100%)',
          }}
          aria-hidden="true"
        />

        {/* Ambient Twinkling Stars in High Altitude Sky */}
        <div ref={reg('stars')} className="pointer-events-none absolute inset-0 -z-20 will-change-opacity" aria-hidden="true">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.r}px`,
                height: `${s.r}px`,
                opacity: s.o,
                boxShadow: s.r > 1.4 ? '0 0 6px rgba(255,255,255,0.8)' : undefined,
              }}
            />
          ))}
        </div>

        {/* ================= Himalayan Alpenglow / Sunrise Aura ================= */}
        <div
          ref={reg('sky')}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[80vh] -z-10 will-change-transform will-change-opacity"
          style={{
            opacity: 0,
            background:
              'radial-gradient(ellipse 90% 65% at 50% 90%, rgba(255, 191, 105, 0.55) 0%, rgba(232, 163, 23, 0.3) 35%, rgba(79, 135, 168, 0.18) 65%, transparent 85%)',
          }}
          aria-hidden="true"
        />

        {/* ================= GIANT KEDARKANTHA LETTERS (Behind Peaks) ================= */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="flex w-full max-w-[100vw] justify-center px-2"
            style={{
              paddingTop: narrow ? '16vh' : '10vh',
            }}
          >
            <h2
              className="flex select-none uppercase tracking-[0.04em] sm:tracking-[0.08em] md:tracking-[0.14em] font-black justify-center"
              style={{
                fontFamily: 'Montserrat, Inter, system-ui, sans-serif',
                fontSize: narrow ? 'clamp(36px, 12.8vw, 68px)' : 'clamp(54px, 10.6vw, 165px)',
                lineHeight: 1,
              }}
            >
              {LETTERS.map((ch, i) => (
                <span
                  key={i}
                  ref={(n) => {
                    (els.current.letters ||= [])[i] = n
                  }}
                  className="inline-block will-change-transform bg-gradient-to-b from-white via-[#E0F2FE] to-[#7EB5D6]/20 bg-clip-text text-transparent"
                  style={{
                    filter: 'drop-shadow(0 0 25px rgba(126, 181, 214, 0.45))',
                    transform: `translate3d(0, ${narrow ? '48vh' : '42vh'}, 0)`,
                    opacity: 0.1,
                  }}
                >
                  {ch}
                </span>
              ))}
            </h2>
          </div>
        </div>

        {/* ================= Initial Scroll Hint ================= */}
        <div
          ref={reg('hint')}
          className="pointer-events-none absolute inset-x-0 top-[18vh] z-30 flex flex-col items-center justify-center text-center transition-opacity will-change-opacity"
          aria-hidden="true"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7EB5D6] backdrop-blur-md ring-1 ring-white/15">
            <span className="h-2 w-2 rounded-full bg-[#4F87A8] animate-ping" />
            Scroll to Rise the Summit
          </div>
        </div>

        {/* ================= SNOW MOUNTAIN RIDGE (Foreground Over Words) ================= */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 w-full overflow-hidden"
          style={{ height: narrow ? '48svh' : '56svh' }}
        >
          {/* Authentic Ridge cut-out */}
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
            className="pointer-events-none absolute inset-x-0 bottom-[15%] h-[30%] opacity-40 mix-blend-screen"
            style={{
              background:
                'radial-gradient(ellipse 100% 60% at 50% 50%, rgba(200, 230, 255, 0.4) 0%, rgba(79, 135, 168, 0.15) 50%, transparent 80%)',
            }}
            aria-hidden="true"
          />

          {/* Deep Melt into Footer */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#091724] via-[#091724]/90 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* ================= SUMMIT CALL-TO-ACTION & METADATA ================= */}
        <div
          ref={reg('content')}
          className="relative z-30 mx-auto w-full max-w-4xl px-4 text-center will-change-transform will-change-opacity pt-[6vh] sm:pt-[7vh]"
          style={{ opacity: 0 }}
        >
          {/* Summit Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#16334D]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#7EB5D6] backdrop-blur-md ring-1 ring-[#4F87A8]/50 shadow-[0_0_20px_rgba(79,135,168,0.3)]">
            <Sparkles size={14} className="text-[#E8A317]" />
            Kedarkantha Summit · 12,500 FT
          </div>

          {/* Inspiring Headline */}
          <h3 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl md:text-5xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            Where the Trail Ends, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-[#E0F2FE] to-[#7EB5D6] bg-clip-text text-transparent">
              Your Legend Begins.
            </span>
          </h3>

          <p className="mt-2 text-xs sm:text-sm md:text-base text-[#8FAEC5] max-w-xl mx-auto drop-shadow-md">
            Step into the heart of the Garhwal Himalayas. Sub-zero winter snow, ancient pine forests, and a breathtaking 360° summit sunrise.
          </p>

          {/* Quick Expedition Highlights */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-medium text-white/80">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10 backdrop-blur-sm">
              <Mountain size={13} className="text-[#7EB5D6]" /> 6 Days · 20 KM Snow Trail
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10 backdrop-blur-sm">
              <Compass size={13} className="text-[#E8A317]" /> Easy–Moderate Grade
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10 backdrop-blur-sm">
              <ShieldCheck size={13} className="text-[#4F87A8]" /> Certified Expedition Leads
            </span>
          </div>

          {/* High-Impact Primary CTA Button */}
          <div className="mt-5 sm:mt-6 flex flex-col items-center justify-center gap-2">
            <Link
              to="/book"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#E8A317] to-[#F59E0B] px-8 py-3.5 text-sm sm:text-base font-extrabold uppercase tracking-widest text-[#0E2233] shadow-[0_0_35px_rgba(232,163,23,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(232,163,23,0.7)]"
            >
              <span>Book Your Kedarkantha Trek</span>
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <span className="text-[11px] text-[#7EB5D6]/80 font-medium">
              Next Batch Starting Soon · Limited 15 Slots Per Team
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
