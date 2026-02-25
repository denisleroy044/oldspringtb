#!/bin/bash

# Fix Sidebar and Transfer Utils Issues
# Save this as scripts/fix_all_issues.sh and run it

echo "🔧 Fixing Sidebar layout and Transfer Utils TypeScript errors..."

# ============================================
# Fix Sidebar Component (restore original with mobile improvements)
# ============================================
cat > src/components/dashboard/Sidebar.tsx << 'EOF'
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

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
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  // Dispatch custom event when sidebar state changes
  useEffect(() => {
    const event = new CustomEvent('sidebarChange', { detail: { collapsed } });
    window.dispatchEvent(event);
  }, [collapsed]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-[#1e3a5f] text-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside
        className={`
          ${collapsed ? 'w-20' : 'w-64'} 
          bg-gradient-to-b from-[#1e3a5f] to-[#0f2a44] text-white 
          transition-all duration-300 
          fixed left-0 top-0 z-50
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          h-full shadow-xl
        `}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Close button for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 text-white hover:bg-[#2b4c7a] rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center justify-between mb-8 mt-8 lg:mt-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#e68a2e] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              {!collapsed && <span className="font-bold text-lg">OST Bank</span>}
            </div>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block p-1 rounded hover:bg-[#2b4c7a] transition"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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

          <nav className="space-y-2 flex-1 overflow-y-auto">
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
                  title={collapsed ? item.name : ''}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-4">
            <Link
              href="/auth/logout"
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-[#2b4c7a] hover:text-white transition"
              title={collapsed ? "Logout" : ""}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!collapsed && <span>Logout</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
EOF

# ============================================
# Fix Header Component
# ============================================
cat > src/components/dashboard/Header.tsx << 'EOF'
'use client'

import { useDashboardContext } from '@/context/DashboardContext'
import { useState, useEffect } from 'react'

export function Header() {
  const { user } = useDashboardContext()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('sidebarChange' as any, handleSidebarChange)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  if (!user) return null

  return (
    <header className={`bg-white border-b border-gray-200 fixed top-0 z-40 h-16 transition-all duration-300 ${
      !isMobile && (sidebarCollapsed ? 'lg:left-20' : 'lg:left-64')
    } left-0 right-0 shadow-sm`}>
      <div className="h-full px-4 lg:px-6 flex items-center justify-end lg:justify-between">
        {/* Left side - hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            {showSearch ? (
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] w-64"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            ) : (
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        {/* Right side - visible on all devices */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search Button */}
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Mobile Search Input - appears when search button is clicked */}
          {showSearch && (
            <div className="lg:hidden absolute left-0 right-0 top-16 bg-white p-4 border-b border-gray-200 shadow-lg">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            </div>
          )}

          <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 lg:space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-[#1e3a5f]"
              />
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium text-gray-700">{user.accountName}</p>
                <p className="text-xs text-gray-500">{user.accountStatus}</p>
              </div>
              <svg className="w-4 h-4 text-gray-500 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
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

      {/* Last login info - hidden on mobile */}
      <div className="hidden lg:block bg-gray-50 border-t border-gray-200 px-6 py-1 text-xs text-gray-500">
        Last Login: {user.lastLogin}
      </div>
    </header>
  )
}
EOF

# ============================================
# Fix Main Dashboard Page
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
import { useState, useEffect } from 'react'

function DashboardContent() {
  const { user, loading } = useDashboardContext()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('sidebarChange' as any, handleSidebarChange)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

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
      <div className={`transition-all duration-300 ${
        !isMobile && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
      }`}>
        <Header />
        <main className="pt-20 lg:pt-24 px-4 lg:px-6 pb-6">
          <div className="mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-[#1e3a5f]">
              Welcome back, {user.accountName.split(' ')[0]}!
            </h1>
          </div>

          <AccountCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
            <div className="lg:col-span-2">
              <TransactionsTable />
            </div>
            <div className="space-y-4 lg:space-y-6">
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
# Fix Transfer Utils TypeScript Error
# ============================================
cat > src/lib/transfer/transferUtils.ts << 'EOF'
import { TransferDetails, TransferStatus } from '@/types/transfer';

// Mock database - In production, this would be your actual database
interface TransferStore {
  [key: string]: TransferStatus;
}

const transferStore: TransferStore = {};

// Security codes for different levels (in production, these would be generated dynamically)
const SECURITY_CODES = {
  1: '4356',
  2: '3624',
  3: '7534',
  4: '7658'
};

export function createTransfer(owner: string, details: TransferDetails): string {
  const transferId = `TR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  transferStore[transferId] = {
    id: transferId,
    owner,
    amount: details.amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    securityCodes: {
      level1: false,
      level2: false,
      level3: false,
      level4: false
    }
  };

  return transferId;
}

export function getPendingTransfer(owner: string): TransferStatus | null {
  const transfers = Object.values(transferStore);
  return transfers.find(t => t.owner === owner && t.status === 'pending') || null;
}

export function getTransferById(id: string): TransferStatus | null {
  return transferStore[id] || null;
}

export function updateTransferStatus(id: string, status: TransferStatus['status']): void {
  if (transferStore[id]) {
    transferStore[id].status = status;
    transferStore[id].updatedAt = new Date().toISOString();
  }
}

export function verifySecurityCode(level: number, code: string): boolean {
  return SECURITY_CODES[level as keyof typeof SECURITY_CODES] === code;
}

export function markSecurityCodeComplete(id: string, level: number): void {
  const transfer = transferStore[id];
  if (transfer && transfer.securityCodes) {
    const levelKey = `level${level}` as keyof typeof transfer.securityCodes;
    transfer.securityCodes[levelKey] = true;
  }
}

export function areAllSecurityCodesComplete(id: string): boolean {
  const transfer = transferStore[id];
  if (!transfer || !transfer.securityCodes) return false;
  
  return Object.values(transfer.securityCodes).every(completed => completed === true);
}

export function completeTransfer(id: string, userBalance: number): { success: boolean; newBalance: number } {
  const transfer = transferStore[id];
  
  if (!transfer || transfer.status !== 'pending') {
    return { success: false, newBalance: userBalance };
  }

  const newBalance = userBalance - transfer.amount;
  
  if (newBalance < 0) {
    return { success: false, newBalance: userBalance };
  }

  transferStore[id].status = 'completed';
  transferStore[id].updatedAt = new Date().toISOString();
  
  return { success: true, newBalance };
}
EOF

echo "✅ All issues fixed!"
echo ""
echo "Fixes applied:"
echo "1. Restored sidebar with proper desktop/mobile behavior"
echo "2. Fixed header positioning relative to sidebar"
echo "3. Added event listeners for sidebar state changes"
echo "4. Fixed TypeScript error in transferUtils.ts"
echo "5. Maintained all mobile optimizations"
echo ""
echo "The sidebar should now:"
echo "- Collapse/expand properly on desktop"
echo "- Slide in/out on mobile"
echo "- Content area adjusts correctly"
echo "- Mobile menu button works"
echo ""
echo "To see the changes:"
echo "1. Make sure your dev server is running"
echo "2. Refresh the page"
echo "3. Test both desktop and mobile views"
echo ""
EOF

chmod +x scripts/fix_all_issues.sh