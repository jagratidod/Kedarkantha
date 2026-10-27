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
// K and E already reach the ridge; every other letter grows a little further down so it touches the valleys too.
const stretch = (i) => (i >= 2 ? { display: 'inline-block', transform: 'scaleY(1.28)', transformOrigin: 'top center' } : {})
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
      const rise = ease(seg(p, 0.05, 0.55))
      const warm = ease(seg(p, 0.2, 0.8))
      // Word: rises cleanly into view on first scroll gesture
      e.word.style.transform = `translate3d(0, ${mix(95, narrow ? 50 : 28, rise)}vh, 0)`
      e.letters.forEach((l) => {
        l.style.opacity = '1'
      })
      e.ridge.style.transform = `scale(1)`
      e.sky.style.opacity = String(warm)
      e.tag.style.opacity = String(ease(seg(p, 0.25, 0.65)))
      e.tag.style.transform = `translateY(${(1 - ease(seg(p, 0.25, 0.65))) * 20}px)`
      e.cta.style.opacity = String(ease(seg(p, 0.35, 0.75)))
      e.cta.style.transform = `translateY(${(1 - ease(seg(p, 0.35, 0.75))) * 16}px)`
      e.hint.style.opacity = String(1 - seg(p, 0.02, 0.15))
      e.stars.style.opacity = String(mix(0.5, 0, warm))
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
    <section ref={wrap} id="behind-the-mountains" aria-label="Behind the mountains" className="relative bg-[#E8EFE5]" style={{ height: reduced ? '100svh' : narrow ? '135vh' : '145vh' }}>
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
            className="flex select-none font-normal uppercase leading-[0.9] tracking-[0.01em] text-forest"
            style={narrow ? { fontFamily: 'Anton, Impact, sans-serif', fontSize: '25vw', transform: 'scaleY(1.45)', transformOrigin: 'top center', flexDirection: 'column', alignItems: 'center' } : { fontFamily: 'Anton, Impact, sans-serif', fontSize: '13vw', transform: 'scaleY(1.8)', transformOrigin: 'top center', whiteSpace: 'nowrap' }}
          >
            {narrow ? (
              <>
                <span className="flex">{LETTERS.slice(0, 5).map((ch, i) => <span key={i} ref={(n) => { (els.current.letters ||= [])[i] = n }} style={{ opacity: 0, ...stretch(i) }}>{ch}</span>)}</span>
                <span className="flex">{LETTERS.slice(5).map((ch, i) => <span key={i} ref={(n) => { (els.current.letters ||= [])[i + 5] = n }} style={{ opacity: 0, ...stretch(i + 5) }}>{ch}</span>)}</span>
              </>
            ) : (
              LETTERS.map((ch, i) => <span key={i} ref={(n) => { (els.current.letters ||= [])[i] = n }} style={{ opacity: 0, ...stretch(i) }}>{ch}</span>)
            )}
          </p>
        </div>
        <h2 className="sr-only">Kedarkantha, behind the mountains</h2>

        {/* Ridge */}
        <div ref={reg('ridge')} className="absolute inset-x-0 bottom-0 will-change-transform" style={{ height: narrow ? '56svh' : undefined }}>
          <img
            src={mountains}
            alt=""
            decoding="async"
            className={narrow ? 'h-full w-full object-cover object-bottom' : 'block w-full'}
            style={narrow ? { objectPosition: '45% 100%' } : undefined}
            draggable="false"
          />
        </div>
        {/* Foot of the ridge melts into the footer colour */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#E8EFE5] to-transparent" aria-hidden="true" />

        {/* Tagline + call to action */}
        <div className="absolute inset-x-0 top-[12%] z-10 flex flex-col items-center px-5 text-center md:top-auto md:bottom-[3.5%]">
          <p ref={reg('tag')} className="font-display text-3xl italic text-forest md:text-[3.2vw]" style={{ opacity: 0 }}>Behind the mountains.</p>
          <div ref={reg('cta')} className="mt-5" style={{ opacity: 0 }}>
            <Link to="/book" className="inline-flex items-center rounded-full bg-[#E8A317] px-7 py-3 text-sm font-bold uppercase tracking-widest text-forest shadow-lg transition-transform hover:scale-105">
              Book Your Trek
            </Link>
          </div>
        </div>

        <p ref={reg('hint')} className="absolute inset-x-0 top-[14%] text-center text-[11px] uppercase tracking-[0.4em] text-forest/60" aria-hidden="true">Scroll</p>
      </div>
    </section>
  )
}
