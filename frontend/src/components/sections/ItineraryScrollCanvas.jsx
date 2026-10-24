import MountainCover from './MountainCover'
import { useEffect, useRef, useState } from 'react'
import { Calendar, MapPin, Mountain, Footprints, ChevronRight, Compass } from 'lucide-react'

const FRAME_COUNT = 25
const frameUrl = (i) => `/BGIMAGES/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/**
 * ItineraryScrollCanvas Component
 *
 * Sticky Full-Screen Canvas Experience for Itinerary:
 * - Scrolled across 25 dynamic background frames from `/BGIMAGES/`
 * - As the user scrolls down, the background images smoothly cross-fade (just like in Hero)
 * - Concurrently, as each step is reached, the day's step text (Day 1, Day 2, Day 3...) changes seamlessly
 * - Interactive timeline indicators on the side, day badge, distance, altitude and narrative
 */
export default function ItineraryScrollCanvas({ days = [], embedded = false }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const totalDays = days.length || 6

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const frames = []
    let current = 0
    let target = 0
    let raf = 0
    let alive = true

    const resize = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      draw()
    }

    const drawCover = (img, alpha) => {
      if (!img?.complete || !img.naturalWidth) return
      const cw = canvas.width
      const ch = canvas.height
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const w = img.naturalWidth * s
      const h = img.naturalHeight * s
      ctx.globalAlpha = alpha
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const f = current * (FRAME_COUNT - 1)
      const i = Math.floor(f)
      const t = f - i
      ctx.globalAlpha = 1
      drawCover(frames[i], 1)
      if (t > 0.001 && i + 1 < FRAME_COUNT) {
        drawCover(frames[i + 1], t)
      }
      ctx.globalAlpha = 1
    }

    const tick = () => {
      const diff = target - current
      if (Math.abs(diff) > 0.0005) {
        current += diff * 0.12
        draw()
      }
      if (alive) raf = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 2 // last screen is reserved for the mountain cover
      if (total <= 0) return
      const p = clamp(-rect.top / total, 0, 1)
      target = p

      // Calculate which day should be active based on scroll progress
      const dayIdx = Math.min(
        totalDays - 1,
        Math.floor(p * totalDays)
      )
      setActiveDayIndex(dayIdx)
    }

    // Preload BGIMAGES frames
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameUrl(i)
      img.onload = () => {
        if (i === 0) draw()
      }
      frames.push(img)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    resize()
    onScroll()
    tick()

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [totalDays])

  const activeDay = days[activeDayIndex] || days[0] || {}

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-[500vh] sm:h-[580vh] -mt-32 sm:-mt-44 -mb-[95vh] z-20"
    >
      {/* Sticky full-screen stage with alpha mask fade to physically erase the hard top edge */}
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-transparent"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 10%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,1) 26%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 10%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,1) 26%)',
        }}
      >
        
        {/* Dynamic Scrubbed Canvas Background - Crystal Clear */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Minimal soft gradient just behind the text card to keep the background scenery 100% visible and vivid */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Main Stage Container */}
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col justify-between pt-24 pb-10 sm:pt-32 sm:pb-14">
          
          {/* Top Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-white backdrop-blur-md border border-white/20 mb-3">
                <Compass size={13} className="text-[#E8A317]" />
                Day-by-Day Expedition
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
                Kedarkantha Trek Itinerary
              </h2>
            </div>

            {/* Step Counter Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
              <span className="text-xs uppercase font-semibold text-white/70 tracking-wider">Progress</span>
              <div className="flex items-center gap-1.5 font-display text-xl font-bold text-white">
                <span className="text-[#E8A317]">0{activeDayIndex + 1}</span>
                <span className="text-white/40">/</span>
                <span>0{totalDays}</span>
              </div>
            </div>
          </div>

          {/* Middle Layout: Vertical Step Timeline on left + Active Day Content Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center my-auto">
            
            {/* Left Column: Vertical Waypoint Indicators */}
            <div className="hidden md:flex md:col-span-4 flex-col space-y-3.5">
              <div className="text-xs font-bold uppercase tracking-widest text-[#E8A317] mb-2 flex items-center gap-2">
                <Footprints size={14} />
                Summit Route Steps
              </div>

              {days.map((d, idx) => {
                const isActive = activeDayIndex === idx
                return (
                  <div
                    key={d.day}
                    className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-white/15 backdrop-blur-md border border-white/30 translate-x-2 shadow-lg'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#E8A317] text-forest font-extrabold shadow-md scale-110'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      D{d.day}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-white/80'}`}>
                        {d.title}
                      </p>
                      <p className="text-[11px] text-white/60 truncate">
                        {d.meta}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight size={16} className="text-[#E8A317] animate-pulse shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Right Column: Active Step Animated Text Card (Clean, focused card with crystal clear background) */}
            <div className="md:col-span-8">
              <div
                key={activeDayIndex}
                className="relative bg-black/60 backdrop-blur-xl border border-white/20 p-6 sm:p-10 rounded-3xl shadow-2xl animate-fade-in transition-all duration-300"
              >
                {/* Day Badge & Meta info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-xl bg-[#E8A317] text-forest font-display font-extrabold text-sm sm:text-base tracking-wide shadow-md">
                      DAY {activeDay.day}
                    </span>
                    <span className="text-white/85 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#E8A317]" />
                      {activeDay.meta}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-white/90 bg-white/15 px-3 py-1 rounded-full border border-white/20">
                    <Mountain size={13} className="text-[#E8A317]" />
                    Elevation Trail
                  </div>
                </div>

                {/* Day Title */}
                <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-5 leading-tight">
                  {activeDay.title}
                </h3>

                {/* Detailed Day Narrative Text */}
                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-normal">
                  {activeDay.text}
                </p>

                {/* Bottom interactive step dots indicator for mobile */}
                <div className="flex md:hidden items-center justify-center gap-2 mt-6 pt-4 border-t border-white/15">
                  {days.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeDayIndex === i ? 'w-6 bg-[#E8A317]' : 'w-2 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Scroll Prompt Bar */}
          <div className="flex items-center justify-between text-xs text-white/70 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E8A317] animate-ping" />
              <span>Scroll to scrub frames & advance route</span>
            </div>
            <span className="hidden sm:inline">Frames auto-sync with expedition path</span>
          </div>

        </div>

      </div>
      <MountainCover />
    </div>
  )
}
