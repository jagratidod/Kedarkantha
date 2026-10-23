import { env } from './env'

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Feature api files call `request(path, { mock })`.
 * - VITE_API_URL empty  -> resolves `mock()` after a short delay (current mode).
 * - VITE_API_URL set    -> performs a real fetch (used once the admin backend exists).
 */
export async function request(path, { method = 'GET', body, mock } = {}) {
  if (!env.apiUrl) {
    await wait(env.mockDelay)
    if (!mock) throw new ApiError('Not implemented in mock mode', 501)
    return mock(body)
  }
  let res
  try {
    res = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Network error. Please check your connection.')
  }
  if (!res.ok) {
    let msg = 'Something went wrong. Please try again.'
    try { msg = (await res.json()).message || msg } catch { /* keep default */ }
    throw new ApiError(msg, res.status)
  }
  return res.json()
}
