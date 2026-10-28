import { useEffect, useMemo, useRef, useState } from 'react'
import Img from '../ui/Img'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => t * t * (3 - 2 * t)
const mix = (a, b, t) => a + (b - a) * t

const ACT2 = {
  wide: { from: [33, 17, 34, 66], radius: 70 },
  narrow: { from: [12, 28, 76, 44], radius: 36 },
}
const MARQUEE = 'Kedarkantha Trek  •  Moments from the Mountains  •  '

export default function FullscreenMoments() {
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
    const A2 = narrow ? ACT2.narrow : ACT2.wide
    const e = els.current
    let target = reduced ? 0.9 : 0
    let cur = target
    let raf = 0

    const apply = () => {
      const p = cur
      const grow = ease(seg(p, 0.22, 0.72))
      // Last scroll: the full-screen photo settles into a framed panel with a white border.
      const frame = ease(seg(p, 0.78, 0.9))
      const sw = stage.current.clientWidth, sh = stage.current.clientHeight
      const inset = narrow ? 10 : 24
      const a2in = ease(seg(p, 0.05, 0.25))
      const full = [0, 0, 100, 100]
      const framed = [(inset / sw) * 100, (inset / sh) * 100, 100 - ((2 * inset) / sw) * 100, 100 - ((2 * inset) / sh) * 100]
      const r = A2.from.map((v, i) => mix(mix(v, full[i], grow), framed[i], frame))
      const box = e.photo
      if (!box) return
      box.style.left = `${r[0]}%`
      box.style.top = `${r[1]}%`
      box.style.width = `${r[2]}%`
      box.style.height = `${r[3]}%`
      box.style.borderRadius = `${mix(mix(A2.radius, 0, grow), narrow ? 16 : 26, frame)}px`
      box.style.opacity = String(a2in)
      box.style.transform = `scale(${mix(0.92, 1, a2in)})`
      if (e.photoImg) e.photoImg.style.transform = `scale(${mix(1.25, 1.02, grow)})`
      if (e.marquee) e.marquee.style.opacity = String(a2in * (1 - ease(seg(p, 0.4, 0.68))))
      if (e.caption) {
        e.caption.style.opacity = String(ease(seg(p, 0.9, 0.99)))
        e.caption.style.transform = `translateY(${(1 - ease(seg(p, 0.9, 0.99))) * 24}px)`
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

  return (
    <section
      ref={wrap}
      aria-label="Moments from Kedarkantha"
      className="relative bg-[#0E2233]"
      style={{ height: reduced ? '100svh' : narrow ? '360vh' : '420vh' }}
    >
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden bg-[#0E2233]">
        {/* Marquee running text behind photo */}
        <div ref={reg('marquee')} className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden" style={{ opacity: 0 }} aria-hidden="true">
          <div className="gs-marquee flex w-max whitespace-nowrap font-semibold leading-none text-[#1B3A54]" style={{ fontSize: narrow ? '20vw' : '10.5vw' }}>
            <span>{MARQUEE.repeat(3)}</span>
            <span>{MARQUEE.repeat(3)}</span>
          </div>
        </div>

        {/* Photo growing to fill the screen */}
        <div ref={reg('photo')} className="absolute overflow-hidden ring-1 ring-white/10 shadow-2xl" style={{ opacity: 0 }}>
          <div ref={reg('photoImg')} className="h-full w-full will-change-transform">
            <Img
              image="/KEDARKANTHATRACKOVERVIEWIMAGE/KEDARKANTHATRECKOVERVIEWIMAGE.png"
              alt="Moments from our Kedarkantha treks"
              focus="50% 50%"
              sizes="100vw"
            />
          </div>
          <div ref={reg('caption')} className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-center text-white sm:p-10" style={{ opacity: 0 }}>
            <p className="font-display text-2xl font-bold tracking-tight sm:text-5xl drop-shadow-lg">Moments from our Kedarkantha treks</p>
          </div>
        </div>
      </div>
    </section>
  )
}
