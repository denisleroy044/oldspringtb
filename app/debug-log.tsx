'use client'

import { useEffect } from 'react'

export default function ConsoleLogger() {
  useEffect(() => {
    // Log all DOM mutations to console
    const logEvent = (e: Event) => {
      console.log('🔄 DOM Event:', e.type, e.target)
    }

    // Log all clicks
    document.addEventListener('click', logEvent)
    
    // Log all errors
    window.addEventListener('error', (e) => {
      console.error('❌ Error:', e.error)
    })

    // Log unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('❌ Unhandled Rejection:', e.reason)
    })

    // Monitor for modal creation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            const el = node as Element
            if (el.classList && 
                (el.classList.toString().includes('fixed') || 
                 el.classList.toString().includes('inset-0'))) {
              console.warn('⚠️ Potential modal added:', el)
              console.log('Stack trace:', new Error().stack)
            }
          }
        })
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('click', logEvent)
      observer.disconnect()
    }
  }, [])

  return null
}
