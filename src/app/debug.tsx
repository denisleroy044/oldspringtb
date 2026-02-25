'use client'

import { useEffect } from 'react'

export default function Debug() {
  useEffect(() => {
    // Log all fixed position elements
    const checkForOverlays = () => {
      const allElements = document.querySelectorAll('*')
      const overlays = []
      
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el)
        if (styles.position === 'fixed' && 
            (styles.backgroundColor?.includes('rgba(0,0,0,') || 
             styles.backgroundColor?.includes('rgb(0,0,0)'))) {
          overlays.push({
            tag: el.tagName,
            id: el.id,
            class: el.className,
            background: styles.backgroundColor,
            zIndex: styles.zIndex
          })
        }
      })
      
      if (overlays.length > 0) {
        console.log('🔍 Found potential overlays:', overlays)
      } else {
        console.log('✅ No overlays found')
      }
    }

    // Run after page loads
    setTimeout(checkForOverlays, 100)
    setTimeout(checkForOverlays, 500)
    setTimeout(checkForOverlays, 1000)
  }, [])

  return null
}
