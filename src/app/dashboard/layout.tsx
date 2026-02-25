'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { MarketProvider } from '@/context/MarketContext'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MarketProvider>
        {children}
      </MarketProvider>
    </AuthProvider>
  )
}
