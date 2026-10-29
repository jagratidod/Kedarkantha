import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import AsyncView from '../ui/AsyncView'
import Img from '../ui/Img'
import { useAsync } from '../../hooks/useAsync'
import { getItinerary } from '../../features/trek/api'
const ART = { w: 2172, h: 724 }
const BG_NAVY = '#0A1826'
const ACCENT_CYAN = '#38BDF8'
const ACCENT_GLOW = '#2DD4BF'

// Route in artwork pixels, left -> right: Sankri, Juda Ka Talab, Base Camp, summit, then back down. `stop` marks a day.
const ROUTE = [
  [40, 620], [230, 565, 1], [420, 500], [690, 525], [950, 470], [1250, 455, 2], [1420, 420], [1560, 335],
  [1650, 315, 3], [1760, 200], [1860, 95, 4], [1960, 260], [1990, 430], [1900, 560, 5], [2050, 640], [2130, 690, 6],
]

// Hand-lettered place names written onto the map, per stop. dx/dy: offset from the stop, in artwork px; rot in degrees.
const PLACES = [
  { name: 'Sankri (6,400 ft)', dx: -10, dy: 62, rot: -3 },
  { name: 'Juda Ka Talab (9,100 ft)', dx: 70, dy: 42, rot: -4, lake: true },
  { name: 'Base Camp (11,250 ft)', dx: 10, dy: -52, rot: 0 },
  { name: 'Kedarkantha Summit (12,500 ft)', dx: 0, dy: -58, rot: 0 },
  { name: 'Hargaon / Sankri', dx: 0, dy: 40, rot: 0 },
  { name: 'Dehradun Return', dx: -10, dy: -40, rot: 0 },
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

function Stop({ day, n, up, width, dx }) {
  return (
    <div
      className="ij-stop absolute z-20"
      style={{ width, left: dx, top: 0, transform: up ? 'translate(0, calc(-100% - 24px))' : 'translate(0, 24px)' }}
    >
      <div className="ij-card overflow-hidden rounded-2xl bg-[#0B1E2E]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#38BDF8]/25 ring-1 ring-white/10">
        <div className="relative aspect-[16/9.5] overflow-hidden">
          <Img image={day.image} focus={day.focus} sizes="260px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E2E] via-transparent to-transparent opacity-60" />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#38BDF8] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#06121E] shadow-md">Day {n}</span>
        </div>
        <div className="p-3.5 sm:p-4">
          <p className="font-display text-lg font-semibold leading-tight text-white sm:text-xl drop-shadow-sm">{day.title}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#38BDF8]">{day.meta}</p>
          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-300">{day.text}</p>
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
  const mapRef = useRef(null)
  const cards = useRef([])
  const [geo, setGeo] = useState(null)
  const [active, setActive] = useState(0)
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])

  // Size the layer to the stage (full width) and build the route for that size.
  useLayoutEffect(() => {
    const el = stage.current
    const measure = () => {
      const sw = el.clientWidth, sh = el.clientHeight
      // Cover the stage height; on very wide screens grow until the map is at least 1.2 screens wide.
      const s = Math.max(sh / ART.h, (sw * 1.2) / ART.w)
      const lw = ART.w * s
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
    const { sw, sh, lw, len, el, stops } = geo
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
      const camX = clamp(sw * (sw < 640 ? 0.5 : 0.42) - pt.x, Math.min(0, sw - lw), 0)
      if (layer.current) layer.current.style.transform = `translate3d(${reduced ? 0 : camX}px,0,0)`
      // Only the current day's card is shown; earlier stops keep their numbered badge ('past'), later ones wait.
      const a = stops.reduce((n, s, i) => (f >= s.f - 0.004 ? i : n), -1)
      stops.forEach((s, i) => {
        const state = i === a ? 'true' : i < a ? 'past' : 'false'
        const c = cards.current[i]
        if (c && c.dataset.on !== state) c.dataset.on = state
      })
      // Map background: none while the big heading is alone, then a light wash, then full strength.
      if (mapRef.current) {
        const o = 0.4 * ease(clamp((cur - 0.035) / 0.075)) + 0.6 * ease(clamp((cur - 0.12) / 0.16))
        mapRef.current.style.opacity = String(reduced ? 1 : o)
      }
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

  const cardW = geo ? clamp(geo.lw * 0.25, 210, 260) : 230
  const narrow = geo ? geo.sw < 640 : false
  const w = narrow ? clamp(geo.sw * 0.52, 180, 220) : cardW

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
        className={`ij-stage ${reduced ? 'relative' : 'sticky'} overflow-hidden bg-[#78B4D4]`}
      >
        {/* Sky gradient background like hero section */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #FFFFFF 0%, #F0F9FF 14%, #D4ECF9 34%, #97D0EE 58%, #5CA8D3 80%, #3682AD 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-4/5 pointer-events-none"
          style={{
            background: 'radial-gradient(90% 80% at 50% 88%, rgba(255, 255, 255, 0.7) 0%, rgba(186, 230, 253, 0.45) 45%, transparent 75%)',
          }}
          aria-hidden="true"
        />
        {geo && (
          <>
            <div
              ref={layer}
              className="absolute left-0 will-change-transform"
              style={{ width: geo.lw, height: geo.lh, top: (geo.sh - geo.lh) / 2 }}
            >
              {/* Procedural Alpine Topography & Mountain Contours Background */}
              <svg
                ref={mapRef}
                style={{ opacity: 0 }}
                viewBox={`0 0 ${geo.lw} ${geo.lh}`}
                className="absolute inset-0 h-full w-full pointer-events-none select-none"
                aria-hidden="true"
              >
                <defs>
                  {/* Glowing background gradient */}
                  <radialGradient id="ij-sky-glow" cx="85%" cy="20%" r="60%" display="none">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.12" />
                    <stop offset="50%" stopColor="#1E3A5F" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#0A1826" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="ridge-grad-1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E4D6E" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0E2D44" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="ridge-grad-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#28628A" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#123B5A" stopOpacity="0.75" />
                  </linearGradient>
                  <linearGradient id="ridge-grad-3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#357DA8" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#19486D" stopOpacity="0.65" />
                  </linearGradient>

                  {/* Topographic pattern / grid */}
                  <pattern id="ij-geo-grid" width={geo.lw / 24} height={geo.lh / 8} patternUnits="userSpaceOnUse">
                    <path
                      d={`M ${geo.lw / 24} 0 L 0 0 0 ${geo.lh / 8}`}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="0.5"
                      strokeOpacity="0.05"
                      strokeDasharray="2 4"
                    />
                  </pattern>

                  {/* Trail animation mask */}
                  <mask id="ij-mask" maskUnits="userSpaceOnUse" x="-80" y="-80" width={geo.lw + 160} height={geo.lh + 160}>
                    <path ref={mask} d={geo.d} fill="none" stroke="#fff" strokeWidth="20" strokeLinecap="round" strokeDasharray={`0 ${geo.len + 10}`} />
                  </mask>
                </defs>

                {/* Base atmospheric glow */}
                
                <rect width={geo.lw} height={geo.lh} fill="url(#ij-geo-grid)" />

                {/* Elegant Distant Mountain Ranges (Silhouette layers) */}
                <path
                  d={`M 0 ${geo.lh * 0.72} 
                      Q ${geo.lw * 0.12} ${geo.lh * 0.42}, ${geo.lw * 0.25} ${geo.lh * 0.54} 
                      T ${geo.lw * 0.48} ${geo.lh * 0.38} 
                      T ${geo.lw * 0.65} ${geo.lh * 0.45} 
                      T ${geo.lw * 0.84} ${geo.lh * 0.16} 
                      T ${geo.lw} ${geo.lh * 0.35} 
                      L ${geo.lw} ${geo.lh} L 0 ${geo.lh} Z`}
                  fill="url(#ridge-grad-3)"
                />

                <path
                  d={`M 0 ${geo.lh * 0.8} 
                      Q ${geo.lw * 0.16} ${geo.lh * 0.62}, ${geo.lw * 0.32} ${geo.lh * 0.68} 
                      T ${geo.lw * 0.58} ${geo.lh * 0.52} 
                      T ${geo.lw * 0.78} ${geo.lh * 0.38} 
                      T ${geo.lw * 0.86} ${geo.lh * 0.14} 
                      T ${geo.lw} ${geo.lh * 0.5} 
                      L ${geo.lw} ${geo.lh} L 0 ${geo.lh} Z`}
                  fill="url(#ridge-grad-2)"
                />

                <path
                  d={`M 0 ${geo.lh * 0.88} 
                      Q ${geo.lw * 0.2} ${geo.lh * 0.75}, ${geo.lw * 0.4} ${geo.lh * 0.72} 
                      T ${geo.lw * 0.68} ${geo.lh * 0.62} 
                      T ${geo.lw * 0.85} ${geo.lh * 0.18} 
                      T ${geo.lw} ${geo.lh * 0.65} 
                      L ${geo.lw} ${geo.lh} L 0 ${geo.lh} Z`}
                  fill="url(#ridge-grad-1)"
                />

                {/* Fine topographic contour lines across the terrain */}
                {[0.28, 0.36, 0.44, 0.52, 0.60, 0.68, 0.76, 0.84].map((ratio, idx) => (
                  <path
                    key={idx}
                    d={`M 0 ${geo.lh * (ratio + 0.08)} 
                        C ${geo.lw * 0.18} ${geo.lh * (ratio - 0.05)}, ${geo.lw * 0.35} ${geo.lh * (ratio + 0.04)}, ${geo.lw * 0.52} ${geo.lh * (ratio - 0.03)} 
                        S ${geo.lw * 0.75} ${geo.lh * (ratio - 0.09)}, ${geo.lw * 0.85} ${geo.lh * (ratio * 0.6)} 
                        S ${geo.lw * 0.95} ${geo.lh * (ratio + 0.02)}, ${geo.lw} ${geo.lh * (ratio + 0.05)}`}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth={idx % 2 === 0 ? '1' : '0.6'}
                    strokeOpacity={0.07 + (idx * 0.015)}
                    strokeDasharray={idx % 3 === 0 ? '4 8' : 'none'}
                  />
                ))}

                {/* Elevation markers & aesthetic coordinate notations */}
                <g fill="#7EB5D6" opacity="0.35" fontSize={Math.max(9, geo.s * 11)} fontFamily="sans-serif" letterSpacing="0.1em">
                  <text x={geo.lw * 0.05} y={geo.lh * 0.92}>ALT 1,950m // 6,400ft (SANKRI VALLEY)</text>
                  <text x={geo.lw * 0.38} y={geo.lh * 0.88}>N 31°04'48" E 78°11'06"</text>
                  <text x={geo.lw * 0.72} y={geo.lh * 0.08}>SUMMIT ELEVATION: 3,810m // 12,500ft ▲</text>
                  <circle cx={geo.lw * 0.856} cy={geo.lh * 0.132} r="4" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
                </g>

                {/* Animated Trek Trail (Cyan / Aqua glowing trail on dark alpine canvas) */}
                <g mask="url(#ij-mask)">
                  {/* Subtle outer glow on path */}
                  <path d={geo.d} fill="none" stroke="#38BDF8" strokeOpacity="0.25" strokeWidth="12" strokeLinecap="round" />
                  {/* Base crisp dashed line */}
                  <path d={geo.d} fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="1 12" />
                  {/* Pulsing cyan flowing bead */}
                  <path d={geo.d} fill="none" stroke={ACCENT_CYAN} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 14" className="ij-flow" />
                </g>

                {/* Active Trail Head Marker */}
                <g ref={tip} style={{ opacity: 0, transition: 'opacity .3s' }}>
                  <circle r="22" fill={ACCENT_CYAN} opacity="0.2" className="ij-pulse" />
                  <circle r="12" fill={ACCENT_GLOW} opacity="0.35" />
                  <circle r="6" fill="#ffffff" stroke={ACCENT_CYAN} strokeWidth="3" />
                </g>
              </svg>

              {/* Stop Pins and Cards */}
              {geo.stops.map((s, i) => {
                const up = s.y > geo.lh * 0.5
                return (
                  <div key={i} className="absolute" style={{ left: s.x, top: s.y }}>
                    <div ref={(n) => { cards.current[i] = n }} data-on="false" className="ij-pin">
                      <span className="ij-badge absolute -left-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#38BDF8] text-sm font-bold text-[#06121E] shadow-[0_4px_16px_rgba(56,189,248,0.4)] ring-2 ring-white/80">
                        {i + 1}
                      </span>
                      <span
                        className="ij-label pointer-events-none absolute whitespace-nowrap text-center font-display font-medium text-sky-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                        style={{
                          left: PLACES[i].dx * geo.s,
                          top: PLACES[i].dy * geo.s,
                          fontSize: Math.max(14, geo.s * 18),
                          letterSpacing: '0.04em',
                          '--rot': `${PLACES[i].rot}deg`,
                        }}
                        aria-hidden="true"
                      >
                        {PLACES[i].name}
                      </span>
                      <Stop day={days[i]} n={days[i].day} up={up} width={w} dx={clamp(s.x - w / 2, 8, geo.lw - w - 8) - s.x} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* HUD Title with scroll scale animation */}
            <div
              ref={titleRef}
              className="pointer-events-none absolute inset-x-0 top-3 flex flex-col items-center text-center will-change-transform sm:top-5 z-30"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#0F3859] sm:text-[11px] font-bold">Kedarkantha Expedition</p>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight leading-none text-white drop-shadow-[0_4px_24px_rgba(15,56,89,0.45)] sm:text-4xl lg:text-5xl">Day by Day</h2>
            </div>

            {/* HUD Progress pill at bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center md:bottom-6 z-30">
              <div className="flex items-center gap-2 rounded-full bg-[#0E283E]/85 px-4 py-2 shadow-2xl border border-white/20 ring-1 ring-[#38BDF8]/30 backdrop-blur-md">
                {days.slice(0, geo.stops.length).map((d, i) => (
                  <span
                    key={d.day}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i <= active ? 'w-6 bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]' : 'w-1.5 bg-white/20'}`}
                  />
                ))}
                <span className="ml-2 text-[11px] font-semibold tracking-wider uppercase text-sky-200">Day {days[active]?.day} of {geo.stops.length}</span>
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
