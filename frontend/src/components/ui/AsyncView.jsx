import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-sage ${className}`} aria-hidden="true" />
}

function DefaultFallback() {
  return (
    <div className="container-page space-y-4 py-10" role="status" aria-label="Loading">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="container-page py-16 text-center" role="alert">
      <AlertTriangle className="mx-auto mb-3 text-seat-low" size={32} aria-hidden="true" />
      <p className="font-semibold">{error?.message || 'Something went wrong.'}</p>
      {onRetry && <Button className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  )
}

/** Renders loading / error / content for a useAsync() result. */
export default function AsyncView({ state, fallback, children }) {
  if (state.loading) return fallback ?? <DefaultFallback />
  if (state.error) return <ErrorState error={state.error} onRetry={state.reload} />
  return children(state.data)
}
