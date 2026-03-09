'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Settings,
  Plus,
  Send,
  CreditCard,
  Landmark
} from 'lucide-react'
import { useState, useEffect } from 'react'

export function MobileBottomNav() {
  const pathname = usePathname()
  const [showQuickMenu, setShowQuickMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/dashboard/accounts', icon: Wallet, label: 'Accounts' }, // Changed from Finance to Accounts
    { href: '/dashboard/transactions', icon: History, label: 'Activity' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  const quickActions = [
    { href: '/dashboard/transfers', icon: Send, label: 'Transfer', color: 'from-blue-500 to-cyan-500' },
    { href: '/dashboard/deposit', icon: Wallet, label: 'Deposit', color: 'from-green-500 to-emerald-500' },
    { href: '/dashboard/bills', icon: CreditCard, label: 'Bills', color: 'from-purple-500 to-pink-500' },
    { href: '/dashboard/loans', icon: Landmark, label: 'Loans', color: 'from-orange-500 to-amber-500' },
  ]

  const activeGradient = 'bg-gradient-to-r from-deep-teal via-sage to-soft-gold/80 dark:from-soft-gold dark:via-sage dark:to-deep-teal/80'

  if (!mounted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Quick Action Menu */}
      <div className={`
        absolute bottom-20 left-0 right-0 transition-all duration-300 ease-out
        ${showQuickMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}>
        <div className="mx-4 mb-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden animate-slideUp">
          <div className="grid grid-cols-4 gap-1 p-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center p-3 rounded-xl hover:bg-gradient-to-b hover:from-deep-teal/10 hover:to-sage/10 dark:hover:from-soft-gold/10 dark:hover:to-sage/10 transition-all group"
                  onClick={() => setShowQuickMenu(false)}
                >
                  <div className={`p-2.5 rounded-full bg-gradient-to-r ${action.color} text-white mb-1.5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-poppins font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Bottom Navigation Bar */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30 px-2 py-2 relative">
        {/* Centered Circle Button */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="relative w-14 h-14 bg-gradient-to-r from-deep-teal via-sage to-soft-gold dark:from-soft-gold dark:via-sage dark:to-deep-teal rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group animate-float"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping-slow"></div>
            <Plus className={`w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${showQuickMenu ? 'rotate-45 scale-110' : ''}`} />
          </button>
        </div>

        {/* Navigation Icons - with padding top for circle button */}
        <div className="flex items-center justify-around pt-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 relative
                  ${isActive 
                    ? activeGradient + ' text-white shadow-lg' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gradient-to-b hover:from-deep-teal/10 hover:to-sage/10 dark:hover:from-soft-gold/10 dark:hover:to-sage/10'
                  }
                  group
                `}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'animate-bounce-gentle' : 'group-hover:scale-110'}`} />
                <span className="text-xs mt-1 font-poppins font-medium">{item.label}</span>
                
                {isActive && (
                  <>
                    <span className="absolute inset-0 bg-white/10 animate-pulse-slow rounded-xl"></span>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full animate-pulse-slow"></span>
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
