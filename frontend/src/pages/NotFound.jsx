import Button from '../components/ui/Button'
import { useSeo } from '../hooks/useSeo'

export default function NotFound() {
  useSeo({ title: 'Page not found' })
  return (
    <div className="container-page py-24 text-center">
      <p className="text-6xl font-bold text-forest">404</p>
      <h1 className="mt-3 text-xl font-bold">This trail doesn&apos;t exist</h1>
      <p className="mt-2 text-sm text-muted">The page you are looking for has moved or never existed.</p>
      <Button to="/" className="mt-6">Back to home</Button>
    </div>
  )
}
