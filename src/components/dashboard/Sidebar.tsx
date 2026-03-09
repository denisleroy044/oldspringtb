'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Send,
  PieChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  Landmark,
  Receipt,
  Target,
  Gift,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
  isMobile: boolean
  onCollapse?: (collapsed: boolean) => void
}

export function Sidebar({ isOpen, toggleSidebar, isMobile, onCollapse }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved) {
      setCollapsed(JSON.parse(saved))
    }
  }, [])

  const handleCollapse = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newCollapsed))
    onCollapse?.(newCollapsed)
    window.dispatchEvent(new CustomEvent('sidebarChange', { detail: { collapsed: newCollapsed } }))
  }

  if (!mounted) return null

  // Main navigation links
  const mainNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/accounts', icon: Wallet, label: 'Accounts' },
    { href: '/dashboard/transactions', icon: History, label: 'Transactions' },
    { href: '/dashboard/transfers', icon: Send, label: 'Transfers' },
    { href: '/dashboard/cards', icon: CreditCard, label: 'Cards' },
    { href: '/dashboard/loans', icon: Landmark, label: 'Loans' },
    { href: '/dashboard/grants', icon: Gift, label: 'Grants' },
    { href: '/dashboard/bills', icon: Receipt, label: 'Bill Pay' },
    { href: '/dashboard/goals', icon: Target, label: 'Goals' },
  ]

  // Bottom fixed links
  const bottomNavItems = [
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  const activeGradient = 'bg-gradient-to-r from-deep-teal via-sage to-soft-gold/80 dark:from-soft-gold dark:via-sage dark:to-deep-teal/80'
  const hoverGradient = 'hover:bg-gradient-to-r hover:from-deep-teal/10 hover:via-sage/10 hover:to-soft-gold/10 dark:hover:from-soft-gold/10 dark:hover:via-sage/10 dark:hover:to-deep-teal/10'

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity animate-fadeIn"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full z-50
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
          border-r border-gray-200/20 dark:border-gray-700/30
          shadow-2xl shadow-deep-teal/5 dark:shadow-soft-gold/5
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isMobile 
            ? isOpen 
              ? 'translate-x-0 w-72' 
              : '-translate-x-full'
            : collapsed 
              ? 'w-20' 
              : 'w-72'
          }
        `}
      >
        {/* Header with Logo - Fixed */}
        <div className="flex-shrink-0 h-20 flex items-center justify-between px-4 border-b border-gray-200/20 dark:border-gray-700/30">
          <Link href="/dashboard" className="flex items-center">
            {collapsed && !isMobile ? (
              <div className="relative group">
                <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-lg group-hover:bg-soft-gold/30 transition-all"></div>
                <img 
                  src="/images/logo/favicon.png" 
                  alt="Logo" 
                  className="h-10 w-10 relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'text-deep-teal font-bold text-xl';
                      fallback.textContent = 'O';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            ) : (
              <img 
                src="/images/logo/logo.png" 
                alt="Oldspring Trust" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = document.createElement('span');
                    fallback.className = 'text-deep-teal font-bold text-xl';
                    fallback.textContent = 'Oldspring Trust';
                    parent.appendChild(fallback);
                  }
                }}
              />
            )}
          </Link>
          
          {/* Close button for mobile */}
          {isMobile && isOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapse Toggle - Fixed below header */}
        {!isMobile && (
          <div className="flex-shrink-0 px-3 py-3 border-b border-gray-200/20 dark:border-gray-700/30">
            <button
              onClick={handleCollapse}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${hoverGradient} text-gray-700 dark:text-gray-300 group
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              {collapsed ? 
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> : 
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              }
              {!collapsed && <span className="font-poppins text-sm font-medium">Collapse Menu</span>}
            </button>
          </div>
        )}

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto py-4 px-3 thin-scrollbar">
          <ul className="space-y-1.5">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                      ${collapsed && !isMobile ? 'justify-center' : ''}
                      ${isActive 
                        ? `${activeGradient} text-white shadow-lg shadow-deep-teal/20 dark:shadow-soft-gold/20` 
                        : `text-gray-700 dark:text-gray-300 ${hoverGradient}`
                      }
                      group relative overflow-hidden
                    `}
                    title={collapsed && !isMobile ? item.label : undefined}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />
                    {(!collapsed || isMobile) && (
                      <span className="font-poppins text-sm font-medium">{item.label}</span>
                    )}
                    {isActive && (
                      <>
                        <span className="absolute inset-0 bg-white/10 animate-pulse-slow"></span>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></span>
                      </>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Fixed Bottom Section with Settings and Logout */}
        <div className="flex-shrink-0 border-t border-gray-200/20 dark:border-gray-700/30 p-3">
          {/* Settings Link */}
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3.5 w-full rounded-xl mb-2
                  transition-all duration-300
                  ${collapsed && !isMobile ? 'justify-center' : ''}
                  ${isActive 
                    ? `${activeGradient} text-white shadow-lg shadow-deep-teal/20 dark:shadow-soft-gold/20` 
                    : `text-gray-700 dark:text-gray-300 ${hoverGradient}`
                  }
                  group
                `}
                title={collapsed && !isMobile ? item.label : undefined}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />
                {(!collapsed || isMobile) && (
                  <span className="font-poppins text-sm font-medium">{item.label}</span>
                )}
              </Link>
            )
          })}

          {/* Logout Button - Always at bottom */}
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 px-4 py-3.5 w-full rounded-xl
              text-gray-700 dark:text-gray-300 ${hoverGradient}
              transition-all duration-300 group
              ${collapsed && !isMobile ? 'justify-center' : ''}
            `}
            title={collapsed && !isMobile ? "Sign Out" : undefined}
          >
            <LogOut className="w-6 h-6 group-hover:rotate-12 group-hover:scale-110 transition-all" />
            {(!collapsed || isMobile) && <span className="font-poppins text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
