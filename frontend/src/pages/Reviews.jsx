import { Sparkles } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import { useSeo } from '../hooks/useSeo'

export default function Reviews({ embedded = false }) {
  useSeo({
    enabled: !embedded,
    title: 'Reviews & Testimonials',
    description: 'Real experiences and live trekker video chronicles from Kedarkantha.',
  })

  return (
    <>
      {!embedded && (
        <PageHero
          title="Trekker Stories & Reviews"
          subtitle="Real experiences from people who stood on the Kedarkantha summit."
          focus="60% 40%"
        />
      )}

      {/* NATURAL SCROLL SECTION WITH CONTINUOUS / FIXED BACKGROUND */}
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

        {/* FULL-SCREEN VIDEO TESTIMONIALS SECTION */}
        <div className="relative z-10 w-full pt-16 sm:pt-24 pb-28 sm:pb-36 px-4 sm:px-8 md:px-12">
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
