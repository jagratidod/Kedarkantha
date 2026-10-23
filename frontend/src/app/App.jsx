import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import AppRoutes from './router'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
