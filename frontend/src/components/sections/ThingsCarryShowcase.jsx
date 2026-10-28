import { useEffect, useMemo, useRef, useState } from 'react'
import { Check } from 'lucide-react'

/* =========================================================================
   5 Dedicated Custom Line-Art SVGs
   Minimalist, technical, alpine stroke-based art
========================================================================= */

function ClothingLineArt({ className = "h-8 w-8 sm:h-9 sm:w-9" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8h16l5 9 7 6-4 8-6-4v13H14V27l-6 4-4-8 7-6 5-9z" />
      <path d="M24 8v32" />
      <path d="M14 17h20" />
      <path d="M14 25h20" />
      <path d="M14 33h20" />
      <path d="M20 8l4 6 4-6" />
    </svg>
  )
}

function FootwearLineArt({ className = "h-8 w-8 sm:h-9 sm:w-9" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M10 11h14v16l14 4c2 1 4 3 4 7v1H6v-6c0-3 2-6 4-6v-16z" />
      <path d="M18 11v12" />
      <path d="M14 15h8" />
      <path d="M14 19h8" />
      <path d="M6 39h36" />
      <path d="M10 39v4M18 39v4M26 39v4M34 39v4" />
    </svg>
  )
}

function HeadwearLineArt({ className = "h-8 w-8 sm:h-9 sm:w-9" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Beanie with cuff */}
      <path d="M13 22c0-6.5 5-12 11-12s11 5.5 11 12v3H13v-3z" />
      <path d="M9 25h30v6H9z" />
      <circle cx="24" cy="7" r="2.5" />
      {/* UV Snow Goggles */}
      <rect x="11" y="34" width="11" height="7" rx="2.5" />
      <rect x="26" y="34" width="11" height="7" rx="2.5" />
      <path d="M22 37.5h4M8 37.5h3M37 37.5h3" />
    </svg>
  )
}

function AccessoriesLineArt({ className = "h-8 w-8 sm:h-9 sm:w-9" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Trekking Pole */}
      <path d="M14 6l7 36M12 14l6 2M10 38l6 2" />
      <path d="M17 6h-5a2 2 0 00-2 2v2a2 2 0 002 2h5" />
      {/* Headlamp torch with beam rays */}
      <circle cx="34" cy="18" r="7" />
      <circle cx="34" cy="18" r="2.5" />
      <path d="M27 18h-3M41 18h3M34 11V8M34 28v-3" />
      {/* Power Bank */}
      <rect x="27" y="33" width="14" height="8" rx="2" />
      <path d="M31 33v-2M37 33v-2" />
    </svg>
  )
}

function BagsLineArt({ className = "h-8 w-8 sm:h-9 sm:w-9" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Expedition Backpack */}
      <rect x="14" y="9" width="20" height="31" rx="5" />
      <path d="M14 17h20" />
      <path d="M14 25h20" />
      <path d="M20 17v8M28 17v8" />
      <path d="M20 9V5a2 2 0 012-2h4a2 2 0 012 2v4" />
      <path d="M10 21v11a2 2 0 002 2h2M38 21v11a2 2 0 01-2 2h-2" />
      <path d="M14 35h20" />
    </svg>
  )
}

/* =========================================================================
   Packing Categories Data
========================================================================= */

const CATEGORIES = [
  {
    id: 'clothing',
    number: '01',
    title: 'Clothing',
    tagline: 'Thermal Insulation, Breathable Layers & Weatherproof Shells',
    Icon: ClothingLineArt,
    items: [
      { title: 'Heavy down jacket / windcheater', note: 'Critical for sub-zero summit push and chilly base camps.' },
      { title: 'Thermal inner upper & lower', note: 'Body-hugging warm fleece base layer for night comfort.' },
      { title: '2–3 dry-fit full sleeve tees', note: 'Moisture-wicking activewear; strictly avoid pure cotton.' },
      { title: 'Waterproof rain jacket / poncho', note: 'Full protection against unexpected snow squalls.' },
      { title: '2 trek pants (no jeans)', note: 'Flexible, water-repellent fleece-lined trail trousers.' },
    ],
  },
  {
    id: 'footwear',
    number: '02',
    title: 'Footwear',
    tagline: 'Traction, Waterproof Grip & Ankle Support',
    Icon: FootwearLineArt,
    items: [
      { title: 'Trekking shoes with high ankle support', note: 'Deep lugs & waterproof membrane for snow trails.' },
      { title: '4–5 pairs of sports / trek socks', note: 'Moisture-wicking synthetic blend for long ascents.' },
      { title: '2 pairs of thick woolen socks', note: 'Essential to retain foot warmth during freezing nights.' },
      { title: 'Microspikes / crampons', note: 'Provided by Treki Travels team at snowline.' },
    ],
  },
  {
    id: 'headwear',
    number: '03',
    title: 'Headwear & Handwear',
    tagline: 'Frostbite Prevention, UV Glare & Wind Shield',
    Icon: HeadwearLineArt,
    items: [
      { title: 'Woolen beanie / balaclava', note: 'Must cover ears completely against biting winds.' },
      { title: 'Sun cap with neck flap', note: 'Shields against intense high-altitude mountain UV.' },
      { title: 'UV-protection sunglasses', note: 'Category 3 or 4 UV lenses to prevent snow blindness.' },
      { title: 'Waterproof insulated ski gloves', note: 'Thermal exterior with fleece lining for summit climb.' },
      { title: 'Fleece / woolen inner gloves', note: 'Lightweight backup for inside camps and meal times.' },
    ],
  },
  {
    id: 'accessories',
    number: '04',
    title: 'Accessories & Toiletries',
    tagline: 'Personal Trail Utility, First Aid & Sanitation',
    Icon: AccessoriesLineArt,
    items: [
      { title: 'Headlamp with extra batteries', note: 'Indispensable for 3:00 AM summit push in pitch dark.' },
      { title: 'Trekking poles with snow baskets', note: 'Reduces knee load by 25% on steep descents.' },
      { title: 'Two 1-litre reusable water bottles / thermos', note: 'Insulated flask keeps drinking water liquid.' },
      { title: 'Quick-dry microfiber towel', note: 'Lightweight and packs compact.' },
      { title: 'Personal medical kit & toiletries', note: 'Diamox, lip balm SPF 30+, sunscreen SPF 50+, wipes.' },
      { title: 'High-capacity power bank (20,000 mAh)', note: 'Phone batteries drain rapidly in sub-zero snow.' },
    ],
  },
  {
    id: 'bags',
    number: '05',
    title: 'Bags & Documents',
    tagline: 'Pack Protection, Trail Permits & ID Verification',
    Icon: BagsLineArt,
    items: [
      { title: '50–60L rucksack with rain cover', note: 'Sturdy backpack with supportive ergonomic hip belt.' },
      { title: '20–30L daypack (if offloading)', note: 'For water, jacket & camera while main bag travels.' },
      { title: 'Dry bags / plastic ziplocs', note: 'Keeps inner clothes 100% dry inside rucksack.' },
      { title: 'Govt. Photo ID & Trek Medical Certificate', note: 'Original Aadhaar/Passport required for forest checkposts.' },
    ],
  },
]

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

export default function ThingsCarryShowcase() {
  const wrapRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    let current = 0
    let target = 0
    let raf = 0

    const onScroll = () => {
      if (reduced) return
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      const totalScrollable = wrapRef.current.offsetHeight - window.innerHeight
      if (totalScrollable <= 0) return

      const progress = clamp(-rect.top / totalScrollable, 0, 1)
      target = progress
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      current += (target - current) * 0.14
      if (Math.abs(target - current) < 0.001) current = target

      setScrollProgress(current)
      const currentStep = clamp(Math.round(current * 4), 0, 4)
      setActiveStep(currentStep)

      raf = current === target ? 0 : requestAnimationFrame(tick)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  // Quick jump by clicking any icon
  const scrollToStep = (idx) => {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const maxScroll = wrapRef.current.offsetHeight - window.innerHeight
    const targetScrollY = window.scrollY + rect.top + (idx / 4) * maxScroll + 2
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
  }

  return (
    <section
      ref={wrapRef}
      id="things-to-carry"
      aria-label="What to Pack for Kedarkantha"
      className="relative bg-[#0E2233]"
      style={{ height: reduced ? 'auto' : '460vh' }}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#0E2233] text-white flex flex-col justify-between py-6 sm:py-8 px-6 sm:px-12 md:px-16 lg:px-24">
        {/* Soft Alpine Radial Ambient Glow spanning entire full-screen */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(85% 70% at 50% 35%, rgba(31,70,99,0.45) 0%, rgba(14,34,51,0.9) 65%, #091724 100%)',
          }}
          aria-hidden="true"
        />

        {/* Subtle grid mesh line art background across 100vw */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        {/* 1. Header & Stepper Line-Art Navigation */}
        <div className="w-full text-center shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#16334D] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#7EB5D6] ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F87A8] animate-pulse" />
            Checklist · Kedarkantha Trek
          </div>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            What to Pack
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#8FAEC5] max-w-xl mx-auto">
            Essential mountain gear for snow trails, sub-zero nights and 12,500 ft summit
          </p>

          {/* Top Line-Art Icons Stepper - Full-width balanced spacing */}
          <div className="mt-3.5 sm:mt-5 flex items-center justify-center gap-2.5 sm:gap-5 overflow-x-auto py-1 [scrollbar-width:none]">
            {CATEGORIES.map((cat, idx) => {
              const IconComp = cat.Icon
              const isActive = idx === activeStep
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToStep(idx)}
                  className={`group relative flex flex-col items-center gap-1.5 rounded-2xl px-3.5 py-2 sm:px-5 sm:py-2.5 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#16334D] text-[#7EB5D6] ring-2 ring-[#4F87A8] shadow-[0_0_24px_rgba(79,135,168,0.4)] scale-102'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white ring-1 ring-white/10'
                  }`}
                  aria-label={`Jump to ${cat.title}`}
                >
                  <IconComp className={`transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'} h-6 w-6 sm:h-7 sm:w-7`} />
                  <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase whitespace-nowrap">
                    {cat.number}. {cat.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Full-Screen Right-to-Left Sliding Stage - Proportional and Spaced */}
        <div className="relative flex-1 w-full overflow-hidden my-auto min-h-[340px] flex items-center">
          {CATEGORIES.map((cat, idx) => {
            const IconComp = cat.Icon
            const diff = idx - scrollProgress * 4
            const xOffset = diff * 100
            const opacity = clamp(1 - Math.abs(diff) * 1.4)
            const isCurrent = Math.abs(diff) < 0.95

            return (
              <div
                key={cat.id}
                className="absolute inset-0 w-full h-full flex flex-col justify-center will-change-transform"
                style={{
                  transform: `translate3d(${xOffset}vw, 0, 0)`,
                  opacity: isCurrent ? opacity : 0,
                  pointerEvents: isCurrent ? 'auto' : 'none',
                  transition: 'opacity 0.15s ease-out',
                }}
                aria-hidden={!isCurrent}
              >
                {/* Category Header with Line-Art Icon */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/15 pb-3 sm:pb-4">
                  <div className="flex items-center gap-3.5 sm:gap-5">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-[#16334D] text-[#7EB5D6] ring-1.5 ring-[#4F87A8]/60 shadow-[0_0_24px_rgba(79,135,168,0.3)]">
                      <IconComp className="h-7 w-7 sm:h-9 sm:w-9 animate-pulse" />
                    </div>
                    <div>
                      <span className="rounded-full bg-[#4F87A8]/20 px-3 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7EB5D6] ring-1 ring-[#4F87A8]/30">
                        Category {cat.number} of 05
                      </span>
                      <h3 className="mt-1 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        {cat.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-[#8FAEC5] max-w-md sm:text-right">
                    {cat.tagline}
                  </p>
                </div>

                {/* Checklist Items Grid - Full screen proportional cards */}
                <ul className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 w-full">
                  {cat.items.map((it, itemIdx) => {
                    const itemDelay = `${itemIdx * 50}ms`
                    return (
                      <li
                        key={it.title}
                        className="flex items-start gap-3.5 rounded-2xl bg-white/[0.04] p-4 sm:p-4.5 ring-1 ring-white/10 hover:bg-white/[0.08] hover:ring-[#4F87A8]/50 transition-all duration-300 backdrop-blur-sm shadow-md"
                        style={{
                          animationDelay: itemDelay,
                        }}
                      >
                        <span className="mt-0.5 flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-[#1F4663] text-[#7EB5D6] ring-1 ring-white/20 shadow">
                          <Check size={15} strokeWidth={2.8} />
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                            {it.title}
                          </h4>
                          <p className="mt-1 text-xs text-[#8FAEC5] leading-relaxed">
                            {it.note}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
