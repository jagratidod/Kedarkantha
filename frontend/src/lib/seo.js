import { env } from './env'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function applySeo({ title, description, path = '/', jsonLd }) {
  const full = title ? `${title} | ${env.appName}` : `${env.appName} | Kedarkantha Trek`
  document.title = full
  if (description) {
    setMeta('name', 'description', description)
    setMeta('property', 'og:description', description)
  }
  setMeta('property', 'og:title', full)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:url', `${env.siteUrl}${path}`)

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = `${env.siteUrl}${path}`

  document.head.querySelectorAll('script[data-seo]').forEach((s) => s.remove())
  if (jsonLd) {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.dataset.seo = '1'
    s.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(s)
  }
}
