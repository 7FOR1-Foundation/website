'use client'

import { useEffect } from 'react'

/**
 * Light deterrent against saving photos: no right-click menu ("Save image as")
 * and no dragging them out of the page. Only photos in the main content are
 * covered, so links, text and the logos still behave normally. It can't stop
 * screenshots or developer tools; the watermark and size cap handle that.
 */
export function ImageGuard() {
  useEffect(() => {
    const block = (event: Event) => {
      const target = event.target as Element | null
      if (target?.closest?.('main img, main picture')) event.preventDefault()
    }
    document.addEventListener('contextmenu', block)
    document.addEventListener('dragstart', block)
    return () => {
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('dragstart', block)
    }
  }, [])
  return null
}
