import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
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
          embedded={false}
          title="Reviews & Testimonials"
          subtitle="Trusted by travelers who return."
          focus="60% 40%"
        />
      )}

      {/* FULL-WIDTH HERO TESTIMONIAL SECTION MATCHING USER'S SCREENSHOT */}
      <section
        className="relative w-full overflow-hidden py-16 sm:py-24 md:py-32 -mt-10 sm:-mt-16 pt-24 sm:pt-32"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 12%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 12%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 100%)',
        }}
      >
        {/* Scenic Himalayan Sunset Background with Soft Warm Haze */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/TESTIMONIAL IMAGE.png"
            alt="Kedarkantha Sunset Mountain Background"
            className="h-full w-full object-cover object-center filter saturate-[1.1] brightness-[1.03]"
          />
          {/* Seamless top melt to blend with FAQ section background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F6F2] via-[#F7EBE1]/60 to-[#EEDCCF]/80 mix-blend-normal" />
          <div className="absolute inset-0 bg-[#EFE3D5]/35" />
        </div>

        <div className="container-page relative z-10 mx-auto max-w-5xl px-4 text-center">
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
                      className="pointer-events-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-[#554032]/30 bg-white/60 text-[#2B1F17] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#2B1F17] hover:bg-white active:scale-95 shadow-md"
                    >
                      <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => changeSlide('next', items.length)}
                      aria-label="Next Testimonial"
                      className="pointer-events-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-[#554032]/30 bg-white/60 text-[#2B1F17] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#2B1F17] hover:bg-white active:scale-95 shadow-md"
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
                        className={`h-2 transition-all duration-300 rounded-full ${
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
      </section>
    </>
  )
}
