import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap'

const variants = {
  primary: 'bg-[#1F4663] text-white hover:bg-[#2A5E85]',
  cta: 'bg-[#E8A317] text-[#0E2233] font-bold hover:bg-[#F2B330] shadow-md',
  outline: 'border border-white/40 bg-white/5 text-white hover:bg-white/15',
  outlineDark: 'border border-white/20 bg-white/10 text-white hover:bg-white/20',
  ghost: 'text-[#7EB5D6] hover:bg-white/10 hover:text-white',
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
