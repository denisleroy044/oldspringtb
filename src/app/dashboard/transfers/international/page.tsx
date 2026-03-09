'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Globe,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle
} from 'lucide-react'

export default function InternationalTransferPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [transferDetails, setTransferDetails] = useState({
    fromAccount: '',
    amount: '',
    currency: 'USD',
    toCountry: '',
    toCurrency: 'EUR',
    toName: '',
    toIban: '',
    toSwift: '',
    toBank: '',
    description: '',
  })

  const accounts = [
    { id: '1', name: 'Primary Checking', number: '****1234', balance: 5280.42 },
    { id: '2', name: 'High-Yield Savings', number: '****5678', balance: 12750.89 },
  ]

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0000 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.9250 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.7950 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 150.25 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.3650 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.5250 },
  ]

  const countries = [
    { name: 'United Kingdom', code: 'GB', currency: 'GBP' },
    { name: 'Germany', code: 'DE', currency: 'EUR' },
    { name: 'France', code: 'FR', currency: 'EUR' },
    { name: 'Spain', code: 'ES', currency: 'EUR' },
    { name: 'Italy', code: 'IT', currency: 'EUR' },
    { name: 'Japan', code: 'JP', currency: 'JPY' },
    { name: 'Canada', code: 'CA', currency: 'CAD' },
    { name: 'Australia', code: 'AU', currency: 'AUD' },
  ]

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const calculateExchange = () => {
    const fromCurrency = currencies.find(c => c.code === transferDetails.currency)
    const toCurrency = currencies.find(c => c.code === transferDetails.toCurrency)
    const amount = parseFloat(transferDetails.amount) || 0
    
    if (fromCurrency && toCurrency) {
      const inUSD = amount / fromCurrency.rate
      const converted = inUSD * toCurrency.rate
      return converted
    }
    return 0
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-deep-teal">International Transfer</h1>
            <Globe className="w-5 h-5 text-soft-gold" />
          </div>
          <p className="text-gray-500 text-sm mt-1">Send money abroad securely</p>
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
          <span className="text-xs text-gray-500">Amount & Currency</span>
          <span className="text-xs text-gray-500">Recipient Details</span>
          <span className="text-xs text-gray-500">Confirm</span>
        </div>
      </div>

      {/* Step 1: Amount & Currency */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <h2 className="text-lg font-semibold text-deep-teal mb-6">Amount & Currency</h2>

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

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">You Send</label>
              <div className="flex">
                <select
                  value={transferDetails.currency}
                  onChange={(e) => setTransferDetails({...transferDetails, currency: e.target.value})}
                  className="w-24 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-gray-50"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={transferDetails.amount}
                  onChange={(e) => setTransferDetails({...transferDetails, amount: e.target.value})}
                  placeholder="0.00"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Gets</label>
              <div className="flex">
                <select
                  value={transferDetails.toCurrency}
                  onChange={(e) => setTransferDetails({...transferDetails, toCurrency: e.target.value})}
                  className="w-24 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-gray-50"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formatCurrency(calculateExchange(), transferDetails.toCurrency)}
                  disabled
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-soft-gold/5 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Exchange Rate</span>
              <button className="text-soft-gold hover:text-deep-teal flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                <span className="text-xs">Refresh</span>
              </button>
            </div>
            <p className="text-sm font-medium text-deep-teal">
              1 {transferDetails.currency} = {currencies.find(c => c.code === transferDetails.toCurrency)?.rate.toFixed(4)} {transferDetails.toCurrency}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Rate updated 2 minutes ago
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination Country</label>
            <select
              value={transferDetails.toCountry}
              onChange={(e) => {
                const country = countries.find(c => c.name === e.target.value)
                setTransferDetails({
                  ...transferDetails,
                  toCountry: e.target.value,
                  toCurrency: country?.currency || 'EUR'
                })
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            >
              <option value="">Select country</option>
              {countries.map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleContinue}
            disabled={!transferDetails.amount || !transferDetails.fromAccount || !transferDetails.toCountry}
            className="w-full bg-deep-teal text-white py-3 rounded-lg hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Recipient Details */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <h2 className="text-lg font-semibold text-deep-teal mb-6">Recipient Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={transferDetails.toName}
                onChange={(e) => setTransferDetails({...transferDetails, toName: e.target.value})}
                placeholder="Recipient's full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
              <input
                type="text"
                value={transferDetails.toIban}
                onChange={(e) => setTransferDetails({...transferDetails, toIban: e.target.value})}
                placeholder="International Bank Account Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT/BIC Code</label>
              <input
                type="text"
                value={transferDetails.toSwift}
                onChange={(e) => setTransferDetails({...transferDetails, toSwift: e.target.value})}
                placeholder="e.g., BOFAUS3N"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                value={transferDetails.toBank}
                onChange={(e) => setTransferDetails({...transferDetails, toBank: e.target.value})}
                placeholder="Recipient's bank"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <input
                type="text"
                value={transferDetails.description}
                onChange={(e) => setTransferDetails({...transferDetails, description: e.target.value})}
                placeholder="e.g., Invoice #123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!transferDetails.toName || !transferDetails.toIban || !transferDetails.toSwift}
            className="w-full bg-deep-teal text-white py-3 rounded-lg hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <h2 className="text-lg font-semibold text-deep-teal mb-6">Review Transfer</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">You Send</span>
              <span className="font-bold text-deep-teal">
                {formatCurrency(parseFloat(transferDetails.amount || '0'), transferDetails.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Recipient Gets</span>
              <span className="font-bold text-sage">
                {formatCurrency(calculateExchange(), transferDetails.toCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-medium text-deep-teal">
                1 {transferDetails.currency} = {currencies.find(c => c.code === transferDetails.toCurrency)?.rate.toFixed(4)} {transferDetails.toCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Fee</span>
              <span className="font-medium text-sage">$15.00</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Delivery Time</span>
              <span className="font-medium text-deep-teal flex items-center gap-1">
                <Clock className="w-4 h-4" />
                2-3 business days
              </span>
            </div>
          </div>

          <div className="bg-soft-gold/5 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-soft-gold mt-0.5" />
              <span>Please verify all details carefully. International transfers cannot be cancelled once processed.</span>
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
