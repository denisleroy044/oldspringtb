'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpUtils'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { addUserNotification } from '@/lib/auth/authService'

interface Card {
  id: string
  type: 'visa' | 'mastercard' | 'amex' | 'discover'
  brand: string
  last4: string
  expiry: string
  holder: string
  status: 'active' | 'blocked' | 'expired' | 'pending'
  limit: number
  spent: number
  freeze: boolean
  color: string
  bgGradient: string
  network: string
  cashback?: number
  annualFee?: number
  foreignFee?: number
  issuedAt: string
  isDigital?: boolean
}

interface CardDesign {
  id: string
  name: string
  type: 'visa' | 'mastercard' | 'amex' | 'discover'
  gradient: string
  textColor: string
  badgeColor: string
  image?: string
  benefits: string[]
  annualFee: number
  cashback: number
  foreignFee: number
  creditLimit: number
  welcomeBonus?: string
}

function CardContent() {
  const { user } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [showOTP, setShowOTP] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [actionType, setActionType] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<string>('classic')
  const [requestStep, setRequestStep] = useState(1)
  const [cardDesigns, setCardDesigns] = useState<CardDesign[]>([
    {
      id: 'classic',
      name: 'Classic Visa',
      type: 'visa',
      gradient: 'from-blue-600 to-blue-800',
      textColor: 'text-white',
      badgeColor: 'bg-blue-500',
      benefits: ['No annual fee', '1% cashback', 'Fraud protection'],
      annualFee: 0,
      cashback: 1,
      foreignFee: 3,
      creditLimit: 5000,
      welcomeBonus: 'Get $50 after first purchase'
    },
    {
      id: 'gold',
      name: 'Gold Mastercard',
      type: 'mastercard',
      gradient: 'from-yellow-500 to-yellow-700',
      textColor: 'text-white',
      badgeColor: 'bg-yellow-600',
      benefits: ['Premium benefits', '2% cashback', 'Travel insurance', 'Airport lounge access'],
      annualFee: 95,
      cashback: 2,
      foreignFee: 0,
      creditLimit: 15000,
      welcomeBonus: 'Earn 50,000 bonus points'
    },
    {
      id: 'platinum',
      name: 'Platinum Amex',
      type: 'amex',
      gradient: 'from-gray-700 to-gray-900',
      textColor: 'text-white',
      badgeColor: 'bg-gray-800',
      benefits: ['Luxury benefits', '3% cashback', 'Global entry credit', 'Hotel credits', 'Concierge service'],
      annualFee: 695,
      cashback: 3,
      foreignFee: 0,
      creditLimit: 30000,
      welcomeBonus: 'Earn 100,000 membership points'
    },
    {
      id: 'signature',
      name: 'Signature Visa',
      type: 'visa',
      gradient: 'from-purple-600 to-purple-900',
      textColor: 'text-white',
      badgeColor: 'bg-purple-700',
      benefits: ['Premium travel', '2.5% cashback', 'No foreign fees', 'Trip cancellation', 'Car rental insurance'],
      annualFee: 450,
      cashback: 2.5,
      foreignFee: 0,
      creditLimit: 20000,
      welcomeBonus: 'Get $500 travel credit'
    },
    {
      id: 'student',
      name: 'Student Card',
      type: 'discover',
      gradient: 'from-green-500 to-green-700',
      textColor: 'text-white',
      badgeColor: 'bg-green-600',
      benefits: ['No credit history needed', '1% cashback', 'No annual fee', 'Grade boost rewards'],
      annualFee: 0,
      cashback: 1,
      foreignFee: 2,
      creditLimit: 1000,
      welcomeBonus: 'Get $20 for good grades'
    },
    {
      id: 'business',
      name: 'Business Elite',
      type: 'mastercard',
      gradient: 'from-indigo-700 to-indigo-900',
      textColor: 'text-white',
      badgeColor: 'bg-indigo-800',
      benefits: ['Expense tracking', 'Employee cards', '2% cashback', 'Business insurance', 'Accounting tools'],
      annualFee: 295,
      cashback: 2,
      foreignFee: 1,
      creditLimit: 50000,
      welcomeBonus: 'Get $500 after $5,000 spend'
    }
  ])

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

    // Load user's cards (mock data for demo)
    if (authUser) {
      const userCards: Card[] = [
        {
          id: '1',
          type: 'visa',
          brand: 'Visa',
          last4: '4242',
          expiry: '05/26',
          holder: user?.accountName || 'User',
          status: 'active',
          limit: 10000,
          spent: 2345,
          freeze: false,
          color: 'blue',
          bgGradient: 'from-blue-600 to-blue-800',
          network: 'Visa',
          cashback: 1,
          annualFee: 0,
          foreignFee: 3,
          issuedAt: '2024-01-15T00:00:00Z'
        }
      ]
      setCards(userCards)
    }

    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [authUser, user])

  if (!authUser || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  const getCardIcon = (type: string) => {
    switch(type) {
      case 'visa': return '💳'
      case 'mastercard': return '💳'
      case 'amex': return '💳'
      case 'discover': return '💳'
      default: return '💳'
    }
  }

  const getNetworkLogo = (type: string) => {
    switch(type) {
      case 'visa':
        return (
          <span className="text-white font-bold text-lg">VISA</span>
        )
      case 'mastercard':
        return (
          <span className="text-white font-bold text-lg">Mastercard</span>
        )
      case 'amex':
        return (
          <span className="text-white font-bold text-lg">AMEX</span>
        )
      case 'discover':
        return (
          <span className="text-white font-bold text-lg">DISCOVER</span>
        )
      default:
        return null
    }
  }

  const handleAction = async (cardId: string, action: string) => {
    setSelectedCard(cardId)
    setActionType(action)
    
    const response = await requestOTP(user?.phone || '1234567890', `card ${action}`)
    if (response.success && response.requestId) {
      setOtpRequestId(response.requestId)
      setShowOTP(true)
    }
  }

  const handleOTPVerify = async (code: string): Promise<boolean> => {
    if (code === 'RESEND') {
      const response = await requestOTP(user?.phone || '1234567890', `card ${actionType}`)
      if (response.requestId) {
        setOtpRequestId(response.requestId)
      }
      return true
    }

    const isValid = await verifyOTP(otpRequestId, code)
    
    if (isValid) {
      if (actionType === 'request') {
        // Add new card
        const design = cardDesigns.find(d => d.id === selectedDesign)
        if (design && authUser) {
          const newCard: Card = {
            id: `card_${Date.now()}`,
            type: design.type,
            brand: design.name,
            last4: Math.floor(1000 + Math.random() * 9000).toString(),
            expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }),
            holder: user.accountName,
            status: 'active',
            limit: design.creditLimit,
            spent: 0,
            freeze: false,
            color: design.gradient.includes('blue') ? 'blue' : design.gradient.includes('yellow') ? 'yellow' : 'gray',
            bgGradient: design.gradient,
            network: design.type.toUpperCase(),
            cashback: design.cashback,
            annualFee: design.annualFee,
            foreignFee: design.foreignFee,
            issuedAt: new Date().toISOString(),
            isDigital: true
          }
          setCards([...cards, newCard])
          
          addUserNotification(authUser.id, {
            title: '💳 New Card Issued',
            message: `Your ${design.name} has been issued and added to your account.`,
            type: 'success'
          })
        }
        setShowRequestModal(false)
        setRequestStep(1)
      } else {
        // Update existing card
        setCards(prev => prev.map(card => {
          if (card.id === selectedCard) {
            switch(actionType) {
              case 'freeze':
                return { ...card, freeze: !card.freeze }
              case 'block':
                return { ...card, status: 'blocked' }
              case 'unblock':
                return { ...card, status: 'active' }
              case 'replace':
                return { 
                  ...card, 
                  last4: Math.floor(1000 + Math.random() * 9000).toString(),
                  expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }),
                  status: 'active'
                }
              default:
                return card
            }
          }
          return card
        }))
      }
    }
    
    return isValid
  }

  const handleRequestCard = () => {
    handleAction('new', 'request')
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'blocked': return 'bg-red-100 text-red-700'
      case 'expired': return 'bg-gray-100 text-gray-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 flex flex-col ${
        !isMobile && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
      }`}>
        <Header />
        <main className="flex-1 pt-20 lg:pt-24 px-4 lg:px-6 pb-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">Card Management</h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">Manage your cards, request new ones, and control spending</p>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 lg:px-6 py-2 lg:py-3 bg-[#1e3a5f] text-white rounded-lg lg:rounded-xl text-sm lg:text-base font-semibold hover:bg-[#2b4c7a] transition flex items-center shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request New Card
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {cards.map((card) => (
              <div key={card.id} className="group">
                {/* Card Preview */}
                <div className={`relative mb-4 p-6 bg-gradient-to-r ${card.bgGradient} rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}>
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-6 -mb-6"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                  
                  {/* Chip and Network */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center shadow-inner">
                      <div className="w-8 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm"></div>
                    </div>
                    {getNetworkLogo(card.type)}
                  </div>
                  
                  {/* Card Number */}
                  <p className="text-xl font-mono tracking-wider mb-4">
                    •••• •••• •••• {card.last4}
                  </p>
                  
                  {/* Card Details */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80 mb-1">Card Holder</p>
                      <p className="font-semibold tracking-wide">{card.holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80 mb-1">Valid Thru</p>
                      <p className="font-semibold">{card.expiry}</p>
                    </div>
                  </div>

                  {/* Digital Badge */}
                  {card.isDigital && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                      📱 Digital
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="bg-white rounded-xl shadow-lg p-5">
                  {/* Status and Quick Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(card.status)}`}>
                        {card.freeze ? 'Frozen' : card.status}
                      </span>
                      {card.cashback && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {card.cashback}% Cashback
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {card.network} • {card.type}
                    </span>
                  </div>

                  {/* Limits and Spending */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Credit Limit</p>
                      <p className="text-lg font-bold text-[#1e3a5f]">${formatCurrency(card.limit)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Spent</p>
                      <p className="text-lg font-bold text-[#e68a2e]">${formatCurrency(card.spent)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Available</span>
                      <span>{((card.limit - card.spent) / card.limit * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#2b4c7a] rounded-full transition-all duration-300"
                        style={{ width: `${((card.limit - card.spent) / card.limit * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Card Features */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                    {card.annualFee === 0 ? (
                      <div className="p-2 bg-green-50 rounded-lg">
                        <p className="text-green-600 font-medium">No Annual Fee</p>
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">${card.annualFee}/yr</p>
                      </div>
                    )}
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">{card.foreignFee === 0 ? 'No FX Fee' : `${card.foreignFee}% FX`}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">{card.cashback}% Back</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {card.status === 'active' && !card.freeze && (
                      <button
                        onClick={() => handleAction(card.id, 'freeze')}
                        className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-200 transition flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Freeze
                      </button>
                    )}
                    {card.freeze && (
                      <button
                        onClick={() => handleAction(card.id, 'freeze')}
                        className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Unfreeze
                      </button>
                    )}
                    {card.status === 'active' && (
                      <button
                        onClick={() => handleAction(card.id, 'block')}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Block
                      </button>
                    )}
                    {card.status === 'blocked' && (
                      <button
                        onClick={() => handleAction(card.id, 'unblock')}
                        className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Unblock
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(card.id, 'replace')}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Replace
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Card Placeholder */}
            {cards.length === 0 && (
              <div className="col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-7xl mb-4">💳</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cards Yet</h3>
                  <p className="text-gray-600 mb-6">Get started by requesting your first card</p>
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-semibold hover:bg-[#2b4c7a] transition"
                  >
                    Request Your First Card
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card Benefits Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Card Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Zero Liability</h3>
                <p className="text-sm text-gray-500">You're not liable for unauthorized charges</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Cashback Rewards</h3>
                <p className="text-sm text-gray-500">Earn up to 3% on every purchase</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Contactless Pay</h3>
                <p className="text-sm text-gray-500">Tap to pay anywhere</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Instant Alerts</h3>
                <p className="text-sm text-gray-500">Real-time transaction notifications</p>
              </div>
            </div>
          </div>
        </main>
        <DashboardFooter />
      </div>

      {/* Request New Card Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Request New Card</h3>
              <button
                onClick={() => {
                  setShowRequestModal(false)
                  setRequestStep(1)
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      s <= requestStep ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {s < requestStep ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        s
                      )}
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        s < requestStep ? 'bg-[#1e3a5f]' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Choose Card Type */}
              {requestStep === 1 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Choose Your Card</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cardDesigns.map((design) => (
                      <div
                        key={design.id}
                        onClick={() => setSelectedDesign(design.id)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                          selectedDesign === design.id
                            ? 'border-[#1e3a5f] bg-[#1e3a5f] bg-opacity-5'
                            : 'border-gray-200 hover:border-[#1e3a5f]'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-16 h-10 bg-gradient-to-r ${design.gradient} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                            {design.type === 'visa' ? 'VISA' : 
                             design.type === 'mastercard' ? 'MC' :
                             design.type === 'amex' ? 'AMEX' : 'DISC'}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900">{design.name}</h5>
                            <p className="text-xs text-gray-500 mt-1">${design.annualFee}/yr • {design.cashback}% cashback</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {design.benefits.slice(0, 2).map((benefit, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Card Details */}
              {requestStep === 2 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Card Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                      <input
                        type="text"
                        value={user.accountName}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                      <input
                        type="text"
                        value={cardDesigns.find(d => d.id === selectedDesign)?.name}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                      <textarea
                        rows={3}
                        defaultValue={`${user.accountName}\n123 Main Street\nNew York, NY 10001`}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="digitalCard"
                        defaultChecked
                        className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                      />
                      <label htmlFor="digitalCard" className="text-sm text-gray-700">
                        Also add digital card to wallet (use immediately)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {requestStep === 3 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Review Your Request</h4>
                  {selectedDesign && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      {/* Card Preview */}
                      <div className={`mb-6 p-4 bg-gradient-to-r ${cardDesigns.find(d => d.id === selectedDesign)?.gradient} rounded-xl text-white`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-7 bg-yellow-300 rounded"></div>
                          <span className="text-xs opacity-80">{cardDesigns.find(d => d.id === selectedDesign)?.type.toUpperCase()}</span>
                        </div>
                        <p className="font-mono text-lg mb-4">•••• •••• •••• 1234</p>
                        <div className="flex justify-between">
                          <p className="text-xs opacity-80">{user.accountName}</p>
                          <p className="text-xs opacity-80">12/28</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Card Type</span>
                          <span className="font-semibold">{cardDesigns.find(d => d.id === selectedDesign)?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Credit Limit</span>
                          <span className="font-semibold">${cardDesigns.find(d => d.id === selectedDesign)?.creditLimit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Fee</span>
                          <span className="font-semibold">${cardDesigns.find(d => d.id === selectedDesign)?.annualFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cashback</span>
                          <span className="font-semibold">{cardDesigns.find(d => d.id === selectedDesign)?.cashback}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Foreign Transaction Fee</span>
                          <span className="font-semibold">{cardDesigns.find(d => d.id === selectedDesign)?.foreignFee}%</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700">
                          {cardDesigns.find(d => d.id === selectedDesign)?.welcomeBonus}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {requestStep > 1 && (
                  <button
                    onClick={() => setRequestStep(requestStep - 1)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                )}
                <div className="flex-1" />
                {requestStep < 3 ? (
                  <button
                    onClick={() => setRequestStep(requestStep + 1)}
                    disabled={requestStep === 1 && !selectedDesign}
                    className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2b4c7a] transition disabled:opacity-50"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleRequestCard}
                    className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2b4c7a] transition"
                  >
                    Submit Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerify={handleOTPVerify}
        phoneNumber={user?.phone || '****'}
        purpose={actionType === 'request' ? 'card request' : `card ${actionType}`}
      />
    </div>
  )
}

export default function CardPage() {
  return (
    <DashboardProvider>
      <CardContent />
    </DashboardProvider>
  )
}
