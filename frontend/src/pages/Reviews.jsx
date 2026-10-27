import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import AsyncView from '../components/ui/AsyncView'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getReviews } from '../features/reviews/api'

export default function Reviews({ embedded = false }) {
  useSeo({
    enabled: !embedded,
    title: 'Reviews & Testimonials',
    description: 'Rated 4.9/5 by 500+ trekkers. Trusted by travelers who return to Kedarkantha.',
  })

  const state = useAsync(getReviews)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [slideDir, setSlideDir] = useState('next')

  const changeSlide = (dir, total) => {
    if (animating || total <= 1) return
    setAnimating(true)
    setSlideDir(dir)
    if (dir === 'next') {
      setCurrentIdx((prev) => (prev + 1) % total)
    } else {
      setCurrentIdx((prev) => (prev - 1 + total) % total)
    }
    setTimeout(() => setAnimating(false), 500)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') changeSlide('prev', state.data?.items?.length || 4)
      if (e.key === 'ArrowRight') changeSlide('next', state.data?.items?.length || 4)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [animating, state.data])

  return (
    <>
      {!embedded && (
        <PageHero
          title="Trekker Stories & Reviews"
          subtitle="Real experiences from people who stood on the Kedarkantha summit."
          focus="60% 40%"
        />
      )}

      {/* 
        NATURAL SCROLL SECTION WITH CONTINUOUS / FIXED BACKGROUND:
        - Background stays continuous behind both sections.
        - Testimonial text scrolls normally from bottom to top without overlap or premature hiding.
        - Video section follows right after, scrolling in naturally in full screen from bottom to top.
      */}
      <section className="relative w-full overflow-hidden">
        
        {/* PERSISTENT MOUNTAIN SUNSET BACKGROUND */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: "url('/TESTIMONIAL IMAGE.png')",
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Aesthetic Warm Tone Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F6F2] via-[#F7EBE1]/65 to-[#EEDCCF]/85 mix-blend-normal" />
          <div className="absolute inset-0 bg-[#EFE3D5]/35" />
        </div>

        {/* 1. TESTIMONIAL REVIEW SECTION (Normal Page Scroll) */}
        <div className="container-page relative z-10 mx-auto max-w-5xl px-4 text-center pt-24 sm:pt-36 pb-16 sm:pb-24">
          <AsyncView state={state}>
            {(r) => {
              const items = r.items || []
              const active = items[currentIdx] || items[0]

              return (
                <div className="relative flex flex-col items-center">
                  
                  {/* MAIN TITLE: TRUSTED BY TRAVELERS WHO RETURN */}
                  <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-light uppercase leading-[1.08] tracking-tight text-[#2B1F17]">
                    Trusted by Travelers<br />Who Return
                  </h2>

                  {/* USER AVATAR WITH WHITE BORDER ELEVATION */}
                  <div className="mt-8 sm:mt-12 relative">
                    <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 overflow-hidden rounded-xl border-[2.5px] border-white shadow-2xl transition-transform duration-500 hover:scale-105">
                      <img
                        src={active.avatar || '/TESTIMONIAL IMAGE.png'}
                        alt={active.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>

                  {/* AUTHOR NAME & BADGE */}
                  <div className="mt-5 text-center">
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.08em] text-[#2B1F17]">
                      {active.name}
                    </h3>
                    <p className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#554032]">
                      {active.role || 'GREAT EXPERIENCE!'}
                    </p>
                  </div>

                  {/* NAVIGATION ARROW BUTTONS (LEFT & RIGHT) */}
                  <div className="pointer-events-none absolute inset-x-0 top-[56%] sm:top-[54%] flex -translate-y-1/2 justify-between px-1 sm:px-4 md:px-8">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => changeSlide('prev', items.length)}
                      aria-label="Previous Testimonial"
                      className="pointer-events-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-[#554032]/30 bg-white/70 text-[#2B1F17] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#2B1F17] hover:bg-white active:scale-95 shadow-md cursor-pointer"
                    >
                      <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => changeSlide('next', items.length)}
                      aria-label="Next Testimonial"
                      className="pointer-events-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-[#554032]/30 bg-white/70 text-[#2B1F17] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#2B1F17] hover:bg-white active:scale-95 shadow-md cursor-pointer"
                    >
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>

                  {/* TESTIMONIAL QUOTE PARAGRAPH */}
                  <div className="relative mt-8 sm:mt-10 max-w-4xl px-4 sm:px-12">
                    <div
                      key={currentIdx}
                      className={`transition-all duration-500 ease-out ${
                        animating
                          ? slideDir === 'next'
                            ? 'translate-x-6 opacity-0'
                            : '-translate-x-6 opacity-0'
                          : 'translate-x-0 opacity-100'
                      }`}
                    >
                      <p className="font-display text-lg sm:text-2xl md:text-[1.75rem] font-normal italic leading-relaxed sm:leading-[1.7] text-[#1E140E] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                        "{active.text}"
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM PAGINATION INDICATOR DOTS */}
                  <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2.5">
                    {items.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (currentIdx !== idx && !animating) {
                            setSlideDir(idx > currentIdx ? 'next' : 'prev')
                            setAnimating(true)
                            setCurrentIdx(idx)
                            setTimeout(() => setAnimating(false), 500)
                          }
                        }}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                          currentIdx === idx
                            ? 'w-8 bg-[#2B1F17]'
                            : 'w-2 bg-[#554032]/30 hover:bg-[#554032]/60'
                        }`}
                      />
                    ))}
                  </div>

                </div>
              )
            }}
          </AsyncView>
        </div>

        {/* 
          2. FULL-SCREEN VIDEO TESTIMONIALS SECTION 
          - Normal flow, no overlap.
          - Scrolls smoothly from bottom to top after the text.
          - Full-screen edge-to-edge layout directly on the background.
        */}
        <div className="relative z-10 w-full pt-10 pb-28 sm:pb-36 px-4 sm:px-8 md:px-12">
          <FullScreenVideoTestimonialsRow />
        </div>

      </section>
    </>
  )
}

function FullScreenVideoTestimonialsRow() {
  const videos = [
    {
      id: 1,
      title: 'Summit Sunrise Celebration',
      author: 'Rohit & Team',
      date: 'Kedarkantha Summit 12,500 ft',
      src: '/WhatsApp Video 2026-10-26 at 5.19.53 PM.mp4',
    },
    {
      id: 2,
      title: 'Snow Trail Expedition',
      author: 'Priya Sharma',
      date: 'Juda Ka Talab Campsite',
      src: '/WhatsApp Video 2026-10-26 at 5.19.53 PM.mp4',
    },
    {
      id: 3,
      title: 'Campfire Stories & Vibes',
      author: 'Aditya & Friends',
      date: 'Base Camp Winter Night',
      src: '/WhatsApp Video 2026-10-26 at 5.19.53 PM.mp4',
    },
    {
      id: 4,
      title: 'First Time Snow Trekker',
      author: 'Ananya Verma',
      date: 'Sankri Base Experience',
      src: '/WhatsApp Video 2026-10-26 at 5.19.53 PM.mp4',
    },
    {
      id: 5,
      title: 'Kedarkantha Winter Ridge',
      author: 'Karan Mehra',
      date: 'Ridge Ascent 11,800 ft',
      src: '/WhatsApp Video 2026-10-26 at 5.19.53 PM.mp4',
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col justify-center text-left">
      
      {/* Full-width header directly floating on the background */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 px-2 sm:px-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#2B1F17]/10 text-[#2B1F17] mb-3 border border-[#2B1F17]/15 backdrop-blur-sm">
            <Sparkles size={13} className="text-[#C2822B]" />
            Live Trekker Chronicles
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-light uppercase tracking-tight text-[#2B1F17]">
            Watch Real Trekker Experiences
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#554032] max-w-sm sm:text-right font-medium leading-relaxed">
          Unfiltered moments, summit highs, and frozen trail adventures captured live by our trekkers.
        </p>
      </div>

      {/* Full-screen horizontal reel cards floating freely on background */}
      <div className="no-scrollbar flex gap-3.5 sm:gap-5 overflow-x-auto pb-4 pt-1 px-2 sm:px-4 scroll-smooth snap-x snap-mandatory">
        {videos.map((v, i) => (
          <div
            key={i}
            className="group relative flex-none w-[170px] sm:w-[200px] md:w-[220px] aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(43,31,23,0.25)] border-2 border-white bg-black snap-start transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_45px_rgba(43,31,23,0.35)] cursor-pointer"
          >
            {/* Native Video Element */}
            <video
              src={v.src}
              playsInline
              autoPlay
              loop
              muted
              className="h-full w-full object-cover"
            />

            {/* Subtle top shadow */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 via-black/25 to-transparent pointer-events-none" />

            {/* Bottom info banner */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none text-white">
              <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider bg-[#E8A317] text-black mb-1 shadow">
                TREKKER REEL
              </span>
              <p className="font-display text-xs sm:text-sm font-medium leading-snug drop-shadow-md line-clamp-1 text-white">
                {v.title}
              </p>
              <p className="text-[10px] sm:text-[11px] text-white/80 font-medium mt-0.5 truncate">
                {v.author} • <span className="text-white/60">{v.date}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
