# Create the withdrawal page directory and file
mkdir -p src/app/dashboard/withdraw

cat > src/app/dashboard/withdraw/page.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building,
  CreditCard,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
  Wallet,
  Copy,
  Plus,
  Trash2,
  Check,
  Info,
  DollarSign,
  Shield,
  Zap,
  Bitcoin,
  Landmark,
  Smartphone
} from 'lucide-react'

interface Account {
  id: string
  accountType: string
  displayName: string
  accountNumber: string
  maskedNumber: string
  balance: number
  currency: string
}

interface WithdrawalMethod {
  id: string
  name: string
  description: string
  feeType: 'fixed' | 'percentage'
  feeValue: number
  minAmount: number
  maxAmount: number
  processingTime: string
  icon?: string
}

interface SavedMethod {
  id: string
  method: string
  nickname?: string
  accountHolder?: string
  accountNumber?: string
  routingNumber?: string
  bankName?: string
  walletAddress?: string
  email?: string
  phone?: string
  isDefault?: boolean
}

export default function WithdrawPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [methods, setMethods] = useState<WithdrawalMethod[]>([])
  const [savedMethods, setSavedMethods] = useState<SavedMethod[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(null)
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<SavedMethod | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [useSavedMethod, setUseSavedMethod] = useState(true)
  const [saveMethod, setSaveMethod] = useState(false)
  const [newMethodData, setNewMethodData] = useState({
    accountHolder: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    walletAddress: '',
    email: '',
    phone: ''
  })
  const [withdrawalResult, setWithdrawalResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch accounts
      const accountsRes = await fetch('/api/accounts')
      const accountsData = await accountsRes.json()
      
      if (accountsRes.ok) {
        const formattedAccounts = (accountsData.accounts || []).map((acc: any) => ({
          ...acc,
          displayName: acc.accountType === 'CHECKING' ? 'Checking Account' : 
                      acc.accountType === 'SAVINGS' ? 'Savings Account' : 
                      acc.accountType === 'CREDIT' ? 'Credit Card' : 'Account',
          maskedNumber: acc.accountNumber ? acc.accountNumber.replace(/\d(?=\d{4})/g, '*') : '****'
        }))
        setAccounts(formattedAccounts)
      }

      // Fetch withdrawal methods (hardcoded for now, will come from DB later)
      const defaultMethods: WithdrawalMethod[] = [
        {
          id: 'bank_transfer',
          name: 'Bank Transfer (ACH)',
          description: 'Transfer to your external bank account',
          feeType: 'fixed',
          feeValue: 0,
          minAmount: 10,
          maxAmount: 50000,
          processingTime: '1-3 business days'
        },
        {
          id: 'wire',
          name: 'Wire Transfer',
          description: 'Domestic wire transfer',
          feeType: 'fixed',
          feeValue: 25,
          minAmount: 1000,
          maxAmount: 100000,
          processingTime: 'Same day'
        },
        {
          id: 'card',
          name: 'Debit Card',
          description: 'Instant withdrawal to your debit card',
          feeType: 'percentage',
          feeValue: 1.5,
          minAmount: 5,
          maxAmount: 5000,
          processingTime: 'Instant'
        },
        {
          id: 'crypto',
          name: 'Cryptocurrency',
          description: 'Withdraw to crypto wallet',
          feeType: 'fixed',
          feeValue: 0,
          minAmount: 50,
          maxAmount: 10000,
          processingTime: '10-30 minutes'
        }
      ]
      setMethods(defaultMethods)

      // Fetch saved methods (empty for now)
      setSavedMethods([])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateFee = (amountValue: number): number => {
    if (!selectedMethod) return 0
    if (selectedMethod.feeType === 'percentage') {
      return amountValue * (selectedMethod.feeValue / 100)
    }
    return selectedMethod.feeValue
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setAmount(value)
    setError(null)
  }

  const handleMethodSelect = (method: WithdrawalMethod) => {
    setSelectedMethod(method)
    setSelectedSavedMethod(null)
    setStep(2)
  }

  const handleSavedMethodSelect = (savedMethod: SavedMethod) => {
    setSelectedSavedMethod(savedMethod)
    const method = methods.find(m => m.id === savedMethod.method)
    setSelectedMethod(method || null)
    setStep(2)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setError(null)
    } else {
      router.push('/dashboard')
    }
  }

  const handleSubmit = async () => {
    if (!selectedAccount || !selectedMethod || !amount) {
      setError('Please fill in all required fields')
      return
    }

    const amountValue = parseFloat(amount)
    const account = accounts.find(a => a.id === selectedAccount)

    if (!account) {
      setError('Selected account not found')
      return
    }

    if (amountValue > account.balance) {
      setError('Insufficient funds')
      return
    }

    if (amountValue < selectedMethod.minAmount) {
      setError(`Minimum withdrawal amount is $${selectedMethod.minAmount}`)
      return
    }

    if (amountValue > selectedMethod.maxAmount) {
      setError(`Maximum withdrawal amount is $${selectedMethod.maxAmount}`)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockResult = {
        id: `wd_${Date.now()}`,
        amount: amountValue,
        method: selectedMethod.id,
        fee: calculateFee(amountValue),
        reference: `WD${Date.now().toString(36).toUpperCase()}`,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }

      setWithdrawalResult(mockResult)
      setStep(3)
    } catch (err: any) {
      setError(err.message || 'Failed to submit withdrawal')
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'bank_transfer':
        return Building
      case 'wire':
        return Globe
      case 'card':
        return CreditCard
      case 'crypto':
        return Bitcoin
      default:
        return Wallet
    }
  }

  const selectedAccountDetails = accounts.find(a => a.id === selectedAccount)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading withdrawal options...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-deep-teal" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Withdraw Funds</h1>
          <p className="text-gray-500 text-sm mt-1">Move money to your external accounts</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-gradient-to-r from-deep-teal to-sage text-white shadow-lg' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i}
              </div>
              {i < 3 && (
                <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                  i < step ? 'bg-gradient-to-r from-deep-teal to-sage' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs text-gray-500">Method</span>
          <span className="text-xs text-gray-500">Details</span>
          <span className="text-xs text-gray-500">Confirm</span>
        </div>
      </div>

      {/* Step 1: Select Account & Method */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Account Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h2 className="text-lg font-semibold text-deep-teal mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-soft-gold" />
              Select Account
            </h2>
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No accounts found</p>
                <Link
                  href="/dashboard/accounts/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-deep-teal text-white rounded-lg hover:bg-sage"
                >
                  <Plus className="w-4 h-4" />
                  Open an Account
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => (
                  <label
                    key={account.id}
                    className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedAccount === account.id
                        ? 'border-soft-gold bg-soft-gold/5'
                        : 'border-gray-200 hover:border-soft-gold/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="account"
                          value={account.id}
                          checked={selectedAccount === account.id}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          className="w-4 h-4 text-soft-gold focus:ring-soft-gold"
                        />
                        <div>
                          <p className="font-medium text-deep-teal">{account.displayName}</p>
                          <p className="text-sm text-gray-500">{account.maskedNumber}</p>
                        </div>
                      </div>
                      <p className="font-bold text-deep-teal">{formatCurrency(account.balance)}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* New Method Selection */}
          {selectedAccount && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
              <h2 className="text-lg font-semibold text-deep-teal mb-4">Choose Withdrawal Method</h2>
              <div className="space-y-3">
                {methods.map((method) => {
                  const MethodIcon = getMethodIcon(method.id)
                  return (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method)}
                      className="w-full p-4 rounded-xl border border-gray-200 hover:border-soft-gold hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-soft-gold/10 rounded-full flex items-center justify-center group-hover:bg-soft-gold/20 transition-colors">
                          <MethodIcon className="w-6 h-6 text-soft-gold" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-deep-teal">{method.name}</h3>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-soft-gold transition-colors" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {method.processingTime}
                            </span>
                            <span>Fee: {method.feeType === 'percentage' ? `${method.feeValue}%` : `$${method.feeValue}`}</span>
                            <span>Min: ${method.minAmount}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Enter Details */}
      {step === 2 && selectedMethod && (
        <div className="space-y-6">
          {/* Method Summary */}
          <div className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                {selectedMethod.id === 'bank_transfer' && <Building className="w-6 h-6" />}
                {selectedMethod.id === 'wire' && <Globe className="w-6 h-6" />}
                {selectedMethod.id === 'card' && <CreditCard className="w-6 h-6" />}
                {selectedMethod.id === 'crypto' && <Bitcoin className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold">{selectedMethod.name}</h3>
                <p className="text-sm text-white/80">{selectedMethod.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-white/70">Fee</p>
                <p className="font-semibold">
                  {selectedMethod.feeType === 'percentage' ? `${selectedMethod.feeValue}%` : `$${selectedMethod.feeValue}`}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-white/70">Min</p>
                <p className="font-semibold">${selectedMethod.minAmount}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-white/70">Max</p>
                <p className="font-semibold">${selectedMethod.maxAmount}</p>
              </div>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h2 className="text-lg font-semibold text-deep-teal mb-4">Recipient Details</h2>
            
            {selectedMethod.id === 'bank_transfer' || selectedMethod.id === 'wire' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                  <input
                    type="text"
                    value={newMethodData.accountHolder}
                    onChange={(e) => setNewMethodData({...newMethodData, accountHolder: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={newMethodData.accountNumber}
                    onChange={(e) => setNewMethodData({...newMethodData, accountNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                  <input
                    type="text"
                    value={newMethodData.routingNumber}
                    onChange={(e) => setNewMethodData({...newMethodData, routingNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="021000021"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={newMethodData.bankName}
                    onChange={(e) => setNewMethodData({...newMethodData, bankName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="Chase, Bank of America, etc."
                  />
                </div>
              </div>
            ) : selectedMethod.id === 'crypto' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={newMethodData.walletAddress}
                    onChange={(e) => setNewMethodData({...newMethodData, walletAddress: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="0x..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={newMethodData.accountNumber}
                    onChange={(e) => setNewMethodData({...newMethodData, accountNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="**** **** **** 1234"
                  />
                </div>
              </div>
            )}

            {/* Save Method Checkbox */}
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveMethod}
                  onChange={(e) => setSaveMethod(e.target.checked)}
                  className="w-4 h-4 text-soft-gold focus:ring-soft-gold rounded"
                />
                <span className="text-sm text-gray-600">Save this method for future withdrawals</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h2 className="text-lg font-semibold text-deep-teal mb-4">Amount to Withdraw</h2>
            
            <div className="mb-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  min={selectedMethod.minAmount}
                  max={Math.min(selectedMethod.maxAmount, selectedAccountDetails?.balance || 0)}
                  className="w-full pl-8 pr-4 py-3 text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Available: {selectedAccountDetails ? formatCurrency(selectedAccountDetails.balance) : 'Select account'}
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[100, 500, 1000, 2500]
                .filter(amt => amt <= (selectedAccountDetails?.balance || 0))
                .map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className="py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-soft-gold hover:text-white transition-colors"
                  >
                    ${amt}
                  </button>
              ))}
            </div>

            {/* Fee Calculation */}
            {amount && (
              <div className="bg-soft-gold/5 p-4 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-deep-teal">{formatCurrency(parseFloat(amount) || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-600">Fee ({selectedMethod.feeType === 'percentage' ? `${selectedMethod.feeValue}%` : 'fixed'}):</span>
                  <span className="font-medium text-sage">{formatCurrency(calculateFee(parseFloat(amount) || 0))}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold mt-3 pt-3 border-t border-gray-200">
                  <span className="text-deep-teal">Total to be deducted:</span>
                  <span className="text-deep-teal">
                    {formatCurrency((parseFloat(amount) || 0) + calculateFee(parseFloat(amount) || 0))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!amount || !selectedAccount || parseFloat(amount) < selectedMethod.minAmount || submitting}
            className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue to Confirmation'
            )}
          </button>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && withdrawalResult && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-sage/20">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-deep-teal mb-2">Withdrawal Initiated!</h2>
            <p className="text-gray-600">
              Your withdrawal request has been submitted successfully
            </p>
          </div>

          <div className="bg-soft-gold/5 rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-2xl text-deep-teal">
                  {formatCurrency(withdrawalResult.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Fee</span>
                <span className="font-medium text-sage">{formatCurrency(withdrawalResult.fee)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Reference</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{withdrawalResult.reference}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(withdrawalResult.reference)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  {withdrawalResult.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Estimated Time</span>
                <span className="font-medium text-deep-teal flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedMethod?.processingTime}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                You will receive a notification once your withdrawal is processed. 
                You can track the status in your withdrawals history.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/dashboard/withdrawals"
              className="px-4 py-3 border border-deep-teal text-deep-teal rounded-lg hover:bg-deep-teal hover:text-white transition-colors text-center font-medium"
            >
              View History
            </Link>
            <button
              onClick={() => {
                setStep(1)
                setSelectedMethod(null)
                setSelectedSavedMethod(null)
                setAmount('')
                setWithdrawalResult(null)
              }}
              className="px-4 py-3 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              New Withdrawal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
EOF

echo "✅ Created withdrawal page at src/app/dashboard/withdraw/page.tsx"

# Create a simple withdrawals list page
mkdir -p src/app/dashboard/withdrawals

cat > src/app/dashboard/withdrawals/page.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Plus,
  ChevronRight,
  Wallet,
  Building,
  CreditCard,
  Bitcoin
} from 'lucide-react'

interface Withdrawal {
  id: string
  amount: number
  method: string
  fee: number
  reference: string
  status: string
  createdAt: string
}

export default function WithdrawalsPage() {
  const router = useRouter()
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching withdrawals
    setTimeout(() => {
      setWithdrawals([])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'PROCESSING':
        return <Loader2 className="w-5 h-5 text-soft-gold animate-spin" />
      case 'PENDING':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building className="w-5 h-5" />
      case 'wire':
        return <Building className="w-5 h-5" />
      case 'card':
        return <CreditCard className="w-5 h-5" />
      case 'crypto':
        return <Bitcoin className="w-5 h-5" />
      default:
        return <Wallet className="w-5 h-5" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading withdrawals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-deep-teal" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-deep-teal">Withdrawals</h1>
            <p className="text-gray-500 text-sm mt-1">Track your withdrawal requests</p>
          </div>
        </div>
        <Link
          href="/dashboard/withdraw"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          New Withdrawal
        </Link>
      </div>

      {/* Withdrawals List */}
      {withdrawals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <div className="w-20 h-20 bg-soft-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-10 h-10 text-soft-gold" />
          </div>
          <h3 className="text-lg font-semibold text-deep-teal mb-2">No withdrawals yet</h3>
          <p className="text-gray-500 mb-6">Start by making your first withdrawal</p>
          <Link
            href="/dashboard/withdraw"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Make a Withdrawal
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <Link
              key={withdrawal.id}
              href={`/dashboard/withdrawals/${withdrawal.id}`}
              className="block bg-white rounded-xl shadow-lg p-6 border border-sage/20 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {getMethodIcon(withdrawal.method)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-deep-teal">
                        {formatCurrency(withdrawal.amount)}
                      </h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        {withdrawal.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ref: {withdrawal.reference}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
EOF

echo "✅ Created withdrawals list page"

echo ""
echo "🎉 Withdrawal pages created successfully!"
echo ""
echo "To fix the 404 error, run:"
echo "  npm run dev"
echo ""
echo "Then visit:"
echo "  http://localhost:3000/dashboard/withdraw"
echo "  http://localhost:3000/dashboard/withdrawals"
echo ""