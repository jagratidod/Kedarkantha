import { useEffect, useRef } from 'react'

const FRAME_COUNT = 25
const frameUrl = (i) => `/hero/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/**
 * Scroll-scrubbed image sequence (public/hero/*.jpg).
 * A tall wrapper scrolls while the inner stage stays sticky; scroll progress picks the frame,
 * adjacent frames are cross-faded and the position is eased so it never jumps.
 * `children` is the overlay content (text, buttons) rendered above the canvas.
 */
export default function ScrollHero({ children, scrollLength = '260vh' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const fadeOutRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frames = []
    let loaded = 0
    let target = 0
    let current = 0
    let raf = 0
    let alive = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      draw()
    }

    const drawCover = (img, alpha) => {
      if (!img?.complete || !img.naturalWidth) return
      const cw = canvas.width
      const ch = canvas.height
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const w = img.naturalWidth * s
      const h = img.naturalHeight * s
      ctx.globalAlpha = alpha
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    function draw() {
      const f = current * (FRAME_COUNT - 1)
      const i = Math.floor(f)
      const t = f - i
      ctx.globalAlpha = 1
      drawCover(frames[i], 1)
      if (t > 0.001 && i + 1 < FRAME_COUNT) drawCover(frames[i + 1], t)
      ctx.globalAlpha = 1

      // Fade the text away over the 0.65 - 0.88 stretch of the scroll.
      if (overlayRef.current) {
        const o = 1 - clamp((current - 0.65) / 0.22)
        overlayRef.current.style.opacity = String(o)
        overlayRef.current.style.transform = `translateY(${(1 - o) * -30}px)`
        overlayRef.current.style.pointerEvents = o < 0.2 ? 'none' : ''
      }

      // Smoothly dissolve the whole hero screen into the offwhite surface background for Trek Overview
      if (fadeOutRef.current) {
        // Starts dissolving from 0.78 to 1.0
        const fadeProgress = clamp((current - 0.78) / 0.22)
        fadeOutRef.current.style.opacity = String(fadeProgress)
      }
    }

    const tick = () => {
      const diff = target - current
      current = Math.abs(diff) < 0.0004 ? target : current + diff * 0.28
      draw()
      raf = current === target ? 0 : requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect()
      const max = wrap.offsetHeight - window.innerHeight
      target = reduced ? 0 : clamp(max > 0 ? -rect.top / max : 0)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        loaded++
        if (alive && (i === 0 || loaded === FRAME_COUNT)) draw()
      }
      img.src = frameUrl(i)
      frames.push(img)
    }

    resize()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section ref={wrapRef} style={{ height: scrollLength }} className="relative bg-offwhite" aria-label="Kedarkantha trek introduction">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-ink-bg sm:top-16 sm:h-[calc(100svh-4rem)]">
        {/* Static first frame shows instantly while the sequence loads, and as the no-JS fallback. */}
        <img src={frameUrl(0)} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-bg via-ink-bg/35 to-ink-bg/20 sm:bg-gradient-to-r sm:from-ink-bg/80 sm:via-ink-bg/30 sm:to-transparent" />
        
        <div ref={overlayRef} className="absolute inset-0 will-change-[opacity,transform]">
          {children}
        </div>

        {/* Screen fade overlay to smooth dissolve into the next section (Trek Overview) */}
        <div
          ref={fadeOutRef}
          className="pointer-events-none absolute inset-0 bg-offwhite opacity-0 will-change-[opacity]"
          aria-hidden="true"
        />

        {/* Soft bottom seamless gradient blend so there is zero hard boundary */}
        <div 
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-offwhite via-offwhite/60 to-transparent sm:h-48"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

