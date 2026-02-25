#!/bin/bash

# Clean Dashboard Based on Reference Images

set -e

echo "🏦 Creating Clean Dashboard from Reference Images"
echo "================================================="

# ============================================
# DASHBOARD LAYOUT
# ============================================
cat > src/app/dashboard/layout.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/auth/login')
      return
    }
    setUser(email)
  }, [router])

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
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user.split('@')[0] || 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-20 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full overflow-y-auto py-6">
          {/* User Info */}
          <div className="px-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Welcome back</p>
              <p className="text-sm font-semibold text-gray-900">{user.split('@')[0] || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user}</p>
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
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
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
      <main className="lg:pl-64 pt-16 min-h-screen">
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

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [userName, setUserName] = useState('User')
  const [balance] = useState(755300.00)

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || ''
    const name = email.split('@')[0] || 'User'
    setUserName(name)
  }, [])

  const stats = [
    { label: 'Available', value: '$500,000.00', subtext: 'Account Limit' },
    { label: 'This Month', value: '$0.00', subtext: 'Monthly Deposits' },
    { label: 'All Time', value: '$0.00', subtext: 'Total Volume' },
  ]

  const recentTransactions = [
    { id: 1, description: 'Salary Deposit', amount: '+$3,250.00', date: 'Feb 15' },
    { id: 2, description: 'Netflix Subscription', amount: '-$15.99', date: 'Feb 14' },
    { id: 3, description: 'Amazon Purchase', amount: '-$89.50', date: 'Feb 13' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, <span className="text-blue-600">{userName}</span>
        </h1>
        <p className="text-sm text-gray-500">Last login: Today 9:30 AM</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
          </div>
        ))}
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
                <span className="font-medium">{userName} Account</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="text-xl font-bold text-gray-900">${balance.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">USD Balance</p>
                <p className="text-lg font-semibold">${balance.toLocaleString()}</p>
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
                <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-700">
                  View All →
                </Link>
              </div>
            </div>
            
            <div className="divide-y">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.amount.startsWith('+') ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {tx.amount.startsWith('+') ? '📥' : '📤'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                      {tx.amount}
                    </p>
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
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">${balance.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Bitcoin Balance: 0.000000 BTC</p>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Account Statistics</h2>
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

          {/* Need Assistance */}
          <div className="bg-blue-600 rounded-lg shadow p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Need Assistance?</h2>
            <p className="text-sm text-blue-100 mb-4">24/7 Live Support</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <span>⚡</span>
                <span className="text-sm">Quick Response &lt; 5 min</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔒</span>
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
                💳
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">No active cards</p>
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
# LOCAL TRANSFER PAGE
# ============================================
mkdir -p src/app/dashboard/transfers/local

cat > src/app/dashboard/transfers/local/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LocalTransferPage() {
  const [amount, setAmount] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Local Transfer</h1>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Available Balance */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">$755,300.00</p>
        </div>

        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">$100</button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">$500</button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">$1000</button>
            </div>
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter full name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Transfer
            </button>
            <Link href="/dashboard" className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-center hover:bg-gray-50">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

# ============================================
# CARDS PAGE
# ============================================
mkdir -p src/app/dashboard/cards

cat > src/app/dashboard/cards/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CardsPage() {
  const [showApply, setShowApply] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Virtual Cards</h1>
        <button
          onClick={() => setShowApply(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + New Card
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">ACTIVE CARDS</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">PENDING APPLICATIONS</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* No Cards */}
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">💳</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Cards Yet</h3>
        <p className="text-gray-600 mb-4">Get started by applying for your first virtual card.</p>
        <button
          onClick={() => setShowApply(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Apply for Card
        </button>
      </div>

      {/* Apply Modal */}
      {showApply && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Apply for Virtual Card</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Debit Card</option>
                  <option>Credit Card</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Submit
                </button>
                <button
                  onClick={() => setShowApply(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
EOF

# ============================================
# DEPOSIT PAGE
# ============================================
mkdir -p src/app/dashboard/deposit

cat > src/app/dashboard/deposit/page.tsx << 'EOF'
'use client'

import { useState } from 'react'

export default function DepositPage() {
  const [method, setMethod] = useState<'bank' | 'bitcoin' | null>(null)
  const [amount, setAmount] = useState('')

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Deposit Funds</h1>

      {/* Method Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Method</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMethod('bank')}
            className={`p-4 border rounded-lg text-center hover:bg-gray-50 ${
              method === 'bank' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="text-2xl mb-2">🏦</div>
            <span className="font-medium">Bank Transfer</span>
          </button>
          <button
            onClick={() => setMethod('bitcoin')}
            className={`p-4 border rounded-lg text-center hover:bg-gray-50 ${
              method === 'bitcoin' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="text-2xl mb-2">₿</div>
            <span className="font-medium">Bitcoin</span>
          </button>
        </div>
      </div>

      {/* Amount */}
      {method && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Amount</h2>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              className="w-full pl-8 pr-3 py-2 border rounded-lg"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-3">
            {[100, 500, 1000, 5000].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                ${preset}
              </button>
            ))}
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700">
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
EOF

echo ""
echo "✅ Clean Dashboard Created!"
echo "==========================="
echo ""
echo "📁 Dashboard pages created:"
echo "   • Dashboard Home"
echo "   • Local Transfer"
echo "   • Cards"
echo "   • Deposit"
echo ""
echo "🚀 Run: npm run dev"
echo "   Login with any email"
echo ""
echo "✅ Your dashboard is ready - just like the first time!"
EOF

chmod +x scripts/clean_dashboard_reference.sh

echo "Run: ./scripts/clean_dashboard_reference.sh"