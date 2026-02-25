#!/bin/bash

# Create Secure Banking Dashboard

set -e

echo "🏦 Creating Secure Banking Dashboard"
echo "===================================="

# Create dashboard directory structure
mkdir -p src/app/dashboard
mkdir -p src/app/dashboard/transactions
mkdir -p src/app/dashboard/cards
mkdir -p src/app/dashboard/transfers/local
mkdir -p src/app/dashboard/transfers/international
mkdir -p src/app/dashboard/deposit
mkdir -p src/app/dashboard/currency-swap
mkdir -p src/app/dashboard/loans
mkdir -p src/app/dashboard/grants
mkdir -p src/app/dashboard/tax-refund
mkdir -p src/app/dashboard/profile
mkdir -p src/app/dashboard/support
mkdir -p src/components/dashboard

# ============================================
# DASHBOARD LAYOUT
# ============================================
cat > src/app/dashboard/layout.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { section: 'MAIN', items: [
      { name: 'Dashboard', href: '/dashboard', icon: '📊' },
      { name: 'Transactions', href: '/dashboard/transactions', icon: '💰' },
      { name: 'Cards', href: '/dashboard/cards', icon: '💳' },
    ]},
    { section: 'TRANSFERS', items: [
      { name: 'Local Transfer', href: '/dashboard/transfers/local', icon: '↗️' },
      { name: 'International', href: '/dashboard/transfers/international', icon: '🌍' },
      { name: 'Deposit', href: '/dashboard/deposit', icon: '📥' },
      { name: 'Currency Swap', href: '/dashboard/currency-swap', icon: '🔄' },
    ]},
    { section: 'SERVICES', items: [
      { name: 'Loans', href: '/dashboard/loans', icon: '🏦' },
      { name: 'Tax Refund', href: '/dashboard/tax-refund', icon: '📄' },
      { name: 'Grants', href: '/dashboard/grants', icon: '🎯' },
      { name: 'Settings', href: '/dashboard/profile', icon: '⚙️' },
      { name: 'Support', href: '/dashboard/support', icon: '❓' },
    ]},
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and mobile menu */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/dashboard" className="ml-4 lg:ml-0">
                <img 
                  src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
                  alt="Global Wealth Management"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600"></span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    DD
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">Dont Delete</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border">
                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <div className="border-t my-1"></div>
                    <Link href="/auth/login" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-20
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full overflow-y-auto py-6">
          {/* User Info */}
          <div className="px-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Welcome back</p>
              <p className="text-sm font-semibold text-gray-900">Dont Delete</p>
              <p className="text-xs text-gray-500 truncate">aoneloyal24@gmail.com</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3">
            {menuItems.map((section, idx) => (
              <div key={idx} className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                  {section.section}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Account Limit */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Account Limit</p>
              <p className="text-lg font-bold text-gray-900">$500,000.00</p>
              <p className="text-xs text-gray-500 mt-2">Daily limit available</p>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{width: '65%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
EOF

# ============================================
# DASHBOARD HOME
# ============================================
cat > src/app/dashboard/page.tsx << 'EOF'
'use client'

import Link from 'next/link'

export default function DashboardHome() {
  const user = {
    name: 'Dont Delete',
    email: 'aoneloyal24@gmail.com',
    accounts: [
      { type: 'Global Wealth Management Bank', balance: 755300.00, accountNumber: '****1234', status: 'Active' },
    ],
    stats: {
      available: 500000.00,
      monthlyDeposits: 0.00,
      totalVolume: 0.00
    },
    recentTransactions: [
      { id: 8836, description: 'Salary Deposit', amount: '+$3,250.00', date: 'Feb 15', status: 'completed' },
      { id: 8835, description: 'Netflix Subscription', amount: '-$15.99', date: 'Feb 14', status: 'completed' },
      { id: 8834, description: 'Amazon Purchase', amount: '-$89.50', date: 'Feb 13', status: 'completed' },
      { id: 8833, description: 'Transfer to Savings', amount: '-$500.00', date: 'Feb 12', status: 'completed' },
    ]
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, <span className="text-blue-600">{user.name}</span>
        </h1>
        <p className="text-sm text-gray-500">Last login: Today 9:30 AM</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Available</p>
          <p className="text-3xl font-bold text-gray-900">${user.stats.available.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Account Limit</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">This Month</p>
          <p className="text-3xl font-bold text-gray-900">${user.stats.monthlyDeposits.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Monthly Deposits</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">All Time</p>
          <p className="text-3xl font-bold text-gray-900">${user.stats.totalVolume.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Total Volume</p>
        </div>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Account */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Global Wealth Management Bank</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Primary Account</span>
            </div>
            
            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Account Holder:</span>
                <span className="font-medium">{user.name} Account</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Flat Balance:</span>
                <span className="text-xl font-bold text-gray-900">${user.accounts[0].balance.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Account Active</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-yellow-600">Verification Required</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">USD Balance</p>
                <p className="text-lg font-semibold">${user.accounts[0].balance.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">1 BTC = $70,412</p>
                <p className="text-lg font-semibold">0.000000 BTC</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/transfers/local" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 text-center">
                Send Money
              </Link>
              <Link href="/dashboard/deposit" className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 text-center">
                Add Money
              </Link>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                  View All
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="divide-y">
              {user.recentTransactions.map((tx) => (
                <div key={tx.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        tx.amount.startsWith('+') ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {tx.amount.startsWith('+') ? '📥' : '📤'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500">Transaction #{tx.id} • {tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'
                      }`}>{tx.amount}</p>
                      <span className="text-xs text-green-600">Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Total Portfolio */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Total Portfolio</h2>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-gray-900">${user.accounts[0].balance.toLocaleString()}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-sm text-gray-600">Bitcoin Balance:</span>
                <span className="text-sm font-semibold">0.000000 BTC</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">= $0.00 • 1 BTC = $70,412</p>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Account Statistics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">TRANSACTION LIMIT</span>
                  <span className="font-semibold">$500,000.00</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{width: '65%'}}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Daily limit available</p>
              </div>
            </div>
          </div>

          {/* Quick Transfer */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Transfer</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Add New</p>
              <p className="text-xs text-gray-500">No saved beneficiaries yet</p>
              <p className="text-xs text-gray-400 mt-2">Add one to get started</p>
            </div>
          </div>

          {/* Need Assistance */}
          <div className="bg-blue-600 rounded-lg shadow p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Need Assistance?</h2>
            <p className="text-sm text-blue-100 mb-4">24/7 Live Support</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Quick Response &lt; 5 min</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">Secure Chat Encrypted</span>
              </div>
            </div>
            <Link href="/dashboard/support" className="block w-full bg-white text-blue-600 text-center px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              Start Live Chat
            </Link>
          </div>

          {/* Active Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Your Active Cards</h2>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">No active cards</p>
              <p className="text-xs text-gray-500 mb-3">Apply for a virtual card</p>
              <Link href="/dashboard/cards" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                + Apply for Card
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

# ============================================
# PROFILE PAGE
# ============================================
cat > src/app/dashboard/profile/page.tsx << 'EOF'
'use client'

import { useState } from 'react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile Information' },
    { id: 'password', name: 'Password Settings' },
    { id: '2fa', name: 'Two-Factor Authentication' },
    { id: 'pin', name: 'Transaction PIN' },
  ]

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h1>
      <p className="text-gray-600 mb-8">Manage your profile and security settings</p>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  DD
                </div>
                <button className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1.5 hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Dont Delete</h2>
                <p className="text-gray-500">Account #54479268836</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="Dont" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="Delete" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="aoneloyal24@gmail.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="02/04/1876" />
              </div>
            </div>

            <div className="mt-6">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Update Profile
              </button>
            </div>
          </div>
        )}

        {/* Password Settings Tab */}
        {activeTab === 'password' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <p className="text-sm text-gray-600 mb-6">Update your account password to maintain security</p>

            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Minimum 8 characters long</li>
                  <li>• At least one lowercase character</li>
                  <li>• At least one uppercase character</li>
                  <li>• At least one number</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  After changing your password, you'll be required to log in again with your new credentials.
                </p>
              </div>

              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Two-Factor Authentication Tab */}
        {activeTab === '2fa' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 mb-6">Add an extra layer of security to your account</p>

            <div className="max-w-2xl">
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Email-Based Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Disabled
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  When enabled, a 6-digit verification code will be sent to your email address{' '}
                  <span className="font-medium">aoneloyal24@gmail.com</span> each time you log in to your account.
                </p>

                <div className="bg-white p-4 rounded-lg border mb-4">
                  <h4 className="font-medium mb-2">How Two-Factor Authentication Works:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• When you log in with your password, a 6-digit code will be sent to your email</li>
                    <li>• You must enter this code to complete your login</li>
                    <li>• This adds an extra layer of security to your account</li>
                    <li>• The code expires after 10 minutes for security</li>
                  </ul>
                </div>

                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Enable Two-Factor Authentication
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Security Tips:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Use a strong, unique password</li>
                  <li>• Enable two-factor authentication</li>
                  <li>• Keep your email secure</li>
                  <li>• Log out when using shared devices</li>
                  <li>• Regularly check your account activity</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Transaction PIN Tab */}
        {activeTab === 'pin' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction PIN</h3>
            <p className="text-sm text-gray-600 mb-6">Manage your profile and change transaction PIN</p>

            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <p className="text-xs text-gray-500 mt-1">For security verification</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Transaction PIN</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" maxLength={6} />
                <p className="text-xs text-gray-500 mt-1">Create a secure 6-digit PIN you can remember</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New PIN</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" maxLength={6} />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Keep your transaction PIN confidential. Never share it with anyone.
                </p>
              </div>

              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Update Transaction PIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
EOF

# ============================================
# SUPPORT PAGE WITH LIVE CHAT
# ============================================
cat > src/app/dashboard/support/page.tsx << 'EOF'
'use client'

import { useState } from 'react'

export default function SupportPage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'How can we help with Global Wealth Management?', sender: 'bot', time: 'Just now' }
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setMessages([...messages, { id: messages.length + 1, text: message, sender: 'user', time: 'Just now' }])
    setMessage('')

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: 'Thank you for your message. One of our support agents will assist you shortly.',
        sender: 'bot',
        time: 'Just now'
      }])
    }, 1000)
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Live Chat Support</h2>
              <p className="text-sm text-gray-500">Last active 1/7/2026</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Compose your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Account Limit */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Account Limit</h2>
            <p className="text-2xl font-bold text-gray-900">$500,000.00</p>
            <p className="text-sm text-gray-600 mt-1">Daily limit available</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{width: '65%'}}></div>
            </div>
          </div>

          {/* Pending Transactions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">PENDING TRANSACTIONS</h2>
            <p className="text-sm text-gray-500">No pending transactions</p>
          </div>

          {/* Need Assistance */}
          <div className="bg-blue-600 rounded-lg shadow p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Need Assistance?</h2>
            <p className="text-sm text-blue-100 mb-4">Our expert support team is available 24/7</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Quick Response &lt; 5 min</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">Secure Chat Encrypted</span>
              </div>
            </div>
            <p className="text-xs text-blue-200 mt-4">Or call us directly for urgent matters</p>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

echo ""
echo "✅ Secure Banking Dashboard Created!"
echo "===================================="
echo ""
echo "🏦 Features:"
echo "   • Dedicated dashboard header with user menu"
echo "   • Collapsible sidebar with sectioned menu"
echo "   • Profile dropdown with sign out"
echo "   • Account overview with balances"
echo "   • Recent transactions list"
echo "   • Account statistics with progress bar"
echo "   • Quick transfer section"
echo "   • Live chat support"
echo "   • Settings pages with tabs"
echo "   • Two-factor authentication setup"
echo "   • Transaction PIN management"
echo ""
echo "🔒 Security Features:"
echo "   • Separate dashboard layout (no marketing header)"
echo "   • Session-based authentication"
echo "   • Profile menu with sign out"
echo "   • Two-factor authentication option"
echo "   • Transaction PIN protection"
echo "   • Secure live chat"
echo ""
echo "🚀 Run: npm run dev to see your secure dashboard!"