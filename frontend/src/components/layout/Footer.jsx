import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { trekInfoLinks } from './navLinks'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer id="contact" className="bg-ink-bg text-white/80">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-base font-bold uppercase tracking-wide text-white">Treki Travels</p>
          <p className="mt-3 text-sm leading-relaxed">Guided Himalayan treks that are safe, comfortable and memorable.</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/">Home</Link></li>
            <li><Link className="hover:text-white" to="/about">About</Link></li>
            <li><Link className="hover:text-white" to="/gallery">Gallery</Link></li>
            <li><Link className="hover:text-white" to="/book">Book Now</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Trek Info</p>
          <ul className="space-y-2 text-sm">
            {trekInfoLinks.slice(0, 5).map((l) => (
              <li key={l.to}><Link className="hover:text-white" to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Contact</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone size={14} aria-hidden="true" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={14} aria-hidden="true" /> hello@trekitravels.example</li>
            <li className="flex items-center gap-2"><MapPin size={14} aria-hidden="true" /> Dehradun, Uttarakhand</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {YEAR} Treki Travels. All rights reserved.
      </div>
    </footer>
  )
}
