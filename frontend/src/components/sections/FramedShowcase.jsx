import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import Img from '../ui/Img'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/*
 * Shared shell for the "framed full-screen photo" sections (Things to Carry, Best Time to Visit).
 * A tall wrapper scrolls while a white-framed stage stays pinned, and scroll steps through `steps`.
 *
 *   entering     the framed panel slides up; the heading rises word by word, "(Scroll)" fades in on the right
 *   each step    its content (put `.gc-line` elements, with --i for the stagger, inside it) rises in
 *   photo        slowly zooms and pans with the scroll; `focus` may be an array with one crop per step
 *   bottom       "+" opens `panel` (the complete list); a progress bar with "01 / 04" fills with the scroll
 *
 * steps: [{ id, content }]    panel: node shown over the photo when "+" is pressed
 */
export default function FramedShowcase({ label, heading, steps, panel, panelLabel, focus = '62% 38%', stepHeight = 'h-[17.5rem] md:h-[18rem]', stepWidth = 'max-w-[38rem]' }) {
  const wrap = useRef(null)
  const photo = useRef(null)
  const bar = useRef(null)
  const [active, setActive] = useState(0)
  const [entered, setEntered] = useState(false)
  const [open, setOpen] = useState(false)
  const [narrow, setNarrow] = useState(false)
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])
  const count = steps.length

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setNarrow(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    let target = 0, cur = 0, raf = 0, last = -1, wasIn = false
    const apply = () => {
      const s = Math.min(count - 1, Math.floor(cur * count))
      if (s !== last) { last = s; setActive(s) }
      if (bar.current) bar.current.style.transform = `scaleX(${cur})`
      if (photo.current) {
        photo.current.style.transform = `scale(${1.18 - 0.14 * cur}) translate3d(${(-1.5 + 3 * cur).toFixed(2)}%, ${(1 - 2 * cur).toFixed(2)}%, 0)`
      }
    }
    const tick = () => {
      cur += (target - cur) * 0.14
      if (Math.abs(target - cur) < 0.0003) cur = target
      apply()
      raf = cur === target ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      if (reduced) return
      const r = wrap.current.getBoundingClientRect()
      const vh = window.innerHeight
      target = clamp(-r.top / Math.max(1, wrap.current.offsetHeight - vh))
      const inView = r.top < vh * 0.55
      if (inView !== wasIn) { wasIn = inView; setEntered(inView) }
      if (!raf) raf = requestAnimationFrame(tick)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [count, reduced])

  return (
    <section
      ref={wrap}
      aria-label={label}
      className="relative bg-white"
      style={{ height: reduced ? '100svh' : `${count * (narrow ? 85 : 95) + 100}vh` }}
    >
      <div data-in={entered || reduced} className="sticky top-0 h-svh bg-white p-[10px] md:p-6">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-ink-bg md:rounded-3xl">
          <div ref={photo} className="absolute inset-0 will-change-transform">
            <Img focus={Array.isArray(focus) ? focus[active] : focus} sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/35" aria-hidden="true" />

          <div className="absolute inset-x-0 top-[12%] px-5 md:top-[28%] md:px-[3.4%]">
            <h2 className="text-[13vw] font-medium leading-[0.98] text-white md:text-[7.2vw]">
              {heading.split(' ').map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <span className="gc-word inline-block" style={{ transitionDelay: `${150 + i * 110}ms` }}>{w}&nbsp;</span>
                </span>
              ))}
            </h2>
          </div>
          <p className="gc-hint pointer-events-none absolute right-[3.4%] top-[28%] hidden font-light text-white/80 md:block md:text-[5.4vw]" aria-hidden="true">
            (Scroll)
          </p>

          <div className="absolute inset-x-0 bottom-0 px-5 pb-36 md:px-[5.5%] md:pb-12">
            <div className={`relative ${stepWidth} ${stepHeight}`}>
              {steps.map((st, i) => (
                <div key={st.id} data-on={i === active} className="gc-step absolute inset-0 text-white">{st.content}</div>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? `Close ${panelLabel}` : `Open ${panelLabel}`}
            onClick={() => setOpen((v) => !v)}
            className="absolute bottom-[5.2rem] left-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-xl transition-transform duration-300 hover:scale-105 md:bottom-8 md:left-[1.6%] md:h-[4.5rem] md:w-[4.5rem]"
          >
            <Plus size={30} strokeWidth={1.6} className={`transition-transform duration-500 ${open ? 'rotate-45' : ''}`} />
          </button>

          <div className="absolute bottom-[6.6rem] right-5 flex w-[calc(100%-7.5rem)] items-center gap-4 md:bottom-12 md:right-[3.4%] md:w-[34%]" aria-hidden="true">
            <span className="text-xs font-semibold text-white/85">{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
              <div ref={bar} className="h-full origin-left bg-white" style={{ transform: 'scaleX(0)' }} />
            </div>
          </div>

          <div
            className={`absolute inset-0 z-10 overflow-y-auto bg-ink-bg/80 p-6 pb-28 text-white backdrop-blur-md transition-all duration-500 md:p-14 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
            role="dialog"
            aria-label={panelLabel}
          >
            {panel}
          </div>
        </div>
      </div>
    </section>
  )
}
