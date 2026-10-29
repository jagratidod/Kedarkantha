import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Snowflake, Sun, Flame, Thermometer, Check, ArrowUpRight, Sparkles, Calendar, Compass, Mountain, Wind } from 'lucide-react'
import Img from '../ui/Img'

/* =========================================================================
   Best Time to Visit:
   - Season 1 (Dec-Feb): 3 fitted images. When scrolling to next section:
       • Top photo scrolls to TOP SIDE
       • Bottom photo scrolls to BOTTOM SIDE
       • Right photo scrolls to RIGHT SIDE
       • Season 1 text slides away to the LEFT side
   - Next Season (March - April):
       • A featured season photo enters and fits on the LEFT side
       • Then text appears on the RIGHT side
   - Season 3 (November):
       • Autumn photo enters on the LEFT side, text appears on the RIGHT side
   - Zero yellow color! Using icy blue (#7EB5D6), sky blue (#38BDF8), and alpine teal (#2DD4BF).
========================================================================= */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t) => t * t * (3 - 2 * t)
const mix = (a, b, t) => a + (b - a) * t

const SEASONS = [
  {
    id: 'dec-feb',
    number: '01',
    months: 'December – February',
    badge: 'Peak Winter Snow',
    tagline: 'Deep powder snow, frozen alpine lakes & sub-zero night skies',
    temp: '-9°C to 10°C',
    weather: 'Heavy Snowfall · Sub-Zero Nights',
    accentColor: '#7EB5D6',
    glowColor: 'rgba(126, 181, 214, 0.35)',
    Icon: Snowflake,
    description:
      'The quintessential Kedarkantha experience. The entire trail from Sankri to the 12,500 ft summit is blanketed under 2 to 4 feet of pristine white snow, with the mystical Juda Ka Talab lake completely frozen.',
    highlights: [
      'Trek through knee-deep fresh powdery snow trails',
      'Walk over the magical frozen Juda Ka Talab lake',
      'Crystal-clear sub-zero stargazing under the Milky Way',
    ],
    topPhoto: {
      src: '/gallery/kedarkantha-flags.jpg',
      alt: 'Kedarkantha stone shrine with orange flags',
      label: '12,500 FT Summit Shrine',
    },
    bottomPhoto: {
      src: '/gallery/shiva-shrine-crampons.jpg',
      alt: 'Trekkers with crampons and gaiters at shrine',
      label: 'Summit Push in Deep Snow',
    },
    rightPhoto: {
      src: '/gallery/snow-ridge-trail.jpg',
      alt: 'Trekkers single-file on deep snow ridge trail',
      label: 'Snow Ridge Trail',
    },
  },
  {
    id: 'mar-apr',
    number: '02',
    months: 'March – April',
    badge: 'Spring Panoramas',
    tagline: 'Warm sunlit days, blooming rhododendrons & widest Himalayan views',
    temp: '-5°C to 15°C',
    weather: 'Pleasant Sunshine · Thawing Snow',
    accentColor: '#4F87A8',
    glowColor: 'rgba(79, 135, 168, 0.35)',
    Icon: Sun,
    description:
      'As winter relaxes, longer sunlit days open up expansive 360° panoramas of Swargarohini and Bandarpoonch. Pine forests burst into vivid pink rhododendron blooms alongside glistening snow on high ridges.',
    leftPhoto: {
      src: '/gallery/himalayan-flag-pride.jpg',
      alt: 'Trekkers celebrating on sunlit snow plateau',
      label: 'Spring Summit Ridge · Clear Skies',
    },
    featureCards: [
      {
        icon: Mountain,
        title: '360° Himalayan Panoramas',
        desc: 'Unmatched crystal-clear visibility of 13+ Himalayan peaks stretching to Tibet border.',
      },
      {
        icon: Sun,
        title: 'Pleasant Daytime Sunshine',
        desc: 'Comfortable hiking weather with bright blue skies, warm afternoons and cool evenings.',
      },
      {
        icon: Compass,
        title: 'Rhododendron Forest Canopy',
        desc: 'Dense oak & pine forests adorned with blossoming pink and scarlet rhododendron blooms.',
      },
      {
        icon: Wind,
        title: 'Ideal Spring Trail Conditions',
        desc: 'Thawing snow on upper ridges allows secure trail footing without extreme sub-zero winds.',
      },
    ],
  },
  {
    id: 'nov',
    number: '03',
    months: 'November',
    badge: 'Autumn Solitude',
    tagline: 'Golden autumn woods, crisp morning frost & first dusting of snow',
    temp: '0°C to 12°C',
    weather: 'Crisp Mountain Chill · Golden Trails',
    accentColor: '#3B82A6',
    glowColor: 'rgba(59, 130, 166, 0.35)',
    Icon: Flame,
    description:
      'The quietest and most serene month to experience Kedarkantha. Witness the dramatic transition from golden autumn canopy to the season’s very first snowfall, with tranquil campsites and intimate batch sizes.',
    leftPhoto: {
      src: '/gallery/camp-bonfire-evening.jpg',
      alt: 'Trekkers around warm campfire with mountain background',
      label: 'Campfire Evening · Peaceful Trails',
    },
    featureCards: [
      {
        icon: Flame,
        title: 'Cozy Campfire Evenings',
        desc: 'Intimate batch sizes enjoying bonfire warmth and storytelling under crystal star-lit skies.',
      },
      {
        icon: Snowflake,
        title: 'Season’s First Snow Dusting',
        desc: 'Witness fresh white powder dusting the highest ridges and pine tips as winter begins.',
      },
      {
        icon: Compass,
        title: 'Pure Wilderness Solitude',
        desc: 'Uncrowded trails, undisturbed campsites, and complete peace across the Garhwal ridges.',
      },
      {
        icon: Mountain,
        title: 'Golden Forest Vistas',
        desc: 'Vibrant golden oak foliage reflecting clear morning light with crisp Himalayan air.',
      },
    ],
  },
]

export default function BestTimeShowcase() {
  const wrapRef = useRef(null)
  const buttonsRef = useRef([])
  // Season 1 (Dec-Feb) refs
  const s0TextRef = useRef(null)
  const topPhotoRef = useRef(null)
  const bottomPhotoRef = useRef(null)
  const rightPhotoRef = useRef(null)
  const s0WrapRef = useRef(null)
  // Seasons 2 & 3 refs
  const otherSeasonsRef = useRef([])

  const [activeSeason, setActiveSeason] = useState(0)
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    let target = 0
    let current = 0
    let raf = 0
    let lastSeasonIdx = -1

    const apply = (p) => {
      // 1. Season tabs update without state re-render during scroll
      const seasonIdx = Math.min(2, Math.floor(p * 2.999))
      if (seasonIdx !== lastSeasonIdx) {
        lastSeasonIdx = seasonIdx
        setActiveSeason(seasonIdx)
        buttonsRef.current.forEach((btn, idx) => {
          if (!btn) return
          const s = SEASONS[idx]
          if (idx === seasonIdx) {
            btn.className = 'group flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer shrink-0 bg-[#16334D] text-white ring-1.5 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
            btn.style.borderColor = s.accentColor
          } else {
            btn.className = 'group flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer shrink-0 bg-slate-100 text-[#0E3555]/70 hover:bg-slate-200 hover:text-[#082138] ring-1 ring-slate-200'
            btn.style.borderColor = ''
          }
        })
      }

      // 2. Season 1 (Dec-Feb) transformations directly in DOM
      const disperseProgress = ease(clamp(p / 0.36))
      const s0TextTranslateX = -disperseProgress * 110
      const topPhotoTranslateY = -disperseProgress * 135
      const bottomPhotoTranslateY = disperseProgress * 135
      const rightPhotoTranslateX = disperseProgress * 135
      const s0Opacity = clamp(1 - disperseProgress * 1.7)
      const isVisible0 = s0Opacity > 0.02

      if (s0WrapRef.current) {
        s0WrapRef.current.style.opacity = isVisible0 ? String(s0Opacity) : '0'
        s0WrapRef.current.style.pointerEvents = isVisible0 && seasonIdx === 0 ? 'auto' : 'none'
      }
      if (s0TextRef.current) {
        s0TextRef.current.style.transform = `translate3d(${s0TextTranslateX}%, 0, 0)`
      }
      if (topPhotoRef.current) {
        topPhotoRef.current.style.transform = `translate3d(0, ${topPhotoTranslateY}vh, 0)`
        topPhotoRef.current.style.opacity = String(s0Opacity)
      }
      if (bottomPhotoRef.current) {
        bottomPhotoRef.current.style.transform = `translate3d(0, ${bottomPhotoTranslateY}vh, 0)`
        bottomPhotoRef.current.style.opacity = String(s0Opacity)
      }
      if (rightPhotoRef.current) {
        rightPhotoRef.current.style.transform = `translate3d(${rightPhotoTranslateX}vw, 0, 0)`
        rightPhotoRef.current.style.opacity = String(s0Opacity)
      }

      // 3. Seasons 2 & 3 transformations directly in DOM
      otherSeasonsRef.current.forEach((el, sliceIdx) => {
        if (!el) return
        const actualIdx = sliceIdx + 1
        const diff = actualIdx - p * 2
        const isCurrent = Math.abs(diff) < 1.05
        const xSlideVw = diff * 100
        const opacity = clamp(1 - Math.abs(diff) * 1.3)

        el.style.transform = `translate3d(${xSlideVw}vw, 0, 0)`
        el.style.opacity = isCurrent ? String(opacity) : '0'
        el.style.pointerEvents = isCurrent ? 'auto' : 'none'
      })
    }

    const tick = () => {
      const diff = target - current
      current = Math.abs(diff) < 0.0002 ? target : current + diff * 0.14
      apply(current)
      raf = current === target ? 0 : requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (!wrapRef.current || reduced) return
      const rect = wrapRef.current.getBoundingClientRect()
      const maxScroll = wrapRef.current.offsetHeight - window.innerHeight
      target = clamp(maxScroll > 0 ? -rect.top / maxScroll : 0)
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

  const scrollToSeason = (idx) => {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const maxScroll = wrapRef.current.offsetHeight - window.innerHeight
    const targetScrollY = window.scrollY + rect.top + (idx / 2) * maxScroll + 2
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
  }

  return (
    <section
      ref={wrapRef}
      id="best-time"
      aria-label="Best Time to Visit Kedarkantha"
      className="relative bg-white"
      style={{ height: reduced ? 'auto' : '340vh' }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-white text-[#082138] flex flex-col justify-between py-2 sm:py-6 pb-16 md:pb-6">
        {/* Pure White Background with very subtle clean glow */}
        <div
          className="absolute inset-0 pointer-events-none bg-white"
          aria-hidden="true"
        />

        {/* Ambient Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(rgba(14, 40, 62, 0.05) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
          aria-hidden="true"
        />

        {/* 1. Top Header & Tabs */}
        <div className="w-full px-4 sm:px-12 md:px-16 lg:px-24 shrink-0 pt-2 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2.5 border-b border-slate-200 pb-1.5 sm:pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] sm:text-xs font-bold uppercase tracking-widest text-[#0E3555] ring-1 ring-slate-300">
                <Sparkles size={11} className="text-[#38BDF8]" />
                Season Planning · Kedarkantha
              </div>
              <h2 className="mt-0.5 sm:mt-1 text-lg sm:text-3xl md:text-4xl font-black tracking-tight text-[#082138] drop-shadow-sm">
                Best Time to Visit
              </h2>
            </div>

            {/* Season Tabs */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 sm:py-1 [scrollbar-width:none]">
              {SEASONS.map((s, idx) => {
                const SIcon = s.Icon
                const isActive = idx === activeSeason
                return (
                  <button
                    key={s.id}
                    ref={(el) => (buttonsRef.current[idx] = el)}
                    type="button"
                    onClick={() => scrollToSeason(idx)}
                    className={`group flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#16334D] text-white ring-1.5 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                        : 'bg-slate-100 text-[#0E3555]/70 hover:bg-slate-200 hover:text-[#082138] ring-1 ring-slate-200'
                    }`}
                    style={{
                      borderColor: isActive ? s.accentColor : undefined,
                    }}
                  >
                    <SIcon
                      size={12}
                      style={{ color: isActive ? s.accentColor : 'inherit' }}
                      className={isActive ? 'animate-pulse' : ''}
                    />
                    <span>{s.months}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 2. Main Animated Stage */}
        <div className="relative flex-1 w-full overflow-hidden my-auto min-h-[300px] sm:min-h-[400px]">
          {/* =========================================================================
              SEASON 1: DECEMBER – FEBRUARY
              On scroll forward:
                - Text scrolls to LEFT SIDE (translateX -110%)
                - Top Photo scrolls to TOP SIDE (translateY -135vh)
                - Bottom Photo scrolls to BOTTOM SIDE (translateY +135vh)
                - Right Photo scrolls to RIGHT SIDE (translateX +135vw)
          ========================================================================= */}
          {(() => {
            const season0 = SEASONS[0]
            const SIcon0 = season0.Icon

            return (
              <div
                ref={s0WrapRef}
                className="absolute inset-0 w-full h-full flex items-center px-4 sm:px-12 md:px-16 lg:px-24 will-change-transform overflow-y-auto lg:overflow-visible"
                style={{
                  opacity: 1,
                  pointerEvents: 'auto',
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-8 lg:gap-12 items-center w-full my-auto py-2">
                  {/* TEXT: Scrolls to LEFT SIDE */}
                  <div
                    ref={s0TextRef}
                    className="lg:col-span-5 flex flex-col justify-center will-change-transform"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow"
                        style={{ backgroundColor: season0.accentColor }}
                      >
                        <SIcon0 size={12} />
                        {season0.badge}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#082138] ring-1 ring-slate-200 shadow-xs">
                        <Thermometer size={12} className="text-[#0284C7]" />
                        {season0.temp}
                      </span>
                    </div>

                    <h3 className="mt-1.5 sm:mt-3 text-2xl sm:text-5xl font-black tracking-tight text-[#082138] drop-shadow-sm leading-tight">
                      {season0.months}
                    </h3>

                    <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-semibold text-[#3B82A6]">
                      {season0.tagline}
                    </p>

                    <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-[#1E4567] font-medium leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {season0.description}
                    </p>

                    <ul className="mt-2 sm:mt-5 space-y-1 sm:space-y-2">
                      {season0.highlights.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-[11px] sm:text-sm text-[#082138] font-medium">
                          <span
                            className="mt-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 items-center justify-center rounded-full text-[#0E2233]"
                            style={{ backgroundColor: season0.accentColor }}
                          >
                            <Check size={9} strokeWidth={3} className="sm:w-2.5 sm:h-2.5" />
                          </span>
                          <span className="leading-tight">{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 sm:mt-6">
                      <Link
                        to="/departures"
                        className="inline-flex items-center gap-2 rounded-full bg-[#0E283E] px-4 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-sm font-bold uppercase tracking-wider text-white ring-1 ring-[#0E283E]/50 hover:bg-[#0284C7] shadow-md transition-all shadow-md"
                      >
                        <Calendar size={13} />
                        <span>View December – February Dates</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* 3 IMAGES: Top to top, bottom to bottom, right to right */}
                  <div className="lg:col-span-7 relative h-[140px] xs:h-[180px] sm:h-[350px] md:h-[420px] lg:h-[460px] w-full">
                    {/* Top photo */}
                    <div
                      ref={topPhotoRef}
                      className="absolute top-0 left-0 w-[46%] h-[47%] overflow-hidden rounded-xl sm:rounded-2xl ring-1.5 sm:ring-2 shadow-xl sm:shadow-2xl transition-all duration-300 will-change-transform"
                      style={{
                        borderColor: `${season0.accentColor}50`,
                        boxShadow: `0 20px 40px rgba(10,30,50,0.18), 0 4px 12px rgba(0,0,0,0.08)`,
                      }}
                    >
                      <Img
                        image={season0.topPhoto.src}
                        alt={season0.topPhoto.alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-1 sm:p-3 text-white">
                        <span className="text-[8px] sm:text-[11px] font-bold uppercase tracking-wider text-[#7EB5D6]">
                          {season0.topPhoto.label}
                        </span>
                      </div>
                    </div>

                    {/* Bottom photo */}
                    <div
                      ref={bottomPhotoRef}
                      className="absolute bottom-0 left-0 w-[46%] h-[47%] overflow-hidden rounded-xl sm:rounded-2xl ring-1.5 sm:ring-2 shadow-xl sm:shadow-2xl transition-all duration-300 will-change-transform"
                      style={{
                        borderColor: `${season0.accentColor}50`,
                        boxShadow: `0 20px 40px rgba(10,30,50,0.18), 0 4px 12px rgba(0,0,0,0.08)`,
                      }}
                    >
                      <Img
                        image={season0.bottomPhoto.src}
                        alt={season0.bottomPhoto.alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-1 sm:p-3 text-white">
                        <span className="text-[8px] sm:text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                          {season0.bottomPhoto.label}
                        </span>
                      </div>
                    </div>

                    {/* Right photo */}
                    <div
                      ref={rightPhotoRef}
                      className="absolute top-0 right-0 w-[50%] h-full overflow-hidden rounded-2xl sm:rounded-3xl ring-1.5 sm:ring-2 shadow-xl sm:shadow-2xl transition-all duration-300 will-change-transform"
                      style={{
                        borderColor: `${season0.accentColor}50`,
                        boxShadow: `0 20px 45px rgba(0,0,0,0.7), 0 0 35px ${season0.glowColor}`,
                      }}
                    >
                      <Img
                        image={season0.rightPhoto.src}
                        alt={season0.rightPhoto.alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2 sm:p-4 text-white">
                        <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#7EB5D6]">
                          {season0.rightPhoto.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* =========================================================================
              NEXT SECTIONS (SEASON 2: MARCH-APRIL & SEASON 3: NOVEMBER)
              Sequence:
                1. Image enters first and fits cleanly on the LEFT side.
                2. Text appears on the RIGHT side.
          ========================================================================= */}
          {SEASONS.slice(1).map((season, sliceIdx) => {
            const SIcon = season.Icon

            return (
              <div
                key={season.id}
                ref={(el) => (otherSeasonsRef.current[sliceIdx] = el)}
                className="absolute inset-0 w-full h-full flex items-center px-4 sm:px-12 md:px-16 lg:px-24 will-change-transform overflow-y-auto lg:overflow-visible"
                style={{
                  transform: `translate3d(${(sliceIdx + 1) * 100}vw, 0, 0)`,
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-8 lg:gap-12 items-center w-full my-auto py-2">
                  {/* ====== LEFT SIDE: IMAGE ====== */}
                  <div className="lg:col-span-5 relative h-[140px] xs:h-[180px] sm:h-[340px] md:h-[400px] lg:h-[440px] w-full">
                    <div
                      className="h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl ring-1.5 sm:ring-2 shadow-xl sm:shadow-2xl relative"
                      style={{
                        borderColor: `${season.accentColor}50`,
                        boxShadow: `0 20px 45px rgba(0,0,0,0.65), 0 0 35px ${season.glowColor}`,
                      }}
                    >
                      <Img
                        image={season.leftPhoto.src}
                        alt={season.leftPhoto.alt}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 sm:p-4 text-white">
                        <span
                          className="text-[9px] sm:text-xs font-bold uppercase tracking-wider"
                          style={{ color: season.accentColor }}
                        >
                          {season.leftPhoto.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ====== RIGHT SIDE: TEXT ====== */}
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0E2233] shadow"
                        style={{ backgroundColor: season.accentColor }}
                      >
                        <SIcon size={12} />
                        Season {season.number} · {season.badge}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#082138] ring-1 ring-slate-200 shadow-xs">
                        <Thermometer size={12} className="text-[#7EB5D6]" />
                        {season.temp}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#4A6B8A] ring-1 ring-slate-200">
                        {season.weather}
                      </span>
                    </div>

                    {/* Month Title */}
                    <h3 className="mt-1.5 sm:mt-2.5 text-2xl sm:text-5xl font-black tracking-tight text-[#082138] drop-shadow-sm leading-tight">
                      {season.months}
                    </h3>

                    <p
                      className="mt-0.5 sm:mt-1 text-xs sm:text-base font-bold"
                      style={{ color: season.accentColor }}
                    >
                      {season.tagline}
                    </p>

                    <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-sm text-[#1E4567] font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {season.description}
                    </p>

                    {/* 4 Feature Highlights Grid */}
                    <div className="mt-2.5 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-left">
                      {season.featureCards.map((feat) => {
                        const FIcon = feat.icon
                        return (
                          <div
                            key={feat.title}
                            className="flex items-start gap-2 rounded-lg sm:rounded-xl bg-slate-50 p-2 sm:p-3 ring-1 ring-slate-200/90 hover:bg-white hover:ring-[#0284C7] transition-all shadow-xs"
                          >
                            <span
                              className="mt-0.5 flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md sm:rounded-lg text-white"
                              style={{ backgroundColor: season.accentColor }}
                            >
                              <FIcon size={13} strokeWidth={2.5} />
                            </span>
                            <div>
                              <h4 className="text-[11px] sm:text-sm font-bold text-[#082138] leading-snug">
                                {feat.title}
                              </h4>
                              <p className="mt-0.5 text-[10px] sm:text-[11px] text-[#335574] font-medium leading-tight">
                                {feat.desc}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Direct Dates Button */}
                    <div className="mt-3 sm:mt-5 flex items-center">
                      <Link
                        to="/departures"
                        className="group inline-flex items-center gap-2 rounded-full px-5 py-2 sm:px-7 sm:py-3 text-[11px] sm:text-sm font-extrabold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105 hover:brightness-110"
                        style={{ backgroundColor: season.accentColor }}
                      >
                        <Calendar size={13} />
                        <span>Explore {season.months} Departures</span>
                        <ArrowUpRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
