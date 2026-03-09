'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  ChevronDown,
  Search,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function LocalTransferPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [transferDetails, setTransferDetails] = useState({
    fromAccount: '',
    toAccount: '',
    toName: '',
    toBank: '',
    amount: '',
    description: '',
  })

  const accounts = [
    { id: '1', name: 'Primary Checking', number: '****1234', balance: 5280.42 },
    { id: '2', name: 'High-Yield Savings', number: '****5678', balance: 12750.89 },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push('/dashboard/transfers')
    }
  }

  const handleSubmit = () => {
    // Submit transfer
    router.push('/dashboard/transfers/confirm')
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
          <h1 className="text-2xl font-bold text-deep-teal">Local Transfer</h1>
          <p className="text-gray-500 text-sm mt-1">Send money within the country</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                i <= step ? 'bg-soft-gold text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i}
              </div>
              {i < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  i < step ? 'bg-soft-gold' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Amount</span>
          <span className="text-xs text-gray-500">Recipient</span>
          <span className="text-xs text-gray-500">Confirm</span>
        </div>
      </div>

      {/* Step 1: Amount */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <h2 className="text-lg font-semibold text-deep-teal mb-6">How much would you like to send?</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
            <select
              value={transferDetails.fromAccount}
              onChange={(e) => setTransferDetails({...transferDetails, fromAccount: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            >
              <option value="">Select account</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.number}) - {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={transferDetails.amount}
                onChange={(e) => setTransferDetails({...transferDetails, amount: e.target.value})}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {[100, 500, 1000, 2500].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTransferDetails({...transferDetails, amount: amt.toString()})}
                className="flex-1 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-soft-gold hover:text-white transition-colors"
              >
                ${amt}
              </button>
            ))}
          </div>

          <div className="bg-soft-gold/5 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-deep-teal">Transfer limit:</span> $50,000 per day
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Remaining today: $44,719.58
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={!transferDetails.amount || !transferDetails.fromAccount}
            className="w-full bg-deep-teal text-white py-3 rounded-lg hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Recipient */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <h2 className="text-lg font-semibold text-deep-teal mb-6">Who are you sending to?</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
            <input
              type="text"
              value={transferDetails.toAccount}
              onChange={(e) => setTransferDetails({...transferDetails, toAccount: e.target.value})}
              placeholder="Enter account number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
            <input
              type="text"
              value={transferDetails.toName}
              onChange={(e) => setTransferDetails({...transferDetails, toName: e.target.value})}
              placeholder="Full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
            <select
              value={transferDetails.toBank}
              onChange={(e) => setTransferDetails({...transferDetails, toBank: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            >
              <option value="">Select bank</option>
              <option value="chase">Chase Bank</option>
              <option value="boa">Bank of America</option>
              <option value="wells">Wells Fargo</option>
              <option value="citibank">Citibank</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <input
              type="text"
              value={transferDetails.description}
              onChange={(e) => setTransferDetails({...transferDetails, description: e.target.value})}
              placeholder="e.g., Rent, Gift, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={!transferDetails.toAccount || !transferDetails.toName || !transferDetails.toBank}
            className="w-full bg-deep-teal text-white py-3 rounded-lg hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <h2 className="text-lg font-semibold text-deep-teal mb-6">Review Transfer Details</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Amount</span>
              <span className="font-bold text-deep-teal text-xl">
                {formatCurrency(parseFloat(transferDetails.amount || '0'))}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">From</span>
              <span className="font-medium text-deep-teal">
                {accounts.find(a => a.id === transferDetails.fromAccount)?.name} ({accounts.find(a => a.id === transferDetails.fromAccount)?.number})
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">To</span>
              <div className="text-right">
                <p className="font-medium text-deep-teal">{transferDetails.toName}</p>
                <p className="text-xs text-gray-500">{transferDetails.toAccount} · {transferDetails.toBank}</p>
              </div>
            </div>
            {transferDetails.description && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Description</span>
                <span className="font-medium text-deep-teal">{transferDetails.description}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Fee</span>
              <span className="font-medium text-sage">Free</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-deep-teal text-xl">
                {formatCurrency(parseFloat(transferDetails.amount || '0'))}
              </span>
            </div>
          </div>

          <div className="bg-soft-gold/5 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-soft-gold mt-0.5" />
              <span>Please verify all details carefully. Transfers cannot be reversed once sent.</span>
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
          >
            Confirm & Send
          </button>
        </div>
      )}
    </div>
  )
}
