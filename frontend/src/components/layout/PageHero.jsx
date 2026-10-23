import Img from '../ui/Img'

/** Dark photo banner used at the top of every inner page / home-page section. */
export default function PageHero({ title, subtitle, image, focus = '50% 40%', embedded = false }) {
  const Heading = embedded ? 'h2' : 'h1'
  return (
    <section className="relative isolate overflow-hidden bg-ink-bg">
      <div className="absolute inset-0 -z-10">
        <Img image={image} focus={focus} eager={!embedded} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-bg/55 via-forest/70 to-forest/90" />
      </div>
      <div className="container-page py-12 sm:py-16 lg:py-20">
        <Heading className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</Heading>
        {subtitle && <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">{subtitle}</p>}
      </div>
    </section>
  )
}
