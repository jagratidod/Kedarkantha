import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import AsyncView from '../ui/AsyncView'
import Img from '../ui/Img'
import { useAsync } from '../../hooks/useAsync'
import { getItinerary } from '../../features/trek/api'
const mapUrl = '/dayone to day end image.png'

/*
 * Day-by-day itinerary drawn on the hand-drawn trek map (itinerary-map.webp, 820 x 1919).
 *
 * Layout: a tall wrapper scrolls while a framed stage stays pinned. Inside the stage the map is a tall
 * "layer" that is moved like a camera, following the tip of the dotted route. As the route is drawn,
 * each day's stop (badge, photo, title, details) appears when the tip reaches it; the previous card
 * gives way to the next one and only its numbered badge stays on the route.
 *
 * Dimensions
 *   scroll length : 720vh (desktop) / 560vh (mobile)
 *   stage         : 100svh - 24px (12px white frame) on desktop, 100svh - 16px (8px frame) on mobile
 *   map layer     : width = min(stage width, 1100px), height = width x 1919 / 820 (centred, edges fade to cream)
 *   card          : 230-300px wide, beside the route stop (desktop); 58vw (200-240px) above the stop (mobile)
 */

const ART = { w: 820, h: 1919 }
const CREAM = '#F9F0E1' // the paper colour of the artwork, used for the stage and the fading edges
const TAN = '#B8892F'

// Route in artwork pixels, bottom -> summit -> back down. `stop` marks a day.
const ROUTE = [
  [60, 1915], [192, 1757, 1], [290, 1597], [369, 1434, 2], [300, 1330], [247, 1219], [380, 1130],
  [545, 1016, 3], [500, 930], [420, 825], [480, 720], [540, 672], [500, 473], [590, 380], [520, 194, 4],
  [640, 290], [730, 440], [775, 640], [700, 820], [700, 905, 5], [640, 1050], [600, 1190], [690, 1340],
  [770, 1490], [735, 1650, 6], [620, 1790],
]

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t) => t * t * (3 - 2 * t)

/** Smooth curve through points (Catmull-Rom -> cubic Bezier). */
function smoothPath(pts) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

/** Path + the length (0..1) at which each stop sits, for a given artwork scale. */
function buildRoute(s) {
  const pts = ROUTE.map(([x, y, stop]) => [x * s, y * s, stop])
  const d = smoothPath(pts)
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  el.setAttribute('d', d)
  const len = el.getTotalLength()
  const samples = 900
  const sampled = Array.from({ length: samples + 1 }, (_, i) => el.getPointAtLength((i / samples) * len))
  const stops = pts.filter((p) => p[2]).map((p) => {
    let best = 0, bd = Infinity
    sampled.forEach((q, i) => { const dd = Math.hypot(q.x - p[0], q.y - p[1]); if (dd < bd) { bd = dd; best = i } })
    return { x: p[0], y: p[1], f: best / samples }
  })
  return { d, len, stops, el }
}

/** Scroll progress P (0..1) -> drawn fraction of the route, with a pause at every stop. */
function makeTimeline(stopFs) {
  const segs = [{ dwell: true, f: 0, w: 0.5 }]
  let prev = 0
  for (const f of [...stopFs, 1]) {
    segs.push({ a: prev, b: f, w: Math.max(0.2, (f - prev) * 9) })
    segs.push({ dwell: true, f, w: f === 1 ? 0.3 : 0.9 })
    prev = f
  }
  const total = segs.reduce((n, g) => n + g.w, 0)
  return (P) => {
    let t = P * total
    for (const g of segs) {
      if (t <= g.w) return g.dwell ? g.f : g.a + (g.b - g.a) * ease(clamp(t / g.w))
      t -= g.w
    }
    return 1
  }
}

function Stop({ day, n, side, width, above }) {
  return (
    <div
      className="ij-stop absolute"
     
      style={{ width, transform: above != null ? `translate(${above}px, calc(-100% - 26px))` : side === 'right' ? 'translate(18px,-50%)' : 'translate(calc(-100% - 18px),-50%)' }}
    >
      <div className="ij-card overflow-hidden rounded-2xl bg-white/95 shadow-[0_18px_50px_rgb(23_61_42/0.22)] ring-1 ring-forest/10">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Img image={day.image} focus={day.focus} sizes="300px" />
          <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Day {n}</span>
        </div>
        <div className="p-4">
          <p className="font-display text-xl font-semibold leading-tight text-forest sm:text-2xl">{day.title}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{day.meta}</p>
          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink/80">{day.text}</p>
        </div>
      </div>
    </div>
  )
}

function Journey({ days }) {
  const wrap = useRef(null)
  const stage = useRef(null)
  const layer = useRef(null)
  const mask = useRef(null)
  const tip = useRef(null)
  const titleRef = useRef(null)
  const cards = useRef([])
  const [geo, setGeo] = useState(null)
  const [active, setActive] = useState(0)
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])

  // Size the layer to the stage (full width) and build the route for that size.
  useLayoutEffect(() => {
    const el = stage.current
    const measure = () => {
      const sw = el.clientWidth, sh = el.clientHeight
      const lw = sw
      const s = lw / ART.w
      const r = buildRoute(s)
      setGeo({ sw, sh, lw, lh: ART.h * s, s, ...r })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const timeline = useMemo(() => (geo ? makeTimeline(geo.stops.map((s) => s.f)) : null), [geo])

  useEffect(() => {
    if (!geo || !timeline) return
    const { sh, lh, len, el, stops } = geo
    let target = reduced ? 1 : 0
    let cur = target
    let raf = 0
    let lastActive = -1

    const apply = () => {
      const f = timeline(cur)
      const pt = el.getPointAtLength(f * len)
      mask.current?.setAttribute('stroke-dasharray', `${f * len} ${len + 10}`)
      if (tip.current) {
        tip.current.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
        tip.current.style.opacity = f > 0.001 && f < 0.999 ? '1' : '0'
      }
      const camY = clamp(sh * 0.56 - pt.y, Math.min(0, sh - lh), 0)
      if (layer.current) layer.current.style.transform = `translate3d(0,${reduced ? 0 : camY}px,0)`
      // Only the current day's card is shown; earlier stops keep their numbered badge ('past'), later ones wait.
      const a = stops.reduce((n, s, i) => (f >= s.f - 0.004 ? i : n), -1)
      stops.forEach((s, i) => {
        const state = i === a ? 'true' : i < a ? 'past' : 'false'
        const c = cards.current[i]
        if (c && c.dataset.on !== state) c.dataset.on = state
      })
      // Scale title from big in center to normal fit on top as user scrolls (0 -> 0.15)
      if (titleRef.current) {
        const p = clamp(cur / 0.14) // 0 at start, 1 when reached 14% scroll
        // p=0: big (scale 2.6 - 3.2), centered translateY; p=1: fit at top (scale 1, translateY 0)
        const scale = 2.8 - 1.8 * ease(p)
        const ty = (1 - ease(p)) * (sh * 0.38)
        titleRef.current.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`
        titleRef.current.style.transformOrigin = 'center top'
      }

      const shown = Math.max(0, a)
      if (shown !== lastActive) { lastActive = shown; setActive(shown) }
    }

    const tick = () => {
      cur += (target - cur) * 0.14
      if (Math.abs(target - cur) < 0.0002) cur = target
      apply()
      raf = cur === target ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      if (reduced) return
      const r = wrap.current.getBoundingClientRect()
      const max = wrap.current.offsetHeight - window.innerHeight
      target = clamp(max > 0 ? -r.top / max : 0)
      if (!raf) raf = requestAnimationFrame(tick)
    }
    onScroll()
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll) }
  }, [geo, timeline, reduced])

  const cardW = geo ? clamp(geo.lw * 0.3, 230, 300) : 260
  const narrow = geo ? geo.sw < 640 : false
  const w = narrow ? clamp(geo.sw * 0.58, 200, 240) : cardW

  return (
    <section
      ref={wrap}
      id="journey"
      aria-label="Day-by-day itinerary"
      className="relative bg-white"
      style={{ height: reduced ? 'auto' : narrow ? '560vh' : '720vh' }}
    >
      <div
        ref={stage}
        className={`ij-stage ${reduced ? 'relative' : 'sticky'} overflow-hidden bg-white`}
        style={{ height: reduced && geo ? geo.lh : undefined }}
      >
        {geo && (
          <>
            <div
              ref={layer}
              className="absolute left-0 top-0 will-change-transform"
              style={{ width: geo.lw, height: geo.lh }}
            >
              <img src={mapUrl} alt="" decoding="async" className="absolute inset-0 h-full w-full select-none" draggable="false" />

              <svg viewBox={`0 0 ${geo.lw} ${geo.lh}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                <defs>
                  <mask id="ij-mask" maskUnits="userSpaceOnUse" x="-80" y="-80" width={geo.lw + 160} height={geo.lh + 160}>
                    <path ref={mask} d={geo.d} fill="none" stroke="#fff" strokeWidth="20" strokeLinecap="round" strokeDasharray={`0 ${geo.len + 10}`} />
                  </mask>
                </defs>
                <g mask="url(#ij-mask)">
                  <path d={geo.d} fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="9" strokeLinecap="round" strokeDasharray="0.1 14" />
                  <path d={geo.d} fill="none" stroke={TAN} strokeWidth="4.2" strokeLinecap="round" strokeDasharray="0.1 14" className="ij-flow" />
                </g>
                <g ref={tip} style={{ opacity: 0, transition: 'opacity .3s' }}>
                  <circle r="16" fill={TAN} opacity="0.25" className="ij-pulse" />
                  <circle r="7" fill={TAN} stroke="#fff" strokeWidth="2.5" />
                </g>
              </svg>

              {geo.stops.map((s, i) => {
                const side = s.x < geo.lw * 0.5 ? 'right' : 'left'
                return (
                  <div key={i} className="absolute" style={{ left: s.x, top: s.y }}>
                    <div ref={(n) => { cards.current[i] = n }} data-on="false" className="ij-pin">
                      <span className="ij-badge absolute -left-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white shadow-md ring-2 ring-white">{i + 1}</span>
                      <Stop day={days[i]} n={days[i].day} side={side} width={w} above={narrow ? clamp(s.x - w / 2, 8, geo.lw - w - 8) - s.x : null} />
                    </div>
                  </div>
                )
              })}
            </div>



            {/* HUD Title with scroll scale animation (starts Big in center, then fits smoothly on top) */}
            <div
              ref={titleRef}
              className="pointer-events-none absolute inset-x-0 top-4 flex flex-col items-center text-center will-change-transform sm:top-6"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-forest/70 sm:text-xs">Kedarkantha Trek</p>
              <h2 className="font-display text-4xl font-bold uppercase tracking-tight leading-none text-forest drop-shadow-sm sm:text-5xl lg:text-6xl">Day by Day</h2>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center md:bottom-4">
              <div className="flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 shadow ring-1 ring-forest/10 backdrop-blur">
                {days.slice(0, geo.stops.length).map((d, i) => (
                  <span key={d.day} className={`h-1.5 rounded-full transition-all duration-500 ${i <= active ? 'w-5 bg-forest' : 'w-1.5 bg-forest/25'}`} />
                ))}
                <span className="ml-1 text-[11px] font-semibold text-forest">Day {days[active]?.day}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default function ItineraryJourney() {
  const state = useAsync(getItinerary)
  return (
    <AsyncView state={state} fallback={<div className="h-[60vh] animate-pulse bg-[#F9F0E1]" />}>
      {(days) => <Journey days={days} />}
    </AsyncView>
  )
}
