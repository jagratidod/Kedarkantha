import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react'

/**
 * FaqPhoneShowcase Component
 *
 * Design matches the user's reference mockup:
 * - Left side: Realistic smartphone mockup with warm golden accent border, deep forest green screen,
 *   header with FAQ title, live animated preview/counter, and selected question highlight card protruding from the left side!
 * - Right side: FAQs list with theme styling, clean cards, expandable animations, and interactive selection.
 */
export default function FaqPhoneShowcase({ faqs = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [openIndexes, setOpenIndexes] = useState({ 0: true })

  const toggleAccordion = (idx) => {
    setSelectedIndex(idx)
    setOpenIndexes((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  const currentFaq = faqs[selectedIndex] || faqs[0]

  return (
    <div className="w-full py-12 lg:py-16">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-forest/10 text-forest mb-4 border border-forest/15">
            <HelpCircle size={14} className="text-cta" />
            Frequently Asked Questions
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-forest">
            Got Questions? We've Got Answers.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            Everything you need to know about weather, safety, preparation, and summit day on the Kedarkantha winter trek.
          </p>
        </div>

        {/* 2-Column Showcase: Left Phone (Mockup) + Right FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* ================= LEFT SIDE: STICKY PHONE MOCKUP (THEMED UI) ================= */}
          <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-28">
            <div className="relative w-[280px] sm:w-[320px] md:w-[340px]">
              
              {/* Outer Golden Glow & Shadow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#E8A317]/25 via-forest/20 to-cta/20 rounded-[52px] blur-xl opacity-70 -z-10" />

              {/* Protruding Notification / Focus Card (Matching user screenshot: white rounded card popping out of phone edge) */}
              <div className="hidden sm:block absolute -left-10 md:-left-14 top-28 z-30 w-36 md:w-44 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-line animate-fade-in transition-all duration-300">
                <div className="flex items-center gap-2 text-forest text-xs font-bold mb-1">
                  <Sparkles size={13} className="text-[#E8A317]" />
                  <span>Topic {selectedIndex + 1}/{faqs.length}</span>
                </div>
                <p className="text-[11px] font-semibold text-ink line-clamp-2 leading-tight">
                  {currentFaq?.q}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-muted font-medium">
                  <CheckCircle2 size={11} className="text-cta" /> Verified Answer
                </div>
              </div>

              {/* Realistic Smartphone Shell (Yellow/Gold border with deep forest background) */}
              <div className="relative w-full aspect-[9/18.5] rounded-[48px] p-3 sm:p-3.5 border-4 sm:border-[4.5px] border-[#E8A317] shadow-[0_25px_60px_-15px_rgba(23,61,42,0.35)] bg-gradient-to-b from-[#0e271a] via-[#112f20] to-[#0a1c13] overflow-hidden flex flex-col text-white">
                
                {/* Speaker Ear-piece & Dynamic Notch / Camera */}
                <div className="relative w-full flex justify-center pt-1 pb-2 shrink-0">
                  <div className="h-4 w-28 bg-[#0a1c13] rounded-full border border-[#E8A317]/50 flex items-center justify-center gap-2 px-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#E8A317]" />
                    <div className="h-1 w-10 rounded-full bg-[#E8A317]/30" />
                  </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between px-4 py-1 text-[10px] text-[#E8A317]/80 font-semibold tracking-wider uppercase shrink-0">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <div className="h-2 w-4 border border-[#E8A317] rounded-sm flex items-center p-0.5">
                      <div className="h-full w-full bg-[#E8A317] rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Phone Header - "FAQ" matching reference screenshot */}
                <div className="pt-4 pb-3 text-center shrink-0 border-b border-[#E8A317]/20">
                  <div className="inline-flex items-center justify-center p-2 rounded-full bg-[#E8A317]/10 mb-1 border border-[#E8A317]/25">
                    <MessageSquare size={16} className="text-[#E8A317]" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold tracking-widest text-[#E8A317] uppercase">
                    FAQ
                  </h3>
                  <p className="text-[11px] text-white/70 tracking-wide">
                    Himalayan Trek Assistance
                  </p>
                </div>

                {/* Phone Screen Live Content (Interactive display of active FAQ) */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 custom-scrollbar text-left">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#E8A317] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E8A317] animate-ping" />
                    Selected Question
                  </div>

                  {/* Active Question in Phone Screen */}
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#E8A317]/30 transition-all duration-300">
                    <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                      {currentFaq?.q}
                    </p>
                  </div>

                  {/* Active Answer in Phone Screen */}
                  <div className="p-3.5 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 transition-all duration-300">
                    <div className="text-[10px] uppercase font-bold text-cta mb-1 flex items-center gap-1">
                      <span>✓ Guide Answer</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-white/90 leading-relaxed font-light">
                      {currentFaq?.a}
                    </p>
                  </div>

                  {/* Quick Assistance Pill */}
                  <div className="mt-4 p-3 rounded-xl bg-[#E8A317]/10 border border-[#E8A317]/20 text-center">
                    <p className="text-[11px] font-medium text-[#E8A317]">
                      Need more clarity?
                    </p>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      Talk to our trip coordinators 24/7
                    </p>
                  </div>
                </div>

                {/* Bottom Home Indicator Bar */}
                <div className="py-2 flex justify-center shrink-0">
                  <div className="h-1 w-28 bg-[#E8A317]/60 rounded-full" />
                </div>

              </div>

            </div>
          </div>

          {/* ================= RIGHT SIDE: FAQS ACCORDION LIST WITH ANIMATION ================= */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((f, idx) => {
              const isOpen = !!openIndexes[idx]
              const isSelected = selectedIndex === idx

              return (
                <div
                  key={f.q}
                  onClick={() => setSelectedIndex(idx)}
                  className={`group rounded-2xl transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'bg-white shadow-[0_10px_30px_rgba(23,61,42,0.1)] border-2 border-forest/30 ring-2 ring-forest/10 scale-[1.01]'
                      : 'bg-white/80 hover:bg-white shadow-sm hover:shadow-md border border-line/80'
                  }`}
                >
                  {/* Accordion Question Header */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleAccordion(idx)
                    }}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-forest text-white shadow-sm'
                            : 'bg-sage/70 text-forest group-hover:bg-forest/15'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span
                        className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
                          isSelected ? 'text-forest' : 'text-ink group-hover:text-forest'
                        }`}
                      >
                        {f.q}
                      </span>
                    </div>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen ? 'bg-forest text-white rotate-180' : 'bg-offwhite text-muted group-hover:text-forest'
                      }`}
                    >
                      <ChevronDown size={17} />
                    </div>
                  </button>

                  {/* Animated Accordion Answer Panel */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1 text-sm sm:text-base leading-relaxed text-muted border-t border-line/40 mt-1">
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
