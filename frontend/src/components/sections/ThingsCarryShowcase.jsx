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
  const stageRef = useRef(null)
  const cardsRef = useRef([])
  const buttonsRef = useRef([])
  const boundaryRef = useRef(null)
  const meltRef = useRef(null)

  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let current = 0
    let target = 0
    let raf = 0
    let lastActiveIdx = -1

    const apply = (p) => {
      // 1. Directly update slide card transforms & opacities
      cardsRef.current.forEach((el, idx) => {
        if (!el) return
        const diff = idx - p * 4
        const xOffset = diff * 100
        const opacity = clamp(1 - Math.abs(diff) * 1.4)
        const isCurrent = Math.abs(diff) < 0.95

        el.style.transform = `translate3d(${xOffset}vw, 0, 0)`
        el.style.opacity = isCurrent ? String(opacity) : '0'
        el.style.pointerEvents = isCurrent ? 'auto' : 'none'
      })

      // 2. Active button highlight directly on DOM without triggering layout shifts
      const rawIdx = p * 4
      // Use hysteresis to prevent rapid boundary fluttering
      let activeIdx = lastActiveIdx
      if (lastActiveIdx === -1) {
        activeIdx = clamp(Math.round(rawIdx), 0, 4)
      } else {
        if (rawIdx > lastActiveIdx + 0.55 && lastActiveIdx < 4) {
          activeIdx = Math.min(4, Math.floor(rawIdx + 0.45))
        } else if (rawIdx < lastActiveIdx - 0.55 && lastActiveIdx > 0) {
          activeIdx = Math.max(0, Math.ceil(rawIdx - 0.45))
        }
      }

      if (activeIdx !== lastActiveIdx) {
        lastActiveIdx = activeIdx
        buttonsRef.current.forEach((btn, idx) => {
          if (!btn) return
          if (idx === activeIdx) {
            btn.className = 'group relative flex flex-col items-center justify-center gap-1 sm:gap-1.5 rounded-xl sm:rounded-2xl px-2.5 sm:px-5 h-13 sm:h-16 transition-colors duration-200 cursor-pointer shrink-0 bg-[#0E283E] text-white ring-2 ring-[#38BDF8] shadow-[0_4px_16px_rgba(14,40,62,0.35)]'
          } else {
            btn.className = 'group relative flex flex-col items-center justify-center gap-1 sm:gap-1.5 rounded-xl sm:rounded-2xl px-2.5 sm:px-5 h-13 sm:h-16 transition-colors duration-200 cursor-pointer shrink-0 bg-white/85 text-[#0A2640] font-bold hover:bg-white hover:text-black ring-2 ring-transparent shadow-sm'
          }
        })
      }

      // 3. Bottom melts
      if (boundaryRef.current) {
        boundaryRef.current.style.opacity = String(clamp((p - 0.65) * 3))
      }
      if (meltRef.current) {
        meltRef.current.style.opacity = String(clamp((p - 0.7) * 3.5))
      }
    }

    const tick = () => {
      const diff = target - current
      current = Math.abs(diff) < 0.0002 ? target : current + diff * 0.14
      apply(current)
      raf = current === target ? 0 : requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (reduced) return
      const rect = wrap.getBoundingClientRect()
      const totalScrollable = wrap.offsetHeight - window.innerHeight
      if (totalScrollable <= 0) return

      target = clamp(-rect.top / totalScrollable, 0, 1)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    onScroll()
    apply(0)
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
      className="relative bg-white"
      style={{ height: reduced ? 'auto' : '460vh' }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-svh w-full overflow-hidden bg-[#78B4D4] text-white flex flex-col justify-between py-4 sm:py-8 px-4 sm:px-12 md:px-16 lg:px-24 pb-16 md:pb-8"
        style={{ '--tcp': 0 }}
      >
        {/* Soft white bottom melt to blend seamlessly into Best Time to Visit */}
        <div
          ref={meltRef}
          className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-20 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.45) 50%, #FFFFFF 100%)',
            opacity: 0,
          }}
          aria-hidden="true"
        />
        {/* Sky gradient background like hero / day by day */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #FFFFFF 0%, #F0F9FF 14%, #D4ECF9 34%, #97D0EE 58%, #5CA8D3 80%, #3682AD 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-4/5 pointer-events-none"
          style={{
            background: 'radial-gradient(90% 80% at 50% 88%, rgba(255, 255, 255, 0.7) 0%, rgba(186, 230, 253, 0.45) 45%, transparent 75%)',
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
        <div className="w-full text-center shrink-0 transform-gpu will-change-transform">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#0A2E4C] ring-1 ring-[#0A2E4C]/20 bg-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F87A8] animate-pulse" />
            Checklist · Kedarkantha Trek
          </div>

          <h2 className="mt-1 sm:mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#082138] drop-shadow-sm">
            What to Pack
          </h2>
          <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-[#1E4567] font-semibold max-w-xl mx-auto hidden sm:block">
            Essential mountain gear for snow trails, sub-zero nights and 12,500 ft summit
          </p>

          {/* Top Line-Art Icons Stepper - Full-width balanced spacing */}
          <div className="mt-2 sm:mt-4 flex items-center justify-start sm:justify-center gap-2 sm:gap-5 overflow-x-auto py-1 px-1 [scrollbar-width:none]">
            {CATEGORIES.map((cat, idx) => {
              const IconComp = cat.Icon
              return (
                <button
                  key={cat.id}
                  ref={(el) => (buttonsRef.current[idx] = el)}
                  type="button"
                  onClick={() => scrollToStep(idx)}
                  className="group relative flex flex-col items-center justify-center gap-1 sm:gap-1.5 rounded-xl sm:rounded-2xl px-2.5 sm:px-5 h-13 sm:h-16 transition-colors duration-200 cursor-pointer shrink-0 bg-white/85 text-[#0A2640] font-bold hover:bg-white hover:text-black ring-2 ring-transparent shadow-sm"
                  aria-label={`Jump to ${cat.title}`}
                >
                  <IconComp className="h-5 w-5 sm:h-7 sm:w-7" />
                  <span className="text-[9px] sm:text-xs font-bold tracking-wider uppercase whitespace-nowrap">
                    {cat.number}. {cat.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Full-Screen Right-to-Left Sliding Stage - Proportional and Spaced */}
        <div className="relative flex-1 w-full overflow-hidden my-auto min-h-[300px] sm:min-h-[340px] flex items-center">
          {CATEGORIES.map((cat, idx) => {
            const IconComp = cat.Icon

            return (
              <div
                key={cat.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="absolute inset-0 w-full h-full flex flex-col justify-center will-change-transform"
                style={{
                  transform: `translate3d(${idx * 100}vw, 0, 0)`,
                  opacity: idx === 0 ? 1 : 0,
                  pointerEvents: idx === 0 ? 'auto' : 'none',
                }}
              >
                {/* Category Header with Line-Art Icon */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-3 border-b border-[#082138]/15 pb-2 sm:pb-4">
                  <div className="flex items-center gap-2.5 sm:gap-5">
                    <div className="flex h-10 w-10 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#0E283E] text-[#38BDF8] ring-1 sm:ring-1.5 ring-[#38BDF8]/50 shadow-[0_4px_20px_rgba(14,40,62,0.25)]">
                      <IconComp className="h-5 w-5 sm:h-9 sm:w-9" />
                    </div>
                    <div>
                      <span className="rounded-full bg-[#0E283E]/10 px-2 sm:px-3 py-0.5 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#0284C7] ring-1 ring-[#0284C7]/30">
                        Category {cat.number} of 05
                      </span>
                      <h3 className="mt-0.5 sm:mt-1 text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#082138] leading-tight drop-shadow-sm">
                        {cat.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-sm lg:text-base text-[#1E4567] font-medium max-w-md sm:text-right line-clamp-1 sm:line-clamp-none">
                    {cat.tagline}
                  </p>
                </div>

                {/* Checklist Items Grid - Full screen proportional cards */}
                <ul className="mt-3 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-5 w-full max-h-[50vh] sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 sm:pr-0">
                  {cat.items.map((it) => {
                    return (
                      <li
                        key={it.title}
                        className="flex items-start gap-2.5 sm:gap-3.5 rounded-xl sm:rounded-2xl bg-white/95 p-2.5 sm:p-4.5 ring-1 ring-[#0E283E]/15 hover:bg-white hover:ring-[#0284C7] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.05)] sm:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                      >
                        <span className="mt-0.5 flex h-5 w-5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-[#0E283E] text-[#38BDF8] ring-1 ring-[#0E283E]/20 shadow-sm">
                          <Check size={13} strokeWidth={2.8} className="sm:w-4 sm:h-4" />
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-base font-bold text-[#082138] leading-snug">
                            {it.title}
                          </h4>
                          <p className="mt-0.5 text-[10px] sm:text-xs text-[#335574] font-medium leading-relaxed">
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



        {/* Bottom boundary line between What to Pack and Best Time */}
        <div
          ref={boundaryRef}
          className="absolute inset-x-0 bottom-0 z-30 pointer-events-none transition-opacity duration-300"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <div className="h-[2.5px] w-full bg-gradient-to-r from-transparent via-[#0284C7] to-transparent shadow-[0_0_12px_rgba(2,132,199,0.5)]" />
        </div>
      </div>
    </section>
  )
}
