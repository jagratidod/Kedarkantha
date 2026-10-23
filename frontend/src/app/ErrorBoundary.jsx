import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { console.error(error) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-3 bg-offwhite p-6 text-center">
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="text-sm text-muted">Please reload the page. If the problem continues, contact us.</p>
        <button className="rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-white" onClick={() => location.reload()}>Reload</button>
      </div>
    )
  }
}
