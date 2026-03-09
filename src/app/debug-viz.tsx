'use client'

import { useEffect, useState } from 'react'

export default function VisualDebugger() {
  const [elements, setElements] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Scan for any elements that might be causing the gray film
    const scanElements = () => {
      const allElements = document.querySelectorAll('*')
      const suspects = []
      
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        
        // Look for fixed position elements with dark backgrounds
        if (styles.position === 'fixed' && 
            (styles.backgroundColor?.includes('rgba(0,0,0,') || 
             styles.backgroundColor?.includes('rgb(0,0,0)') ||
             styles.opacity === '0.5' ||
             styles.opacity === '0.6')) {
          
          suspects.push({
            tag: el.tagName,
            id: el.id,
            class: el.className,
            backgroundColor: styles.backgroundColor,
            opacity: styles.opacity,
            zIndex: styles.zIndex,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            element: el
          })
        }
      })
      
      setElements(suspects)
      
      // If we found suspects, highlight them in red
      suspects.forEach(suspect => {
        if (suspect.element) {
          (suspect.element as HTMLElement).style.outline = '3px solid red'
          (suspect.element as HTMLElement).style.outlineOffset = '2px'
        }
      })
    }

    scanElements()
    setTimeout(scanElements, 500)
    setTimeout(scanElements, 1000)
  }, [])

  const removeElement = (element: any) => {
    if (element.element) {
      element.element.remove()
      setElements(prev => prev.filter(e => e !== element))
    }
  }

  const removeAll = () => {
    elements.forEach(el => {
      if (el.element) el.element.remove()
    })
    setElements([])
  }

  if (elements.length === 0) return null

  return (
    <>
      {/* Debug button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition flex items-center space-x-2"
      >
        <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
        <span>Debug: {elements.length} overlay(s) found</span>
      </button>

      {/* Debug panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[9999] bg-white rounded-xl shadow-2xl max-w-md w-full p-4 border-2 border-red-500">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-red-600">🔍 Visual Debugger</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500">✕</button>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            Found {elements.length} element(s) that might be causing the gray film:
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
            {elements.map((el, idx) => (
              <div key={idx} className="text-xs bg-gray-50 p-2 rounded border border-gray-200">
                <div className="font-mono">
                  <span className="text-red-500">{el.tag}</span>
                  {el.id && <span className="text-blue-500"> #{el.id}</span>}
                </div>
                <div className="text-gray-600 mt-1">
                  <div>BG: {el.backgroundColor}</div>
                  <div>Opacity: {el.opacity}</div>
                  <div>Z-Index: {el.zIndex}</div>
                  <div>Position: {el.top.toFixed(0)},{el.left.toFixed(0)} ({el.width.toFixed(0)}x{el.height.toFixed(0)})</div>
                </div>
                <button
                  onClick={() => removeElement(el)}
                  className="mt-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                >
                  Remove this element
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={removeAll}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700"
            >
              Remove All
            </button>
            <button
              onClick={() => {
                elements.forEach(el => {
                  if (el.element) (el.element as HTMLElement).style.outline = ''
                })
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              Clear Outlines
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Elements outlined in red are potential culprits. Click "Remove" to delete them.
          </p>
        </div>
      )}
    </>
  )
}
