import { useEffect, useRef } from 'react'
import Img from '../ui/Img'
import Icon from '../ui/Icon'
import Button from '../ui/Button'
import ridge from '../../assets/images/hero-3rd.webp'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => t * t * (3 - 2 * t)
const WORD = 'KEDARKANTHA'

/*
 * Scroll story (P = 0..1 over 900vh pinned hero):
 *   0.00 - 0.04  Scroll cue fades out immediately on first movement
 *   0.00 - 0.28  giant KEDARKANTHA immediately rises from behind the ridge on the very first scroll
 *   0.36 - 0.46  the word lifts away while the ridge settles
 *   0.44 - 0.60  hero copy (tagline, intro, button, facts)
 *   0.63 - 0.70  hero copy exits
 *   0.70 - 0.82  All overview parts scroll in together from right to left
 *   0.82 - 0.91  Then Border: draws around the overview section
 *   0.92 - 0.98  Border expansion: expands outward to screen edges
 */
const VARS = (p) => ({
  '--pw': 1 - seg(p, 0.00, 0.04), // scroll cue fades right on first touch
  '--pl': ease(seg(p, 0.00, 0.28)), // KEDARKANTHA starts rising immediately on first scroll!
  '--lo': ease(seg(p, 0.36, 0.46)), // word out
  '--pm': ease(seg(p, 0, 0.45)), // ridge parallax / zoom
  '--ps': 0.55 * ease(seg(p, 0.44, 0.58)), // dark veil so copy and cards stay readable
  '--ci': seg(p, 0.46, 0.60), // hero copy in
  '--co': seg(p, 0.63, 0.70), // hero copy out
  '--po': ease(seg(p, 0.70, 0.82)), // ALL parts slide in together from right to left
  '--pb': ease(seg(p, 0.82, 0.91)), // THEN border draws around the section
  '--pz': ease(seg(p, 0.92, 0.98)), // fast snap zoom / border expand
})

/**
 * Scroll-driven hero: a wrapper scrolls while the stage stays sticky.
 */
export default function ScrollHero({ trek, facts = [], stats = [], photos = [], scrollLength = '900vh' }) {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const copyRef = useRef(null)
  const ovRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let target = reduced ? 0.58 : 0
    let current = target
    let raf = 0

    const draw = () => {
      const v = VARS(current)
      for (const k in v) stage.style.setProperty(k, String(v[k]))
      if (copyRef.current) copyRef.current.style.pointerEvents = v['--ci'] > 0.4 && v['--co'] < 0.5 ? 'auto' : 'none'
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

  // d = delay inside the 0..1 range of a progress variable; w = how long each item takes.
  const rise = (v, d, w = 0.45, dist = '36px') => ({
    opacity: `clamp(0, (var(${v}) - ${d}) / ${w}, 1)`,
    transform: `translateY(calc((1 - clamp(0, (var(${v}) - ${d}) / ${w}, 1)) * ${dist}))`,
  })
  const copyIn = (d) => {
    const k = `clamp(0, (var(--ci) - ${d}) / 0.5, 1)`
    return { opacity: `calc(${k} * (1 - var(--co)))`, transform: `translateY(calc((1 - ${k}) * 44px - var(--co) * 36px))` }
  }

  return (
    <section ref={wrapRef} style={{ height: scrollLength }} className="relative bg-white" aria-label="Kedarkantha trek introduction">
      <div
        ref={stageRef}
        className="hero-stage sticky overflow-hidden bg-[#0E2233] text-white"
        style={{ '--pw': 1, '--pl': 0, '--lo': 0, '--pm': 0, '--ps': 0, '--ci': 0, '--co': 0, '--po': 0, '--pb': 0, '--pz': 0 }}
      >
        {/* Dawn sky */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0E2233 0%, #1F4663 30%, #4F87A8 58%, #B7D6E4 82%, #F3E3C8 100%)' }} aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-3/5" style={{ background: 'radial-gradient(80% 70% at 50% 100%, rgba(255,214,150,0.55), transparent 70%)' }} aria-hidden="true" />

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
            <span className="block" style={{ color: '#FFFFFF', textShadow: '0 0.04em 0.5em rgba(8,24,40,0.35)' }}>{WORD}</span>
          </div>
        </div>

        {/* Snowy ridge along the bottom */}
        <div className="hero-ridge pointer-events-none absolute inset-x-0 bottom-0" style={{ transform: 'translateY(calc(var(--pm) * 3vh)) scale(calc(1 + var(--pm) * 0.1))', transformOrigin: '50% 100%' }}>
          <img src={ridge} alt="" decoding="async" fetchPriority="high" className="block h-full w-full object-cover object-bottom" draggable="false" />
        </div>
        <div className="absolute inset-0 bg-ink-bg" style={{ opacity: 'var(--ps)' }} aria-hidden="true" />

        {/* Scroll cue that fades out when KEDARKANTHA rises */}
        <p className="hero-wordmark absolute inset-x-0 top-[12%] text-center text-[12px] font-semibold uppercase tracking-[0.4em] text-white/80" style={{ opacity: 'var(--pw)' }} aria-hidden="true">
          Scroll
        </p>

        {/* 4. Hero copy. */}
        <div ref={copyRef} className="container-page absolute inset-0 flex flex-col justify-end pb-6 sm:justify-center sm:pb-10" style={{ pointerEvents: 'none' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/90 sm:text-sm" style={copyIn(0)}>{trek.name}</p>
          <h1 className="mt-2 max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl" style={copyIn(0.1)}>{trek.tagline}</h1>
          <p className="mt-4 max-w-md text-sm text-white/85 sm:text-base" style={copyIn(0.2)}>{trek.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3" style={copyIn(0.3)}>
            <Button to="/book" variant="cta" size="lg">Book Your Trek</Button>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 sm:grid-cols-4" style={copyIn(0.4)}>
            {facts.map(({ Icon: I, value, label }) => (
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

        {/* 5. Trek Overview, inside the hero with right-to-left entrance and subsequent border draw */}
        <div ref={ovRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* SVG Border that draws around the card AFTER content appears, then expands on further scroll */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="calc(max(16px, (100% - 72rem) / 2) * (1 - var(--pz)) + 16px * var(--pz))"
              y="calc(max(24px, (100% - 38rem) / 2) * (1 - var(--pz)) + 16px * var(--pz))"
              width="calc(min(calc(100% - 32px), 72rem) * (1 - var(--pz)) + (100% - 32px) * var(--pz))"
              height="calc(min(calc(100% - 48px), 38rem) * (1 - var(--pz)) + (100% - 32px) * var(--pz))"
              rx="calc(20px * (1 - var(--pz)) + 24px * var(--pz))"
              ry="calc(20px * (1 - var(--pz)) + 24px * var(--pz))"
              fill="none"
              stroke="rgba(255, 255, 255, calc(0.35 + var(--pz) * 0.65))"
              strokeWidth="calc(1.8px + var(--pz) * 6.2px)"
              pathLength="100"
              style={{
                strokeDasharray: '100',
                strokeDashoffset: 'calc(100 - clamp(0, var(--pb), 1) * 100)',
                opacity: 'clamp(0, var(--pb) * 3, 1)',
                transition: 'all 0.12s ease-out',
              }}
            />
          </svg>

          {/* Middle text & cards container: all parts scroll in together from right to left */}
          <div
            className="container-page relative z-10 mx-auto max-w-6xl p-4 sm:p-7 md:p-8"
            style={{
              opacity: 'clamp(0, var(--po) * 1.5, 1)',
              transform: 'translateX(calc((1 - var(--po)) * 75vw))',
            }}
          >
            {/* Heading */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-cta" /> Key Highlights
              </span>
              <h2 className="mt-2 text-3xl font-bold sm:text-5xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">Trek Overview</h2>
              <p className="mt-1 text-sm text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">Essential details at a glance</p>
            </div>

            {/* 6 Stat cards */}
            <ul className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3 lg:grid-cols-6">
              {stats.map((s) => (
                <li key={s.label}>
                  <div className="flex h-full flex-col items-center gap-1 rounded-xl bg-black/25 p-3 text-center ring-1 ring-white/20 backdrop-blur-md sm:p-4">
                    <span className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-white/35 sm:h-10 sm:w-10"><Icon name={s.icon} size={18} /></span>
                    <p className="text-xs font-bold sm:text-base [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">{s.value}</p>
                    <p className="text-[10px] text-white/80 sm:text-xs [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">{s.label}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* 3 Photo cards */}
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-4">
              {photos.map((h) => (
                <li key={h.id}>
                  <div className="overflow-hidden rounded-xl ring-1 ring-white/25">
                    <div className="relative aspect-[4/3] sm:aspect-[16/9]">
                      <Img image={h.image} focus={h.focus} sizes="(min-width:640px) 33vw, 33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-bg/85 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3">
                        <p className="text-xs font-semibold sm:text-sm">{h.title}</p>
                        <p className="hidden text-xs text-white/75 sm:block">{h.caption}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Dissolve into next section removed to prevent hiding hero screen */}
      </div>
    </section>
  )
}
