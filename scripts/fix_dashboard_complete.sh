#!/bin/bash

# Complete Dashboard Fix - Remove ALL marketing elements

set -e

echo "🔧 Fixing Dashboard - Removing ALL Marketing Elements"
echo "======================================================"

# ============================================
# FIXED DASHBOARD LAYOUT - NO MARKETING ELEMENTS
# ============================================
cat > src/app/dashboard/layout.tsx << 'EOF'
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { checkAuth, clearAuth } from '@/lib/auth/check-auth'
import * as Icons from '@/components/icons'

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
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
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      {/* Sidebar for desktop - NO MARKETING ELEMENTS */}
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 border-r bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
          {/* Logo - Only logo, no extra text */}
          <div className={`flex items-center px-4 mb-8 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <Icons.BankIcon className="h-6 w-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">GWMB</span>
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

          {/* User profile section - Only user info, no marketing */}
          <div className={`mt-auto px-4 pt-4 border-t dark:border-gray-700 ${sidebarCollapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center mb-4' : 'justify-between mb-4'}`}>
              {!sidebarCollapsed && (
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {userInitial}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium dark:text-white truncate max-w-[120px]">{userName}</p>
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

      {/* Mobile sidebar - NO MARKETING ELEMENTS */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <Icons.BankIcon className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">GWMB</span>
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
        {/* Top Navigation - NO MARKETING ELEMENTS */}
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
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold relative ring-2 ring-white dark:ring-gray-800">
                  {userInitial}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 border dark:border-gray-700 z-50 animate-fade-in">
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t dark:border-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      handleLogout()
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
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
# FIXED HEADER COMPONENT - REMOVE MARKETING FROM PUBLIC PAGES
# ============================================
cat > src/components/layout/Header.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Don't show header on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Wealth Management', href: '/wealth-management' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' }
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>Routing # 655205039</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">24/7 Customer Support</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="tel:+447451272406" className="hover:text-blue-200">+44-800-BANKING</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
                alt="Oldspring Trust Bank"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 border-b-2 border-blue-600 py-1'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                LOGIN
              </Link>
              <Link
                href="/auth/signup"
                className="border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
              >
                OPEN ACCOUNT
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <nav className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col space-y-2 border-t">
                  <Link
                    href="/auth/login"
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg text-sm font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    OPEN ACCOUNT
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Branch Hours Strip - Only on marketing pages */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src="/templates/bank-pro/static-strip-icons/ico-clock-new.svg" className="w-4 h-4" alt="" />
                <span className="font-medium">Branch Hours:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <span>Mon-Thu: 8:30-5:00</span>
                <span className="hidden sm:inline">|</span>
                <span>Fri: 8:30-6:00</span>
                <span className="hidden sm:inline">|</span>
                <span>Sat: 9:00-1:00</span>
              </div>
            </div>
            <a href="mailto:support@oldspringtrust.com" className="text-blue-600 hover:text-blue-700 font-medium hidden md:block">
              support@oldspringtrust.com
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
EOF

# ============================================
# FIXED ROOT LAYOUT
# ============================================
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Oldspring Trust Bank - Mobile Banking, Credit Cards, Mortgages',
  description: 'Mobile Banking, Credit Cards, Mortgages, Auto Loan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
EOF

# ============================================
# SIMPLE DASHBOARD HOME TO TEST
# ============================================
cat > src/app/dashboard/page.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || ''
    const name = email.split('@')[0] || 'User'
    setUserName(name)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Welcome back, {userName}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$755,300.00</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Income</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$12,840.50</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Cards</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Transactions</h2>
        <p className="text-gray-500 dark:text-gray-400">No recent transactions</p>
      </div>
    </div>
  )
}
EOF

echo ""
echo "✅ Dashboard Fixed!"
echo "==================="
echo ""
echo "🔧 Fixes Applied:"
echo "   • Header now checks pathname - won't show on dashboard pages"
echo "   • Dashboard layout has NO marketing elements"
echo "   • Only logo and user menu in dashboard header"
echo "   • Removed all duplicate branch hours and routing numbers"
echo "   • Clean, simple dashboard layout"
echo ""
echo "📱 What you'll see now:"
echo "   • Marketing pages: Full header with navigation, branch hours"
echo "   • Dashboard pages: Clean layout with only sidebar and user menu"
echo "   • No duplicate elements"
echo "   • No marketing in dashboard"
echo ""
echo "🚀 Run: npm run dev and test:"
echo "   1. Go to / - see full marketing header"
echo "   2. Login to /dashboard - see clean dashboard with NO marketing"
echo ""
echo "✅ Your dashboard is now fixed!"
EOF

chmod +x scripts/fix_dashboard_complete.sh

echo "Run: ./scripts/fix_dashboard_complete.sh to fix your dashboard!"