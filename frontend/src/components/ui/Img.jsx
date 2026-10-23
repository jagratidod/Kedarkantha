import { resolveImage } from '../../lib/images'

/**
 * Image slot. `image` may be null (default photo), a URL, or {src, srcSet, alt}.
 * `focus` is an object-position, used to vary the crop of the shared photo.
 */
export default function Img({ image, focus = '50% 50%', alt, className = '', eager = false, sizes = '(min-width: 1024px) 50vw, 100vw' }) {
  const img = resolveImage(image)
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={img.srcSet ? sizes : undefined}
      alt={alt ?? img.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      style={{ objectPosition: focus }}
      className={`h-full w-full object-cover ${className}`}
    />
  )
}
