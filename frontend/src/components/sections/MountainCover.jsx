import { useEffect, useRef } from 'react'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const SIDE_LEAD = 0.22 // how much earlier the side mountains rise than the middle

// One layer, in the page colour (#F5F6F2) so the cover melts into the next section.
// Grey-blue only at the very top of the peaks (like shaded rock/snow), fading to the page colour.
const LAYERS = [{ seed: 7.3, amp: 0.5, lead: 0, top: '#C9CFCB', bottom: '#F5F6F2', rough: 0.55 }]

const mix = (a, b, t) => {
  const f = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [x, y] = [f(a), f(b)]
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',')})`
}

// Smooth deterministic 1D value noise.
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }
const smooth = (t) => t * t * (3 - 2 * t)
const noise = (x) => { const i = Math.floor(x); return hash(i) + (hash(i + 1) - hash(i)) * smooth(x - i) }

// Alpine skyline: a few tall asymmetric peaks (sharp triangles) + jagged ridged detail on top.
const PEAKS = [ // [centre 0..1, height 0..1, left slope, right slope]
  [0.05, 0.42, 2.6, 3.4], [0.17, 0.62, 3.0, 2.4], [0.30, 1.0, 3.4, 2.8], [0.43, 0.55, 2.6, 3.2],
  [0.55, 0.72, 3.0, 2.6], [0.67, 0.5, 2.8, 3.4], [0.78, 0.8, 3.2, 2.6], [0.90, 0.6, 2.6, 3.0], [0.99, 0.45, 3.2, 2.4],
]
function ridge(t, seed, rough) {
  let base = 0
  for (const [c, h, sl, sr] of PEAKS) {
    const d = t - c
    base = Math.max(base, h - Math.abs(d) * (d < 0 ? sl : sr))
  }
  let sum = 0, amp = 1, norm = 0, f = 9
  for (let o = 0; o < 4; o++) {
    sum += amp * (1 - Math.abs(noise(t * f + seed * (o + 1)) * 2 - 1))
    norm += amp
    amp *= rough
    f *= 2.1
  }
  return clamp(base * 0.9 + (sum / norm - 0.5) * 0.28 * clamp(base * 2 + 0.2))
}

/**
 * Layered mountain ranges that rise from the bottom (higher at the left and right edges first) and
 * cover the section above. Place as the LAST child of a tall `relative` wrapper: it spans the
 * wrapper's last 2 screens and draws itself in viewport space while the stage is pinned.
 */
export default function MountainCover() {
  const svg = useRef(null)
  const paths = useRef([])
  const stops = useRef([])

  useEffect(() => {
    const el = svg.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const w = el.clientWidth
      const r = el.getBoundingClientRect()
      const base = clamp((2 * vh - r.bottom) / (0.6 * vh)) // 0 -> 1 over the last 60% of a screen of scroll, so it is finished before the stage is released
      const n = Math.max(60, Math.ceil(w / 8))
      LAYERS.forEach((L, li) => {
        const d = paths.current[li]
        // Fade the grey peak tint into the page colour as the cover completes, so the end state is seamless.
        stops.current[li]?.setAttribute('stop-color', mix(L.top, L.bottom, clamp((base - 0.5) / 0.4)))
        if (!d) return
        const p = clamp(base * (1 + L.lead) + (base > 0 ? L.lead * 0.5 : 0))
        if (base <= 0) { d.setAttribute('d', ''); return }
        const amp = clamp(w * L.amp, 200, 620)
        let s = ''
        for (let i = 0; i <= n; i++) {
          const t = i / n
          const side = Math.abs(t * 2 - 1)
          const q = clamp(p * (1 + SIDE_LEAD) - SIDE_LEAD * (1 - side))
          const rise = Math.max(0, q * (vh + amp) - amp * 1.15 * (1 - ridge(t, L.seed, L.rough)) * (1 - q))
          s += `${i ? 'L' : 'M'}${(t * w).toFixed(1)} ${(vh - rise - r.top).toFixed(1)}`
        }
        d.setAttribute('d', `${s} L${w} ${r.height} L0 ${r.height} Z`)
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <svg ref={svg} className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[200vh] w-full" aria-hidden="true">
      <defs>
        {LAYERS.map((L, i) => (
          <linearGradient key={i} id={`mc-g${i}`} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop ref={(e) => { stops.current[i] = e }} offset="0" stopColor={L.top} />
            <stop offset="0.28" stopColor={L.bottom} />
          </linearGradient>
        ))}
      </defs>
      {LAYERS.map((L, i) => (
        <path key={i} ref={(e) => { paths.current[i] = e }} fill={`url(#mc-g${i})`} />
      ))}
    </svg>
  )
}
