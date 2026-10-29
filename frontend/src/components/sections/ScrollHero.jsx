import { useEffect, useRef } from 'react'
import Icon from '../ui/Icon'
import ridge from '../../assets/images/hero-3rd.webp'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => t * t * (3 - 2 * t)
const WORD = 'KEDARKANTHA'

/*
 * Scroll story (P = 0..1 over 800vh pinned hero):
 *   0.00 - 0.03  Scroll cue fades out immediately on first movement
 *   0.00 - 0.18  Giant KEDARKANTHA rises immediately from behind the ridge
 *   0.18 - 0.28  Word lifts away & dark atmospheric veil prepares stage
 *   0.30 - 0.44  Trek Overview header + 6 Stat cards slide in from right to left
 *   0.44 - 0.58  Trek Overview & stats shift upward to top while rich storytelling text appears
 *   0.58 - 0.72  Bold border draws smoothly and completely around the overview section
 *   0.72 - 0.78  Pause to view fully drawn overview card
 *   0.78 - 0.98  Dedicated Border Zoom: ONLY the border zooms on all 4 sides to fit the screen's outer edges
 */
const VARS = (p) => ({
  '--pw': 1 - seg(p, 0.00, 0.03), // scroll cue fades right on first touch
  '--pl': ease(seg(p, 0.00, 0.18)), // KEDARKANTHA starts rising immediately
  '--lo': ease(seg(p, 0.18, 0.28)), // word out
  '--pm': ease(seg(p, 0, 0.32)), // ridge parallax / zoom
  '--ps': 0.65 * ease(seg(p, 0.24, 0.38)), // dark veil for readability
  '--po': ease(seg(p, 0.30, 0.44)), // ALL parts slide in together from right to left
  '--pu': ease(seg(p, 0.44, 0.58)), // Upward shift for header & icons + reveal of detailed overview text
  '--pb': ease(seg(p, 0.58, 0.72)), // Border draws completely around the card
  '--pz': ease(seg(p, 0.78, 0.98)), // Dedicated Zoom: ONLY the border zooms outward on all 4 sides to screen edges
})

/**
 * Scroll-driven hero: a wrapper scrolls while the stage stays sticky.
 */
export default function ScrollHero({ trek, facts = [], stats = [], photos = [], scrollLength = '800vh' }) {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const ovRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let target = reduced ? 0.75 : 0
    let current = target
    let raf = 0

    const draw = () => {
      const v = VARS(current)
      for (const k in v) stage.style.setProperty(k, String(v[k]))
      if (ovRef.current) ovRef.current.style.pointerEvents = v['--po'] > 0.4 ? 'auto' : 'none'
    }

    const tick = () => {
      const diff = target - current
      current = Math.abs(diff) < 0.0003 ? target : current + diff * 0.16
      draw()
      raf = current === target ? 0 : requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (reduced) return
      const rect = wrap.getBoundingClientRect()
      const max = wrap.offsetHeight - window.innerHeight
      target = clamp(max > 0 ? -rect.top / max : 0)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    draw()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={wrapRef} style={{ height: scrollLength }} className="relative bg-white" aria-label="Kedarkantha trek introduction">
      <div
        ref={stageRef}
        className="hero-stage sticky overflow-hidden bg-[#78B4D4] text-white"
        style={{ '--pw': 1, '--pl': 0, '--lo': 0, '--pm': 0, '--ps': 0, '--po': 0, '--pb': 0, '--pu': 0, '--pz': 0 }}
      >
        {/* Dawn sky */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #F0F9FF 14%, #D4ECF9 34%, #97D0EE 58%, #5CA8D3 80%, #3682AD 100%)' }} aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-3/5" style={{ background: 'radial-gradient(90% 80% at 50% 88%, rgba(255, 255, 255, 0.7) 0%, rgba(186, 230, 253, 0.45) 45%, transparent 75%)' }} aria-hidden="true" />

        {/* Giant KEDARKANTHA, standing behind the ridge */}
        <div
          className="pointer-events-none absolute inset-x-0 flex justify-center"
          style={{ bottom: 'var(--word-bottom)', perspective: '1100px', opacity: 'calc(1 - var(--lo))', transform: 'translateY(calc(var(--lo) * -10vh))' }}
          aria-hidden="true"
        >
          <div
            className="hero-word flex whitespace-nowrap uppercase leading-[0.9] tracking-[0.02em]"
            style={{
              fontFamily: 'Anton, Impact, sans-serif',
              transformOrigin: '50% 100%',
              transform: 'translateY(calc((1 - var(--pl)) * 40vh))',
              opacity: 'clamp(0, var(--pl) * 6, 1)',
            }}
          >
            <span className="block" style={{ color: '#FFFFFF', textShadow: '0 4px 28px rgba(27, 73, 107, 0.35), 0 1px 3px rgba(14, 34, 51, 0.2)' }}>{WORD}</span>
          </div>
        </div>

        {/* Snowy ridge along the bottom */}
        <div className="hero-ridge pointer-events-none absolute inset-x-0 bottom-0" style={{ transform: 'translateY(calc(var(--pm) * 3vh)) scale(calc(1 + var(--pm) * 0.1))', transformOrigin: '50% 100%' }}>
          <img src={ridge} alt="" decoding="async" fetchPriority="high" className="block h-full w-full object-cover object-bottom" draggable="false" />
        </div>
        <div className="absolute inset-0 bg-ink-bg" style={{ opacity: 'var(--ps)' }} aria-hidden="true" />

        {/* Scroll cue that fades out when KEDARKANTHA rises */}
        <p className="hero-wordmark absolute inset-x-0 top-[12%] text-center text-[12px] font-bold uppercase tracking-[0.4em] text-[#133E5E]/90 drop-shadow-sm" style={{ opacity: 'var(--pw)' }} aria-hidden="true">
          Scroll
        </p>

        {/* 5. Trek Overview, inside the hero with right-to-left entrance, border draw, and edge zoom */}
        <div ref={ovRef} className="absolute inset-0 flex items-center justify-center pointer-events-none pb-16 md:pb-0">
          {/* SVG Border that draws around the card AFTER content appears, then zooms outward to screen edges */}
          {/* Desktop SVG Border */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible hidden sm:block"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="calc(max(16px, (100% - 72rem) / 2) * (1 - var(--pz)))"
              y="calc((max(16px, (100% - 22rem) / 2 * (1 - var(--pu)) + 2.6rem * var(--pu))) * (1 - var(--pz)))"
              width="calc(min(calc(100% - 32px), 72rem) * (1 - var(--pz)) + 100% * var(--pz))"
              height="calc((min(calc(100% - 48px), 21.5rem) * (1 - var(--pu)) + min(calc(100% - 5.5rem), 34.5rem) * var(--pu)) * (1 - var(--pz)) + 100% * var(--pz))"
              rx="calc(24px * (1 - var(--pz)))"
              ry="calc(24px * (1 - var(--pz)))"
              fill="none"
              stroke="rgba(255, 255, 255, calc(0.9 * (1 - var(--pz)) + var(--pz)))"
              strokeWidth="calc(3px + var(--pz) * 2px)"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]"
              pathLength="100"
              style={{
                strokeDasharray: '100',
                strokeDashoffset: 'calc(100 - clamp(0, var(--pb), 1) * 100)',
                opacity: 'clamp(0, var(--pb) * 3, 1)',
                transition: 'all 0.12s ease-out',
              }}
            />
          </svg>

          {/* Mobile SVG Border */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible sm:hidden"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="calc(10px * (1 - var(--pz)))"
              y="calc((max(8px, (100% - 31rem) / 2 * (1 - var(--pu)) + 0.8rem * var(--pu))) * (1 - var(--pz)))"
              width="calc(calc(100% - 20px) * (1 - var(--pz)) + 100% * var(--pz))"
              height="calc((min(calc(100% - 5.5rem), 32rem) * (1 - var(--pu)) + min(calc(100% - 5.5rem), 33rem) * var(--pu)) * (1 - var(--pz)) + 100% * var(--pz))"
              rx="calc(18px * (1 - var(--pz)))"
              ry="calc(18px * (1 - var(--pz)))"
              fill="none"
              stroke="rgba(255, 255, 255, calc(0.9 * (1 - var(--pz)) + var(--pz)))"
              strokeWidth="calc(2px + var(--pz) * 2px)"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]"
              pathLength="100"
              style={{
                strokeDasharray: '100',
                strokeDashoffset: 'calc(100 - clamp(0, var(--pb), 1) * 100)',
                opacity: 'clamp(0, var(--pb) * 3, 1)',
                transition: 'all 0.12s ease-out',
              }}
            />
          </svg>

          {/* Middle text & cards container: stays stationary while ONLY the border zooms outward */}
          <div
            className="container-page relative z-10 mx-auto max-w-6xl px-3 py-2 sm:p-7 md:p-8 flex flex-col justify-center"
            style={{
              opacity: 'calc(clamp(0, var(--po) * 1.5, 1) * (1 - var(--pz) * 0.9))',
              transform: 'translateX(calc((1 - var(--po)) * 75vw)) translateY(calc(var(--pu) * -1.8rem))',
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* Heading (Moves smoothly upwards as --pu increases) */}
            <div className="text-center transition-all duration-300">
              <h2 className="text-2xl font-bold sm:text-5xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">Trek Overview</h2>
              <p className="mt-0.5 text-xs sm:text-sm text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">Essential details at a glance</p>
            </div>

            {/* 6 Stat cards (Compact on mobile & desktop, seamlessly transitions upward) */}
            <ul className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-3 lg:grid-cols-6">
              {stats.map((s) => (
                <li key={s.label}>
                  <div className="flex h-full flex-col items-center justify-center gap-0.5 rounded-lg sm:rounded-xl bg-black/40 p-1.5 sm:p-3.5 text-center ring-1 ring-white/20 backdrop-blur-md shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                    <span className="mb-0.5 flex h-6 w-6 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/10 text-sky-300 ring-1 ring-white/30"><Icon name={s.icon} size={14} /></span>
                    <p className="text-[11px] font-bold leading-tight sm:text-sm md:text-base [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">{s.value}</p>
                    <p className="text-[8.5px] sm:text-xs leading-tight text-white/75 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">{s.label}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Detailed text & expedition description: smoothly appears as user scrolls further */}
            <div
              className="mt-2.5 sm:mt-8 px-1 py-1 sm:px-4 sm:py-4 transition-all duration-300"
              style={{
                opacity: 'clamp(0, (var(--pu) - 0.25) * 1.5, 1)',
                transform: 'translateY(calc((1 - var(--pu)) * 20px))',
                pointerEvents: 'var(--pu) > 0.6 ? "auto" : "none"',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-8 text-left items-center">
                <div className="md:col-span-2 space-y-1 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] shrink-0" />
                    <h3 className="text-xs sm:text-xl md:text-2xl font-bold uppercase tracking-wide sm:tracking-wider text-sky-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-tight">
                      The Classic Himalayan Winter Odyssey
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-lg md:text-xl leading-relaxed text-slate-100 font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    Perched in the Govind Wildlife Sanctuary of Uttarkashi at 12,500 ft, Kedarkantha is India's most celebrated summit trek. Journey from quiet pine-scented trails into majestic alpine clearings, camp beside the mythical frozen waters of Juda Ka Talab, and witness an awe-inspiring 360-degree sunrise over Swargarohini, Black Peak, and Bandarpoonch.
                  </p>
                </div>
                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/25 pt-2 sm:pt-4 md:pt-0 md:pl-7 space-y-1 sm:space-y-3 text-[11px] sm:text-base md:text-lg text-slate-200 font-medium">
                  <div className="flex items-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    <span className="text-xs sm:text-lg text-[#38BDF8] shrink-0">✦</span>
                    <span className="leading-tight">Best Season: Dec to April</span>
                  </div>
                  <div className="flex items-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    <span className="text-xs sm:text-lg text-[#38BDF8] shrink-0">✦</span>
                    <span className="leading-tight">Forest: Oak, Pine & Deodar</span>
                  </div>
                  <div className="flex items-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    <span className="text-xs sm:text-lg text-[#38BDF8] shrink-0">✦</span>
                    <span className="leading-tight">Trail: Beginner to Pro Friendly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Dissolve into next section removed to prevent hiding hero screen */}
      </div>
    </section>
  )
}
