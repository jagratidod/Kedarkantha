import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, HeartPulse, Footprints, Mountain, Sprout, Users, RotateCcw, BookOpen, Bookmark, Sparkles } from 'lucide-react'
import Button from '../ui/Button'

/*
 * "Are you ready for Kedarkantha?" quiz.
 * Designed with an authentic open-book spread layout:
 * - Left Page: Question number, Icon, Title, and Hint/Context.
 * - Center Spine: Book seam, realistic crease/shadows, and ribbon bookmark.
 * - Right Page: Choice Options (A, B, C, D) and navigation (Back / Next).
 * - Verdict view when complete.
 */

const QUESTIONS = [
  {
    id: 'walk',
    icon: Footprints,
    q: 'How long can you walk comfortably in one go?',
    hint: 'Think of a normal day, on flat ground, at your own pace.',
    options: [
      { label: 'Under 30 minutes', note: 'I get tired quickly', pts: 0 },
      { label: '1 to 2 hours', note: 'A long walk is fine', pts: 1 },
      { label: '3 to 4 hours', note: 'I enjoy long walks', pts: 2 },
      { label: '5 hours or more', note: 'Walking all day is easy', pts: 3 },
    ],
  },
  {
    id: 'cardio',
    icon: HeartPulse,
    q: 'How often do you exercise or play a sport?',
    hint: 'Running, cycling, gym, swimming, football: anything that raises your heart rate.',
    options: [
      { label: 'Almost never', note: 'Rarely', pts: 0 },
      { label: 'Once a week', note: 'Now and then', pts: 1 },
      { label: '2 to 3 times a week', note: 'Fairly regular', pts: 2 },
      { label: '4 or more times a week', note: 'It is part of my routine', pts: 3 },
    ],
  },
  {
    id: 'stairs',
    icon: Mountain,
    q: 'How do you feel after climbing five floors of stairs?',
    hint: 'No lift, no stopping.',
    options: [
      { label: 'Out of breath, need a long rest', note: '', pts: 0 },
      { label: 'Breathing hard, recover in a few minutes', note: '', pts: 1 },
      { label: 'A little puffed, fine right away', note: '', pts: 2 },
      { label: 'Barely notice it', note: '', pts: 3 },
    ],
  },
  {
    id: 'experience',
    icon: Sprout,
    q: 'Have you trekked or hiked before?',
    hint: 'This trek needs no experience, so any answer is a good one.',
    options: [
      { label: 'Never', note: 'This would be my first', pts: 1 },
      { label: 'A day hike or two', note: 'Short trails', pts: 2 },
      { label: 'A multi-day trek', note: 'I know the routine', pts: 3 },
      { label: 'A high-altitude trek', note: 'Above 10,000 ft', pts: 3 },
    ],
  },
  {
    id: 'age',
    icon: Users,
    q: 'Which age group are you in?',
    hint: 'We recommend 12 to 55 years. Outside it, please talk to us before booking.',
    options: [
      { label: 'Under 12', note: 'Please contact us first', pts: 0 },
      { label: '12 to 55', note: 'Recommended range', pts: 3 },
      { label: 'Over 55', note: 'Please consult your doctor', pts: 1 },
    ],
  },
]

const MAX = QUESTIONS.reduce((n, q) => n + Math.max(...q.options.map((o) => o.pts)), 0)

function verdict(total) {
  const pct = total / MAX
  if (pct >= 0.75) return { tag: 'You are ready', title: 'Pack your bags.', text: 'Your fitness is well above what Kedarkantha asks for. Enjoy the summit sunrise.', tone: 3 }
  if (pct >= 0.5) return { tag: 'Almost there', title: 'Ready with a little prep.', text: 'Walk 30 to 45 minutes a day for two or three weeks before the trek and you will be comfortable.', tone: 2 }
  return { tag: 'Start building up', title: 'A few weeks of training first.', text: 'Begin with daily walks and stair climbing, then book a later date. The trek will be far more fun.', tone: 1 }
}

export default function FitnessQuiz({ info }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [dir, setDir] = useState(1)
  const [leaving, setLeaving] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const n = QUESTIONS.length
  const done = step >= n
  const q = QUESTIONS[step]
  const total = Object.values(answers).reduce((s, v) => s + v.pts, 0)

  const go = (to, d) => {
    if (leaving) return
    setDir(d)
    setLeaving(true)
    timer.current = setTimeout(() => {
      setStep(to)
      setLeaving(false)
    }, 480)
  }

  const pick = (i) => {
    if (leaving) return
    setAnswers((a) => ({ ...a, [q.id]: { i, pts: q.options[i].pts } }))
    clearTimeout(timer.current)
    timer.current = setTimeout(() => go(step + 1, 1), 380)
  }

  const reset = () => { setAnswers({}); go(0, -1) }
  const v = done ? verdict(total) : null
  const Icon = q?.icon

  return (
    <div className="mx-auto w-full max-w-4xl book-spread-container">
      {/* Top Header & Page Number Tracker */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm" aria-hidden={done}>
        <div className="flex items-center gap-2 text-[#7EB5D6]">
          <BookOpen size={18} className="text-[#4F87A8]" />
          <span className="font-semibold tracking-wider uppercase text-xs">Trek Readiness Logbook</span>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="flex w-32 sm:w-48 gap-1.5">
            {QUESTIONS.map((_, i) => (
              <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-forest/20">
                <span
                  className="block h-full origin-left bg-forest transition-transform duration-500"
                  style={{ transform: `scaleX(${i < step || done ? 1 : i === step ? 0.35 : 0})` }}
                />
              </span>
            ))}
          </div>
          <span className="text-xs font-semibold tabular-nums text-forest/80">
            {done ? `Page ${n * 2} of ${n * 2}` : `Chapter ${step + 1} / ${n}`}
          </span>
        </div>
      </div>

      {/* Book Container with Outer Hardcover styling */}
      <div className="book-outer relative rounded-3xl p-3 sm:p-4.5 shadow-2xl">
        {/* Bookmark ribbon hanging from top */}
        {!done && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center pointer-events-none">
            <div className="w-4 h-8 bg-gradient-to-b from-sky-400 to-[#3B82A6] rounded-t-sm shadow-md" />
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#3B82A6]" />
          </div>
        )}

        {/* Pages inner wrapper */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0D2031] ring-1 ring-white/10 shadow-inner">
          <div
            key={step}
            className={`${leaving ? 'BOOK_OUT' : 'BOOK_IN'}`}
          >
            {!done ? (
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[460px] relative">
                {/* Center Book Spine Separator for Desktop */}
                <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 z-10 pointer-events-none">
                  <div className="h-full w-full bg-gradient-to-r from-black/40 via-black/10 to-black/40 border-x border-white/5 shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]" />
                </div>

                {/* LEFT SIDE: Question Chapter Page */}
                <div className="book-page-left p-6 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative">
                  <div>
                    {/* Page Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F4663] text-[#7EB5D6] shadow-sm">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#7EB5D6]">Section {step + 1}</p>
                          <p className="text-xs text-[#8FAEC5]/80 font-medium">Self-Assessment</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#8FAEC5]/60 bg-white/5 px-2.5 py-1 rounded-full">
                        Page {step * 2 + 1}
                      </span>
                    </div>

                    {/* Question text */}
                    <div className="mt-2 space-y-3">
                      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-[#1F4663]/60 text-[#7EB5D6] border border-[#7EB5D6]/20">
                        QUESTION #{step + 1}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug text-white">
                        {q.q}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#8FAEC5] pt-1">
                        {q.hint}
                      </p>
                    </div>
                  </div>

                  {/* Left page footer */}
                  <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#8FAEC5]/70">
                    <button
                      type="button"
                      onClick={() => go(step - 1, -1)}
                      disabled={step === 0}
                      className="inline-flex items-center gap-1.5 font-semibold text-[#7EB5D6] transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowLeft size={15} aria-hidden="true" /> Previous Page
                    </button>
                    <span className="italic font-serif hidden sm:inline">Kedarkantha Expedition Guide</span>
                  </div>
                </div>

                {/* RIGHT SIDE: Options Page */}
                <div className="book-page-right p-6 sm:p-10 flex flex-col justify-between relative">
                  <div>
                    {/* Page Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                      <div className="flex items-center gap-1.5 text-xs text-[#7EB5D6]">
                        <Sparkles size={14} className="text-[#7EB5D6]" />
                        <span className="font-semibold uppercase tracking-wider text-[10px]">Select Your Answer</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8FAEC5]/60 bg-white/5 px-2.5 py-1 rounded-full">
                        Page {step * 2 + 2}
                      </span>
                    </div>

                    {/* Choices list */}
                    <ul className="space-y-3" role="radiogroup" aria-label={q.q}>
                      {q.options.map((o, i) => {
                        const on = answers[q.id]?.i === i
                        return (
                          <li key={o.label} className="fq-opt" style={{ '--i': i }}>
                            <button
                              type="button"
                              role="radio"
                              aria-checked={on}
                              onClick={() => pick(i)}
                              className={`group flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                                on
                                  ? 'border-[#4F87A8] bg-[#1F4663] text-white shadow-md ring-2 ring-[#7EB5D6]/30'
                                  : 'border-white/10 bg-[#0E2233]/80 text-white hover:border-[#4F87A8]/70 hover:bg-[#16334D]'
                              }`}
                            >
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${
                                  on
                                    ? 'border-white bg-white text-[#0E2233]'
                                    : 'border-white/15 bg-white/5 text-[#7EB5D6] group-hover:border-[#4F87A8]'
                                }`}
                              >
                                {on ? <Check size={16} aria-hidden="true" /> : String.fromCharCode(65 + i)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <span className="block text-sm sm:text-[15px] font-semibold leading-snug">{o.label}</span>
                                {o.note && (
                                  <span className={`block text-xs mt-0.5 ${on ? 'text-white/85' : 'text-[#8FAEC5]'}`}>
                                    {o.note}
                                  </span>
                                )}
                              </div>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* Right page footer */}
                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[#8FAEC5]/70 italic">Pick an option to flip page</span>
                    {answers[q.id] ? (
                      <button
                        type="button"
                        onClick={() => go(step + 1, 1)}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#7EB5D6] hover:text-white transition-colors"
                      >
                        Next Page <ArrowRight size={15} aria-hidden="true" />
                      </button>
                    ) : (
                      <span className="text-[#8FAEC5]/40 text-xs flex items-center gap-1">
                        Select one <ArrowRight size={13} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* RESULT VIEW - Formatted as an Expedition Certificate / Final Log */
              <div className="p-8 sm:p-12 text-center text-white bg-gradient-to-b from-[#132A3E] to-[#0E2233]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F4663] text-[#7EB5D6] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                  <Bookmark size={14} /> Final Assessment Log
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7EB5D6]">{v.tag}</p>
                <h3 className="mt-2 font-display text-3xl sm:text-5xl font-semibold leading-tight text-white">{v.title}</h3>

                {/* Readiness Meter */}
                <div className="mx-auto mt-6 max-w-sm">
                  <div className="flex items-end justify-center gap-2" role="img" aria-label={`Readiness ${Math.round((total / MAX) * 100)} percent`}>
                    {[1, 2, 3, 4, 5].map((k) => (
                      <span
                        key={k}
                        className={`fq-bar w-10 rounded-sm ${k <= Math.max(1, Math.round((total / MAX) * 5)) ? 'bg-[#4F87A8]' : 'bg-white/10'}`}
                        style={{ height: 14 + k * 12, '--i': k }}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#7EB5D6]">{Math.round((total / MAX) * 100)}% Trek Ready</p>
                </div>

                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#8FAEC5]">{v.text}</p>

                <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#091724]/70 border border-white/10 p-4.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#7EB5D6]">Trek difficulty</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-white">{info.level}</p>
                  </div>
                  <ul className="space-y-1.5 rounded-2xl bg-[#091724]/70 border border-white/10 p-4.5 text-[13px] text-[#8FAEC5]">
                    {info.fitness.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 shrink-0 text-[#4F87A8]" aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button to="/book" variant="cta" size="lg">Book Your Trek</Button>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
                  >
                    <RotateCcw size={15} aria-hidden="true" /> Reopen Book
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
