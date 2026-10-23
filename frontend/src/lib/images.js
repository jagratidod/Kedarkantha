// Single source for the site imagery. Every slot falls back to this one photo.
// To change images later: edit this file, or set `image` on individual data records
// (or return it from the admin API) - components never need to change.
import w480 from '../assets/images/trek-480.webp'
import w1000 from '../assets/images/trek-1000.webp'
import w1920 from '../assets/images/trek-1920.webp'

export const DEFAULT_IMAGE = {
  src: w1000,
  srcSet: `${w480} 480w, ${w1000} 1000w, ${w1920} 1672w`,
  alt: 'Snow-covered Himalayan peaks at sunrise above pine forest',
}

/** Resolve a record's image (string URL or {src, srcSet, alt}) to a full image object. */
export function resolveImage(image) {
  if (!image) return DEFAULT_IMAGE
  if (typeof image === 'string') return { src: image, alt: DEFAULT_IMAGE.alt }
  return { ...DEFAULT_IMAGE, ...image }
}
