import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import mountains from '../../assets/images/footer-mountains.webp'

/*
 * Closing scene before the footer: a morning sky, the mountain ridge along the bottom of the screen and a huge
 * KEDARKANTHA that rises from behind the ridge as you scroll (P = 0..1 over the pinned stage).
 *
 *   0.00 - 0.12  sky and mountains only, a small "Scroll" hint
 *   0.10 - 0.62  the giant word rises from behind the ridge, letter by letter
 *   0.55 - 0.80  the word settles with its feet fading into the ridge
 *   0.66 - 0.90  "Behind the mountains." and the call-to-action fade in; the sky warms toward the horizon
 */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => t * t * (3 - 2 * t)
const mix = (a, b, t) => a + (b - a) * t

const LETTERS = 'KEDARKANTHA'.split('')
const STARS = Array.from({ length: 46 }, (_, i) => {
  const h = (n) => { const s = Math.sin(n * 91.7 + 12.3) * 43758.5; return s - Math.floor(s) }
  return { x: h(i) * 100, y: h(i + 77) * 62, r: 0.6 + h(i + 150) * 1.4, o: 0.25 + h(i + 220) * 0.6 }
})

export default function BehindMountains() {
  const wrap = useRef(null)
  const els = useRef({})
  const [narrow, setNarrow] = useState(false)
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setNarrow(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    const e = els.current
    let target = reduced ? 1 : 0
    let cur = target
    let raf = 0
    const apply = () => {
      const p = cur
      const rise = ease(seg(p, 0.1, 0.62))
      const warm = ease(seg(p, 0.5, 0.9))
      // Word: starts hidden below the ridge (translateY 95vh) and rises so full text is visible with minimal bottom edges touching the ridge
      if (e.word) {
        e.word.style.transform = `translate3d(0, ${mix(95, narrow ? 48 : 42, rise)}vh, 0)`
      }
      if (e.letters) {
        e.letters.forEach((l) => {
          if (l) l.style.opacity = '1'
        })
      }
      if (e.ridge) e.ridge.style.transform = `scale(1)`
      if (e.sky) e.sky.style.opacity = String(warm)
      if (e.tag) {
        e.tag.style.opacity = String(ease(seg(p, 0.66, 0.82)))
        e.tag.style.transform = `translateY(${(1 - ease(seg(p, 0.66, 0.82))) * 28}px)`
      }
      if (e.cta) {
        e.cta.style.opacity = String(ease(seg(p, 0.76, 0.9)))
        e.cta.style.transform = `translateY(${(1 - ease(seg(p, 0.76, 0.9))) * 22}px)`
      }
      if (e.hint) e.hint.style.opacity = String(1 - seg(p, 0.03, 0.12))
      if (e.stars) e.stars.style.opacity = String(mix(0.5, 0, warm))
    }
    const tick = () => {
      cur += (target - cur) * 0.12
      if (Math.abs(target - cur) < 0.0003) cur = target
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
  }, [narrow, reduced])

  const reg = (k) => (n) => { els.current[k] = n }

  return (
    <section ref={wrap} id="behind-the-mountains" aria-label="Behind the mountains" className="relative bg-[#E8EFE5]" style={{ height: reduced ? '100svh' : narrow ? '300vh' : '340vh' }}>
      <div className="sticky top-0 h-svh overflow-hidden" style={{ background: 'linear-gradient(to bottom, #DCE8EE 0%, #E8EFE5 38%, #F5F1E4 68%, #F7E3C4 100%)' }}>
        {/* Warm horizon glow that fades in */}
        <div ref={reg('sky')} className="absolute inset-0" style={{ opacity: 0, background: 'radial-gradient(90% 70% at 50% 100%, rgba(255,214,150,0.75), rgba(255,226,180,0.35) 45%, transparent 72%)' }} aria-hidden="true" />

        {/* Stars */}
        <div ref={reg('stars')} className="absolute inset-0" aria-hidden="true">
          {STARS.map((s, i) => (
            <span key={i} className="absolute rounded-full bg-white/80" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, opacity: s.o }} />
          ))}
        </div>

        {/* Giant word behind the ridge */}
        <div ref={reg('word')} className="absolute inset-x-0 top-0 flex justify-center" aria-hidden="true">
          <p
            className="flex select-none font-normal uppercase whitespace-nowrap tracking-[0.01em] text-forest justify-center"
            style={{
              fontFamily: 'Anton, Impact, sans-serif',
              fontSize: narrow ? 'clamp(28px, 14.5vw, 54px)' : '12.5vw',
              lineHeight: 1,
              transform: narrow ? 'scaleY(1.12)' : 'scaleY(1.15)',
              transformOrigin: 'top center',
            }}
          >
            {LETTERS.map((ch, i) => (
              <span
                key={i}
                ref={(n) => {
                  (els.current.letters ||= [])[i] = n
                }}
                style={{ opacity: 0, display: 'inline-block' }}
              >
                {ch}
              </span>
            ))}
          </p>
        </div>
        <h2 className="sr-only">Kedarkantha, behind the mountains</h2>

        {/* Ridge */}
        <div ref={reg('ridge')} className="absolute inset-x-0 bottom-0 will-change-transform" style={{ height: narrow ? '54svh' : undefined }}>
          <img
            src={mountains}
            alt=""
            decoding="async"
            className={narrow ? 'h-full w-full object-cover object-bottom' : 'block w-full'}
            style={narrow ? { objectPosition: '50% 100%' } : undefined}
            draggable="false"
          />
        </div>
        {/* Foot of the ridge melts into the footer colour */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#E8EFE5] to-transparent" aria-hidden="true" />

        {/* Tagline + call to action */}
        <div className="absolute inset-x-0 top-[8%] z-10 flex flex-col items-center px-4 text-center md:top-auto md:bottom-[3.5%]">
          <p ref={reg('tag')} className="font-display text-2xl italic text-forest sm:text-3xl md:text-[3.2vw]" style={{ opacity: 0 }}>Behind the mountains.</p>
          <div ref={reg('cta')} className="mt-3 sm:mt-5" style={{ opacity: 0 }}>
            <Link to="/book" className="inline-flex items-center rounded-full bg-[#E8A317] px-6 py-2.5 text-xs sm:px-7 sm:py-3 sm:text-sm font-bold uppercase tracking-widest text-forest shadow-lg transition-transform hover:scale-105">
              Book Your Trek
            </Link>
          </div>
        </div>

        <p ref={reg('hint')} className="absolute inset-x-0 top-[14%] text-center text-[11px] uppercase tracking-[0.4em] text-forest/60" aria-hidden="true">Scroll</p>
      </div>
    </section>
  )
}
