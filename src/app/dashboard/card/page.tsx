'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Card {
  id: string
  type: string
  brand: string
  lastFour: string
  cardholderName: string
  expiryMonth: number
  expiryYear: number
  status: string
  isVirtual: boolean
  creditLimit?: number
  availableCredit?: number
  currentBalance?: number
  apr?: number
  rewardsPoints?: number
}

// Mock function to simulate OTP request
const requestOTP = async (email: string, purpose: string, name?: string) => {
  console.log(`Requesting OTP for ${email} for ${purpose} ${name ? `with name ${name}` : ''}`)
  return { requestId: 'mock-request-id' }
}

export default function CardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CardContent />
        </div>
      </main>
      <Footer />
    </>
  )
}

function CardContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [actionType, setActionType] = useState<'freeze' | 'unfreeze' | 'report' | 'replace'>('freeze')
  const [showActionModal, setShowActionModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [otp, setOtp] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCards: Card[] = [
      {
        id: '1',
        type: 'DEBIT',
        brand: 'VISA',
        lastFour: '1234',
        cardholderName: user?.name || 'John Doe',
        expiryMonth: 12,
        expiryYear: 2025,
        status: 'ACTIVE',
        isVirtual: false,
      },
      {
        id: '2',
        type: 'CREDIT',
        brand: 'MASTERCARD',
        lastFour: '5678',
        cardholderName: user?.name || 'John Doe',
        expiryMonth: 10,
        expiryYear: 2024,
        status: 'ACTIVE',
        isVirtual: false,
        creditLimit: 10000,
        availableCredit: 7500,
        currentBalance: 2500,
        apr: 18.99,
        rewardsPoints: 1250,
      },
      {
        id: '3',
        type: 'VIRTUAL',
        brand: 'VISA',
        lastFour: '9012',
        cardholderName: user?.name || 'John Doe',
        expiryMonth: 8,
        expiryYear: 2026,
        status: 'ACTIVE',
        isVirtual: true,
      },
    ]

    setTimeout(() => {
      setCards(mockCards)
      setLoading(false)
    }, 1000)
  }, [user])

  const handleCardAction = (card: Card, action: 'freeze' | 'unfreeze' | 'report' | 'replace') => {
    if (!user?.email) {
      alert('Please log in to continue')
      return
    }

    setSelectedCard(card)
    setActionType(action)
    setShowActionModal(true)
  }

  const handleActionConfirm = async () => {
    if (!user?.email || !selectedCard) return

    setIsProcessing(true)
    try {
      const response = await requestOTP(
        user.email, 
        `card ${actionType}`, 
        user.name || undefined
      )
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowActionModal(false)
        setShowOtpModal(true)
      }
    } catch (error) {
      console.error('Failed to request OTP:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOtpSubmit = async () => {
    if (!otp || !selectedCard) return

    setIsProcessing(true)
    try {
      // Verify OTP and process card action
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update card status based on action
      setCards(prev => prev.map(card => {
        if (card.id === selectedCard.id) {
          if (actionType === 'freeze') {
            return { ...card, status: 'FROZEN' }
          } else if (actionType === 'unfreeze') {
            return { ...card, status: 'ACTIVE' }
          }
          // For report/replace, you might want to show a different indicator
        }
        return card
      }))
      
      setShowOtpModal(false)
      setOtp('')
      setSelectedCard(null)
      
      // Show success message
      alert(`Card ${actionType} successful!`)
    } catch (error) {
      console.error('Failed to process card action:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getBrandLogo = (brand: string) => {
    switch (brand) {
      case 'VISA':
        return '💳'
      case 'MASTERCARD':
        return '💳'
      default:
        return '💳'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100'
      case 'FROZEN':
        return 'text-blue-600 bg-blue-100'
      case 'BLOCKED':
        return 'text-red-600 bg-red-100'
      case 'EXPIRED':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your cards</p>
        <Link href="/auth/login" className="mt-4 inline-block bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-soft-gold transition-colors">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-teal">My Cards</h1>
        <p className="text-gray-600 mt-2">Manage your debit and credit cards</p>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-teal mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cards...</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-600">No cards found</p>
          <button className="mt-4 bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-soft-gold transition-colors">
            Request a Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(card.status)}`}>
                      {card.status}
                    </span>
                    {card.isVirtual && (
                      <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-soft-gold/10 text-soft-gold">
                        Virtual
                      </span>
                    )}
                  </div>
                  <span className="text-3xl">{getBrandLogo(card.brand)}</span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Cardholder Name</p>
                  <p className="text-lg font-semibold">{card.cardholderName}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Card Number</p>
                  <p className="text-lg font-mono">•••• •••• •••• {card.lastFour}</p>
                </div>

                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Expires</p>
                    <p className="font-semibold">{card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}</p>
                  </div>
                  {card.type === 'CREDIT' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Credit Limit</p>
                      <p className="font-semibold">${card.creditLimit?.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {card.type === 'CREDIT' && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Available Credit</span>
                      <span className="font-semibold text-green-600">${card.availableCredit?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Balance</span>
                      <span className="font-semibold">${card.currentBalance?.toLocaleString()}</span>
                    </div>
                    {card.rewardsPoints && card.rewardsPoints > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Rewards Points: </span>
                        <span className="font-semibold text-soft-gold">{card.rewardsPoints}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {card.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleCardAction(card, 'freeze')}
                      className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-soft-gold hover:text-soft-gold transition-colors"
                    >
                      Freeze Card
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCardAction(card, 'unfreeze')}
                      className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-soft-gold hover:text-soft-gold transition-colors"
                    >
                      Unfreeze
                    </button>
                  )}
                  <button
                    onClick={() => handleCardAction(card, 'report')}
                    className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    Report Lost
                  </button>
                  <button
                    onClick={() => handleCardAction(card, 'replace')}
                    className="px-3 py-2 text-sm bg-deep-teal text-white rounded-lg hover:bg-soft-gold transition-colors col-span-2"
                  >
                    Request Replacement
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">
              {actionType === 'freeze' && 'Freeze Card'}
              {actionType === 'unfreeze' && 'Unfreeze Card'}
              {actionType === 'report' && 'Report Lost/Stolen'}
              {actionType === 'replace' && 'Request Replacement'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {actionType === 'freeze' && 'This will temporarily freeze your card. No transactions will be processed until you unfreeze it.'}
              {actionType === 'unfreeze' && 'This will unfreeze your card and allow transactions again.'}
              {actionType === 'report' && 'This will permanently block your card. A replacement card will be sent to your address.'}
              {actionType === 'replace' && 'This will issue a new card with the same number. Your current card will be deactivated.'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleActionConfirm}
                disabled={isProcessing}
                className="flex-1 bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">Verify Action</h2>
            
            <p className="text-gray-600 mb-6">
              Enter the 6-digit code sent to your email to confirm this action.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOtpModal(false)
                  setOtp('')
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6 || isProcessing}
                className="flex-1 bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
