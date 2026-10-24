import { useLayoutEffect, useRef, useState } from 'react'
import { MapPin, TreePine } from 'lucide-react'
import { useInView } from '../../hooks/useInView'

const LINE = '#173D2A'

function Logo() {
  return (
    <svg width="46" height="30" viewBox="0 0 46 30" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 27 17 6l7 10 5-7 14 18" />
      <path d="M14 11l3 4 3-3" />
      <path d="M25 27V19m0 0-3 3m3-3 3 3" />
    </svg>
  )
}

/** Route in header-local px: Sankri (left) -> Kedarkantha summit (right), passing lower beneath title and filter chips. */
function route(w, yc) {
  const x = (f) => (f * w).toFixed(1)
  const yBase = yc + 28 // shifted lower beneath the chips
  return {
    d: `M${(0.10 * w + 24).toFixed(1)} 54 C ${x(0.15)} 48, ${x(0.18)} 95, ${x(0.20)} 125 S ${x(0.25)} ${yBase - 15}, ${x(0.32)} ${yBase} L ${x(0.68)} ${yBase} C ${x(0.75)} ${yBase - 12}, ${x(0.78)} ${yBase - 18}, ${x(0.81)} ${yBase - 36} S ${x(0.87)} 110, ${x(0.91)} 86 S ${x(0.93)} 62, ${(0.95 * w - 46).toFixed(1)} 56`,
    nodes: [[0.20, 125], [0.81, yBase - 36], [0.89, 98]],
    trees: [[0.24, 150], [0.75, yBase + 12], [0.85, 102]],
  }
}

/**
 * Header of the Photo Gallery section: logo, title, subtitle and filter chips,
 * with an animated dotted trail from Sankri to the Kedarkantha summit running behind them.
 */
export default function GalleryHeader({ title, subtitle, children }) {
  const [seenRef, seen] = useInView({ threshold: 0.2 })
  const box = useRef(null)
  const chips = useRef(null)
  const [geo, setGeo] = useState({ w: 0, yc: 0 })

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => {
      const b = el.getBoundingClientRect()
      const cr = chips.current?.getBoundingClientRect()
      setGeo({ w: el.clientWidth, yc: cr ? cr.top - b.top + cr.height / 2 : 190 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, yc } = geo
  const r = w ? route(w, yc) : null
  const H = Math.ceil(yc + 75)

  return (
    <div ref={(n) => { box.current = n; seenRef.current = n }} data-in={seen} className="relative mx-auto w-full px-4 pb-10 pt-10 text-center">
      {r && (
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden md:block" style={{ height: H }} aria-hidden="true">
          <svg viewBox={`0 0 ${w} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <mask id="gh-mask" maskUnits="userSpaceOnUse" x="-40" y="-40" width={w + 80} height={H + 80}>
                <path d={r.d} pathLength="1" fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round" className="gh-draw" />
              </mask>
            </defs>

            {/* Animated Main Trail */}
            <g mask="url(#gh-mask)">
              <path d={r.d} fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 8" className="gh-flow" />
            </g>
            {r.nodes.map(([f, y], i) => (
              <circle key={i} cx={f * w} cy={y} r="5" fill="#fff" stroke={LINE} strokeWidth="1.8" className="gh-node" style={{ '--d': `${1200 + i * 700}ms` }} />
            ))}
          </svg>
          {r.trees.map(([f, y], i) => (
            <TreePine key={i} size={22} strokeWidth={1.8} className="gh-node absolute text-forest" style={{ left: f * w - 11, top: y - 22, '--d': `${1400 + i * 700}ms` }} />
          ))}
          <div className="absolute flex flex-col items-center text-forest" style={{ left: 0.10 * w - 30, top: 28, width: 80 }}>
            <MapPin size={26} strokeWidth={2.2} />
            <span className="mt-1 text-[11px] font-bold uppercase tracking-wide">Sankri</span>
            <span className="text-[10px] text-muted">6,400 ft</span>
          </div>
          <div className="absolute flex flex-col items-center text-forest" style={{ left: 0.95 * w - 46, top: 32, width: 100 }}>
            <span className="text-[11px] font-bold uppercase leading-tight tracking-wide">Kedarkantha<br />Summit</span>
            <span className="text-[10px] text-muted">12,500 ft</span>
          </div>
        </div>
      )}

      <div className="relative flex flex-col items-center">
        <Logo />
        <h2 className="mt-2 font-display text-5xl font-bold leading-none text-forest sm:text-6xl">{title}</h2>
        {subtitle && <p className="mt-3 text-sm text-muted sm:text-base">{subtitle}</p>}
        <div ref={chips} className="mt-6 w-full max-w-full">{children}</div>
      </div>
    </div>
  )
}
