'use client'

import { ReactNode, useState, useEffect } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { DashboardHeader } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav'
import { DashboardFooter } from '@/components/dashboard/Footer'

function DashboardContent({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Listen for sidebar collapse events
  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed)
    }

    window.addEventListener('sidebarChange' as any, handleSidebarChange)
    return () => window.removeEventListener('sidebarChange' as any, handleSidebarChange)
  }, [])

  // Calculate content margin based on sidebar state
  const getContentMargin = () => {
    if (isMobile) return 'ml-0'
    return sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <DashboardHeader 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        isSidebarOpen={sidebarOpen}
        isMobile={isMobile}
      />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
          onCollapse={(collapsed) => setSidebarCollapsed(collapsed)}
        />
        
        {/* Main content area with perfect margins */}
        <main className={`
          flex-1 transition-all duration-300 ease-in-out pt-16
          ${getContentMargin()}
        `}>
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
            <DashboardFooter />
          </div>
        </main>
      </div>

      {isMobile && <MobileBottomNav />}
    </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DashboardContent>{children}</DashboardContent>
      </ThemeProvider>
    </AuthProvider>
  )
}
