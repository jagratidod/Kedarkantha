import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, Compass, Sparkles } from 'lucide-react'
import Img from '../ui/Img'
import Button from '../ui/Button'

/**
 * Foxico Travel UI - Automatic Slide Animation with Synchronized Headline, Subtitle, & Description
 * - AUTO-SLIDE: Automatically advances every 4 seconds.
 * - PARALLEL SYNC: As the slide auto-changes, the left giant heading, subtitle, description, tag, and active card all animate synchronously.
 * - INTERACTIVE: Clicking any right card or arrow button instantly shifts the focus.
 * - SMOOTH TRANSITIONS: High-end slide and fade animations with progress bar indicator.
 */
export default function TrekHighlightsCinematic({ highlights = [] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [bookmarked, setBookmarked] = useState({})
  const items = highlights.length > 0 ? highlights : []
  const activeItem = items[activeIdx] || items[0]
  const cardRailRef = useRef(null)
  const cardRefs = useRef([])

  // Automatic slide animation every 4 seconds (uninterrupted auto-scroll)
  useEffect(() => {
    if (items.length <= 1) return
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [items.length])

  // Physically auto-scroll the card rail smoothly so the active card is centered every 4s
  useEffect(() => {
    const targetCard = cardRefs.current[activeIdx]
    const rail = cardRailRef.current
    if (targetCard && rail) {
      const railWidth = rail.clientWidth
      const cardOffset = targetCard.offsetLeft
      const cardWidth = targetCard.clientWidth
      // Center the card in the viewport
      const targetScroll = cardOffset - railWidth / 2 + cardWidth / 2
      rail.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      })
    }
  }, [activeIdx])

  const goNext = () => setActiveIdx((prev) => (prev + 1) % items.length)
  const goPrev = () => setActiveIdx((prev) => (prev - 1 + items.length) % items.length)

  const toggleBookmark = (id, e) => {
    e.stopPropagation()
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (!activeItem) return null

  return (
    <section
      id="highlights"
      aria-label="Trek Highlights"
      className="relative w-full overflow-hidden min-h-[620px] sm:min-h-[680px] md:min-h-[740px] flex items-center justify-center py-14 sm:py-20 text-white select-none"
    >
      {/* 1. CINEMATIC BACKGROUND IMAGE with gradient vignette */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/BACKGROUNDIMAGE.png"
          alt="Kedarkantha Sunrise Mountains"
          className="h-full w-full object-cover object-[center_35%] transition-transform duration-1000 ease-out scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45" />
      </div>

      <div className="container-page relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Top Tag & Active Progress Indicator */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>Curated Himalayan Expedition</span>
          </div>

          {/* Animated Auto-Slide Timeline Progress Bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1 w-36 rounded-full bg-white/20 overflow-hidden">
              <div
                key={activeIdx}
                className="h-full bg-amber-400"
                style={{ animation: 'autoProgress 4s linear' }}
              />
            </div>
            <span className="text-[11px] font-mono text-white/70">
              0{activeIdx + 1} / 0{items.length}
            </span>
          </div>
        </div>

        {/* Master 2-Column Grid (Left: Synchronized Story + Vertical Timeline, Right: Cards Deck) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ================= LEFT STORY COLUMN WITH VERTICAL TIMELINE ON ITS RIGHT ================= */}
          <div className="lg:col-span-6 flex items-center justify-between gap-6 sm:gap-8">
            
            {/* Story Text Block */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Synchronized Tag */}
              <div
                key={`tag-${activeIdx}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/15 w-fit transition-all duration-500 animate-in fade-in slide-in-from-left-2"
              >
                <Compass size={13} className="text-amber-400" />
                <span>{activeItem.tag || 'Summit Day'}</span>
              </div>

              {/* GIANT DESTINATION HEADING (Smoothly Animates On Every Slide Change) */}
              <h2
                key={`title-${activeIdx}`}
                className="font-display mt-4 text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white leading-[0.96] drop-shadow-lg transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-3"
              >
                {activeItem.title}
              </h2>

              {/* SYNCHRONIZED SUBTITLE */}
              <p
                key={`sub-${activeIdx}`}
                className="mt-3 text-sm sm:text-base md:text-lg font-medium text-amber-300 tracking-wide transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-2"
              >
                {activeItem.subtitle || activeItem.caption}
              </p>

              {/* SYNCHRONIZED DESCRIPTION PARAGRAPH */}
              <p
                key={`desc-${activeIdx}`}
                className="mt-3.5 text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-lg transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-1 line-clamp-3 sm:line-clamp-4"
              >
                {activeItem.description}
              </p>

              {/* Action Buttons & Progress Dots */}
              <div className="mt-7 sm:mt-9 flex items-center gap-5">
                <Button
                  to="/#itinerary"
                  size="lg"
                  className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium px-7 py-3 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  Explore <ArrowRight size={16} className="ml-1" />
                </Button>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2">
                  {items.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      aria-label={`Jump to highlight ${idx + 1}`}
                      className={`h-2 transition-all duration-500 rounded-full ${
                        activeIdx === idx
                          ? 'w-8 bg-amber-400'
                          : 'w-2 bg-white/35 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* VERTICAL NUMBERED TIMELINE LINE (Positioned directly beside text on the right) */}
            <div className="hidden sm:flex flex-col items-center justify-center shrink-0 relative self-stretch py-2 px-1">
              {/* Continuous vertical track line */}
              <div className="absolute top-4 bottom-4 w-px bg-white/25" />
              
              {/* Waypoint Nodes along the vertical track */}
              <div className="relative z-10 flex flex-col justify-between h-full py-4 gap-6 sm:gap-7">
                {items.map((_, idx) => {
                  const isActive = activeIdx === idx
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      aria-label={`Select destination ${idx + 1}`}
                      className="group/node relative flex items-center justify-center focus:outline-none"
                    >
                      {isActive ? (
                        /* Active Glowing Numbered Bubble */
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-2xl ring-4 ring-white/35 transition-all duration-300 scale-110">
                          <span className="text-[11px] font-bold">{idx + 1}</span>
                        </div>
                      ) : (
                        /* Inactive Waypoint Dot */
                        <div className="h-2 w-2 rounded-full bg-white/50 transition-all duration-300 group-hover/node:scale-150 group-hover/node:bg-white" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* ================= RIGHT CAROUSEL CARDS DECK ================= */}
          <div className="lg:col-span-6 flex flex-col justify-center overflow-hidden">
            
            {/* Horizontal Deck with Physical Auto-Scroll (No scrollbars visible) */}
            <div
              ref={cardRailRef}
              className="relative flex items-center gap-4 sm:gap-5 overflow-x-auto pb-4 pt-3 no-scrollbar scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item, idx) => {
                  const isActive = activeIdx === idx
                  const isSaved = bookmarked[item.id]

                  return (
                    <div
                      key={item.id}
                      ref={(el) => (cardRefs.current[idx] = el)}
                      onClick={() => setActiveIdx(idx)}
                      className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 ease-out ${
                        isActive
                          ? 'w-56 sm:w-64 md:w-72 aspect-[3/4] ring-2 ring-amber-400 shadow-2xl scale-105 z-20'
                          : 'w-44 sm:w-52 md:w-56 aspect-[3/4] opacity-70 hover:opacity-100 hover:scale-100 z-10'
                      }`}
                    >
                      {/* Card Photo */}
                      <div className="absolute inset-0 h-full w-full">
                        <Img
                          image={item.image}
                          focus={item.focus || '50% 50%'}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      </div>

                      {/* Dark gradient backdrop */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                      {/* Bookmark Icon in White Circle */}
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(item.id, e)}
                        aria-label="Bookmark destination"
                        className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110 active:scale-90"
                      >
                        <Bookmark
                          size={15}
                          className={isSaved ? 'fill-blue-600 text-blue-600' : 'text-slate-700'}
                        />
                      </button>

                      {/* Active highlight label pill */}
                      {isActive && (
                        <div className="absolute left-3.5 top-3.5 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-900 shadow">
                          Active
                        </div>
                      )}

                      {/* Card Title & Subtitle Footer */}
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          {item.tag || 'Highlight'}
                        </span>
                        <h4 className="font-display mt-0.5 text-base sm:text-lg font-bold uppercase tracking-wide text-white drop-shadow line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-200/90 line-clamp-1">
                          {item.subtitle || item.caption}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Bottom Controls (Counter & Arrows) */}
              <div className="mt-4 sm:mt-6 flex items-center justify-between px-2">
                <span className="text-xs font-mono tracking-widest text-white/70">
                  0{activeIdx + 1} / 0{items.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous Highlight"
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-white hover:bg-black/70 active:scale-95 shadow-sm"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next Highlight"
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-white hover:bg-black/70 active:scale-95 shadow-sm"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

          </div>

        </div>

      </div>
    </section>
  )
}
