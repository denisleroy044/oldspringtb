'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fallback?: React.ReactNode
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  fallback 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (error) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-500 text-xs">📷</span>
      </div>
    )
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      width={width}
      height={height}
      onError={() => setError(true)}
    />
  )
}
