import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AsyncView from '../ui/AsyncView'
import Img from '../ui/Img'
import { useAsync } from '../../hooks/useAsync'
import { useInView } from '../../hooks/useInView'
import { getJourneys } from '../../features/trek/api'
import mapUrl from '../../assets/images/world-map.webp'

const LINE = '#B98F5E' // warm tan that matches the map artwork
const STAGE = { w: 755, h: 660 } // coordinate space of the connecting paths (matches stage aspect ratio)

// 1 -> 2 and 2 -> 3, in stage coordinates.
const PATHS = [
  'M572 320 C 520 362, 440 362, 386 322',
  'M221 378 C 192 390, 169 410, 168 438 C 167 472, 176 496, 154 522',
]

function Card({ j }) {
  return (
    <Link
      to={j.to}
      className="group block overflow-hidden rounded-[0.9cqw] bg-white/95 shadow-[0_1.2cqw_3cqw_rgb(23_61_42/0.18)] ring-1 ring-forest/10"
    >
      <div className="aspect-[1.55] overflow-hidden">
        <Img image={j.image} focus={j.focus} sizes="300px" className="transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="flex items-center justify-between px-[7%] py-[6%]">
        <div>
          <p className="font-display text-[1.7cqw] font-semibold uppercase leading-none tracking-normal text-forest">{j.name}</p>
          <p className="mt-[0.5cqw] text-[0.95cqw] font-medium uppercase tracking-[0.18em] text-muted">{j.region}</p>
        </div>
        <ArrowRight className="ml-[0.6cqw] h-[1.5cqw] w-[1.5cqw] shrink-0 text-forest transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </Link>
  )
}

function Desktop({ items }) {
  // Card reveal order: 1, path, 2, path, 3
  const cardDelay = [700, 2300, 3900]
  return (
    <div className="relative hidden aspect-[755/660] w-full [container-type:inline-size] md:block">
      <svg viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        {PATHS.map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength="1"
            fill="none"
            stroke={LINE}
            strokeWidth="1.6"
            strokeLinecap="round"
            className="jm-path"
            style={{ '--d': `${1500 + i * 1600}ms` }}
          />
        ))}
        <circle cx="168" cy="438" r="4" fill={LINE} className="jm-node" style={{ '--d': '3200ms' }} />
      </svg>

      {items.map((j, i) => (
        <div
          key={j.id}
          className="jm-rise absolute"
          style={{ left: `${j.pos.left}%`, top: `${j.pos.top}%`, width: `${j.pos.width}%`, '--d': `${cardDelay[i] ?? 700 + i * 1600}ms` }}
        >
          <div className="jm-float" style={{ animationDelay: `${i * 0.7 + 2.4}s` }}>
            <Card j={j} />
          </div>
          <span
            className="jm-badge absolute -right-[0.9cqw] -top-[0.9cqw] flex h-[2.5cqw] w-[2.5cqw] items-center justify-center rounded-full bg-forest text-[1.15cqw] font-semibold text-white shadow-md"
            style={{ '--d': `${(cardDelay[i] ?? 700) + 500}ms` }}
            aria-hidden="true"
          >
            {j.id}
          </span>
        </div>
      ))}
    </div>
  )
}

function Mobile({ items }) {
  return (
    <ol className="relative mx-auto max-w-sm space-y-6 pb-4 pl-11 md:hidden">
      <span className="jm-vline absolute bottom-6 left-[15px] top-4 w-px" style={{ background: `repeating-linear-gradient(${LINE} 0 6px, transparent 6px 11px)` }} aria-hidden="true" />
      {items.map((j, i) => (
        <li key={j.id} className="jm-rise relative [container-type:inline-size]" style={{ '--d': `${500 + i * 450}ms` }}>
          <span className="jm-badge absolute -left-11 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white" style={{ '--d': `${700 + i * 450}ms` }} aria-hidden="true">
            {j.id}
          </span>
          <MobileCard j={j} />
        </li>
      ))}
    </ol>
  )
}

function MobileCard({ j }) {
  return (
    <Link to={j.to} className="group block overflow-hidden rounded-xl bg-white/95 shadow-pop ring-1 ring-forest/10">
      <div className="aspect-[1.7] overflow-hidden"><Img image={j.image} focus={j.focus} sizes="400px" /></div>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="font-display text-xl font-semibold uppercase tracking-wide text-forest">{j.name}</p>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{j.region}</p>
        </div>
        <ArrowRight size={18} className="text-forest" aria-hidden="true" />
      </div>
    </Link>
  )
}

function MapBody({ items }) {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const bg = useRef(null)

  // Gentle parallax: the map drifts slower than the page.
  useEffect(() => {
    const el = bg.current
    const host = ref.current
    if (!el || !host || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = host.getBoundingClientRect()
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight // -1..1 around centre
      el.style.setProperty('--py', `${Math.max(-1, Math.min(1, p)) * -28}px`)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [ref])

  return (
    <section
      ref={ref}
      data-in={inView}
      id="journeys"
      aria-labelledby="journeys-title"
      className="scroll-mt-16 relative w-full overflow-hidden bg-[#FAF2E4] pt-4 pb-8 sm:pb-12"
    >
      {/* Seamless gradient mask connecting Trek Overview to the Map */}
      <div 
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FAF2E4] via-[#FAF2E4]/80 to-transparent z-10"
        aria-hidden="true"
      />

      <div className="relative isolate w-full">
        <div ref={bg} className="absolute inset-x-0 -bottom-8 -top-8 -z-10 [transform:translateY(var(--py,0px))]">
          <img
            src={mapUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="jm-map h-full w-full object-cover [object-position:center_bottom] md:object-cover md:[object-position:50%_80%]"
          />
        </div>

        <div className="relative px-4 pt-10 sm:px-8 md:absolute md:inset-x-0 md:top-[7%] md:z-10 md:px-0 md:pt-0 [container-type:inline-size]">
          <div className="mx-auto max-w-5xl text-center md:w-full">
            <h2 id="journeys-title" className="font-display text-[clamp(2.6rem,11vw,4rem)] font-medium uppercase leading-[0.92] tracking-tight text-forest md:text-[5.5rem]">
              <span className="jm-line"><span style={{ '--d': '100ms' }}>We Support</span></span>
              <span className="jm-line"><span style={{ '--d': '300ms' }}>Every Journey</span></span>
            </h2>
            <div className="jm-rule mx-auto mt-5 h-px w-12 origin-center bg-forest" style={{ '--d': '600ms' }} />
            <p className="jm-fade mt-4 text-[10px] font-medium uppercase tracking-[0.28em] text-forest/80 sm:text-xs md:text-sm" style={{ '--d': '750ms' }}>
              Extraordinary places. Meaningful journeys.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-8 md:px-8 md:pb-16 md:pt-0">
          <Desktop items={items} />
          <Mobile items={items} />
        </div>
      </div>

      {/* Seamless bottom fade mask merging directly into About Kedarkantha Trek mountain sky */}
      <div 
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-transparent via-[#FAF2E4]/60 to-[#FAF2E4] z-10"
        aria-hidden="true"
      />
    </section>
  )
}

export default function JourneyMap() {
  const state = useAsync(getJourneys)
  return (
    <AsyncView state={state} fallback={<div className="w-full bg-[#FAF2E4] py-10"><div className="mx-auto aspect-[4/3] max-w-7xl animate-pulse rounded-3xl bg-sage/60 md:aspect-[755/660]" /></div>}>
      {(items) => <MapBody items={items} />}
    </AsyncView>
  )
}
