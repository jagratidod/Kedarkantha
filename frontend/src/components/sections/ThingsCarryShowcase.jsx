import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'

/* =========================================================================
   5 Dedicated Custom Line-Art SVGs
   Minimalist, technical, alpine stroke-based art
========================================================================= */

function ClothingLineArt({ className = "h-10 w-10 sm:h-12 sm:w-12" }) {
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

function FootwearLineArt({ className = "h-10 w-10 sm:h-12 sm:w-12" }) {
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

function HeadwearLineArt({ className = "h-10 w-10 sm:h-12 sm:w-12" }) {
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

function AccessoriesLineArt({ className = "h-10 w-10 sm:h-12 sm:w-12" }) {
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

function BagsLineArt({ className = "h-10 w-10 sm:h-12 sm:w-12" }) {
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
   Packing Categories Data (Exact items specified by user)
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
    tagline: 'Snow Traction, Warm Padding & Camp Relax',
    Icon: FootwearLineArt,
    items: [
      { title: 'Trekking shoes (ankle support)', note: 'Deep lug grip sole with waterproof membrane for snow.' },
      { title: 'Sandals for camp use', note: 'Lightweight slip-ons to breathe your feet at tents.' },
      { title: '3 pairs woolen socks', note: 'Thick merino woolen socks for zero-frostbite night warmth.' },
      { title: '1 pair waterproof gloves', note: 'Windproof insulated outer shell for ridge snow walk.' },
      { title: '1 pair warm inner gloves', note: 'Fleece touchscreen liners for quick camera clicks.' },
    ],
  },
  {
    id: 'headwear',
    number: '03',
    title: 'Headwear',
    tagline: 'UV Defense, Ear Protection & Mountain Glare Guard',
    Icon: HeadwearLineArt,
    items: [
      { title: 'Woolen cap / balaclava', note: 'Covers forehead, ears, and neck against cutting summit gusts.' },
      { title: 'Neck warmer / scarf', note: 'Shields trachea and chest from frigid morning drafts.' },
      { title: 'Sun cap for daytime', note: 'Protects face from harsh midday glare on exposed clearings.' },
      { title: 'UV protected sunglasses', note: 'Category 3 or 4 UV blockage to prevent snow blindness.' },
      { title: 'Sunscreen SPF 50+', note: 'High altitude UV is intense; reapply every 3 hours.' },
    ],
  },
  {
    id: 'accessories',
    number: '04',
    title: 'Accessories',
    tagline: 'Trail Balance, Illumination & Cold-Proof Power',
    Icon: AccessoriesLineArt,
    items: [
      { title: 'Trekking pole (recommended)', note: 'Absorbs up to 25% of knee shock on steep snow descents.' },
      { title: 'Headlamp with extra batteries', note: 'Crucial hands-free lighting for 3:30 AM summit departure.' },
      { title: 'Power bank & mobile charger', note: 'Freezing temperatures drain batteries rapidly; keep insulated.' },
      { title: 'Reusable water bottle 1L+', note: 'Insulated thermos flask to prevent drinking water freezing.' },
      { title: 'Camera / action camera', note: 'Capture spectacular 360° views of Swargarohini peaks.' },
    ],
  },
  {
    id: 'bags',
    number: '05',
    title: 'Bags',
    tagline: 'Ergonomic Carry, Permit Documents & Eco-Trek Guidelines',
    Icon: BagsLineArt,
    items: [
      { title: 'Backpack 40–50L with rain cover', note: 'Sturdy internal frame with padded waist strap.' },
      { title: 'Small daypack for essentials', note: '10–15L summit pack for hydration, layers & camera.' },
      { title: 'ID proof (Original + copy)', note: 'Mandatory verification for forest checkpost permits.' },
      { title: 'Sufficient cash (no ATMs)', note: 'Last active ATMs are in Mori/Purola before Sankri base.' },
      { title: 'Reusable waste bag', note: 'Leave No Trace policy: bring all dry waste back to base.' },
    ],
  },
]

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

export default function ThingsCarryShowcase() {
  const wrapRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])

  // Smooth scroll scrubbing
  useEffect(() => {
    let target = 0
    let current = 0
    let raf = 0

    const onScroll = () => {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      const maxScroll = wrapRef.current.offsetHeight - window.innerHeight
      target = clamp(maxScroll > 0 ? -rect.top / maxScroll : 0)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      const diff = target - current
      current = Math.abs(diff) < 0.0004 ? target : current + diff * 0.14
      setScrollProgress(current)

      // 5 steps across 0..1
      const step = Math.min(4, Math.floor(current * 4.999))
      setActiveStep(step)

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
  }, [])

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
      style={{ height: reduced ? 'auto' : '480vh' }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[#0E2233] text-white flex flex-col justify-between py-5 sm:py-7">
        {/* Soft Alpine Radial Ambient Glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(80% 65% at 50% 30%, rgba(31,70,99,0.45) 0%, rgba(14,34,51,0.85) 60%, #091724 100%)',
          }}
          aria-hidden="true"
        />

        {/* Subtle grid mesh line art background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        {/* 1. Full-Width Header & Stepper Line-Art Navigation */}
        <div className="w-full px-6 sm:px-12 md:px-20 lg:px-28 text-center shrink-0 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#16334D] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#7EB5D6] ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F87A8] animate-pulse" />
            Checklist · Kedarkantha Trek
          </div>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            What to Pack
          </h2>
          <p className="mt-1 text-xs sm:text-sm md:text-base text-[#8FAEC5]">
            Essential mountain gear for snow trails, sub-zero nights and 12,500 ft summit
          </p>

          {/* Top Line-Art Icons Stepper - Full Width */}
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-6 overflow-x-auto pb-1 [scrollbar-width:none]">
            {CATEGORIES.map((cat, idx) => {
              const IconComp = cat.Icon
              const isActive = idx === activeStep
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToStep(idx)}
                  className={`group relative flex flex-col items-center gap-1.5 rounded-2xl px-4 py-2 sm:px-6 sm:py-3 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#16334D] text-[#7EB5D6] ring-2 ring-[#4F87A8] shadow-[0_0_30px_rgba(79,135,168,0.4)] scale-105'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white ring-1 ring-white/10'
                  }`}
                  aria-label={`Jump to ${cat.title}`}
                >
                  <IconComp className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'} h-7 w-7 sm:h-9 sm:w-9`} />
                  <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase whitespace-nowrap">
                    {cat.number}. {cat.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Full-Screen Right-to-Left Sliding Stage (No Card Box Container) */}
        <div className="relative flex-1 w-full overflow-hidden my-auto min-h-[360px]">
          {CATEGORIES.map((cat, idx) => {
            const IconComp = cat.Icon
            const diff = idx - scrollProgress * 4
            // Full 100vw horizontal translation from right to left
            const xOffset = diff * 100
            const opacity = clamp(1 - Math.abs(diff) * 1.4)
            const isCurrent = Math.abs(diff) < 0.95

            return (
              <div
                key={cat.id}
                className="absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 will-change-transform"
                style={{
                  transform: `translate3d(${xOffset}vw, 0, 0)`,
                  opacity: isCurrent ? opacity : 0,
                  pointerEvents: isCurrent ? 'auto' : 'none',
                  transition: 'opacity 0.15s ease-out',
                }}
                aria-hidden={!isCurrent}
              >
                {/* Full-Screen Category Header with Line-Art Icon */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/15 pb-4 sm:pb-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-[#16334D] text-[#7EB5D6] ring-2 ring-[#4F87A8]/60 shadow-[0_0_30px_rgba(79,135,168,0.35)]">
                      <IconComp className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-[#4F87A8]/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#7EB5D6] ring-1 ring-[#4F87A8]/30">
                          Category {cat.number} of 05
                        </span>
                      </div>
                      <h3 className="mt-1 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                        {cat.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-[#8FAEC5] max-w-md sm:text-right">
                    {cat.tagline}
                  </p>
                </div>

                {/* Full-Screen Checklist Items Grid */}
                <ul className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 w-full">
                  {cat.items.map((it, itemIdx) => {
                    const itemDelay = `${itemIdx * 60}ms`
                    return (
                      <li
                        key={it.title}
                        className="flex items-start gap-4 rounded-2xl bg-white/[0.04] p-4 sm:p-5 ring-1 ring-white/10 hover:bg-white/[0.08] hover:ring-[#4F87A8]/50 transition-all duration-300 backdrop-blur-sm"
                        style={{
                          animationDelay: itemDelay,
                        }}
                      >
                        <span className="mt-0.5 flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#1F4663] text-[#7EB5D6] ring-1 ring-white/20 shadow">
                          <Check size={16} strokeWidth={2.8} />
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                            {it.title}
                          </h4>
                          <p className="mt-1 text-xs sm:text-sm text-[#8FAEC5] leading-relaxed">
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

        {/* 3. Full-Width Bottom Progress Bar & Step Navigation */}
        <div className="w-full px-6 sm:px-12 md:px-20 lg:px-28 shrink-0 pb-2 sm:pb-3">
          <div className="flex items-center justify-between text-xs sm:text-sm text-[#8FAEC5] mb-2 font-semibold">
            <span className="uppercase tracking-widest text-[#7EB5D6]">
              {CATEGORIES[activeStep]?.number} / 05 · {CATEGORIES[activeStep]?.title}
            </span>
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/60">
              Scroll to slide next category <ChevronRight size={14} />
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#4F87A8] via-[#7EB5D6] to-[#E8A317] transition-all duration-150 ease-out rounded-full shadow-[0_0_12px_rgba(79,135,168,0.5)]"
              style={{ width: `${Math.max(12, Math.min(100, scrollProgress * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
