import MountainCover from './MountainCover'
import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, HeartHandshake, Headphones, Award, Leaf, ChevronRight, Sparkles } from 'lucide-react'

const FRAME_COUNT = 25
const frameUrl = (i) => `/BGIMAGES/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

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

export default function ItineraryScrollCanvas() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const totalSteps = TREKI_FEATURES.length

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
      const frameIndex = current * (FRAME_COUNT - 1)
      const baseIndex = Math.floor(frameIndex)
      const nextIndex = Math.min(baseIndex + 1, FRAME_COUNT - 1)
      const blend = frameIndex - baseIndex

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawCover(frames[baseIndex], 1)
      if (blend > 0.001 && baseIndex !== nextIndex) {
        drawCover(frames[nextIndex], blend)
      }
    }

    const tick = () => {
      current += (target - current) * 0.14
      if (Math.abs(target - current) < 0.0005) {
        current = target
      }
      draw()
      if (current !== target) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect()
      const totalScrollable = wrap.offsetHeight - window.innerHeight
      if (totalScrollable <= 0) return

      const progress = clamp(-rect.top / totalScrollable, 0, 1)
      target = progress
      if (!raf) raf = requestAnimationFrame(tick)

      const step = Math.min(Math.floor(progress * totalSteps), totalSteps - 1)
      setActiveStep(step)
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (alive && i === 0) draw()
      }
      img.src = frameUrl(i)
      frames.push(img)
    }

    resize()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)

    return () => {
      alive = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [totalSteps])

  const feature = TREKI_FEATURES[activeStep] || TREKI_FEATURES[0]
  const IconComponent = feature.icon

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-[450vh] sm:h-[500vh] -mb-[95vh] z-20"
      style={{ marginTop: -100 }}
    >
      {/* Sticky full-screen stage. Top melts seamlessly into the white section above */}
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-transparent"
      >
        
        {/* Dynamic Scrubbed Canvas Background - Top dissolves/melts smoothly into white */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 12%, black 22%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 12%, black 22%)',
          }}
        />

        {/* Minimal soft gradient just behind the text card */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Main Stage Container */}
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col justify-between pt-24 pb-10 sm:pt-32 sm:pb-14">
          
          {/* Top Section Header - Perfectly Centered */}
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-white backdrop-blur-md border border-white/20 mb-3">
              <ShieldCheck size={13} className="text-[#E8A317]" />
              Why Treki Travels
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-md">
              Treki Info, Trust & Support
            </h2>
            
            {/* Step Counter Badge Centered */}
            <div className="mt-3 inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15">
              <span className="text-[11px] uppercase font-semibold text-white/70 tracking-wider">Highlight</span>
              <div className="flex items-center gap-1 font-display text-sm font-bold text-white">
                <span className="text-[#E8A317]">0{activeStep + 1}</span>
                <span className="text-white/40">/</span>
                <span>0{totalSteps}</span>
              </div>
            </div>
          </div>

          {/* Centered Layout: Clean floating text in the middle of the screen (container bg removed) */}
          <div className="w-full max-w-4xl mx-auto my-auto text-center">
            <div
              key={activeStep}
              className="relative p-4 sm:p-6 animate-fade-in transition-all duration-300"
            >
              {/* Badge & Highlight info */}
              <div className="flex flex-wrap items-center justify-center gap-3 pb-4">
                <span className="px-3.5 py-1.5 rounded-xl bg-[#E8A317] text-forest font-display font-extrabold text-xs sm:text-sm tracking-wide shadow-md">
                  {feature.badge}
                </span>
                <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
                  <IconComponent size={15} className="text-[#E8A317]" />
                  {feature.highlight}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                  <ShieldCheck size={13} className="text-[#E8A317]" />
                  Verified Standard
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mt-4 leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                {feature.title}
              </h3>

              {/* Description Narrative */}
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed font-normal [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                {feature.desc}
              </p>

              {/* Stat Badges Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto mt-8 pt-6 border-t border-white/20">
                {feature.stats.map((s) => (
                  <div key={s.label} className="p-2 sm:p-3 text-center">
                    <p className="font-display text-xl sm:text-3xl font-extrabold text-[#E8A317] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{s.value}</p>
                    <p className="text-xs sm:text-sm text-white/90 mt-1 [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Interactive step indicator pills */}
              <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-white/15">
                {TREKI_FEATURES.map((f, i) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveStep(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeStep === i ? 'w-8 bg-[#E8A317]' : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={f.title}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Scroll Prompt Bar */}
          <div className="flex items-center justify-between text-xs text-white/70 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E8A317] animate-ping" />
              <span>Scroll to scrub alpine scenery & explore Treki pillars</span>
            </div>
            <span className="hidden sm:inline">24/7 Operations Hub • Himalayan Certified</span>
          </div>

        </div>

      </div>
      <MountainCover />
    </div>
  )
}
