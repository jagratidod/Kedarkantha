import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import Button from '../ui/Button'
import { mainLinks, trekInfoLinks } from './navLinks'

function TreksDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { key } = useLocation()

  useEffect(() => setOpen(false), [key])
  useEffect(() => {
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-1 py-2 text-sm font-medium text-white/80 hover:text-white"
      >
        Treks <ChevronDown size={14} className={open ? 'rotate-180' : ''} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full z-50 mt-2 w-60 rounded-xl border border-line bg-white p-2 shadow-pop">
          {trekInfoLinks.map((l) => (
            <Link key={l.to} to={l.to} role="menuitem" className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-sage">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [menu, setMenu] = useState(false)
  const { key } = useLocation()
  useEffect(() => setMenu(false), [key])

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-bg/95 backdrop-blur">
      <nav className="container-page flex h-14 items-center justify-between sm:h-16" aria-label="Main">
        <Link to="/" className="text-sm font-bold uppercase tracking-wide text-white sm:text-base">Kedarkantha</Link>

        <div className="hidden items-center gap-7 md:flex">
          {mainLinks.map((l) =>
            l.children ? (
              <TreksDropdown key={l.label} />
            ) : (
              <Link key={l.label} to={l.to} className="px-1 py-2 text-sm font-medium text-white/80 hover:text-white">{l.label}</Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button to="/book" variant="cta" size="sm" className="!px-3.5">Book Now</Button>
          <button
            type="button"
            className="rounded-lg p-2 text-white md:hidden"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menu && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-white/10 bg-ink-bg md:hidden">
          <div className="container-page flex flex-col py-3">
            {[{ to: '/', label: 'Home' }, ...trekInfoLinks, { to: '/about', label: 'About' }, { to: '/gallery', label: 'Gallery' }, { to: '/#contact', label: 'Contact' }].map((l) => (
              <Link key={l.to} to={l.to} className="border-b border-white/5 py-3 text-sm font-medium text-white/85 last:border-0">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
