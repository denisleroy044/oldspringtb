#!/bin/bash

# Script: 4_create_dashboard_components.sh
# Description: Create dashboard components

set -e

echo "📊 Creating dashboard components..."

mkdir -p src/components/dashboard

# Account Cards Component
cat > src/components/dashboard/AccountCards.tsx << 'EOF'
'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'

interface Account {
  id: string
  accountNumber: string
  accountType: string
  balance: number
  currency: string
}

export function AccountCards() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/user/accounts')
      const data = await response.json()
      setAccounts(data.accounts)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading accounts...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {accounts.map((account) => (
        <div key={account.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 capitalize">{account.accountType}</p>
              <p className="text-xs text-gray-400">{account.accountNumber.slice(-4)}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-deep-teal to-sage rounded-full flex items-center justify-center text-white font-bold">
              {account.currency}
            </div>
          </div>
          <p className="text-2xl font-bold text-deep-teal">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: account.currency
            }).format(account.balance)}
          </p>
        </div>
      ))}
    </div>
  )
}
EOF

# Quick Actions Component
cat > src/components/dashboard/QuickActions.tsx << 'EOF'
'use client'

import Link from 'next/link'

const actions = [
  { name: 'Send Money', href: '/dashboard/transfers/local', icon: '↗️', color: 'bg-blue-500' },
  { name: 'Add Money', href: '/dashboard/deposit', icon: '📥', color: 'bg-green-500' },
  { name: 'Pay Bills', href: '/dashboard/payments', icon: '📄', color: 'bg-purple-500' },
  { name: 'Cards', href: '/dashboard/cards', icon: '💳', color: 'bg-orange-500' },
  { name: 'Loans', href: '/dashboard/loans', icon: '🏦', color: 'bg-red-500' },
  { name: 'Support', href: '/dashboard/support', icon: '💬', color: 'bg-teal-500' }
]

export function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-deep-teal mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow group"
          >
            <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center text-white text-xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
EOF

# Market Watch Component
cat > src/components/dashboard/MarketWatch.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export function MarketWatch() {
  const [markets, setMarkets] = useState<MarketData[]>([
    { symbol: 'BTC/USD', price: 70412, change: 1234, changePercent: 1.78 },
    { symbol: 'ETH/USD', price: 3521, change: -45, changePercent: -1.26 },
    { symbol: 'S&P 500', price: 5123, change: 23, changePercent: 0.45 },
    { symbol: 'GOLD', price: 2150, change: 12, changePercent: 0.56 }
  ])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-deep-teal mb-4">Market Watch</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {markets.map((market) => (
          <div key={market.symbol} className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">{market.symbol}</p>
            <p className="text-lg font-bold text-deep-teal">
              ${market.price.toLocaleString()}
            </p>
            <p className={`text-xs ${market.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {market.change >= 0 ? '+' : ''}{market.change} ({market.changePercent}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
EOF

# Dashboard Header
cat > src/components/dashboard/Header.tsx << 'EOF'
'use client'

import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import Link from 'next/link'

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/dashboard" className="text-xl font-bold text-deep-teal">
            Dashboard
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-deep-teal to-sage rounded-full flex items-center justify-center text-white font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border">
              <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </Link>
              <hr className="my-1" />
              <button
                onClick={() => logout()}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
EOF

# Sidebar Component
cat > src/components/dashboard/Sidebar.tsx << 'EOF'
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const menuItems = [
  { section: 'MAIN', items: [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Accounts', href: '/dashboard/accounts', icon: '💰' },
    { name: 'Cards', href: '/dashboard/cards', icon: '💳' },
  ]},
  { section: 'TRANSFERS', items: [
    { name: 'Send Money', href: '/dashboard/transfers/local', icon: '↗️' },
    { name: 'International', href: '/dashboard/transfers/international', icon: '🌍' },
    { name: 'Deposit', href: '/dashboard/deposit', icon: '📥' },
  ]},
  { section: 'SERVICES', items: [
    { name: 'Loans', href: '/dashboard/loans', icon: '🏦' },
    { name: 'Payments', href: '/dashboard/payments', icon: '📄' },
    { name: 'Support', href: '/dashboard/support', icon: '💬' },
  ]},
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className={`bg-white border-r border-gray-200 ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 hidden md:block`}>
      <div className="p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-6 p-2 hover:bg-gray-100 rounded-lg"
        >
          {isOpen ? '◀' : '▶'}
        </button>

        <nav className="space-y-6">
          {menuItems.map((section) => (
            <div key={section.section}>
              {isOpen && (
                <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">
                  {section.section}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-deep-teal text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {isOpen && <span className="ml-3">{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
EOF

# Footer Component
cat > src/components/dashboard/Footer.tsx << 'EOF'
export function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 px-4 md:px-8 py-4">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Oldspring Trust. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-deep-teal">Privacy</a>
          <a href="#" className="hover:text-deep-teal">Terms</a>
          <a href="#" className="hover:text-deep-teal">Help</a>
        </div>
      </div>
    </footer>
  )
}
EOF

echo "✅ Dashboard components created!"
EOF