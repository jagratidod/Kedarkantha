import { useEffect, useMemo, useRef, useState } from 'react'
import Img from '../ui/Img'

/*
 * Horizontal photo gallery: the section is pinned and vertical scroll slides a wide track of photos sideways.
 * Each photo has its own depth, so near photos travel faster than far ones, and the faint contour lines in
 * the background drift slower than everything else. Photo layout is in vw/% so it scales; on phones the
 * whole track is stretched (K) so photos stay a readable size.
 */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t) => t * t * (3 - 2 * t)

// x, w in vw of the track; y in % of stage height; ratio = h / w; depth > 1 moves faster than the track.
const ITEMS = [
  { x: 3, y: 34, w: 31, ratio: 0.9, label: 'Sankri, 2025', focus: '60% 45%', depth: 1.0 },
  { x: 38, y: 8, w: 11, ratio: 1.0, label: 'Juda Ka Talab, 2025', focus: '30% 60%', depth: 0.82 },
  { x: 52, y: 52, w: 16, ratio: 0.9, label: 'Base Camp, 2024', focus: '75% 35%', depth: 1.12 },
  { x: 74, y: 24, w: 11, ratio: 1.05, label: 'Pine Forest, 2024', focus: '15% 60%', depth: 0.88 },
  { x: 90, y: 5, w: 15, ratio: 1.15, label: 'Summit Ridge, 2025', focus: '50% 22%', depth: 1.05 },
  { x: 108, y: 48, w: 24, ratio: 0.72, label: 'Sunrise, 2025', focus: '65% 40%', depth: 1.15 },
  { x: 136, y: 12, w: 14, ratio: 1.0, label: 'Prayer Flags, 2024', focus: '40% 62%', depth: 0.85 },
  { x: 154, y: 46, w: 18, ratio: 1.1, label: 'Above the Clouds, 2025', focus: '85% 30%', depth: 1.1 },
  { x: 178, y: 18, w: 12, ratio: 0.95, label: 'Camp Fire, 2024', focus: '25% 70%', depth: 0.9 },
  { x: 194, y: 50, w: 26, ratio: 0.68, label: 'Swargarohini, 2025', focus: '90% 20%', depth: 1.0 },
  { x: 224, y: 14, w: 15, ratio: 1.2, label: 'First Snow, 2024', focus: '10% 55%', depth: 1.08 },
  { x: 243, y: 52, w: 12, ratio: 1.0, label: 'Trail Break, 2024', focus: '55% 75%', depth: 0.85 },
]
const TRACK_VW = 275

export default function HorizontalGallery() {
  const wrap = useRef(null)
  const track = useRef(null)
  const bg = useRef(null)
  const bar = useRef(null)
  const itemEls = useRef([])
  const [narrow, setNarrow] = useState(false)
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])
  const K = narrow ? 2.1 : 1

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setNarrow(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    let target = 0, cur = 0, raf = 0
    const apply = () => {
      const vw = window.innerWidth
      const travel = Math.max(0, (TRACK_VW * K * vw) / 100 - vw)
      const x = -cur * travel
      if (track.current) track.current.style.transform = `translate3d(${x}px,0,0)`
      if (bg.current) bg.current.style.transform = `translate3d(${x * 0.45}px,0,0)`
      if (bar.current) bar.current.style.transform = `scaleX(${cur})`
      itemEls.current.forEach((el, i) => {
        if (!el) return
        // Extra parallax: depth > 1 slides a little ahead, depth < 1 lags behind.
        const dx = x * (ITEMS[i].depth - 1) * 0.5
        const left = (ITEMS[i].x * K * vw) / 100 + x
        const w = (ITEMS[i].w * K * vw) / 100
        const vis = clamp((vw - left) / (vw * 0.18)) * clamp((left + w) / (vw * 0.12))
        el.style.transform = `translate3d(${dx}px,0,0)`
        el.style.opacity = String(0.25 + 0.75 * ease(vis))
      })
    }
    const tick = () => {
      cur += (target - cur) * 0.12
      if (Math.abs(target - cur) < 0.0002) cur = target
      apply()
      raf = cur === target ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      if (reduced) return
      const r = wrap.current.getBoundingClientRect()
      target = clamp(-r.top / Math.max(1, wrap.current.offsetHeight - window.innerHeight))
      if (!raf) raf = requestAnimationFrame(tick)
    }
    onScroll()
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', () => { onScroll(); apply() })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll) }
  }, [K, reduced])

  return (
    <section
      ref={wrap}
      id="gallery-scroll"
      aria-label="Photo gallery"
      className="relative"
      style={{ height: reduced ? 'auto' : `${Math.round(TRACK_VW * K * 0.62) + 100}vh` }}
    >
      <div className={`${reduced ? 'relative overflow-x-auto' : 'sticky top-0 overflow-hidden'} h-svh bg-white`}>
        {/* Contour lines, drifting slower than the photos */}
        <div ref={bg} className="absolute inset-y-0 left-0 will-change-transform" style={{ width: `${TRACK_VW * K}vw` }} aria-hidden="true">
          <svg className="h-full w-full" viewBox="0 0 2750 1000" preserveAspectRatio="none" fill="none" stroke="#2D5A40" strokeOpacity="0.45" strokeWidth="1.3">
            <path d="M0 700 C 200 520, 360 840, 560 620 S 860 180, 1080 420 S 1380 860, 1600 560 S 1900 140, 2140 380 S 2460 760, 2750 480" />
            <path d="M0 560 C 220 380, 380 700, 600 480 S 900 60, 1120 300 S 1420 740, 1640 440 S 1940 20, 2180 260 S 2500 640, 2750 360" />
            <path d="M0 860 C 240 700, 420 960, 640 780 S 940 340, 1160 560 S 1460 980, 1680 700 S 1980 300, 2220 520 S 2540 900, 2750 640" />
            <circle cx="620" cy="300" r="190" />
            <circle cx="620" cy="300" r="120" />
            <circle cx="1900" cy="700" r="230" />
            <circle cx="1900" cy="700" r="150" />
            <circle cx="2450" cy="260" r="160" />
          </svg>
        </div>

        <div ref={track} className="absolute inset-y-0 left-0 will-change-transform" style={{ width: `${TRACK_VW * K}vw` }}>
          {/* Intro text, top left */}
          <div className="absolute left-[3vw] top-[12%] max-w-[26rem] md:left-[2vw] md:top-[9%]" style={{ left: `${3 * K}vw`, maxWidth: narrow ? '62vw' : '26vw' }}>
            <p className="font-display text-2xl leading-snug text-forest/90 md:text-[2.1vw]">
              It doesn&rsquo;t matter where you start, it&rsquo;s how you <em>progress</em> from there.
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-forest/60">Kedarkantha · Moments</p>
          </div>

          {ITEMS.map((it, i) => (
            <figure
              key={it.label}
              ref={(n) => { itemEls.current[i] = n }}
              className="absolute will-change-transform"
              style={{ left: `${it.x * K}vw`, top: `${it.y}%`, width: `${it.w * K}vw` }}
            >
              <figcaption className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink/70 md:text-[0.72vw]" style={{ fontSize: narrow ? 10 : undefined }}>{it.label}</figcaption>
              <div className="overflow-hidden" style={{ aspectRatio: `1 / ${it.ratio}` }}>
                <Img focus={it.focus} sizes="40vw" />
              </div>
            </figure>
          ))}
        </div>

        {/* Progress */}
        <div className="absolute bottom-6 left-6 right-6 z-10 h-[2px] overflow-hidden rounded-full bg-forest/15 md:left-[3vw] md:right-[3vw]" aria-hidden="true">
          <div ref={bar} className="h-full origin-left bg-forest" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </section>
  )
}
