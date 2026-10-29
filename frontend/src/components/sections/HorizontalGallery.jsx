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
  { x: 3, y: 34, w: 31, ratio: 0.72, label: 'Sankri Trailhead · 14 KM', image: '/gallery/sankri-trailhead.jpg', focus: '50% 50%', depth: 1.0 },
  { x: 38, y: 8, w: 14, ratio: 1.0, label: 'Base Camp Squad, 2025', image: '/gallery/sankri-basecamp.jpg', focus: '50% 40%', depth: 0.82 },
  { x: 55, y: 52, w: 18, ratio: 0.88, label: 'Pine Forest Trail, 2024', image: '/gallery/pine-forest-trail.jpg', focus: '50% 45%', depth: 1.12 },
  { x: 77, y: 18, w: 15, ratio: 1.1, label: 'Juda Ka Talab Ascent, 2024', image: '/gallery/juda-lake-ascent.jpg', focus: '50% 30%', depth: 0.88 },
  { x: 96, y: 50, w: 16, ratio: 1.05, label: 'Campfire Evening, 2024', image: '/gallery/camp-bonfire-evening.jpg', focus: '50% 40%', depth: 1.05 },
  { x: 116, y: 14, w: 26, ratio: 0.62, label: 'Snow Ridge Walk, 2025', image: '/gallery/snow-ridge-trail.jpg', focus: '50% 50%', depth: 1.15 },
  { x: 146, y: 48, w: 18, ratio: 0.82, label: 'Tricolour at Snow Peaks, 2025', image: '/gallery/himalayan-flag-pride.jpg', focus: '50% 40%', depth: 0.85 },
  { x: 168, y: 15, w: 25, ratio: 0.62, label: 'Summit Crew · 12,500 FT', image: '/gallery/summit-crew-12500.jpg', focus: '50% 45%', depth: 1.1 },
  { x: 196, y: 50, w: 16, ratio: 1.12, label: 'Crampons & Shrine, 2024', image: '/gallery/shiva-shrine-crampons.jpg', focus: '50% 35%', depth: 0.9 },
  { x: 216, y: 14, w: 18, ratio: 0.82, label: 'Kedarkantha Shrine, 2025', image: '/gallery/kedarkantha-flags.jpg', focus: '50% 35%', depth: 1.0 },
  { x: 238, y: 48, w: 18, ratio: 0.82, label: 'Summit Victory, 2025', image: '/gallery/summit-victory-moment.jpg', focus: '50% 35%', depth: 1.08 },
  { x: 260, y: 16, w: 16, ratio: 0.82, label: 'Peak Celebration, 2025', image: '/gallery/peak-celebration.jpg', focus: '50% 35%', depth: 0.85 },
]
const TRACK_VW = 280

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
      className="relative bg-white"
      style={{ height: reduced ? 'auto' : `${Math.round(TRACK_VW * K * 0.62) + 100}vh` }}
    >
      <div className={`${reduced ? 'relative overflow-x-auto' : 'sticky top-0 overflow-hidden'} h-svh bg-white`}>
        {/* Contour lines in elegant subtle slate on white */}
        <div ref={bg} className="absolute inset-y-0 left-0 will-change-transform" style={{ width: `${TRACK_VW * K}vw` }} aria-hidden="true">
          <svg className="h-full w-full" viewBox="0 0 2750 1000" preserveAspectRatio="none" fill="none" stroke="#0284C7" strokeOpacity="0.12" strokeWidth="1.3">
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
          {/* Intro text, top left - adjusted for light white background */}
          <div className="absolute left-[3vw] top-[12%] max-w-[26rem] md:left-[2vw] md:top-[9%]" style={{ left: `${3 * K}vw`, maxWidth: narrow ? '62vw' : '26vw' }}>
            <p className="font-display text-2xl leading-snug text-slate-900 md:text-[2.1vw]">
              It doesn&rsquo;t matter where you start, it&rsquo;s how you <em className="text-[#0284C7] not-italic font-semibold">progress</em> from there.
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Kedarkantha · Moments</p>
          </div>

          {ITEMS.map((it, i) => (
            <figure
              key={it.label}
              ref={(n) => { itemEls.current[i] = n }}
              className="absolute will-change-transform"
              style={{ left: `${it.x * K}vw`, top: `${it.y}%`, width: `${it.w * K}vw` }}
            >
              <figcaption className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-700 md:text-[0.72vw]" style={{ fontSize: narrow ? 10 : undefined }}>
                {it.label}
              </figcaption>
              <div className="group overflow-hidden rounded-2xl ring-1 ring-black/10 hover:ring-[#0284C7]/60 shadow-xl transition-all duration-300 hover:scale-[1.02] bg-slate-100" style={{ aspectRatio: `1 / ${it.ratio}` }}>
                <Img image={it.image} alt={it.label} focus={it.focus} sizes="40vw" className="transition-transform duration-500 group-hover:scale-105" />
              </div>
            </figure>
          ))}
        </div>


      </div>
    </section>
  )
}
