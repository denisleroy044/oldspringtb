'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  Wallet,
  Bitcoin,
  Landmark,
  Globe,
  Smartphone,
  DollarSign,
  X,
  ChevronRight,
  Loader2,
  ArrowRight,
  Bell,
  ExternalLink
} from 'lucide-react'

interface Account {
  id: string
  accountType: string
  accountNumber: string
  balance: number
  displayName: string
  maskedNumber: string
}

interface DepositMethod {
  id: string
  name: string
  icon: any
  description: string
  minAmount: number
  maxAmount: number
  processingTime: string
  fee: string
}

interface DepositRequest {
  id: string
  amount: number
  method: string
  status: string
  reference: string
  createdAt: string
  paymentDetails?: any
  instructions?: string
  cryptoCurrency?: string
}

export default function DepositPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestId = searchParams.get('request')
  
  const [accounts, setAccounts] = useState<Account[]>([])
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [cryptoCurrency, setCryptoCurrency] = useState('BTC')
  const [senderInfo, setSenderInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [depositResult, setDepositResult] = useState<any>(null)
  const [step, setStep] = useState<'form' | 'instructions'>('form')
  const [copied, setCopied] = useState<string | null>(null)
  const [showPending, setShowPending] = useState(false)

  const depositMethods: DepositMethod[] = [
    {
      id: 'BANK',
      name: 'Bank Transfer',
      icon: Landmark,
      description: 'ACH transfer from your bank',
      minAmount: 10,
      maxAmount: 50000,
      processingTime: '2-3 business days',
      fee: 'Free'
    },
    {
      id: 'WIRE',
      name: 'Wire Transfer',
      icon: Globe,
      description: 'Domestic or international wire',
      minAmount: 1000,
      maxAmount: 100000,
      processingTime: '1 business day',
      fee: '$25'
    },
    {
      id: 'CRYPTO',
      name: 'Cryptocurrency',
      icon: Bitcoin,
      description: 'BTC, ETH, USDT deposits',
      minAmount: 50,
      maxAmount: 50000,
      processingTime: '10-30 minutes',
      fee: 'Network fee'
    },
    {
      id: 'CASHAPP',
      name: 'Cash App',
      icon: Smartphone,
      description: 'Instant deposits from Cash App',
      minAmount: 10,
      maxAmount: 2500,
      processingTime: 'Instant',
      fee: 'Free'
    },
    {
      id: 'VENMO',
      name: 'Venmo',
      icon: Smartphone,
      description: 'Send from your Venmo balance',
      minAmount: 10,
      maxAmount: 2000,
      processingTime: 'Instant',
      fee: 'Free'
    },
    {
      id: 'PAYPAL',
      name: 'PayPal',
      icon: DollarSign,
      description: 'Deposit via PayPal',
      minAmount: 10,
      maxAmount: 5000,
      processingTime: 'Instant',
      fee: '2.9%'
    }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (requestId) {
      fetchDepositRequest(requestId)
    }
  }, [requestId])

  const fetchData = async () => {
    try {
      const [accountsRes, depositsRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/deposits/requests')
      ])
      
      const accountsData = await accountsRes.json()
      const depositsData = await depositsRes.json()
      
      setAccounts(accountsData.accounts || [])
      if (accountsData.accounts?.length > 0) {
        setSelectedAccount(accountsData.accounts[0].id)
      }
      
      setDepositRequests(depositsData.deposits || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepositRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/deposits/${id}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedRequest(data)
        setShowModal(true)
        setStep('instructions')
      }
    } catch (err) {
      console.error('Error fetching deposit request:', err)
    }
  }

  const handleMethodClick = (method: DepositMethod) => {
    setSelectedMethod(method)
    setStep('form')
    setError('')
    setAmount('')
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!selectedMethod) return

    const depositAmount = parseFloat(amount)
    if (isNaN(depositAmount) || depositAmount < selectedMethod.minAmount || depositAmount > selectedMethod.maxAmount) {
      setError(`Amount must be between $${selectedMethod.minAmount} and $${selectedMethod.maxAmount}`)
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depositAmount,
          method: selectedMethod.id,
          accountId: selectedAccount,
          cryptoCurrency: selectedMethod.id === 'CRYPTO' ? cryptoCurrency : undefined,
          senderInfo: senderInfo || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit deposit request')
      }

      setDepositResult(data)
      setStep('instructions')
      fetchData() // Refresh requests list
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'APPROVED': return 'bg-green-50 text-green-700 border-green-200'
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200'
      case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const pendingRequests = depositRequests.filter(r => r.status === 'PENDING')
  const hasPending = pendingRequests.length > 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-teal mb-1">Deposit Funds</h1>
          <p className="text-gray-500 text-sm">Add money to your account</p>
        </div>
        {hasPending && (
          <button
            onClick={() => setShowPending(!showPending)}
            className="relative"
          >
            <div className="bg-soft-gold/10 px-4 py-2 rounded-lg border border-soft-gold/20 flex items-center gap-2 hover:bg-soft-gold/20 transition-colors">
              <Clock className="w-4 h-4 text-soft-gold" />
              <span className="text-sm text-soft-gold font-medium">{pendingRequests.length} Pending</span>
            </div>
          </button>
        )}
      </div>

      {/* Pending Requests Panel */}
      {showPending && pendingRequests.length > 0 && (
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-soft-gold/10 to-transparent border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-medium text-deep-teal flex items-center gap-2">
              <Clock className="w-4 h-4 text-soft-gold" />
              Your Pending Deposits
            </h2>
            <button onClick={() => setShowPending(false)}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingRequests.map((req) => (
              <div 
                key={req.id} 
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedRequest(req as DepositRequest)
                  setStep('instructions')
                  setShowModal(true)
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-deep-teal">{formatCurrency(req.amount)}</span>
                    <span className="text-xs text-gray-400">via {req.method}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Ref: {req.reference}</span>
                  <span className="text-gray-400">{formatDate(req.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methods Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {depositMethods.map((method) => {
          const Icon = method.icon
          return (
            <button
              key={method.id}
              onClick={() => handleMethodClick(method)}
              className="bg-white rounded-xl shadow-sm border border-sage/20 p-4 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-soft-gold/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-soft-gold/20 transition-colors">
                  <Icon className="w-5 h-5 text-soft-gold" />
                </div>
                <h3 className="font-medium text-sm text-deep-teal mb-1">{method.name}</h3>
                <p className="text-xs text-gray-400">{method.processingTime}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Deposit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setShowModal(false)} />
            
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b z-10">
                <div className="flex items-center gap-2">
                  {step === 'instructions' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    selectedMethod && <selectedMethod.icon className="w-5 h-5 text-soft-gold" />
                  )}
                  <h3 className="font-semibold text-deep-teal">
                    {step === 'instructions' ? 'Payment Instructions' : (selectedMethod?.name || 'Deposit')}
                  </h3>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4">
                {step === 'form' ? (
                  <>
                    {/* Account Selection */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-500 mb-1">Deposit to</label>
                      <select
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-soft-gold"
                      >
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>
                            {acc.displayName} ({acc.maskedNumber}) - {formatCurrency(acc.balance)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-500 mb-1">
                        Amount (${selectedMethod?.minAmount} - ${selectedMethod?.maxAmount})
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-soft-gold"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Crypto Currency */}
                    {selectedMethod?.id === 'CRYPTO' && (
                      <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">Currency</label>
                        <select
                          value={cryptoCurrency}
                          onChange={(e) => setCryptoCurrency(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="USDT">Tether (USDT)</option>
                        </select>
                      </div>
                    )}

                    {/* Sender Info (optional) */}
                    {(selectedMethod?.id === 'CRYPTO' || selectedMethod?.id === 'CASHAPP' || selectedMethod?.id === 'VENMO') && (
                      <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">
                          Your {selectedMethod.id === 'CRYPTO' ? 'wallet address' : 'username'} <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={senderInfo}
                          onChange={(e) => setSenderInfo(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          placeholder={selectedMethod.id === 'CRYPTO' ? '0x...' : '@username'}
                        />
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                        <p className="text-xs text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!amount || submitting}
                        className="flex-1 bg-deep-teal text-white py-2 rounded-lg text-sm hover:bg-sage disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>Continue <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Instructions */}
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-medium text-deep-teal">Deposit Request Submitted</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Reference: <span className="font-mono font-bold">{(selectedRequest || depositResult)?.reference}</span>
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">Amount to send</p>
                      <p className="text-xl font-bold text-deep-teal">
                        {formatCurrency((selectedRequest || depositResult)?.amount || 0)}
                      </p>
                    </div>

                    {/* Payment Details */}
                    {(selectedRequest || depositResult) && (
                      <div className="space-y-3 mb-4">
                        {/* Bank Transfer */}
                        {((selectedRequest?.method === 'BANK' || selectedRequest?.method === 'WIRE') && 
                          (selectedRequest?.paymentDetails || depositResult?.adminPaymentDetails?.details)) && (
                          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                            <p className="text-xs font-medium text-deep-teal mb-2">Bank Details</p>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Bank:</span>
                                <span className="font-medium">Oldspring Trust Bank</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Account:</span>
                                <span className="font-medium">123456789</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Routing:</span>
                                <span className="font-medium">655205039</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Crypto */}
                        {selectedRequest?.method === 'CRYPTO' && selectedRequest?.paymentDetails && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-deep-teal mb-2">Wallet Address</p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 p-2 bg-white border rounded text-xs break-all">
                                {selectedRequest.paymentDetails[selectedRequest.cryptoCurrency || 'BTC']}
                              </code>
                              <button
                                onClick={() => copyToClipboard(selectedRequest.paymentDetails[selectedRequest.cryptoCurrency || 'BTC'], 'crypto')}
                                className="p-2 bg-white border rounded hover:bg-gray-50"
                              >
                                {copied === 'crypto' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Cash App */}
                        {selectedRequest?.method === 'CASHAPP' && selectedRequest?.paymentDetails && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-deep-teal mb-2">Cash App Tag</p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 p-3 bg-white border rounded text-center font-bold">
                                {selectedRequest.paymentDetails.cashtag}
                              </code>
                              <button
                                onClick={() => copyToClipboard(selectedRequest.paymentDetails.cashtag, 'cashapp')}
                                className="p-2 bg-white border rounded hover:bg-gray-50"
                              >
                                {copied === 'cashapp' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Venmo */}
                        {selectedRequest?.method === 'VENMO' && selectedRequest?.paymentDetails && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-deep-teal mb-2">Venmo Username</p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 p-3 bg-white border rounded text-center font-bold">
                                {selectedRequest.paymentDetails.username}
                              </code>
                              <button
                                onClick={() => copyToClipboard(selectedRequest.paymentDetails.username, 'venmo')}
                                className="p-2 bg-white border rounded hover:bg-gray-50"
                              >
                                {copied === 'venmo' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* PayPal */}
                        {selectedRequest?.method === 'PAYPAL' && selectedRequest?.paymentDetails && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-deep-teal mb-2">PayPal Email</p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 p-3 bg-white border rounded text-center">
                                {selectedRequest.paymentDetails.email}
                              </code>
                              <button
                                onClick={() => copyToClipboard(selectedRequest.paymentDetails.email, 'paypal')}
                                className="p-2 bg-white border rounded hover:bg-gray-50"
                              >
                                {copied === 'paypal' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Instructions */}
                    {(selectedRequest?.instructions || depositResult?.instructions) && (
                      <div className="bg-soft-gold/5 p-3 rounded-lg mb-4">
                        <p className="text-xs text-gray-600">{selectedRequest?.instructions || depositResult?.instructions}</p>
                      </div>
                    )}

                    {/* Important Note */}
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-xs text-blue-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="font-bold">Don't forget:</span> Include reference <span className="font-mono font-bold">{(selectedRequest || depositResult)?.reference}</span> in your payment.
                        </span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowModal(false)
                          setSelectedRequest(null)
                          setStep('form')
                          setAmount('')
                        }}
                        className="flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false)
                          setSelectedRequest(null)
                          setStep('form')
                          setAmount('')
                          router.push('/dashboard/notifications')
                        }}
                        className="flex-1 bg-soft-gold text-white py-2 rounded-lg text-sm hover:bg-soft-gold/80 flex items-center justify-center gap-1"
                      >
                        <Bell className="w-4 h-4" />
                        View Notifications
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
