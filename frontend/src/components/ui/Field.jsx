import { useId } from 'react'

export default function Field({ label, error, className = '', ...input }) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-cta focus:outline-none ${
          error ? 'border-seat-low' : 'border-line'
        }`}
        {...input}
      />
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-seat-low">{error}</p>}
    </div>
  )
}
