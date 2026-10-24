import Img from '../ui/Img'

/** Dark photo banner used at the top of every inner page, or merged gracefully when embedded on home */
export default function PageHero({ title, subtitle, image, focus = '50% 40%', embedded = false }) {
  const Heading = embedded ? 'h2' : 'h1'

  if (embedded) {
    return (
      <section className="relative isolate overflow-hidden pt-12 pb-6 sm:pt-16 sm:pb-8">
        {/* Soft atmospheric glow & subtle divider line connecting sections */}
        <div className="container-page flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest/8 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-forest ring-1 ring-forest/15">
            <span className="h-1.5 w-1.5 rounded-full bg-cta animate-pulse" />
            Explore Section
          </div>
          <Heading className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {title}
          </Heading>
          {subtitle && (
            <p className="mt-2.5 max-w-2xl text-sm text-muted sm:text-base">
              {subtitle}
            </p>
          )}
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-forest/30 to-transparent" />
        </div>
      </section>
    )
  }

  return (
    <section className="relative isolate overflow-hidden bg-ink-bg">
      <div className="absolute inset-0 -z-10">
        <Img image={image} focus={focus} eager sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-bg/55 via-forest/70 to-forest/90" />
      </div>
      <div className="container-page py-12 sm:py-16 lg:py-20">
        <Heading className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</Heading>
        {subtitle && <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">{subtitle}</p>}
      </div>
    </section>
  )
}

