import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applySeo } from '../lib/seo'

/** `enabled: false` is used when a page is embedded as a section of the home page. */
export function useSeo({ title, description, jsonLd, enabled = true }) {
  const { pathname } = useLocation()
  const ld = jsonLd ? JSON.stringify(jsonLd) : null
  useEffect(() => {
    if (!enabled) return
    applySeo({ title, description, path: pathname, jsonLd: ld ? JSON.parse(ld) : undefined })
  }, [enabled, title, description, pathname, ld])
}
