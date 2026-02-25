#!/bin/bash

# Oldspring Trust Bank - Next.js Dashboard Setup
set -e

echo "🏦 Setting up Oldspring Trust Bank Dashboard for Next.js"
echo "========================================================"

# Create dashboard directory structure
mkdir -p src/app/dashboard
mkdir -p src/app/dashboard/deposit
mkdir -p src/app/dashboard/transfer
mkdir -p src/app/dashboard/card
mkdir -p src/app/dashboard/transactions
mkdir -p src/app/dashboard/account
mkdir -p src/app/dashboard/calendar
mkdir -p src/components/dashboard
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/context
mkdir -p public/assets/img
mkdir -p public/assets/img/avatars

# ============================================
# PACKAGE.JSON with stable dependencies
# ============================================
cat > package.json << 'EOF'
{
  "name": "oldspring-trust-bank",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5"
  }
}
EOF

# ============================================
# TAILWIND CONFIG (v3 format)
# ============================================
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        'primary-dark': '#0f2a44',
        'primary-light': '#2b4c7a',
        accent: '#e68a2e',
        'accent-light': '#f5a344',
      },
    },
  },
  plugins: [],
}
EOF

# ============================================
# POSTCSS CONFIG (standard v3)
# ============================================
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# ============================================
# GLOBAL CSS (standard v3)
# ============================================
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #1e3a5f;
  --primary-dark: #0f2a44;
  --primary-light: #2b4c7a;
  --accent: #e68a2e;
  --accent-light: #f5a344;
}

@layer base {
  body {
    @apply antialiased text-gray-800;
  }
}

@layer components {
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .btn-primary {
    @apply bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2b4c7a] transition duration-300;
  }

  .btn-accent {
    @apply bg-[#e68a2e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#f5a344] transition duration-300;
  }

  .btn-outline {
    @apply border-2 border-[#1e3a5f] text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-[#1e3a5f] hover:text-white transition duration-300;
  }

  .dashboard-card {
    @apply bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl;
  }

  .status-badge {
    @apply px-2 py-1 text-xs font-medium rounded-full;
  }

  .status-badge-completed {
    @apply bg-green-100 text-green-800;
  }

  .status-badge-pending {
    @apply bg-yellow-100 text-yellow-800;
  }

  .status-badge-failed {
    @apply bg-red-100 text-red-800;
  }
}

@layer utilities {
  .animation-slide-in {
    animation: slideIn 0.5s ease-out;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #1e3a5f;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2b4c7a;
}
EOF

# ============================================
# DASHBOARD TYPES
# ============================================
cat > src/types/dashboard.ts << 'EOF'
export interface User {
  id: string;
  name: string;
  email: string;
  accountName: string;
  accountStatus: string;
  lastLogin: string;
  avatar: string;
  personalAccount: {
    number: string;
    balance: number;
  };
  checkingAccount: {
    number: string;
    balance: number;
  };
}

export interface Transaction {
  id: number;
  accountName: string;
  accountNumber: string;
  bankName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  type: 'credit' | 'debit';
}
EOF

# ============================================
# DASHBOARD HOOKS
# ============================================
cat > src/hooks/useDashboard.ts << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { User, Transaction } from '@/types/dashboard'

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  accountName: 'Johnathan M. Doe',
  accountStatus: 'Premium Member',
  lastLogin: '2024-02-16 09:30 AM',
  avatar: '/assets/img/avatars/default-avatar.png',
  personalAccount: {
    number: '**** 4582 9632 7410',
    balance: 54750.80
  },
  checkingAccount: {
    number: '**** 1122 3344 5566',
    balance: 12350.25
  }
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    accountName: 'Amazon Prime',
    accountNumber: '**** 7890',
    bankName: 'Amazon Payments',
    amount: 14.99,
    status: 'completed',
    date: '2024-02-16',
    type: 'debit'
  },
  {
    id: 2,
    accountName: 'Salary Deposit',
    accountNumber: '**** 1234',
    bankName: 'Employer Corp',
    amount: 3500.00,
    status: 'completed',
    date: '2024-02-15',
    type: 'credit'
  },
  {
    id: 3,
    accountName: 'Netflix Subscription',
    accountNumber: '**** 5678',
    bankName: 'Netflix Inc',
    amount: 15.99,
    status: 'completed',
    date: '2024-02-14',
    type: 'debit'
  },
  {
    id: 4,
    accountName: 'Walmart',
    accountNumber: '**** 9012',
    bankName: 'Walmart',
    amount: 234.56,
    status: 'completed',
    date: '2024-02-13',
    type: 'debit'
  },
  {
    id: 5,
    accountName: 'Transfer to Savings',
    accountNumber: '**** 3456',
    bankName: 'Oldspring Trust',
    amount: 500.00,
    status: 'completed',
    date: '2024-02-12',
    type: 'debit'
  },
  {
    id: 6,
    accountName: 'Dividend Payment',
    accountNumber: '**** 7890',
    bankName: 'Investment Co',
    amount: 125.50,
    status: 'completed',
    date: '2024-02-11',
    type: 'credit'
  }
]

export function useDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setUser(mockUser)
        setTransactions(mockTransactions)
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { user, transactions, loading, error }
}
EOF

# ============================================
# DASHBOARD CONTEXT
# ============================================
cat > src/context/DashboardContext.tsx << 'EOF'
'use client'

import React, { createContext, useContext } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { User, Transaction } from '@/types/dashboard'

interface DashboardContextType {
  user: User | null
  transactions: Transaction[]
  loading: boolean
  error: string | null
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const dashboardData = useDashboard()

  return (
    <DashboardContext.Provider value={dashboardData}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider')
  }
  return context
}
EOF

# ============================================
# SIDEBAR COMPONENT
# ============================================
cat > src/components/dashboard/Sidebar.tsx << 'EOF'
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface MenuItem {
  name: string
  href: string
  icon: string
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Deposit', href: '/dashboard/deposit', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { name: 'Transfer', href: '/dashboard/transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { name: 'Manage Card', href: '/dashboard/card', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { name: 'Transactions', href: '/dashboard/transactions', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Account', href: '/dashboard/account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-[#1e3a5f] to-[#0f2a44] text-white transition-all duration-300 min-h-screen fixed left-0 top-0 z-20`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#e68a2e] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            {!collapsed && <span className="font-bold text-lg">OST Bank</span>}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-[#2b4c7a] transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                  isActive 
                    ? 'bg-[#e68a2e] text-white' 
                    : 'text-gray-300 hover:bg-[#2b4c7a] hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/auth/logout"
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-[#2b4c7a] hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </div>
    </aside>
  )
}
EOF

# ============================================
# HEADER COMPONENT
# ============================================
cat > src/components/dashboard/Header.tsx << 'EOF'
'use client'

import { useDashboardContext } from '@/context/DashboardContext'
import { useState } from 'react'

export function Header() {
  const { user } = useDashboardContext()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  if (!user) return null

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 h-16">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="relative">
            {showSearch ? (
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            ) : (
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">{user.accountName}</p>
                <p className="text-xs text-gray-500">{user.accountStatus}</p>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <a href="/dashboard/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                <a href="/dashboard/calendar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Calendar
                </a>
                <hr className="my-1" />
                <a href="/auth/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 px-6 py-1 text-xs text-gray-500">
        Last Login: {user.lastLogin}
      </div>
    </header>
  )
}
EOF

# ============================================
# ACCOUNT CARDS COMPONENT
# ============================================
cat > src/components/dashboard/AccountCards.tsx << 'EOF'
'use client'

import { useDashboardContext } from '@/context/DashboardContext'

export function AccountCards() {
  const { user } = useDashboardContext()

  if (!user) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Personal Account</p>
            <p className="text-lg font-mono font-bold text-[#1e3a5f]">{user.personalAccount.number}</p>
            <p className="text-xs text-gray-400 mt-1">Account Number</p>
          </div>
          <div className="w-10 h-10 bg-[#1e3a5f] bg-opacity-10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1 bg-gray-200 rounded">
            <div className="h-1 bg-[#1e3a5f] rounded w-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Personal Balance</p>
            <p className="text-2xl font-bold text-[#1e3a5f]">
              ${user.personalAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">Available Balance</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1 bg-gray-200 rounded">
            <div className="h-1 bg-green-500 rounded w-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Checking Account</p>
            <p className="text-lg font-mono font-bold text-[#1e3a5f]">{user.checkingAccount.number}</p>
            <p className="text-xs text-gray-400 mt-1">Account Number</p>
          </div>
          <div className="w-10 h-10 bg-[#1e3a5f] bg-opacity-10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1 bg-gray-200 rounded">
            <div className="h-1 bg-[#1e3a5f] rounded w-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Checking Balance</p>
            <p className="text-2xl font-bold text-[#1e3a5f]">
              ${user.checkingAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">Available Balance</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1 bg-gray-200 rounded">
            <div className="h-1 bg-blue-500 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

# ============================================
# TRANSACTIONS TABLE COMPONENT
# ============================================
cat > src/components/dashboard/TransactionsTable.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useDashboardContext } from '@/context/DashboardContext'

export function TransactionsTable() {
  const { transactions } = useDashboardContext()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  if (!transactions) return null

  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = transactions.slice(startIndex, endIndex)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAmountColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-[#1e3a5f]">Recent Transactions</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.accountName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.accountNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.bankName}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getAmountColor(transaction.type)}`}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1e3a5f] hover:bg-gray-200'}`}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1e3a5f] hover:bg-gray-200'}`}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#1e3a5f] hover:bg-gray-200'}`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#1e3a5f] hover:bg-gray-200'}`}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
EOF

# ============================================
# QUICK ACTIONS COMPONENT
# ============================================
cat > src/components/dashboard/QuickActions.tsx << 'EOF'
'use client'

import Link from 'next/link'

const actions = [
  { name: 'Make a Deposit', href: '/dashboard/deposit', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', color: 'bg-green-500' },
  { name: 'Transfer Funds', href: '/dashboard/transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'bg-blue-500' },
  { name: 'Manage Cards', href: '/dashboard/card', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', color: 'bg-purple-500' },
  { name: 'View Statements', href: '/dashboard/transactions', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-orange-500' },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group p-4 border border-gray-200 rounded-lg hover:border-[#1e3a5f] hover:shadow-md transition"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-[#1e3a5f]">{action.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
EOF

# ============================================
# RECENT ACTIVITY COMPONENT
# ============================================
cat > src/components/dashboard/RecentActivity.tsx << 'EOF'
'use client'

import { useDashboardContext } from '@/context/DashboardContext'

export function RecentActivity() {
  const { transactions } = useDashboardContext()

  if (!transactions) return null

  const recentTransactions = transactions.slice(0, 3)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {transaction.type === 'credit' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  )}
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{transaction.accountName}</p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
            </div>
            <p className={`text-sm font-semibold ${
              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
EOF

# ============================================
# MAIN DASHBOARD PAGE
# ============================================
cat > src/app/dashboard/page.tsx << 'EOF'
'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { AccountCards } from '@/components/dashboard/AccountCards'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'

function DashboardContent() {
  const { user, loading } = useDashboardContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load user data</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="lg:ml-64">
        <Header />
        <main className="pt-24 px-6 pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1e3a5f]">
              Welcome back, {user.accountName.split(' ')[0]}!
            </h1>
          </div>

          <AccountCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <TransactionsTable />
            </div>
            <div className="space-y-6">
              <QuickActions />
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}
EOF

# ============================================
# DASHBOARD LAYOUT
# ============================================
cat > src/app/dashboard/layout.tsx << 'EOF'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
EOF

# ============================================
# ROOT LAYOUT
# ============================================
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Oldspring Trust Bank - Dashboard',
  description: 'Secure Online Banking Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

# ============================================
# CREATE DEFAULT AVATAR (base64 encoded 1x1 transparent PNG)
# ============================================
echo "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" | base64 -d > public/assets/img/avatars/default-avatar.png 2>/dev/null || true

# ============================================
# CREATE MOCK API ROUTES
# ============================================
mkdir -p src/app/api/dashboard

cat > src/app/api/dashboard/route.ts << 'EOF'
import { NextResponse } from 'next/server'

export async function GET() {
  const mockData = {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      accountName: 'Johnathan M. Doe',
      accountStatus: 'Premium Member',
      lastLogin: '2024-02-16 09:30 AM',
      avatar: '/assets/img/avatars/default-avatar.png',
      personalAccount: {
        number: '**** 4582 9632 7410',
        balance: 54750.80
      },
      checkingAccount: {
        number: '**** 1122 3344 5566',
        balance: 12350.25
      }
    },
    transactions: [
      {
        id: 1,
        accountName: 'Amazon Prime',
        accountNumber: '**** 7890',
        bankName: 'Amazon Payments',
        amount: 14.99,
        status: 'completed',
        date: '2024-02-16',
        type: 'debit'
      },
      {
        id: 2,
        accountName: 'Salary Deposit',
        accountNumber: '**** 1234',
        bankName: 'Employer Corp',
        amount: 3500.00,
        status: 'completed',
        date: '2024-02-15',
        type: 'credit'
      }
    ]
  }

  return NextResponse.json(mockData)
}
EOF

# ============================================
# CREATE TYPESCRIPT CONFIG
# ============================================
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# ============================================
# CREATE NEXT CONFIG
# ============================================
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
EOF

# ============================================
# CLEAR CACHE AND FINISH
# ============================================
echo ""
echo "✅ Oldspring Trust Bank Dashboard Created Successfully!"
echo "========================================================"
echo ""
echo "📁 Dashboard Structure:"
echo "   • Modern sidebar navigation"
echo "   • Professional header with user menu"
echo "   • Account summary cards"
echo "   • Transaction history with pagination"
echo "   • Quick actions panel"
echo "   • Recent activity feed"
echo ""
echo "🎨 Features Implemented:"
echo "   • Responsive design"
echo "   • Animated transitions"
echo "   • Loading states"
echo "   • Error handling"
echo "   • TypeScript support"
echo "   • Mock API routes"
echo "   • Context for state management"
echo ""
echo "🎨 Color Scheme:"
echo "   • Primary: #1e3a5f (Navy Blue)"
echo "   • Accent: #e68a2e (Gold)"
echo ""
echo "🚀 To start:"
echo "   1. cd your-project-directory"
echo "   2. rm -rf node_modules package-lock.json (clean install)"
echo "   3. npm install"
echo "   4. npm run dev"
echo "   5. Visit: http://localhost:3000/dashboard"
echo ""
echo "✅ Your professional banking dashboard is ready!"
EOF

# Make the script executable
chmod +x scripts/setup_dashboard.sh

echo ""
echo "Script saved to: scripts/setup_dashboard.sh"
echo "Run it with: ./scripts/setup_dashboard.sh"