import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { smoothScrollTo, startSmoothScroll } from '../../lib/smoothScroll'
import Button from '../ui/Button'

export default function Layout() {
  const { pathname, hash, key } = useLocation()
  const inBooking = pathname.startsWith('/book')
  const lastPath = useRef(null)

  useEffect(() => startSmoothScroll(), [])

  // Scroll to the `#section` of the home page (or to the top when there is no hash).
  // Sections load their content asynchronously and shift the layout, so re-align a couple of times.
  useEffect(() => {
    if (!hash) {
      smoothScrollTo(0, { immediate: pathname !== lastPath.current })
      lastPath.current = pathname
      return
    }
    lastPath.current = pathname
    const go = () => {
      const el = document.querySelector(hash)
      if (el) smoothScrollTo(el, { offset: 0 })
    }
    go()
    const timers = [500, 1200].map((ms) => setTimeout(go, ms))
    return () => timers.forEach(clearTimeout)
  }, [pathname, hash, key])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <main id="main" className={`flex-1 ${inBooking ? '' : 'pb-16 md:pb-0'}`}>
        <Outlet />
      </main>
      {!inBooking && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
          <Button to="/book" variant="primary" size="lg" className="w-full">Book Your Trek</Button>
        </div>
      )}
    </div>
  )
}
