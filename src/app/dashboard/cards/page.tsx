'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { 
  Plus,
  Eye,
  EyeOff,
  CreditCard,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  RefreshCw,
  Snowflake,
  Flame,
  Star,
  Zap,
  Wallet,
  Hourglass,
  XCircle
} from 'lucide-react'

interface Card {
  id: string
  cardType: string
  cardBrand: string
  lastFour: string
  cardholderName: string
  expiryMonth: number
  expiryYear: number
  status: string
  isVirtual: boolean
  creditLimit?: number
  availableCredit?: number
  currentBalance?: number
  rewardsPoints?: number
  accountId?: string
  accountName?: string
}

interface CardRequest {
  id: string
  cardType: string
  cardBrand: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function CardsPage() {
  const { user } = useAuth()
  const [showCardNumbers, setShowCardNumbers] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [requests, setRequests] = useState<CardRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestType, setRequestType] = useState('DEBIT')
  const [requestBrand, setRequestBrand] = useState('VISA')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [accounts, setAccounts] = useState<any[]>([])
  const [showRequests, setShowRequests] = useState(false)

  useEffect(() => {
    fetchCards()
    fetchRequests()
    fetchAccounts()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load cards')
      }
      
      setCards(data.cards || [])
    } catch (err) {
      console.error('Error fetching cards:', err)
      setError(err.message)
    }
  }

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/cards/requests')
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (err) {
      console.error('Error fetching card requests:', err)
    }
  }

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (err) {
      console.error('Error fetching accounts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCardAction = async (cardId: string, action: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} card`)
      }

      // Refresh cards list
      fetchCards()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleRequestCard = async () => {
    try {
      const response = await fetch('/api/cards/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cardType: requestType,
          cardBrand: requestBrand,
          accountId: selectedAccount || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setShowRequestModal(false)
      fetchRequests()
      
      // Show success message
      alert('Card request submitted! Check the Pending Requests section below.')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleFreezeCard = (cardId: string) => handleCardAction(cardId, 'freeze')
  const handleUnfreezeCard = (cardId: string) => handleCardAction(cardId, 'unfreeze')
  const handleReportLost = (cardId: string) => handleCardAction(cardId, 'report-lost')
  const handleReplaceCard = (cardId: string) => handleCardAction(cardId, 'replace')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getCardIcon = (brand: string, type: string) => {
    if (type === 'VIRTUAL') return '📱'
    switch(brand) {
      case 'VISA': return '💳'
      case 'MASTERCARD': return '💳'
      case 'AMEX': return '💳'
      default: return '💳'
    }
  }

  const getCardColor = (brand: string) => {
    switch(brand) {
      case 'VISA': return 'from-blue-600 to-blue-800'
      case 'MASTERCARD': return 'from-orange-500 to-red-600'
      case 'AMEX': return 'from-blue-400 to-blue-600'
      default: return 'from-deep-teal to-sage'
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      case 'FROZEN':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
          <Snowflake className="w-3 h-3" />
          Frozen
        </span>
      case 'BLOCKED':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center gap-1">
          <Flame className="w-3 h-3" />
          Blocked
        </span>
      case 'EXPIRED':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Expired
        </span>
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Hourglass className="w-3 h-3" />
          Pending
        </span>
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING').length
  const approvedRequests = requests.filter(r => r.status === 'APPROVED')
  const rejectedRequests = requests.filter(r => r.status === 'REJECTED')

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gold-trim-bottom pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-deep-teal">Cards</h1>
          <p className="text-gray-500 mt-1">Manage your debit, credit, and virtual cards</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button
            onClick={() => setShowCardNumbers(!showCardNumbers)}
            className="p-2 bg-white rounded-lg shadow-sm border border-soft-gold/20 hover:bg-gray-50 transition-colors"
            title={showCardNumbers ? 'Hide card numbers' : 'Show card numbers'}
          >
            {showCardNumbers ? <EyeOff className="w-5 h-5 text-deep-teal" /> : <Eye className="w-5 h-5 text-deep-teal" />}
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-sage transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Request Card</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Cards</p>
          <p className="text-2xl font-bold text-deep-teal">{cards.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Active Cards</p>
          <p className="text-2xl font-bold text-deep-teal">
            {cards.filter(c => c.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Virtual Cards</p>
          <p className="text-2xl font-bold text-deep-teal">
            {cards.filter(c => c.isVirtual).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
          <p className="text-2xl font-bold text-soft-gold">{pendingRequests}</p>
        </div>
      </div>

      {/* Pending Requests Section */}
      {requests.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-deep-teal">Card Requests</h2>
            <button
              onClick={() => setShowRequests(!showRequests)}
              className="text-sm text-soft-gold hover:text-deep-teal"
            >
              {showRequests ? 'Hide' : 'Show'} Requests
            </button>
          </div>

          {showRequests && (
            <div className="space-y-4">
              {/* Pending Requests */}
              {requests.filter(r => r.status === 'PENDING').length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 className="font-medium text-yellow-800 mb-3 flex items-center gap-2">
                    <Hourglass className="w-4 h-4" />
                    Pending Approval
                  </h3>
                  <div className="space-y-3">
                    {requests.filter(r => r.status === 'PENDING').map((req) => (
                      <div key={req.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-deep-teal">
                              {req.cardType} {req.cardBrand} Card
                            </p>
                            <p className="text-xs text-gray-500">
                              Requested on {new Date(req.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approved Requests */}
              {approvedRequests.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approved
                  </h3>
                  <div className="space-y-3">
                    {approvedRequests.map((req) => (
                      <div key={req.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-deep-teal">
                              {req.cardType} {req.cardBrand} Card
                            </p>
                            <p className="text-xs text-gray-500">
                              Approved - Check your cards list
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejected Requests */}
              {rejectedRequests.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Rejected
                  </h3>
                  <div className="space-y-3">
                    {rejectedRequests.map((req) => (
                      <div key={req.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-deep-teal">
                              {req.cardType} {req.cardBrand} Card
                            </p>
                            <p className="text-xs text-gray-500">
                              Request rejected
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Rejected
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="group cursor-pointer"
            onClick={() => setSelectedCard(card.id === selectedCard ? null : card.id)}
          >
            {/* Card Front */}
            <div className={`bg-gradient-to-br ${getCardColor(card.cardBrand)} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white rounded-full"></div>
                <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-white rounded-full"></div>
              </div>

              {/* Card Header */}
              <div className="flex justify-between items-start mb-8 relative">
                <div>
                  <p className="text-xs opacity-80">
                    {card.cardType} {card.isVirtual && '• Virtual'}
                  </p>
                  <p className="text-lg font-semibold mt-1">{card.cardBrand}</p>
                </div>
                <Shield className="w-6 h-6 text-soft-gold" />
              </div>

              {/* Card Number */}
              <div className="mb-4 relative">
                <p className="text-lg font-mono tracking-wider">
                  {showCardNumbers ? '•••• •••• •••• ' : '•••• •••• •••• '}{card.lastFour}
                </p>
              </div>

              {/* Card Details */}
              <div className="flex justify-between items-center relative">
                <div>
                  <p className="text-xs opacity-80">Card Holder</p>
                  <p className="font-medium">{card.cardholderName}</p>
                </div>
                <div>
                  <p className="text-xs opacity-80">Expires</p>
                  <p className="font-medium">{card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear.toString().slice(-2)}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {getStatusBadge(card.status)}
              </div>

              {/* Virtual Badge */}
              {card.isVirtual && (
                <div className="absolute bottom-4 right-4 bg-soft-gold/20 text-soft-gold text-xs px-2 py-1 rounded-full">
                  Virtual
                </div>
              )}
            </div>

            {/* Card Details (expandable) */}
            {selectedCard === card.id && (
              <div className="mt-4 bg-white rounded-xl shadow-lg p-4 border border-sage/20 animate-fadeIn">
                {/* Balance / Credit Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {card.cardType === 'CREDIT' ? (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                        <p className="font-bold text-deep-teal">{formatCurrency(card.currentBalance || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Available Credit</p>
                        <p className="font-bold text-sage">{formatCurrency(card.availableCredit || 0)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                        <p className="font-bold text-deep-teal">{formatCurrency(card.currentBalance || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Linked Account</p>
                        <p className="font-medium text-deep-teal text-sm">{card.accountName || 'Checking'}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Credit Limit Bar (for credit cards) */}
                {card.cardType === 'CREDIT' && card.creditLimit && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">Credit Utilization</span>
                      <span className="text-deep-teal font-medium">
                        {Math.round(((card.creditLimit - (card.availableCredit || 0)) / card.creditLimit) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-soft-gold h-2 rounded-full"
                        style={{ width: `${((card.creditLimit - (card.availableCredit || 0)) / card.creditLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Rewards Points */}
                {card.rewardsPoints ? (
                  <div className="mb-4 p-2 bg-soft-gold/10 rounded-lg flex items-center gap-2">
                    <Star className="w-4 h-4 text-soft-gold" />
                    <span className="text-sm text-deep-teal">{card.rewardsPoints.toLocaleString()} rewards points</span>
                  </div>
                ) : null}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {card.status === 'ACTIVE' ? (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFreezeCard(card.id); }}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <Snowflake className="w-4 h-4" />
                        Freeze
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleReportLost(card.id); }}
                        className="p-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Report Lost
                      </button>
                    </>
                  ) : card.status === 'FROZEN' ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUnfreezeCard(card.id); }}
                      className="col-span-2 p-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Unfreeze
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReplaceCard(card.id); }}
                      className="col-span-2 p-2 bg-deep-teal text-white rounded-lg text-sm hover:bg-sage transition-colors flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Replace Card
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {cards.length === 0 && requests.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-deep-teal mb-2">No Cards Yet</h3>
          <p className="text-gray-500 mb-4">Get started by requesting your first card</p>
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-sage transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Request Card
          </button>
        </div>
      )}

      {/* Request Card Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-deep-teal mb-4">Request New Card</h2>
            
            <div className="space-y-4">
              {/* Card Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'DEBIT', name: 'Debit', icon: Wallet },
                    { id: 'CREDIT', name: 'Credit', icon: CreditCard },
                    { id: 'VIRTUAL', name: 'Virtual', icon: Zap }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setRequestType(type.id)}
                      className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                        requestType === type.id
                          ? 'border-soft-gold bg-soft-gold/5'
                          : 'border-gray-200 hover:border-soft-gold/50'
                      }`}
                    >
                      <type.icon className={`w-5 h-5 ${
                        requestType === type.id ? 'text-soft-gold' : 'text-gray-600'
                      }`} />
                      <span className={`text-xs font-medium ${
                        requestType === type.id ? 'text-soft-gold' : 'text-gray-700'
                      }`}>
                        {type.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Brand</label>
                <select
                  value={requestBrand}
                  onChange={(e) => setRequestBrand(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold"
                >
                  <option value="VISA">Visa</option>
                  <option value="MASTERCARD">Mastercard</option>
                  <option value="AMEX">American Express</option>
                </select>
              </div>

              {/* Link to Account (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Account <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold"
                >
                  <option value="">Select an account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.displayName} ({acc.maskedNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-soft-gold/5 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-deep-teal">Note:</span> Your request will be reviewed by an admin. 
                  You'll see it in the Pending Requests section above.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleRequestCard}
                  className="flex-1 bg-deep-teal text-white py-2 rounded-lg hover:bg-sage transition-colors"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
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
