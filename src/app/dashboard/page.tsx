export const dynamic = 'force-dynamic'
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { AccountCards } from '@/components/dashboard/AccountCards'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { MarketWatch } from '@/components/dashboard/MarketWatch'
import { DashboardHeader } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className={`flex-1 p-4 md:p-8 ${isMobile ? 'pb-20' : ''}`}>
          <ScrollAnimation animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-deep-teal mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-gray-600">Here's what's happening with your accounts today.</p>
            </div>

            {/* Account Cards */}
            <AccountCards />

            {/* Quick Actions */}
            <QuickActions />

            {/* Market Watch */}
            <MarketWatch />
          </ScrollAnimation>
        </main>
        <DashboardFooter />
      </div>
    </div>
  )
}
