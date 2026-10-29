import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react'

export default function FaqPhoneShowcase({ faqs = [] }) {
  const [openIndexes, setOpenIndexes] = useState({ 0: true })

  const toggleAccordion = (idx) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  return (
    <div className="w-full pt-16 pb-8 sm:pt-20 sm:pb-10 relative bg-transparent">
        <div className="container-page max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/80 text-[#0E3555] mb-4 border border-[#0E3555]/20 backdrop-blur shadow-xs">
            <HelpCircle size={14} className="text-[#4F87A8]" />
            Frequently Asked Questions
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#082138] drop-shadow-sm">
            Got Questions? We've Got Answers.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#1E4567] font-medium">
            Everything you need to know about weather, safety, preparation, and summit day on the Kedarkantha winter trek.
          </p>
        </div>

        {/* Clean Full-Width FAQs Accordion List */}
        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = !!openIndexes[idx]

            return (
              <div
                key={f.q}
                className={`group rounded-2xl transition-all duration-300 overflow-hidden bg-white/90 backdrop-blur-md border border-[#082138]/12 shadow-[0_4px_16px_rgba(0,0,0,0.06)] ${
                  isOpen
                    ? 'border-[#4F87A8]/50 shadow-lg ring-1 ring-[#4F87A8]/30'
                    : 'border-white/10 hover:border-[#4F87A8]/30 hover:shadow'
                }`}
              >
                {/* Accordion Question Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#4F87A8] text-[#082138] shadow-sm'
                          : 'bg-slate-100 text-[#0E3555] group-hover:bg-[#0E283E] group-hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-semibold leading-snug transition-colors ${
                        isOpen ? 'text-[#0284C7]' : 'text-[#082138] group-hover:text-[#0284C7]'
                      }`}
                    >
                      {f.q}
                    </span>
                  </div>

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen ? 'bg-[#4F87A8] text-white rotate-180' : 'bg-slate-100 text-[#082138] group-hover:bg-[#0E283E] group-hover:text-white'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {/* Animated Accordion Answer Panel */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2 text-sm sm:text-base leading-relaxed text-[#1E4567] font-medium leading-relaxed border-t border-slate-200/80">
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Need more help banner at the bottom */}
        <div className="mt-12 p-6 rounded-2xl bg-white/90 border border-[#082138]/15 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-full bg-[#1F4663] text-[#7EB5D6] flex items-center justify-center shrink-0">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#082138]">Still have questions?</p>
              <p className="text-xs text-[#1E4567]">Can't find the answer you're looking for? Talk to our expedition leader.</p>
            </div>
          </div>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-[#1F4663] text-white text-xs sm:text-sm font-semibold hover:bg-[#2A5E85] ring-1 ring-white/20 transition-colors shadow-sm shrink-0"
          >
            Contact Expedition Team
          </a>
        </div>
      </div>
    </div>
  )
}
