import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap'

const variants = {
  primary: 'bg-forest text-white hover:bg-ink-bg',
  cta: 'bg-cta text-white hover:bg-[#587659]',
  outline: 'border border-white/60 bg-ink-bg/30 text-white hover:bg-white/15',
  outlineDark: 'border border-line bg-white text-ink hover:bg-sage',
  ghost: 'text-forest hover:bg-sage',
}

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm sm:text-base',
}

/** Renders a router <Link> when `to` is set, an <a> for `href`, otherwise a <button>. */
export default function Button({ variant = 'primary', size = 'md', to, href, className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>
  return <button type="button" className={cls} {...rest}>{children}</button>
}
