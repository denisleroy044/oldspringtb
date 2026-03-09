'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpService'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

interface Card {
  id: string
  type: 'debit' | 'credit'
  brand: 'visa' | 'mastercard' | 'amex'
  lastFour: string
  cardholderName: string
  expiryDate: string
  status: 'active' | 'inactive' | 'blocked' | 'expired'
  creditLimit?: number
  availableCredit?: number
  currentBalance?: number
  rewards?: number
  isVirtual?: boolean
}

export default function CardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'freeze' | 'unfreeze' | 'report' | 'replace' | 'increase' | 'request'>('freeze')
  const [newLimit, setNewLimit] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Mock cards data
  useEffect(() => {
    const mockCards: Card[] = [
      {
        id: '1',
        type: 'debit',
        brand: 'visa',
        lastFour: '4567',
        cardholderName: user?.name || 'John Doe',
        expiryDate: '05/27',
        status: 'active',
        currentBalance: 5280.42,
        rewards: 125.50
      },
      {
        id: '2',
        type: 'credit',
        brand: 'mastercard',
        lastFour: '8901',
        cardholderName: user?.name || 'John Doe',
        expiryDate: '08/26',
        status: 'active',
        creditLimit: 10000,
        availableCredit: 6750.75,
        currentBalance: 3249.25,
        rewards: 2450
      },
      {
        id: '3',
        type: 'credit',
        brand: 'amex',
        lastFour: '2345',
        cardholderName: user?.name || 'John Doe',
        expiryDate: '11/25',
        status: 'inactive',
        creditLimit: 5000,
        availableCredit: 5000,
        currentBalance: 0,
        rewards: 0
      }
    ]
    setCards(mockCards)
    setLoading(false)
  }, [user])

  const handleCardAction = (card: Card, action: 'freeze' | 'unfreeze' | 'report' | 'replace' | 'increase' | 'request') => {
    setSelectedCard(card)
    setActionType(action)
    
    // For credit limit increase, show modal first, then OTP
    if (action === 'increase') {
      setShowActionModal(true)
    } else if (action === 'request') {
      // For new card request, just show success message (no OTP needed)
      setMessage({ type: 'success', text: 'New card requested. You will receive it in 5-7 business days.' })
      setSelectedCard(null)
    } else {
      // For other actions, request OTP directly
      handleRequestOTP()
    }
  }

  const handleRequestOTP = async () => {
    if (!selectedCard || !user) return

    try {
      const response = await requestOTP(user.email, `card ${actionType}`, user.name)
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowOtpModal(true)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to request OTP' })
    }
  }

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    if (!otpRequestId || !selectedCard || !user) return false

    try {
      const isValid = await verifyOTP(otpRequestId, code)
      if (isValid) {
        // Process the card action
        if (actionType === 'freeze') {
          setCards(prev => prev.map(c => 
            c.id === selectedCard.id ? { ...c, status: 'blocked' } : c
          ))
          setMessage({ type: 'success', text: 'Card frozen successfully' })
        } else if (actionType === 'unfreeze') {
          setCards(prev => prev.map(c => 
            c.id === selectedCard.id ? { ...c, status: 'active' } : c
          ))
          setMessage({ type: 'success', text: 'Card unfrozen successfully' })
        } else if (actionType === 'report') {
          setCards(prev => prev.map(c => 
            c.id === selectedCard.id ? { ...c, status: 'blocked' } : c
          ))
          setMessage({ type: 'success', text: 'Card reported as lost/stolen. A replacement will be sent.' })
        } else if (actionType === 'replace') {
          setMessage({ type: 'success', text: 'Replacement card requested. You will receive it in 5-7 business days.' })
        } else if (actionType === 'increase') {
          setMessage({ type: 'success', text: `Credit limit increase to $${newLimit} requested. You will be notified once approved.` })
        }

        setShowOtpModal(false)
        setShowActionModal(false)
        setOtpRequestId(null)
        setSelectedCard(null)
        setNewLimit('')
        return true
      } else {
        setMessage({ type: 'error', text: 'Invalid OTP code' })
        return false
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Verification failed' })
      return false
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getCardIcon = (brand: string) => {
    switch(brand) {
      case 'visa': return '💳'
      case 'mastercard': return '💳'
      case 'amex': return '💳'
      default: return '💳'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cards...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <ScrollAnimation animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-deep-teal mb-2">Cards</h1>
              <p className="text-gray-600">Manage your debit and credit cards</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            {/* Request New Card Button */}
            <button
              onClick={() => handleCardAction({
                id: 'new',
                type: 'debit',
                brand: 'visa',
                lastFour: '',
                cardholderName: user?.name || '',
                expiryDate: '',
                status: 'inactive'
              } as Card, 'request')}
              className="mb-6 bg-soft-gold text-deep-teal px-6 py-3 rounded-lg font-semibold hover:bg-deep-teal hover:text-white transition-colors"
            >
              + Request New Card
            </button>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div key={card.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-4xl">{getCardIcon(card.brand)}</span>
                        <p className="text-xs text-gray-500 mt-1">{card.brand.toUpperCase()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(card.status)}`}>
                        {card.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Cardholder Name</p>
                      <p className="font-medium">{card.cardholderName}</p>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-500">•••• •••• •••• {card.lastFour}</p>
                        <p className="text-xs text-gray-400">Expires {card.expiryDate}</p>
                      </div>
                      {card.isVirtual && (
                        <span className="text-xs bg-soft-gold/20 text-deep-teal px-2 py-1 rounded-full">
                          Virtual
                        </span>
                      )}
                    </div>

                    {card.type === 'credit' ? (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Credit Limit</span>
                          <span className="font-medium">{formatCurrency(card.creditLimit || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Available</span>
                          <span className="font-medium text-green-600">{formatCurrency(card.availableCredit || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Current Balance</span>
                          <span className="font-medium">{formatCurrency(card.currentBalance || 0)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Current Balance</span>
                          <span className="font-medium">{formatCurrency(card.currentBalance || 0)}</span>
                        </div>
                      </div>
                    )}

                    {card.rewards !== undefined && (
                      <div className="mb-4 p-3 bg-soft-gold/10 rounded-lg">
                        <p className="text-xs text-gray-500">Rewards Points</p>
                        <p className="text-lg font-bold text-soft-gold">{card.rewards.toLocaleString()}</p>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {card.status === 'active' ? (
                        <>
                          <button
                            onClick={() => handleCardAction(card, 'freeze')}
                            className="text-sm bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors"
                          >
                            Freeze
                          </button>
                          <button
                            onClick={() => handleCardAction(card, 'report')}
                            className="text-sm bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 transition-colors"
                          >
                            Report
                          </button>
                        </>
                      ) : card.status === 'blocked' ? (
                        <button
                          onClick={() => handleCardAction(card, 'unfreeze')}
                          className="text-sm bg-green-100 text-green-700 py-2 rounded hover:bg-green-200 transition-colors col-span-2"
                        >
                          Unfreeze
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCardAction(card, 'replace')}
                          className="text-sm bg-deep-teal text-white py-2 rounded hover:bg-soft-gold transition-colors col-span-2"
                        >
                          Replace Card
                        </button>
                      )}
                      
                      {card.type === 'credit' && card.status === 'active' && (
                        <button
                          onClick={() => handleCardAction(card, 'increase')}
                          className="text-sm bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 transition-colors"
                        >
                          Increase Limit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </main>
        <DashboardFooter />
      </div>

      {/* Credit Limit Increase Modal */}
      {showActionModal && selectedCard && actionType === 'increase' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-deep-teal mb-4">Request Credit Limit Increase</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              handleRequestOTP()
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Limit</label>
                <input
                  type="text"
                  value={formatCurrency(selectedCard.creditLimit || 0)}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requested New Limit</label>
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  placeholder="Enter amount"
                  min={selectedCard.creditLimit}
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Credit limit increases are subject to approval based on your credit history and account standing.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowActionModal(false)
                    setSelectedCard(null)
                    setNewLimit('')
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Modal - Using standardized props */}
      <OTPModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false)
          setOtpRequestId(null)
        }}
        onVerify={handleOtpVerify}
        email={user?.email}
      />
    </div>
  )
}
