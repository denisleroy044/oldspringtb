'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { MarketProvider } from '@/context/MarketContext'
import { DashboardProvider } from '@/context/DashboardContext'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardProvider>
        <MarketProvider>
          {children}
        </MarketProvider>
      </DashboardProvider>
    </AuthProvider>
  )
}
