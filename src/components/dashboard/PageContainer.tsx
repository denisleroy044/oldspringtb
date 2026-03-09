'use client'

import { ReactNode } from 'react'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

interface PageContainerProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScrollAnimation animation="fadeIn">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-deep-teal mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          {children}
        </ScrollAnimation>
      </div>
    </div>
  )
}
