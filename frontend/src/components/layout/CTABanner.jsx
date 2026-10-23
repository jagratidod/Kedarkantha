import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import Img from '../ui/Img'

export default function CTABanner({ title, text, label, to, focus = '50% 70%' }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-bg">
      <div className="absolute inset-0 -z-10">
        <Img focus={focus} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-bg/90 via-forest/75 to-ink-bg/50" />
      </div>
      <div className="container-page py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-white/85">{text}</p>
        <Button to={to} variant="cta" size="lg" className="mt-6">
          {label} <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
