/** Horizontal pill filter (months, gallery categories, mandatory/optional tabs). */
export default function Chips({ options, value, onChange, label, className = '', variant = 'soft' }) {
  return (
    <div role="tablist" aria-label={label} className={`flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] ${className}`}>
      {options.map((o) => {
        const active = o === value
        return (
          <button
            key={o}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(o)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              active ? 'bg-[#1F4663] text-white shadow-md ring-1 ring-white/20' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}
