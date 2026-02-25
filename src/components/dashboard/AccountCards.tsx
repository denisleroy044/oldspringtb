'use client'

import { useState, useEffect } from 'react'
import { useDashboardContext } from '@/context/DashboardContext'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { OpenAccountModal } from './OpenAccountModal'

export function AccountCards() {
  const { user } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [showOpenAccountModal, setShowOpenAccountModal] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [showAccountNumber, setShowAccountNumber] = useState(false)

  // Load user preference from localStorage
  useEffect(() => {
    if (authUser) {
      const savedBalancePref = localStorage.getItem(`showBalance_${authUser.id}`)
      const savedAccountPref = localStorage.getItem(`showAccountNumber_${authUser.id}`)
      
      if (savedBalancePref !== null) {
        setShowBalance(savedBalancePref === 'true')
      }
      if (savedAccountPref !== null) {
        setShowAccountNumber(savedAccountPref === 'true')
      }
    }
  }, [authUser])

  // Save preference to localStorage
  const toggleBalance = () => {
    const newValue = !showBalance
    setShowBalance(newValue)
    if (authUser) {
      localStorage.setItem(`showBalance_${authUser.id}`, String(newValue))
    }
  }

  const toggleAccountNumber = () => {
    const newValue = !showAccountNumber
    setShowAccountNumber(newValue)
    if (authUser) {
      localStorage.setItem(`showAccountNumber_${authUser.id}`, String(newValue))
    }
  }

  if (!authUser || !user) return null

  // Get account type details based on user's actual account type
  const getAccountTypeDetails = () => {
    switch(user.accountType) {
      case 'business':
        return {
          name: 'Business Account',
          description: 'For entrepreneurs & businesses',
          gradient: 'from-purple-600 to-purple-800',
          icon: '💼',
          badge: 'Business',
          badgeColor: 'bg-purple-100 text-purple-700'
        }
      case 'premium':
        return {
          name: 'Premium Account',
          description: 'Exclusive premium benefits',
          gradient: 'from-yellow-500 to-yellow-700',
          icon: '⭐',
          badge: 'Premium',
          badgeColor: 'bg-yellow-100 text-yellow-700'
        }
      default:
        return {
          name: 'Personal Account',
          description: 'Primary checking',
          gradient: 'from-[#1e3a5f] to-[#2b4c7a]',
          icon: '👤',
          badge: 'Active',
          badgeColor: 'bg-green-100 text-green-700'
        }
    }
  }

  const accountDetails = getAccountTypeDetails()

  const formatFullAccountNumber = (accNumber: string) => {
    if (!accNumber) return 'N/A'
    // If already formatted with spaces, return as is
    if (accNumber.includes(' ')) {
      return accNumber
    }
    // If it's a continuous string, format it with spaces every 4 digits
    const cleaned = accNumber.replace(/\s/g, '')
    const parts = cleaned.match(/.{1,4}/g)
    return parts ? parts.join(' ') : accNumber
  }

  const maskAccountNumber = (accNumber: string) => {
    if (!accNumber) return '•••• •••• •••• ••••'
    const cleaned = accNumber.replace(/\s/g, '')
    if (cleaned.length >= 4) {
      const last4 = cleaned.slice(-4)
      return `•••• •••• •••• ${last4}`
    }
    return '•••• •••• •••• ••••'
  }

  const maskBalance = (balance: number) => {
    return '••••••'
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Main Account Card - Dynamic based on user type */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${accountDetails.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-lg lg:text-xl">{accountDetails.icon}</span>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900">{accountDetails.name}</h3>
                  <p className="text-xs lg:text-sm text-gray-500">{accountDetails.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${accountDetails.badgeColor}`}>
                {accountDetails.badge}
              </span>
            </div>

            <div className="space-y-3">
              {/* Account Number with Privacy Toggle - Shows FULL number when visible */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-xs lg:text-sm text-gray-600">Account Number</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm lg:text-base font-mono font-semibold text-[#1e3a5f]">
                    {showAccountNumber ? formatFullAccountNumber(user.accountNumber) : maskAccountNumber(user.accountNumber)}
                  </span>
                  <button
                    onClick={toggleAccountNumber}
                    className="p-1 hover:bg-gray-200 rounded-full transition"
                    title={showAccountNumber ? "Hide account number" : "Show account number"}
                  >
                    {showAccountNumber ? (
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Balance with Privacy Toggle */}
              <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${accountDetails.gradient} rounded-lg`}>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs lg:text-sm text-white opacity-90">Available Balance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg lg:text-xl font-bold text-white">
                    {showBalance ? `$${user.balance?.toFixed(2) || '0.00'}` : maskBalance(user.balance)}
                  </span>
                  <button
                    onClick={toggleBalance}
                    className="p-1 hover:bg-white/20 rounded-full transition"
                    title={showBalance ? "Hide balance" : "Show balance"}
                  >
                    {showBalance ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2 pt-2">
                <Link href="/dashboard/deposit" className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span>Deposit</span>
                </Link>
                <Link href="/dashboard/transfer" className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>Transfer</span>
                </Link>
                <Link href="/dashboard/transactions" className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>History</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gray-100">
            <div className={`h-1 bg-gradient-to-r ${accountDetails.gradient} rounded-full`} style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Open New Account Card */}
        <div 
          onClick={() => setShowOpenAccountModal(true)}
          className="bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
        >
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#e68a2e] to-[#f5a344] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900">Open New Account</h3>
                  <p className="text-xs lg:text-sm text-gray-500">Savings, Money Market, CDs</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">New</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs lg:text-sm text-gray-600">Rates starting at</span>
                </div>
                <span className="text-sm lg:text-base font-semibold text-[#e68a2e]">2.5% APY</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#e68a2e] to-[#f5a344] rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs lg:text-sm text-white opacity-90">Minimum Deposit</span>
                </div>
                <span className="text-lg lg:text-xl font-bold text-white">$100</span>
              </div>

              <div className="flex space-x-2 pt-2">
                <span className="flex-1 px-3 py-2 text-xs bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2b4c7a] transition text-center">
                  Get Started
                </span>
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gray-100">
            <div className="h-1 bg-gradient-to-r from-[#e68a2e] to-[#f5a344] rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>

      {/* Account Opening Modal */}
      <OpenAccountModal
        isOpen={showOpenAccountModal}
        onClose={() => setShowOpenAccountModal(false)}
        userId={authUser.id}
        userName={`${user.firstName} ${user.lastName}`}
        userEmail={user.email}
        userPhone={user.phone}
      />
    </>
  )
}
