'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  ArrowRight,
  Send,
  Wallet,
  Building,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Copy,
  Download,
  Share2,
  X
} from 'lucide-react'

interface Account {
  id: string
  accountType: string
  accountNumber: string
  balance: number
  displayName: string
}

interface TransferDetails {
  amount: number
  fee: number
  total: number
  fromAccount: string
}

interface TransferResult {
  id: string
  reference: string
  amount: number
  fee: number
  total: number
  fromAccount: string
  toAccount: string
  description: string
  timestamp: string
  newBalance: {
    from: number
    to: number | null
  }
}

export default function TransfersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [transferType, setTransferType] = useState('internal')
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [toAccountNumber, setToAccountNumber] = useState('')
  const [toBankName, setToBankName] = useState('')
  const [toAccountName, setToAccountName] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [requestId, setRequestId] = useState('')
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

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

  const selectedFromAccount = accounts.find(a => a.id === fromAccount)

  const calculateFee = () => {
    const amt = parseFloat(amount) || 0
    let fee = 0
    if (transferType === 'external') fee = 15
    if (transferType === 'wire') fee = 25
    return { fee, total: amt + fee }
  }

  const handleInitiateTransfer = async () => {
    setError('')
    setIsProcessing(true)

    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toAccountId: transferType === 'internal' ? toAccount : undefined,
          toAccountNumber: transferType !== 'internal' ? toAccountNumber : undefined,
          toBankName: transferType !== 'internal' ? toBankName : undefined,
          toAccountName: transferType !== 'internal' ? toAccountName : undefined,
          amount: parseFloat(amount),
          description,
          type: transferType
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate transfer')
      }

      setRequestId(data.requestId)
      setStep(2)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVerifyOTP = async () => {
    const code = otpCode.join('')
    if (code.length !== 6) {
      setError('Please enter complete 6-digit code')
      return
    }

    setError('')
    setIsProcessing(true)

    try {
      const response = await fetch('/api/transfers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, otpCode: code })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setTransferResult(data.transfer)
      setStep(3)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const handleDownloadReceipt = () => {
    // Create a blob with the receipt HTML
    const receiptContent = document.getElementById('transfer-receipt')?.innerHTML
    if (!receiptContent) return

    const style = `
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; }
        .receipt { max-width: 400px; margin: 0 auto; background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 1.5rem; }
        .title { font-size: 1.5rem; font-weight: bold; color: #006F87; }
        .detail-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e2e8f0; }
        .label { color: #64748b; }
        .value { font-weight: 600; color: #1e293b; }
        .amount { font-size: 1.5rem; font-weight: bold; color: #006F87; }
        .footer { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: #94a3b8; }
      </style>
    `

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Transfer Receipt</title>
          ${style}
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transfer-receipt-${transferResult?.reference}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your accounts...</p>
        </div>
      </div>
    )
  }

  if (step === 3 && transferResult) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-deep-teal mb-2">Transfer Complete!</h1>
          <p className="text-gray-500">Your money has been sent successfully</p>
        </div>

        {/* Receipt Card */}
        <div id="transfer-receipt" className="bg-white rounded-2xl shadow-xl p-6 border border-sage/20 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-deep-teal">Oldspring Trust</h2>
            <p className="text-xs text-gray-400">Transfer Receipt</p>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Amount Sent</p>
              <p className="text-3xl font-bold text-deep-teal">{formatCurrency(transferResult.amount)}</p>
            </div>

            <div className="bg-soft-gold/5 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reference</span>
                <span className="font-mono font-medium text-deep-teal">{transferResult.reference}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium text-deep-teal">
                  {new Date(transferResult.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">From Account</span>
                <span className="font-medium text-deep-teal">
                  {accounts.find(a => a.id === transferResult.fromAccount)?.accountType} 
                  (••••{accounts.find(a => a.id === transferResult.fromAccount)?.accountNumber.slice(-4)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To Account</span>
                <span className="font-medium text-deep-teal">{transferResult.toAccount}</span>
              </div>
              {transferResult.description && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Description</span>
                  <span className="font-medium text-deep-teal">{transferResult.description}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Fee</span>
                <span className="font-medium text-deep-teal">{formatCurrency(transferResult.fee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-deep-teal">Total Deducted</span>
                <span className="font-bold text-deep-teal">{formatCurrency(transferResult.total)}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                New Balance: {formatCurrency(transferResult.newBalance.from)}
              </p>
            </div>

            <div className="text-center text-xs text-gray-400">
              <p>FSCS Protected • Authorised by the Prudential Regulation Authority</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 bg-deep-teal text-white py-3 rounded-lg hover:bg-sage transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
          <button
            onClick={handlePrintReceipt}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-soft-gold hover:text-deep-teal transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-deep-teal mb-2">Transfer Money</h1>
        <p className="text-gray-500">Send money securely to any account</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                i <= step ? 'bg-soft-gold text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i}
              </div>
              {i < 2 && (
                <div className={`flex-1 h-1 mx-2 ${
                  i < step ? 'bg-soft-gold' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Transfer Details</span>
          <span className="text-xs text-gray-500">Verification</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-sage/20">
          {/* Transfer Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Transfer Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTransferType('internal')}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                  transferType === 'internal'
                    ? 'border-soft-gold bg-soft-gold/5'
                    : 'border-gray-200 hover:border-soft-gold/50'
                }`}
              >
                <Wallet className={`w-6 h-6 ${
                  transferType === 'internal' ? 'text-soft-gold' : 'text-gray-600'
                }`} />
                <span className="text-xs font-medium">Internal</span>
              </button>
              <button
                onClick={() => setTransferType('external')}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                  transferType === 'external'
                    ? 'border-soft-gold bg-soft-gold/5'
                    : 'border-gray-200 hover:border-soft-gold/50'
                }`}
              >
                <Building className={`w-6 h-6 ${
                  transferType === 'external' ? 'text-soft-gold' : 'text-gray-600'
                }`} />
                <span className="text-xs font-medium">External</span>
              </button>
              <button
                onClick={() => setTransferType('wire')}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                  transferType === 'wire'
                    ? 'border-soft-gold bg-soft-gold/5'
                    : 'border-gray-200 hover:border-soft-gold/50'
                }`}
              >
                <Globe className={`w-6 h-6 ${
                  transferType === 'wire' ? 'text-soft-gold' : 'text-gray-600'
                }`} />
                <span className="text-xs font-medium">Wire</span>
              </button>
            </div>
          </div>

          {/* From Account */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold"
              required
            >
              <option value="">Select account</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType} (••••{acc.accountNumber.slice(-4)}) - {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
          </div>

          {/* To Account - Internal */}
          {transferType === 'internal' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">To Account</label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold"
                required
              >
                <option value="">Select account</option>
                {accounts
                  .filter(acc => acc.id !== fromAccount)
                  .map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountType} (••••{acc.accountNumber.slice(-4)}) - {formatCurrency(acc.balance)}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* To Account - External/Wire */}
          {(transferType === 'external' || transferType === 'wire') && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={toAccountNumber}
                  onChange={(e) => setToAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={toBankName}
                  onChange={(e) => setToBankName(e.target.value)}
                  placeholder="Enter bank name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={toAccountName}
                  onChange={(e) => setToAccountName(e.target.value)}
                  placeholder="Full name on account"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold"
                  required
                />
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Rent, Gift, Invoice"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold"
            />
          </div>

          {/* Fee Summary */}
          {fromAccount && amount && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-deep-teal">{formatCurrency(parseFloat(amount) || 0)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Fee</span>
                <span className="font-medium text-deep-teal">{formatCurrency(calculateFee().fee)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="font-medium text-deep-teal">Total</span>
                <span className="font-bold text-deep-teal">{formatCurrency(calculateFee().total)}</span>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleInitiateTransfer}
            disabled={!fromAccount || !amount || (transferType === 'internal' && !toAccount) || 
              ((transferType === 'external' || transferType === 'wire') && (!toAccountNumber || !toBankName || !toAccountName)) ||
              isProcessing}
            className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-sage/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-soft-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-soft-gold" />
            </div>
            <h2 className="text-xl font-bold text-deep-teal mb-2">Verification Required</h2>
            <p className="text-gray-500">Enter the 6-digit code sent to your email</p>
          </div>

          {/* OTP Input */}
          <div className="flex gap-2 justify-center mb-6">
            {otpCode.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const newOtp = [...otpCode]
                  newOtp[index] = e.target.value.replace(/\D/g, '')
                  setOtpCode(newOtp)
                  if (e.target.value && index < 5) {
                    const nextInput = document.getElementById(`otp-${index + 1}`)
                    nextInput?.focus()
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                    const prevInput = document.getElementById(`otp-${index - 1}`)
                    prevInput?.focus()
                  }
                }}
                id={`otp-${index}`}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-soft-gold focus:ring-2 focus:ring-soft-gold outline-none"
              />
            ))}
          </div>

          {/* Fee Summary */}
          {selectedFromAccount && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 text-center">
                Sending <span className="font-bold text-deep-teal">{formatCurrency(parseFloat(amount) || 0)}</span> from your {selectedFromAccount.accountType}
              </p>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerifyOTP}
            disabled={otpCode.join('').length !== 6 || isProcessing}
            className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
            ) : (
              <>Verify & Complete Transfer</>
            )}
          </button>

          <button
            onClick={() => setStep(1)}
            className="w-full mt-4 text-sm text-gray-500 hover:text-deep-teal transition-colors"
          >
            ← Back to details
          </button>
        </div>
      )}
    </div>
  )
}
