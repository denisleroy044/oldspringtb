#!/bin/bash

# Complete Enhanced Banking Platform with Modern Design

set -e

echo "🏦 Creating Enhanced Banking Platform"
echo "====================================="

# Create directory structure
mkdir -p src/app/dashboard
mkdir -p src/app/dashboard/transactions
mkdir -p src/app/dashboard/cards
mkdir -p src/app/dashboard/transfers
mkdir -p src/app/dashboard/transfers/local
mkdir -p src/app/dashboard/transfers/international
mkdir -p src/app/dashboard/deposits
mkdir -p src/app/dashboard/loans
mkdir -p src/app/dashboard/grants
mkdir -p src/app/dashboard/settings
mkdir -p src/app/admin
mkdir -p src/app/admin/deposits
mkdir -p src/app/admin/cards
mkdir -p src/app/admin/users
mkdir -p src/app/admin/transactions
mkdir -p src/app/admin/chat
mkdir -p src/app/admin/settings
mkdir -p src/components/icons
mkdir -p src/lib/auth
mkdir -p src/hooks
mkdir -p src/utils

# ============================================
# ICONS COMPONENT
# ============================================
cat > src/components/icons/index.tsx << 'EOF'
import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export const DashboardIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

export const CardsIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

export const TransactionsIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export const TransfersIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
)

export const DepositsIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

export const LoansIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export const GrantsIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

export const SettingsIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export const UsersIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

export const SupportIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

export const BankIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
)

export const ChevronLeftIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

export const ChevronRightIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export const LogoutIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

export const SearchIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export const BellIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

export const SunIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

export const MoonIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

export const WalletIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

export const MenuIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export const CloseIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)
EOF

# ============================================
# AUTH CHECK UTILITY
# ============================================
cat > src/lib/auth/check-auth.ts << 'EOF'
export interface AuthResult {
  isAuthenticated: boolean
  email: string | null
  role: 'user' | 'admin' | null
}

export function checkAuth(): AuthResult {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, email: null, role: null }
  }
  
  const email = localStorage.getItem('userEmail')
  const role = localStorage.getItem('userRole') as 'user' | 'admin' | null
  const isAuthenticated = !!email
  
  return { isAuthenticated, email, role }
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userRole')
  localStorage.removeItem('lastLoginDate')
}

export function setAuth(email: string, role: 'user' | 'admin'): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('userEmail', email)
  localStorage.setItem('userRole', role)
  localStorage.setItem('lastLoginDate', new Date().toDateString())
}
EOF

# ============================================
# USE MEDIA QUERY HOOK
# ============================================
cat > src/hooks/useMediaQuery.ts << 'EOF'
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [matches, query])

  return matches
}
EOF

# ============================================
# USER DASHBOARD LAYOUT
# ============================================
cat > src/app/dashboard/layout.tsx << 'EOF'
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { checkAuth, clearAuth } from '@/lib/auth/check-auth'
import * as Icons from '@/components/icons'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Icons.DashboardIcon },
  { label: 'Cards', href: '/dashboard/cards', icon: Icons.CardsIcon },
  { label: 'Transactions', href: '/dashboard/transactions', icon: Icons.TransactionsIcon },
  { label: 'Transfers', href: '/dashboard/transfers', icon: Icons.TransfersIcon },
  { label: 'Deposits', href: '/dashboard/deposits', icon: Icons.DepositsIcon },
  { label: 'Loans', href: '/dashboard/loans', icon: Icons.LoansIcon },
  { label: 'Grants', href: '/dashboard/grants', icon: Icons.GrantsIcon },
  { label: 'Settings', href: '/dashboard/settings', icon: Icons.SettingsIcon },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState<{ email: string; role: string; firstName?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  useEffect(() => {
    // Auto-collapse sidebar on mobile
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }, [isMobile])

  useEffect(() => {
    // Check authentication on mount
    const auth = checkAuth()
    
    if (!auth.isAuthenticated || auth.role !== 'user') {
      router.push('/auth/login')
      return
    }
    
    // For demo, extract first name from email
    const email = auth.email || ''
    const firstName = email.split('@')[0] || 'User'
    
    setUser({ 
      email, 
      role: auth.role || 'user',
      firstName 
    })
    setIsLoading(false)
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    // Close profile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [router])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const userName = user?.firstName || user?.email?.split('@')[0] || 'Valued Client'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans">
      {/* Sidebar for desktop */}
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 border-r bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className={`flex items-center px-4 mb-8 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <Icons.BankIcon className="h-6 w-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">GWMB</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Wealth Management</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Collapse sidebar"
              >
                <Icons.ChevronLeftIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
          
          {/* Collapsed sidebar toggle */}
          {sidebarCollapsed && (
            <div className="flex justify-center mb-6">
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Expand sidebar"
              >
                <Icons.ChevronRightIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all group ${
                  sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-3'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <item.icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* User profile section */}
          <div className={`mt-auto px-4 pt-4 border-t dark:border-gray-700 ${sidebarCollapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center mb-4' : 'justify-between mb-4'}`}>
              {!sidebarCollapsed && (
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {userInitial}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium dark:text-white truncate max-w-[120px]">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Premium Account</p>
                  </div>
                </div>
              )}
              
              {sidebarCollapsed && (
                <div className="relative group">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {userInitial}
                  </div>
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {userName}
                  </div>
                </div>
              )}
              
              {!sidebarCollapsed && (
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full p-1 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                  aria-label="Toggle dark mode"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              )}
            </div>
            
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium transition flex items-center justify-center"
              >
                <Icons.LogoutIcon className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            )}
            
            {sidebarCollapsed && (
              <div className="space-y-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Icons.SunIcon className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Icons.MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors relative group"
                  aria-label="Sign out"
                >
                  <Icons.LogoutIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Sign Out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <Icons.BankIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">GWMB</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Wealth Management</div>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <Icons.CloseIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              ))}
              
              {/* Dark mode toggle in mobile menu */}
              <div className="flex items-center justify-between py-3 px-2">
                <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full p-1 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                  aria-label="Toggle dark mode"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              
              {/* Sign out button in mobile menu */}
              <button
                onClick={() => {
                  setSidebarOpen(false)
                  handleLogout()
                }}
                className="flex items-center w-full px-3 py-3 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition mt-2"
              >
                <Icons.LogoutIcon className="h-5 w-5 mr-3" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-700 px-4 lg:px-6">
          <button
            className="lg:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Icons.MenuIcon className="h-6 w-6" />
          </button>
          
          {/* Search Box */}
          <div className="flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, accounts, cards..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <kbd className="inline-flex items-center px-2 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs font-sans font-medium text-gray-400 dark:text-gray-500">
                  ⌘K
                </kbd>
              </div>
            </form>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Day/Night Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Icons.SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <Icons.MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Icons.BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* Profile Picture Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors"
              >
                <div className="hidden lg:flex flex-col items-end">
                  <p className="text-sm font-medium dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Premium Member</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold relative ring-2 ring-white dark:ring-gray-800">
                  {userInitial}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 border dark:border-gray-700 z-50 animate-fade-in">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {userInitial}
                      </div>
                      <div>
                        <p className="text-sm font-medium dark:text-white">{userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Icons.DashboardIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Icons.SettingsIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Account Settings
                    </Link>
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {darkMode ? (
                        <>
                          <Icons.SunIcon className="h-4 w-4 mr-3 text-yellow-500" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Icons.MoonIcon className="h-4 w-4 mr-3 text-gray-400" />
                          Dark Mode
                        </>
                      )}
                    </button>
                    <div className="border-t dark:border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Icons.LogoutIcon className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
EOF

# ============================================
# USER DASHBOARD HOME
# ============================================
cat > src/app/dashboard/page.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WalletIcon, CardsIcon, TransactionsIcon, TransfersIcon } from '@/components/icons'

export default function DashboardPage() {
  const [balance, setBalance] = useState(755300.00)
  const [userName, setUserName] = useState('Valued Client')
  const [greeting, setGreeting] = useState('')
  const [firstLoginToday, setFirstLoginToday] = useState(false)

  useEffect(() => {
    // Get user info from localStorage
    const email = localStorage.getItem('userEmail') || ''
    const name = email.split('@')[0] || 'Valued Client'
    setUserName(name)
    
    // Set personalized greeting based on time of day
    const hour = new Date().getHours()
    let timeGreeting = 'Good morning'
    if (hour >= 12 && hour < 17) {
      timeGreeting = 'Good afternoon'
    } else if (hour >= 17) {
      timeGreeting = 'Good evening'
    }
    
    // Check if first login today
    const lastLoginDate = localStorage.getItem('lastLoginDate')
    const today = new Date().toDateString()
    
    if (lastLoginDate !== today) {
      setFirstLoginToday(true)
      setGreeting(`${timeGreeting},`)
      localStorage.setItem('lastLoginDate', today)
    } else {
      setFirstLoginToday(false)
      setGreeting('Welcome back,')
    }
  }, [])

  const stats = [
    {
      title: 'Total Balance',
      value: `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+2.4%',
      trend: 'up',
      icon: WalletIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Monthly Income',
      value: '$12,840.50',
      change: '+5.2%',
      trend: 'up',
      icon: TransactionsIcon,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      title: 'Active Cards',
      value: '3',
      change: 'Active',
      trend: 'stable',
      icon: CardsIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Pending Transfers',
      value: '$2,500.00',
      change: '2 pending',
      trend: 'pending',
      icon: TransfersIcon,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20'
    }
  ]

  const quickActions = [
    { label: 'Send Money', icon: '→', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', href: '/dashboard/transfers' },
    { label: 'Receive Money', icon: '←', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', href: '/dashboard/deposits' },
    { label: 'Pay Bills', icon: '💳', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', href: '/dashboard/transfers' },
    { label: 'Invest', icon: '📈', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', href: '/dashboard/loans' }
  ]

  const recentTransactions = [
    { id: 1, name: 'Salary Deposit', amount: '+$5,000.00', date: 'Today', status: 'completed', type: 'credit' },
    { id: 2, name: 'Grocery Store', amount: '-$245.60', date: 'Yesterday', status: 'completed', type: 'debit' },
    { id: 3, name: 'Netflix Subscription', amount: '-$15.99', date: '2 days ago', status: 'completed', type: 'debit' },
    { id: 4, name: 'Stock Investment', amount: '-$1,000.00', date: '3 days ago', status: 'pending', type: 'investment' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {greeting} {userName}!
            </h1>
            <p className="text-blue-100 mt-2">
              {firstLoginToday ? 
                "We're glad to have you back. Here's your financial overview for today." : 
                "Welcome back to your secure banking dashboard. Here's your financial overview."}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-right">
              <p className="text-sm text-blue-200">Last updated</p>
              <p className="font-medium">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                <div className={`flex items-center mt-2 ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-amber-600'}`}>
                  <span className="text-sm font-medium">{stat.change}</span>
                  <span className="ml-1 text-xs">this month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">View all</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.bg} p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-0.5`}
              >
                <div className={`text-2xl ${action.color} mb-2`}>{action.icon}</div>
                <span className="font-medium text-gray-900 dark:text-white block">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'credit' ? 'bg-green-100 dark:bg-green-900/30' : 
                    transaction.type === 'investment' ? 'bg-blue-100 dark:bg-blue-900/30' : 
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.type === 'credit' ? '↑' : 
                     transaction.type === 'investment' ? '📈' : '↓'}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 
                    transaction.type === 'investment' ? 'text-blue-600 dark:text-blue-400' : 
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.amount}
                  </p>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}>
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bitcoin (BTC)</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">$42,850.30</p>
                <p className="text-green-600 dark:text-green-400 text-sm mt-1">+3.2% today</p>
              </div>
              <span className="text-2xl">₿</span>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ethereum (ETH)</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">$2,450.75</p>
                <p className="text-green-600 dark:text-green-400 text-sm mt-1">+1.8% today</p>
              </div>
              <span className="text-2xl">Ξ</span>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gold (XAU)</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">$2,034.50</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">-0.4% today</p>
              </div>
              <span className="text-2xl">🥇</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

# ============================================
# SETTINGS PAGE
# ============================================
cat > src/app/dashboard/settings/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import * as Icons from '@/components/icons'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: Icons.DashboardIcon },
    { id: 'password', name: 'Password Settings', icon: Icons.SettingsIcon },
    { id: '2fa', name: 'Two-Factor Authentication', icon: Icons.GrantsIcon },
    { id: 'notifications', name: 'Notifications', icon: Icons.BellIcon },
  ]

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Icons.SettingsIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">John Doe</h2>
                <p className="text-gray-500 dark:text-gray-400">Member since January 2024</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" defaultValue="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" defaultValue="Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" defaultValue="john.doe@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input type="tel" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" defaultValue="(555) 123-4567" />
              </div>
            </div>

            <div className="mt-6">
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                <input type="password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <input type="password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                <input type="password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Password Requirements:</p>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Minimum 8 characters long</li>
                  <li>• At least one lowercase character</li>
                  <li>• At least one uppercase character</li>
                  <li>• At least one number</li>
                </ul>
              </div>

              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium">
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* 2FA Tab */}
        {activeTab === '2fa' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
            <div className="max-w-2xl">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email-Based Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">
                    Disabled
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  When enabled, a 6-digit verification code will be sent to your email address each time you log in.
                </p>

                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium">
                  Enable Two-Factor Authentication
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {['Email Notifications', 'SMS Alerts', 'Push Notifications', 'Marketing Communications'].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via {item.toLowerCase()}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
EOF

# ============================================
# ADMIN LAYOUT
# ============================================
cat > src/app/admin/layout.tsx << 'EOF'
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { checkAuth, clearAuth } from '@/lib/auth/check-auth'
import * as Icons from '@/components/icons'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const adminMenuItems = [
  { label: 'Dashboard', href: '/admin', icon: Icons.DashboardIcon },
  { label: 'Deposits', href: '/admin/deposits', icon: Icons.DepositsIcon },
  { label: 'Cards', href: '/admin/cards', icon: Icons.CardsIcon },
  { label: 'Users', href: '/admin/users', icon: Icons.UsersIcon },
  { label: 'Transactions', href: '/admin/transactions', icon: Icons.TransactionsIcon },
  { label: 'Support', href: '/admin/chat', icon: Icons.SupportIcon },
  { label: 'Settings', href: '/admin/settings', icon: Icons.SettingsIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }, [isMobile])

  useEffect(() => {
    const auth = checkAuth()
    
    if (!auth.isAuthenticated || auth.role !== 'admin') {
      router.push('/auth/login')
      return
    }
    
    setUser({ email: auth.email || '', role: auth.role || 'admin' })
    setIsLoading(false)
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [router])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching admin for:', searchQuery)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const userName = user?.email?.split('@')[0] || 'Administrator'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans">
      {/* Sidebar for desktop */}
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 border-r bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border-gray-800 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className={`flex items-center px-4 mb-8 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Icons.BankIcon className="h-6 w-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <div className="text-xl font-bold text-white">Admin Panel</div>
                  <div className="text-xs text-gray-400">Global Wealth Management</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Collapse sidebar"
              >
                <Icons.ChevronLeftIcon className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          
          {sidebarCollapsed && (
            <div className="flex justify-center mb-6">
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Expand sidebar"
              >
                <Icons.ChevronRightIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {adminMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all group ${
                  sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-3'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <item.icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* User profile section */}
          <div className={`mt-auto px-4 pt-4 border-t border-gray-800 ${sidebarCollapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center mb-4' : 'justify-between mb-4'}`}>
              {!sidebarCollapsed && (
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {userInitial}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white truncate max-w-[120px]">{userName}</p>
                    <p className="text-xs text-gray-400">Super Admin</p>
                  </div>
                </div>
              )}
              
              {sidebarCollapsed && (
                <div className="relative group">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {userInitial}
                  </div>
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {userName}
                  </div>
                </div>
              )}
              
              {!sidebarCollapsed && (
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full p-1 ${darkMode ? 'bg-blue-600' : 'bg-gray-700'}`}
                  aria-label="Toggle dark mode"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              )}
            </div>
            
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 bg-red-900/30 text-red-100 rounded-lg hover:bg-red-800/40 text-sm font-medium transition flex items-center justify-center"
              >
                <Icons.LogoutIcon className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            )}
            
            {sidebarCollapsed && (
              <div className="space-y-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Icons.SunIcon className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Icons.MoonIcon className="h-5 w-5 text-gray-300" />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors relative group"
                  aria-label="Sign out"
                >
                  <Icons.LogoutIcon className="h-5 w-5 text-red-400" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Sign Out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Icons.BankIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-xl font-bold text-white">Admin Panel</div>
                  <div className="text-xs text-gray-400">Global Wealth Management</div>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <Icons.CloseIcon className="h-6 w-6 text-gray-300" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {adminMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setSidebarOpen(false)
                  handleLogout()
                }}
                className="flex items-center w-full px-3 py-3 text-red-400 rounded-lg hover:bg-red-900/20 transition mt-2"
              >
                <Icons.LogoutIcon className="h-5 w-5 mr-3" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-700 px-4 lg:px-6">
          <button
            className="lg:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Icons.MenuIcon className="h-6 w-6" />
          </button>
          
          {/* Search Box */}
          <div className="flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, transactions, deposits..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <kbd className="inline-flex items-center px-2 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs font-sans font-medium text-gray-400 dark:text-gray-500">
                  ⌘K
                </kbd>
              </div>
            </form>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Day/Night Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Icons.SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <Icons.MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Icons.BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* Profile Picture Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors"
              >
                <div className="hidden lg:flex flex-col items-end">
                  <p className="text-sm font-medium dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold relative ring-2 ring-white dark:ring-gray-800">
                  {userInitial}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 border dark:border-gray-700 z-50 animate-fade-in">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {userInitial}
                      </div>
                      <div>
                        <p className="text-sm font-medium dark:text-white">{userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Icons.DashboardIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Icons.SettingsIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Admin Settings
                    </Link>
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {darkMode ? (
                        <>
                          <Icons.SunIcon className="h-4 w-4 mr-3 text-yellow-500" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Icons.MoonIcon className="h-4 w-4 mr-3 text-gray-400" />
                          Dark Mode
                        </>
                      )}
                    </button>
                    <div className="border-t dark:border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Icons.LogoutIcon className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
EOF

# ============================================
# GLOBAL CSS UPDATE
# ============================================
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }

  body {
    @apply antialiased;
  }
}

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}
EOF

echo ""
echo "🎉 Enhanced Banking Platform Created Successfully!"
echo "=================================================="
echo ""
echo "✨ Features Added:"
echo "   • Modern, professional dashboard design"
echo "   • Collapsible sidebar with smooth transitions"
echo "   • Dark mode support throughout"
echo "   • Responsive mobile navigation"
echo "   • Search functionality with keyboard shortcut"
echo "   • Notification system with badges"
echo "   • User profile dropdown"
echo "   • Admin panel with separate styling"
echo "   • Gradient backgrounds and elegant cards"
echo "   • Interactive hover effects"
echo "   • Custom scrollbar styling"
echo "   • Loading states and animations"
echo ""
echo "📁 Pages Created:"
echo "   • User Dashboard Layout & Home"
echo "   • Settings Page (Profile, Password, 2FA, Notifications)"
echo "   • Admin Layout & Dashboard"
echo "   • Icon components library"
echo "   • Authentication utilities"
echo "   • Custom hooks"
echo ""
echo "🚀 Next Steps:"
echo "   1. Run: npm run dev"
echo "   2. Login with demo credentials"
echo "   3. Test dark mode toggle"
echo "   4. Try collapsing the sidebar"
echo "   5. Check mobile responsiveness"
echo ""
echo "✅ Your banking platform now has a premium, modern look!"
EOF

chmod +x scripts/enhance_banking_platform.sh

echo "Run: ./scripts/enhance_banking_platform.sh to create your enhanced banking platform!"