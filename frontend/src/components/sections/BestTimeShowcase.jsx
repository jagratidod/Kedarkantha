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
  const [activeSeason, setActiveSeason] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  )

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

      // 3 seasons across 0..1
      const seasonIdx = Math.min(2, Math.floor(current * 2.999))
      setActiveSeason(seasonIdx)

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

  const scrollToSeason = (idx) => {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const maxScroll = wrapRef.current.offsetHeight - window.innerHeight
    const targetScrollY = window.scrollY + rect.top + (idx / 2) * maxScroll + 2
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
  }

  const currentSeasonData = SEASONS[activeSeason]

  // Progress of scrolling away from Season 0 (December-February)
  const disperseProgress = ease(clamp(scrollProgress / 0.36))

  // Season 1 (Dec-Feb) exit animations:
  // Text scrolls to the LEFT side
  const s0TextTranslateX = -disperseProgress * 110
  // Top photo scrolls to TOP SIDE
  const topPhotoTranslateY = -disperseProgress * 135
  // Bottom photo scrolls to BOTTOM SIDE
  const bottomPhotoTranslateY = disperseProgress * 135
  // Right photo scrolls to RIGHT SIDE
  const rightPhotoTranslateX = disperseProgress * 135
  // Opacity of Season 1
  const s0Opacity = clamp(1 - disperseProgress * 1.7)

  return (
    <section
      ref={wrapRef}
      id="best-time"
      aria-label="Best Time to Visit Kedarkantha"
      className="relative bg-[#0E2233]"
      style={{ height: reduced ? 'auto' : '340vh' }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[#0E2233] text-white flex flex-col justify-between py-4 sm:py-6">
        {/* Ambient Seasonal Glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(85% 70% at 75% 45%, ${currentSeasonData.glowColor} 0%, rgba(14, 34, 51, 0.8) 55%, #091724 100%)`,
          }}
          aria-hidden="true"
        />

        {/* Ambient Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
          aria-hidden="true"
        />

        {/* 1. Top Header & Tabs */}
        <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 shrink-0 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-white/10 pb-2.5 sm:pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#16334D] px-3 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#7EB5D6] ring-1 ring-white/10">
                <Sparkles size={11} className="text-[#38BDF8]" />
                Season Planning · Kedarkantha
              </div>
              <h2 className="mt-1 text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md">
                Best Time to Visit
              </h2>
            </div>

            {/* Season Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]">
              {SEASONS.map((s, idx) => {
                const SIcon = s.Icon
                const isActive = idx === activeSeason
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollToSeason(idx)}
                    className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-[#16334D] text-white ring-1.5 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white ring-1 ring-white/10'
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
        <div className="relative flex-1 w-full overflow-hidden my-auto min-h-[400px]">
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
            const isVisible0 = s0Opacity > 0.02

            return (
              <div
                className="absolute inset-0 w-full h-full flex items-center px-6 sm:px-12 md:px-16 lg:px-24 will-change-transform"
                style={{
                  opacity: isVisible0 ? s0Opacity : 0,
                  pointerEvents: isVisible0 && activeSeason === 0 ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease-out',
                }}
                aria-hidden={activeSeason !== 0}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
                  {/* TEXT: Scrolls to LEFT SIDE */}
                  <div
                    className="lg:col-span-5 flex flex-col justify-center will-change-transform"
                    style={{
                      transform: `translate3d(${s0TextTranslateX}%, 0, 0)`,
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow"
                        style={{ backgroundColor: season0.accentColor }}
                      >
                        <SIcon0 size={13} />
                        {season0.badge}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur-sm">
                        <Thermometer size={13} className="text-[#7EB5D6]" />
                        {season0.temp}
                      </span>
                    </div>

                    <h3 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                      {season0.months}
                    </h3>

                    <p className="mt-1 text-sm sm:text-base font-semibold text-[#7EB5D6]">
                      {season0.tagline}
                    </p>

                    <p className="mt-3 text-xs sm:text-sm text-[#8FAEC5] leading-relaxed">
                      {season0.description}
                    </p>

                    <ul className="mt-4 sm:mt-5 space-y-2">
                      {season0.highlights.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90">
                          <span
                            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#0E2233]"
                            style={{ backgroundColor: season0.accentColor }}
                          >
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 sm:mt-6">
                      <Link
                        to="/departures"
                        className="inline-flex items-center gap-2 rounded-full bg-[#16334D] px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#7EB5D6] ring-1 ring-[#4F87A8]/60 hover:bg-[#1F4663] hover:text-white transition-all shadow-md"
                      >
                        <Calendar size={14} />
                        <span>View December – February Dates</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* 3 IMAGES: Top to top, bottom to bottom, right to right */}
                  <div className="lg:col-span-7 relative h-[280px] sm:h-[350px] md:h-[420px] lg:h-[460px] w-full">
                    {/* Top photo */}
                    <div
                      className="absolute top-0 left-0 w-[45%] h-[47%] overflow-hidden rounded-2xl ring-2 shadow-2xl transition-all duration-300 will-change-transform"
                      style={{
                        borderColor: `${season0.accentColor}50`,
                        boxShadow: `0 15px 35px rgba(0,0,0,0.6), 0 0 25px ${season0.glowColor}`,
                        transform: `translate3d(0, ${topPhotoTranslateY}vh, 0)`,
                        opacity: s0Opacity,
                      }}
                    >
                      <Img
                        image={season0.topPhoto.src}
                        alt={season0.topPhoto.alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2 sm:p-3 text-white">
                        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#7EB5D6]">
                          {season0.topPhoto.label}
                        </span>
                      </div>
                    </div>

                    {/* Bottom photo */}
                    <div
                      className="absolute bottom-0 left-0 w-[45%] h-[47%] overflow-hidden rounded-2xl ring-2 shadow-2xl transition-all duration-300 will-change-transform"
                      style={{
                        borderColor: `${season0.accentColor}50`,
                        boxShadow: `0 15px 35px rgba(0,0,0,0.6), 0 0 25px ${season0.glowColor}`,
                        transform: `translate3d(0, ${bottomPhotoTranslateY}vh, 0)`,
                        opacity: s0Opacity,
                      }}
                    >
                      <Img
                        image={season0.bottomPhoto.src}
                        alt={season0.bottomPhoto.alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2 sm:p-3 text-white">
                        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                          {season0.bottomPhoto.label}
                        </span>
                      </div>
                    </div>

                    {/* Right photo */}
                    <div
                      className="absolute top-0 right-0 w-[52%] h-full overflow-hidden rounded-3xl ring-2 shadow-2xl transition-all duration-300 will-change-transform"
                      style={{
                        borderColor: `${season0.accentColor}50`,
                        boxShadow: `0 20px 45px rgba(0,0,0,0.7), 0 0 35px ${season0.glowColor}`,
                        transform: `translate3d(${rightPhotoTranslateX}vw, 0, 0)`,
                        opacity: s0Opacity,
                      }}
                    >
                      <Img
                        image={season0.rightPhoto.src}
                        alt={season0.rightPhoto.alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 sm:p-4 text-white">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7EB5D6]">
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
            const actualIdx = sliceIdx + 1
            const SIcon = season.Icon
            const diff = actualIdx - scrollProgress * 2
            const isCurrent = Math.abs(diff) < 1.05
            // Slide in from right (positive vw) to left (0 and then exits to negative vw)
            const xSlideVw = diff * 100
            const opacity = clamp(1 - Math.abs(diff) * 1.3)

            return (
              <div
                key={season.id}
                className="absolute inset-0 w-full h-full flex items-center px-6 sm:px-12 md:px-16 lg:px-24 will-change-transform"
                style={{
                  transform: `translate3d(${xSlideVw}vw, 0, 0)`,
                  opacity: isCurrent ? opacity : 0,
                  pointerEvents: isCurrent ? 'auto' : 'none',
                  transition: 'opacity 0.15s ease-out',
                }}
                aria-hidden={!isCurrent}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
                  {/* ====== LEFT SIDE: IMAGE ====== */}
                  <div className="lg:col-span-5 relative h-[260px] sm:h-[340px] md:h-[400px] lg:h-[440px] w-full">
                    <div
                      className="h-full w-full overflow-hidden rounded-3xl ring-2 shadow-2xl relative"
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
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 sm:p-4 text-white">
                        <span
                          className="text-[10px] sm:text-xs font-bold uppercase tracking-wider"
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
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0E2233] shadow"
                        style={{ backgroundColor: season.accentColor }}
                      >
                        <SIcon size={13} />
                        Season {season.number} · {season.badge}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur-sm">
                        <Thermometer size={13} className="text-[#7EB5D6]" />
                        {season.temp}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-[#8FAEC5] ring-1 ring-white/10">
                        {season.weather}
                      </span>
                    </div>

                    {/* Month Title */}
                    <h3 className="mt-2.5 text-3xl sm:text-5xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                      {season.months}
                    </h3>

                    <p
                      className="mt-1 text-sm sm:text-base font-bold"
                      style={{ color: season.accentColor }}
                    >
                      {season.tagline}
                    </p>

                    <p className="mt-2 text-xs sm:text-sm text-[#8FAEC5] leading-relaxed">
                      {season.description}
                    </p>

                    {/* 4 Feature Highlights Grid */}
                    <div className="mt-3.5 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-left">
                      {season.featureCards.map((feat) => {
                        const FIcon = feat.icon
                        return (
                          <div
                            key={feat.title}
                            className="flex items-start gap-2.5 rounded-xl bg-white/[0.04] p-2.5 sm:p-3 ring-1 ring-white/10 hover:bg-white/[0.08] transition-all backdrop-blur-sm"
                          >
                            <span
                              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                              style={{ backgroundColor: season.accentColor }}
                            >
                              <FIcon size={14} strokeWidth={2.5} />
                            </span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                                {feat.title}
                              </h4>
                              <p className="mt-0.5 text-[11px] text-[#8FAEC5] leading-relaxed">
                                {feat.desc}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Direct Dates Button */}
                    <div className="mt-4 sm:mt-5 flex items-center">
                      <Link
                        to="/departures"
                        className="group inline-flex items-center gap-2.5 rounded-full px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105 hover:brightness-110"
                        style={{ backgroundColor: season.accentColor }}
                      >
                        <Calendar size={15} />
                        <span>Explore {season.months} Departures</span>
                        <ArrowUpRight
                          size={15}
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
