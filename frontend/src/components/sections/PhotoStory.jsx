import { useEffect, useMemo, useRef, useState } from 'react'
import Img from '../ui/Img'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => t * t * (3 - 2 * t)
const mix = (a, b, t) => a + (b - a) * t

// Rects in % of the stage: [left, top, width, height].
const LAYOUT = {
  wide: {
    a: { from: [0, 0, 49.5, 49.5], to: [1.3, 20, 28.4, 15.4], focus: '50% 22%', radius: 4 },
    b: { from: [0, 50.5, 49.5, 49.5], to: [1.3, 57.5, 16.9, 34], focus: '25% 62%', radius: 4 },
    c: { from: [50.5, 0, 49.5, 100], to: [82.3, 9, 14.5, 100], focus: '78% 40%', radius: 4 },
  },
  narrow: {
    a: { from: [0, 0, 100, 34], to: [4, 5, 60, 13], focus: '50% 22%', radius: 4 },
    b: { from: [0, 35, 49.5, 32], to: [4, 76, 38, 18], focus: '25% 62%', radius: 4 },
    c: { from: [50.5, 35, 49.5, 65], to: [88, 0, 12, 100], focus: '78% 40%', radius: 4 },
  },
}

const WORDS = [
  ...'Treki Travels leads small-group winter treks to Kedarkantha, planned end to end for first-timers'.split(' ').map((w) => ({ w })),
  ...'and seasoned trekkers alike.'.split(' ').map((w) => ({ w, accent: true })),
]

export default function PhotoStory() {
  const wrap = useRef(null)
  const stage = useRef(null)
  const [narrow, setNarrow] = useState(false)
  const els = useRef({})
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setNarrow(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    const L = narrow ? LAYOUT.narrow : LAYOUT.wide
    const e = els.current
    let target = reduced ? 0.7 : 0
    let cur = target
    let raf = 0

    const place = (el, from, to, t, radius) => {
      if (!el) return
      const r = from.map((v, i) => mix(v, to[i], t))
      el.style.left = `${r[0]}%`
      el.style.top = `${r[1]}%`
      el.style.width = `${r[2]}%`
      el.style.height = `${r[3]}%`
      el.style.borderRadius = `${radius}px`
    }

    const apply = () => {
      const p = cur
      // Shrink from collage to 3 photos
      const shrink = ease(seg(p, 0.1, 0.55))
      // Drift gently towards the end of scroll
      const driftEnd = ease(seg(p, 0.75, 1.0))

      for (const k of ['a', 'b', 'c']) {
        const to = L[k].to
        place(e[k], L[k].from, to, shrink, mix(0, L[k].radius, shrink))
        e[k].style.opacity = '1'
        const drift = (k === 'a' ? -0.4 : k === 'b' ? 0.35 : -0.25) * 50 * driftEnd
        e[k].style.transform = `translateY(${drift}px)`
      }

      const textIn = seg(p, 0.3, 0.68)
      if (e.text) {
        e.text.style.opacity = '1'
        e.text.style.transform = `translateY(${-driftEnd * 30}px)`
        e.text.style.setProperty('--tp', String(textIn))
      }
    }

    const tick = () => {
      cur += (target - cur) * 0.14
      if (Math.abs(target - cur) < 0.0002) cur = target
      apply()
      raf = cur === target ? 0 : requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (reduced) return
      const r = wrap.current?.getBoundingClientRect()
      if (!r) return
      const vh = window.innerHeight
      const max = wrap.current.offsetHeight - vh
      target = clamp(max > 0 ? -r.top / max : 0)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [narrow, reduced])

  const reg = (k) => (n) => { els.current[k] = n }
  const L = narrow ? LAYOUT.narrow : LAYOUT.wide

  return (
    <section
      ref={wrap}
      aria-label="About Kedarkantha Trek"
      className="relative bg-white"
      style={{ height: reduced ? '100svh' : narrow ? '320vh' : '380vh' }}
    >
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden bg-white">
        {/* Three photos with collage to separate photos animation */}
        {['a', 'b', 'c'].map((k) => (
          <div key={k} ref={reg(k)} className="absolute overflow-hidden will-change-transform" aria-hidden="true">
            <Img focus={L[k].focus} sizes="(min-width:768px) 40vw, 80vw" />
          </div>
        ))}

        {/* Headline that reveals word by word */}
        <div
          ref={reg('text')}
          className={`absolute will-change-transform ${narrow ? 'left-[5%] right-[15%] top-[22%] text-center' : 'left-[16%] right-[19%] top-[34%] text-right'}`}
          style={{ '--tp': 0 }}
        >
          <p
            className="text-lg font-semibold text-forest sm:text-3xl"
            style={{ opacity: 'clamp(0, var(--tp) * 4, 1)', transform: 'translateY(calc((1 - clamp(0, var(--tp) * 4, 1)) * 20px))' }}
          >
            About Kedarkantha Trek
          </p>
          <h2 className={`mt-4 font-medium leading-[1.12] text-ink ${narrow ? 'text-[7vw]' : 'text-[3.4vw]'}`}>
            {WORDS.map(({ w, accent }, i) => {
              const k = `clamp(0, (var(--tp) * ${WORDS.length + 6} - ${i + 3}) / 5, 1)`
              return (
                <span key={i} className="inline-block">
                  <span
                    className={`inline-block ${accent ? 'text-cta' : ''}`}
                    style={{ opacity: k, transform: `translateY(calc((1 - ${k}) * 0.5em))` }}
                  >
                    {w}&nbsp;
                  </span>
                </span>
              )
            })}
          </h2>
        </div>
      </div>
    </section>
  )
}
