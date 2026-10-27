import { useEffect, useRef } from 'react'
import Img from '../ui/Img'
import Icon from '../ui/Icon'
import Button from '../ui/Button'

const FRAME_COUNT = 25
const frameUrl = (i) => `/hero/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => t * t * (3 - 2 * t)
const WORD = 'KEDARKANTHA'

/*
 * Scroll story (P = 0..1 over the whole pinned hero):
 *   0.00 - 0.10  dark screen, only the small "Kedarkantha" wordmark
 *   0.10 - 0.28  background image fades in and starts to move (frame scrub 0.10 -> 0.80)
 *   0.30 - 0.46  giant bold KEDARKANTHA rises letter by letter
 *   0.49 - 0.59  giant word lifts away
 *   0.60 - 0.72  hero copy (tagline, intro, buttons, facts) rises in, leaves at 0.78 - 0.85
 *   0.80 - 0.95  Trek Overview: heading, stat cards from both sides, then photo cards
 *   0.95 - 1.00  dissolves into the cream colour of the next section
 * Every value is written to a CSS variable on the stage, and the markup reads them with calc().
 */
const VARS = (p) => ({
  '--pw': 1 - seg(p, 0.3, 0.37), // small wordmark
  '--pb': ease(seg(p, 0.1, 0.28)), // background opacity
  '--ps': 0.05 + 0.1 * ease(seg(p, 0.76, 0.9)), // subtle shade to keep background crisp and clear
  '--pl': seg(p, 0.3, 0.46), // giant letters in
  '--lo': ease(seg(p, 0.49, 0.59)), // giant letters out
  '--ci': seg(p, 0.6, 0.72), // hero copy in
  '--co': seg(p, 0.78, 0.85), // hero copy out
  '--po': seg(p, 0.8, 0.95), // overview in
  '--pe': ease(seg(p, 0.95, 1)), // dissolve to next section
})

/**
 * Scroll-driven hero: a tall wrapper scrolls while the stage stays sticky. `trek`, `facts`,
 * `stats` and `photos` come from the home page data, so the Trek Overview lives inside the hero.
 */
export default function ScrollHero({ trek, facts = [], stats = [], photos = [], scrollLength = '820vh' }) {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const copyRef = useRef(null)
  const ovRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const frames = []
    let target = reduced ? 0.58 : 0
    let current = target
    let raf = 0
    let alive = true

    const drawCover = (img, alpha) => {
      if (!img?.complete || !img.naturalWidth) return
      const cw = canvas.width, ch = canvas.height
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const w = img.naturalWidth * s, h = img.naturalHeight * s
      ctx.globalAlpha = alpha
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    const draw = () => {
      const f = seg(current, 0.1, 0.8) * (FRAME_COUNT - 1)
      const i = Math.floor(f), t = f - i
      ctx.globalAlpha = 1
      drawCover(frames[i], 1)
      if (t > 0.001 && i + 1 < FRAME_COUNT) drawCover(frames[i + 1], t)
      ctx.globalAlpha = 1

      const v = VARS(current)
      for (const k in v) stage.style.setProperty(k, String(v[k]))
      if (copyRef.current) copyRef.current.style.pointerEvents = v['--ci'] > 0.4 && v['--co'] < 0.5 ? 'auto' : 'none'
      if (ovRef.current) ovRef.current.style.pointerEvents = v['--po'] > 0.5 && v['--pe'] < 0.5 ? 'auto' : 'none'
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      draw()
    }

    const tick = () => {
      const diff = target - current
      current = Math.abs(diff) < 0.0003 ? target : current + diff * 0.2
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

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => alive && draw()
      img.src = frameUrl(i)
      frames.push(img)
    }

    resize()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
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
    <section ref={wrapRef} style={{ height: scrollLength }} className="relative bg-white px-4 pb-4 sm:px-6 sm:pb-6" aria-label="Kedarkantha trek introduction">
      <div
        ref={stageRef}
        className="hero-stage sticky overflow-hidden rounded-2xl bg-ink-bg text-white sm:rounded-3xl"
        style={{ '--pw': 1, '--pb': 0, '--ps': 0.18, '--pl': 0, '--lo': 0, '--ci': 0, '--co': 0, '--po': 0, '--pe': 0 }}
      >
        {/* Background sequence with vibrant visibility (heavy black overlay removed) */}
        <div className="absolute inset-0" style={{ opacity: 'var(--pb)' }}>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 bg-ink-bg" style={{ opacity: 'var(--ps)' }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" aria-hidden="true" />

        {/* 1. Scroll cue */}
        <p className="hero-wordmark absolute inset-x-0 bottom-6 text-center text-[11px] uppercase tracking-[0.35em] text-white/55" style={{ opacity: 'var(--pw)' }} aria-hidden="true">
          Scroll
        </p>

        {/* 3. Giant KEDARKANTHA. */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: 'calc(1 - var(--lo))', transform: 'translateY(calc(var(--lo) * -26vh)) scale(calc(1 - var(--lo) * 0.35))' }}
          aria-hidden="true"
        >
          <div className="flex justify-center whitespace-nowrap text-[13.2vw] font-black leading-[0.9] tracking-tighter text-white [text-shadow:0_6px_40px_rgb(0_0_0/0.35)]">
            {WORD.split('').map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
                <span
                  className="inline-block"
                  style={{
                    transform: `translateY(calc((1 - clamp(0, (var(--pl) * 1.9 - ${(i * 0.085).toFixed(3)}), 1)) * 112%))`,
                    opacity: `clamp(0, (var(--pl) * 1.9 - ${(i * 0.085).toFixed(3)}) * 3, 1)`,
                  }}
                >
                  {ch}
                </span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.5em] text-white/80 sm:text-sm" style={rise('--pl', 0.7, 0.3, '14px')}>
            Sankri · Uttarakhand · 12,500 ft
          </p>
        </div>

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

        {/* 5. Trek Overview, inside the hero. */}
        <div ref={ovRef} className="container-page absolute inset-0 flex flex-col justify-center gap-4 py-4 sm:gap-6" style={{ pointerEvents: 'none' }}>
          <div className="text-center" style={rise('--po', 0, 0.3, '24px')}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-cta" /> Key Highlights
            </span>
            <h2 className="mt-2 text-3xl font-bold sm:text-5xl">Trek Overview</h2>
            <p className="mt-1 text-sm text-white/75">Essential details at a glance</p>
          </div>

          <ul className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
            {stats.map((s, i) => {
              const left = i < stats.length / 2
              const k = `clamp(0, (var(--po) - ${(0.12 + (i % 3) * 0.06).toFixed(2)}) / 0.4, 1)`
              return (
                <li
                  key={s.label}
                  style={{ opacity: k, transform: `translateX(calc((1 - ${k}) * ${left ? '-' : ''}90px))` }}
                >
                  <div className="flex h-full flex-col items-center gap-1 rounded-xl bg-black/20 p-3 text-center ring-1 ring-white/20 backdrop-blur-md sm:p-4">
                    <span className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-white/35 sm:h-10 sm:w-10"><Icon name={s.icon} size={18} /></span>
                    <p className="text-xs font-bold sm:text-base [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">{s.value}</p>
                    <p className="text-[10px] text-white/80 sm:text-xs [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">{s.label}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <ul className="grid grid-cols-3 gap-2 sm:gap-4">
            {photos.map((h, i) => {
              const k = `clamp(0, (var(--po) - ${(0.45 + i * 0.1).toFixed(2)}) / 0.4, 1)`
              return (
                <li key={h.id} style={{ opacity: k, transform: `translateY(calc((1 - ${k}) * 60px)) scale(calc(0.94 + ${k} * 0.06))` }}>
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
              )
            })}
          </ul>
        </div>

        {/* 6. Dissolve into next section removed to prevent hiding hero screen */}
      </div>
    </section>
  )
}
