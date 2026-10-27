import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, HeartPulse, Footprints, Mountain, Sprout, Users, RotateCcw } from 'lucide-react'
import Button from '../ui/Button'

/*
 * "Are you ready for Kedarkantha?" quiz. One question at a time; the user picks an answer, the card slides
 * out to the left and the next one slides in. Each answer is worth 0-3 points; the total decides the verdict.
 * `info` is the trek's difficulty data (level, score, fitness list) shown with the result.
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
  const [step, setStep] = useState(0) // 0..n-1 questions, n = result
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
    }, 280)
  }

  const pick = (i) => {
    if (leaving) return
    setAnswers((a) => ({ ...a, [q.id]: { i, pts: q.options[i].pts } }))
    clearTimeout(timer.current)
    // brief pause so the chosen option visibly lights up, then move on
    timer.current = setTimeout(() => go(step + 1, 1), 380)
  }

  const reset = () => { setAnswers({}); go(0, -1) }
  const v = done ? verdict(total) : null
  const Icon = q?.icon

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Progress */}
      <div className="mb-5 flex items-center gap-3" aria-hidden={done}>
        <div className="flex flex-1 gap-1.5">
          {QUESTIONS.map((_, i) => (
            <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-forest/15">
              <span className="block h-full origin-left bg-forest transition-transform duration-500" style={{ transform: `scaleX(${i < step || done ? 1 : i === step ? 0.35 : 0})` }} />
            </span>
          ))}
        </div>
        <span className="text-xs font-semibold tabular-nums text-forest/70">{done ? n : step + 1} / {n}</span>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-pop ring-1 ring-forest/10">
        <div
          key={step}
          className="fq-card p-6 sm:p-9"
          data-state={leaving ? 'out' : 'in'}
          style={{ '--dx': `${dir * 56}px` }}
        >
          {!done ? (
            <>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-forest"><Icon size={22} aria-hidden="true" /></span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-forest/60">Question {step + 1}</p>
              </div>
              <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{q.q}</h3>
              <p className="mt-2 text-sm text-muted">{q.hint}</p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={q.q}>
                {q.options.map((o, i) => {
                  const on = answers[q.id]?.i === i
                  return (
                    <li key={o.label} className="fq-opt" style={{ '--i': i }}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => pick(i)}
                        className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${on ? 'border-forest bg-forest text-white shadow-lg' : 'border-line bg-offwhite hover:-translate-y-0.5 hover:border-cta hover:bg-sage'}`}
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${on ? 'border-white bg-white text-forest' : 'border-forest/30 text-forest/70 group-hover:border-cta'}`}>
                          {on ? <Check size={15} aria-hidden="true" /> : String.fromCharCode(65 + i)}
                        </span>
                        <span>
                          <span className="block text-[15px] font-semibold leading-snug">{o.label}</span>
                          {o.note && <span className={`block text-xs ${on ? 'text-white/80' : 'text-muted'}`}>{o.note}</span>}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => go(step - 1, -1)}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition-opacity disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowLeft size={16} aria-hidden="true" /> Back
                </button>
                {answers[q.id] && (
                  <button type="button" onClick={() => go(step + 1, 1)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                    Next <ArrowRight size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-forest/60">{v.tag}</p>
              <h3 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{v.title}</h3>

              {/* Meter */}
              <div className="mx-auto mt-6 max-w-sm">
                <div className="flex items-end justify-center gap-1.5" role="img" aria-label={`Readiness ${Math.round((total / MAX) * 100)} percent`}>
                  {[1, 2, 3, 4, 5].map((k) => (
                    <span
                      key={k}
                      className={`fq-bar w-9 rounded-sm ${k <= Math.max(1, Math.round((total / MAX) * 5)) ? 'bg-cta' : 'bg-sage'}`}
                      style={{ height: 14 + k * 11, '--i': k }}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm font-semibold text-forest">{Math.round((total / MAX) * 100)}% ready</p>
              </div>

              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">{v.text}</p>

              <div className="mx-auto mt-6 grid max-w-xl gap-2 text-left sm:grid-cols-2">
                <div className="rounded-2xl bg-sage p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-forest/60">Trek difficulty</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-forest">{info.level}</p>
                </div>
                <ul className="space-y-1.5 rounded-2xl bg-offwhite p-4 text-[13px] text-muted">
                  {info.fitness.map((t) => (
                    <li key={t} className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-cta" aria-hidden="true" />{t}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button to="/book" size="lg">Book Your Trek</Button>
                <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-forest ring-1 ring-forest/25 transition-colors hover:bg-sage">
                  <RotateCcw size={15} aria-hidden="true" /> Retake quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
