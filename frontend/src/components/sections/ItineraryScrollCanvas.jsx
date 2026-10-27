import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, Headphones, Award, Leaf, Sparkles, CheckCircle2 } from 'lucide-react'
import Img from '../ui/Img'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t) => t * t * (3 - 2 * t)

const TREKI_FEATURES = [
  {
    id: 'info',
    badge: 'ABOUT TREKI',
    tagline: 'Authentic Himalayan Journeys',
    title: 'Treki Info & Journey',
    icon: Sparkles,
    highlight: 'Over 8+ Years of Himalayan Excellence',
    desc: 'Founded with a passionate vision to make Himalayan adventures accessible, authentic and deeply memorable. We craft responsible mountain expeditions combining authentic local wisdom with premium alpine standards.',
    stats: [
      { label: 'Happy Trekkers', value: '15,000+' },
      { label: 'Summit Ratio', value: '98.6%' },
      { label: 'Local Guides', value: '100%' },
    ],
  },
  {
    id: 'inclusions',
    badge: 'WHAT IS COVERED',
    tagline: '100% Transparent Price Coverage',
    title: 'Inclusions & Exclusions',
    icon: CheckCircle2,
    highlight: 'All Meals • Camps • Permits • Safety Kit Included',
    desc: 'Know exactly what your trek fee covers. We take pride in 100% honest transparency with zero hidden campsite charges.',
    inclusionsList: [
      'Accommodation in alpine camps/tents',
      'All nutritious mountain meals during trek',
      'Certified trek leader & safety guides',
      'Forest permits & sanctuary entry fees',
      'Basic trekking equipment & gaiters',
      'First aid, oxygen cylinders & stretchers',
    ],
    exclusionsList: [
      'Travel to & from Dehradun base',
      'Personal expenses, snacks & mineral water',
      'Trekking shoes & personal thermal layers',
      'Personal travel/medical insurance',
    ],
    stats: [
      { label: 'Hidden Charges', value: '0%' },
      { label: 'Meals Included', value: 'All 3 Meals' },
      { label: 'Permits Covered', value: '100%' },
    ],
  },
  {
    id: 'trust',
    badge: 'TREKI TRUST',
    tagline: 'Transparent & Verified',
    title: 'Uncompromised Alpine Trust',
    icon: ShieldCheck,
    highlight: 'Zero Hidden Fees • 100% Certified Gear',
    desc: 'Trust is forged on snowy ridges. We operate with complete pricing transparency, certified 4-season geodesic tents, sub-zero sleeping bags, and government-approved forest permits.',
    stats: [
      { label: 'Safety Rating', value: '4.9 / 5' },
      { label: 'Certified Gear', value: 'Tested -15°C' },
      { label: 'Refund Policy', value: 'Hassle-Free' },
    ],
  },
  {
    id: 'support',
    badge: 'TREKI SUPPORT',
    tagline: '24/7 Mountain Assistance',
    title: 'Round-The-Clock Alpine Care',
    icon: Headphones,
    highlight: 'High Altitude Medical Kits & Oxygen Support',
    desc: 'From the moment you inquire until you safely return home, our operations hub and summit team provide 24/7 live assistance, satellite communication, oximeter tracking, and immediate evacuation protocols.',
    stats: [
      { label: 'Live Assistance', value: '24/7 Ops Hub' },
      { label: 'Health Checks', value: 'Twice Daily' },
      { label: 'Emergency Oxygen', value: 'At Every Camp' },
    ],
  },
  {
    id: 'guides',
    badge: 'EXPERT CREW',
    tagline: 'IMF & NIM Certified',
    title: 'Licensed Himalayan Leaders',
    icon: Award,
    highlight: 'Born and Raised in Garhwal Himalayas',
    desc: 'Our trek leaders hold advanced certifications from premier institutes like NIM and HMI. Their deep knowledge of local weather windows, snow conditions, and flora/fauna transforms every trek into a masterclass.',
    stats: [
      { label: 'Guide Ratio', value: '1:6 Trekkers' },
      { label: 'Exp. In Winter', value: '10+ Seasons' },
      { label: 'First Aid', value: 'Wilderness WFA' },
    ],
  },
  {
    id: 'eco',
    badge: 'ECO CONSCIOUS',
    tagline: 'Leave No Trace Behind',
    title: 'Green Trail Commitment',
    icon: Leaf,
    highlight: 'Eco-Friendly Bio Tents & Zero Plastic Trails',
    desc: 'We are stewards of the Himalayas. Every batch carries back non-biodegradable waste, uses solar charging, and supports local mountain communities through ethical homestays and fair employment.',
    stats: [
      { label: 'Waste Brought Back', value: '100%' },
      { label: 'Local Economy', value: 'Direct Support' },
      { label: 'Eco Footprint', value: 'Carbon Offset' },
    ],
  },
]

/*
 * Treki Info, Trust & Support: a scroll-told story on a light background (P = 0..1 over the pinned stage).
 *
 *   0.00 - 0.18  headline "Hello, we are Treki Travels." fills in word by word (ghost grey -> ink)
 *   0.28 - 0.42  headline lifts away; a photo rises and grows, with huge "WHY TREKI" lettering on it
 *   0.45 - 0.60  photo slides to the left panel, lettering fades, the second headline appears on the right
 *   0.62 - 1.00  the six feature cards (from TREKI_FEATURES) slide in from the right and travel left, one after another
 */

const WORDS = [
  { w: 'Hello,', accent: true },
  { w: 'we' }, { w: 'are' }, { w: 'Treki' }, { w: 'Travels.' },
]
const clamp01 = clamp
const seg = (p, a, b) => clamp01((p - a) / (b - a))
const mix = (a, b, t) => a + (b - a) * t

const FOCI = ['60% 40%', '30% 55%', '75% 35%', '50% 25%', '20% 60%', '85% 45%']

export default function ItineraryScrollCanvas() {
  const wrap = useRef(null)
  const els = useRef({})
  const [narrow, setNarrow] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setNarrow(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  useEffect(() => {
    const e = els.current
    let target = reduced ? 1 : 0
    let cur = target
    let raf = 0

    const apply = () => {
      const p = cur
      const vw = window.innerWidth
      const vh = window.innerHeight

      // Headline words
      const hIn = seg(p, 0, 0.18)
      const hOut = ease(seg(p, 0.28, 0.4))
      e.words.forEach((w, i) => {
        const k = clamp01(hIn * (WORDS.length + 1.5) - i)
        w.style.opacity = String(mix(0.14, 1, ease(k)))
      })
      e.head.style.opacity = String(1 - hOut)
      e.head.style.transform = `translateY(${-hOut * 14}vh)`
      e.kicker.style.opacity = String(ease(seg(p, 0, 0.06)) * (1 - hOut))

      // Photo
      const rise = ease(seg(p, 0.26, 0.42))
      const side = ease(seg(p, 0.45, 0.6))
      const leave = ease(seg(p, 0.7, 0.86))
      const big = narrow ? [4, 24, 92, 52] : [14, 14, 72, 72]
      const small = narrow ? [0, 0, 100, 34] : [0, 0, 38, 100]
      const r0 = narrow ? [20, 100, 60, 30] : [30, 100, 40, 60]
      const r = r0.map((v, i) => mix(mix(v, big[i], rise), small[i], side))
      const ph = e.photo
      ph.style.left = `${r[0] - leave * (narrow ? 0 : 42)}%`
      ph.style.top = `${r[1] - (narrow ? leave * 36 : 0)}%`
      ph.style.width = `${r[2]}%`
      ph.style.height = `${r[3]}%`
      ph.style.borderRadius = `${mix(mix(28, 20, rise), 0, side)}px`
      ph.style.opacity = String(rise > 0 ? 1 : 0)
      e.photoImg.style.transform = `scale(${mix(1.25, 1.02, rise + side * 0.2)})`
      e.big.style.opacity = String(rise * (1 - ease(seg(p, 0.45, 0.55))))
      e.big.style.transform = `translateY(${(1 - rise) * 8}vh) scale(${mix(0.94, 1, rise)})`

      // Second headline + cards track
      const tIn = ease(seg(p, 0.56, 0.66))
      const travelP = ease(seg(p, 0.72, 1))
      const trackW = e.track.scrollWidth
      const startLeft = narrow ? 5 : 42 // vw
      const endLeft = 5
      const left = mix(startLeft, endLeft, ease(seg(p, 0.7, 0.86))) * (vw / 100)
      const travel = Math.max(0, trackW - (vw - endLeft * (vw / 100) * 1.2))
      e.track.style.transform = `translate3d(${left - travelP * travel}px, 0, 0)`
      e.track.style.opacity = String(tIn)
      e.track.style.top = narrow ? '39%' : '17%'
      e.track.style.height = narrow ? '56%' : '70%'
      e.progress.style.transform = `scaleX(${travelP})`
      e.progressWrap.style.opacity = String(tIn)
      void vh
    }

    const tick = () => {
      cur += (target - cur) * 0.12
      if (Math.abs(target - cur) < 0.0003) cur = target
      apply()
      raf = cur === target ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      if (reduced) return
      const r = wrap.current.getBoundingClientRect()
      target = clamp(-r.top / Math.max(1, wrap.current.offsetHeight - window.innerHeight))
      if (!raf) raf = requestAnimationFrame(tick)
    }
    onScroll()
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', () => { onScroll(); apply() })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll) }
  }, [narrow, reduced])

  const reg = (k) => (n) => { els.current[k] = n }

  return (
    <section ref={wrap} id="trust" aria-label="Treki info, trust and support" className="relative bg-[#F5F6F2]" style={{ height: reduced ? 'auto' : narrow ? '700vh' : '820vh' }}>
      <div className="sticky top-0 h-svh overflow-hidden bg-[#F5F6F2]">
        {/* 1. Headline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <p ref={reg('kicker')} className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-forest/70 md:mb-6 md:text-sm">Treki Info, Trust &amp; Support</p>
          <h2 ref={reg('head')} className="font-bold leading-[1.02] tracking-tight text-ink" style={{ fontSize: narrow ? '15vw' : '8.4vw' }}>
            {WORDS.map(({ w, accent }, i) => (
              <span key={w} ref={(n) => { (els.current.words ||= [])[i] = n }} className={`mr-[0.22em] inline-block ${accent ? 'text-cta' : ''}`} style={{ opacity: 0.14 }}>{w}</span>
            ))}
          </h2>
        </div>

        {/* 2. Photo (rises, then becomes the left panel) */}
        <div ref={reg('photo')} className="absolute overflow-hidden bg-sage" style={{ left: '30%', top: '100%', width: '40%', height: '60%', opacity: 0 }}>
          <div ref={reg('photoImg')} className="h-full w-full will-change-transform"><Img focus="55% 40%" sizes="80vw" /></div>
          <div className="absolute inset-0 bg-black/25" />
          <p ref={reg('big')} className="absolute inset-0 flex items-center justify-center text-center font-black uppercase leading-[0.9] tracking-tighter text-white" style={{ fontSize: narrow ? '17vw' : '10vw', opacity: 0 }}>
            Why<br />Treki
          </p>
        </div>

        {/* 3. Second headline + feature cards */}
        <div ref={reg('track')} className="absolute left-0 flex items-stretch gap-4 md:gap-6" style={{ opacity: 0 }}>
          <div className="flex shrink-0 flex-col justify-center" style={{ width: narrow ? '78vw' : '30vw' }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-forest/70">Why Treki Travels</p>
            <h3 className="mt-3 font-bold leading-[1.08] tracking-tight text-ink" style={{ fontSize: narrow ? '9vw' : '3.2vw' }}>
              Treks you can trust,<br />journeys you <span className="text-cta">won&rsquo;t forget.</span>
            </h3>
            <p className="mt-4 max-w-sm text-sm text-muted">Scroll to meet the people, standards and promises behind every Kedarkantha batch.</p>
          </div>
          {TREKI_FEATURES.map((f, i) => {
            const FIcon = f.icon
            const lines = f.stats || f.inclusionsList.slice(0, 3).map((t) => ({ value: '✓', label: t }))
            return (
              <article key={f.id} className="relative shrink-0 overflow-hidden rounded-2xl bg-ink-bg text-white shadow-card" style={{ width: narrow ? '68vw' : '21vw' }}>
                <div className="absolute inset-0"><Img focus={FOCI[i % FOCI.length]} sizes="30vw" /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <span className="absolute left-4 top-4 rounded-full bg-[#E8A317] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-forest">{String(i + 1).padStart(2, '0')} · {f.badge}</span>
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <FIcon size={20} className="mb-2 text-[#E8A317]" aria-hidden="true" />
                  <h4 className="font-display text-2xl font-bold leading-tight md:text-[1.7vw]" style={{ fontSize: narrow ? undefined : 'clamp(1.35rem,1.7vw,2rem)' }}>{f.title}</h4>
                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-white/80 md:text-[0.82vw]" style={{ fontSize: narrow ? undefined : 'clamp(0.75rem,0.82vw,0.95rem)' }}>{f.desc}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/20 pt-3 text-[11px]">
                    {lines.map((s) => (
                      <li key={s.label}><span className="font-display font-bold text-[#E8A317]">{s.value}</span> <span className="text-white/80">{s.label}</span></li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
          <div className="w-2 shrink-0 md:w-10" aria-hidden="true" />
        </div>

        <div ref={reg('progressWrap')} className="absolute bottom-6 left-6 right-6 h-[2px] overflow-hidden rounded-full bg-forest/15 md:left-[5vw] md:right-[5vw]" style={{ opacity: 0 }} aria-hidden="true">
          <div ref={reg('progress')} className="h-full origin-left bg-forest" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </section>
  )
}
