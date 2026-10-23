import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

/** Single disclosure row. `children` is the expanded panel. */
export function AccordionItem({ header, children, defaultOpen = false, className = '' }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="min-w-0 flex-1">{header}</span>
        <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <div id={id} hidden={!open} className="pt-3">
        {children}
      </div>
    </div>
  )
}
