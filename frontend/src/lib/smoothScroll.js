import Lenis from 'lenis'

let lenis = null
let raf = 0

/** Starts inertia ("soft") page scrolling. Returns a cleanup. Skipped for reduced-motion users. */
export function startSmoothScroll() {
  if (lenis || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({
    duration: 1.25,        // higher = softer / longer glide
    easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
  })
  const loop = (time) => {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

/** Scroll to an element (offset = sticky header height) or to the top; falls back to native scrolling. */
export function smoothScrollTo(target, { offset = 0, immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate })
  } else if (target === 0) {
    window.scrollTo(0, 0)
  } else if (target instanceof Element) {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset })
  }
}
