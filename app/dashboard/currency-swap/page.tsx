'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function CurrencySwapPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [fromAmount, setFromAmount] = useState('1000')
  const [toAmount, setToAmount] = useState('')
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [step, setStep] = useState(1)

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0000, change: 0.00 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.9250, change: -0.15 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.7950, change: 0.25 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 150.25, change: 0.50 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.3650, change: 0.10 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.5250, change: -0.20 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.8850, change: 0.05 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.1950, change: -0.10 },
  ]

  useEffect(() => {
    calculateConversion()
  }, [fromAmount, fromCurrency, toCurrency])

  const calculateConversion = () => {
    const from = currencies.find(c => c.code === fromCurrency)
    const to = currencies.find(c => c.code === toCurrency)
    
    if (from && to && fromAmount) {
      const amount = parseFloat(fromAmount) || 0
      const inUSD = amount / from.rate
      const converted = inUSD * to.rate
      setToAmount(converted.toFixed(2))
    }
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleContinue = () => {
    setStep(2)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push('/dashboard')
    }
  }

  const handleConfirm = () => {
    setStep(3)
  }

  const getExchangeRate = () => {
    const from = currencies.find(c => c.code === fromCurrency)
    const to = currencies.find(c => c.code === toCurrency)
    return (to?.rate / from?.rate).toFixed(4)
  }

  const formatCurrency = (amount: number, code: string) => {
    const currency = currencies.find(c => c.code === code)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount).replace(code, currency?.symbol || code)
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
          <h1 className="text-2xl font-bold text-deep-teal">Currency Swap</h1>
          <p className="text-gray-500 text-sm mt-1">Exchange currencies at live rates</p>
        </div>
      </div>

      {/* Progress */}
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
          <span className="text-xs text-gray-500">Review</span>
          <span className="text-xs text-gray-500">Confirm</span>
        </div>
      </div>

      {/* Step 1: Enter Amount */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <h2 className="text-lg font-semibold text-deep-teal mb-6">Enter Amount</h2>

          {/* From Currency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">You Send</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {currencies.find(c => c.code === fromCurrency)?.symbol}
                </span>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              </div>
              <div className="relative w-40">
                <button
                  onClick={() => setShowFromDropdown(!showFromDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50"
                >
                  <span className="font-medium">{fromCurrency}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showFromDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setFromCurrency(currency.code)
                          setShowFromDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium">{currency.code}</span>
                          <span className="text-xs text-gray-500 ml-2">{currency.name}</span>
                        </div>
                        <span className="text-gray-600">{currency.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-2">
            <button
              onClick={handleSwap}
              className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center hover:bg-soft-gold/30 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-soft-gold" />
            </button>
          </div>

          {/* To Currency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">You Receive</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {currencies.find(c => c.code === toCurrency)?.symbol}
                </span>
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div className="relative w-40">
                <button
                  onClick={() => setShowToDropdown(!showToDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50"
                >
                  <span className="font-medium">{toCurrency}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showToDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setToCurrency(currency.code)
                          setShowToDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium">{currency.code}</span>
                          <span className="text-xs text-gray-500 ml-2">{currency.name}</span>
                        </div>
                        <span className="text-gray-600">{currency.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-soft-gold/5 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Exchange Rate</span>
              <span className="font-medium text-deep-teal">
                1 {fromCurrency} = {getExchangeRate()} {toCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-gray-500">Inverse Rate</span>
              <span className="text-gray-500">
                1 {toCurrency} = {(1 / parseFloat(getExchangeRate())).toFixed(4)} {fromCurrency}
              </span>
            </div>
          </div>

          {/* Fee Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-deep-teal">Fee:</span> 0.5% ($5.00)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              You'll receive {formatCurrency(parseFloat(toAmount || '0'), toCurrency)}
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0}
            className="w-full bg-deep-teal text-white py-3 rounded-lg hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <h2 className="text-lg font-semibold text-deep-teal mb-6">Review Swap</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">You Send</span>
              <span className="font-bold text-deep-teal">
                {formatCurrency(parseFloat(fromAmount), fromCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">You Receive</span>
              <span className="font-bold text-sage">
                {formatCurrency(parseFloat(toAmount), toCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-medium text-deep-teal">
                1 {fromCurrency} = {getExchangeRate()} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Fee</span>
              <span className="font-medium text-sage">$5.00 (0.5%)</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Rate valid for</span>
              <span className="font-medium text-deep-teal flex items-center gap-1">
                <Clock className="w-4 h-4" />
                60 seconds
              </span>
            </div>
          </div>

          <div className="bg-soft-gold/5 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-soft-gold mt-0.5" />
              <span>Exchange rates are locked for 60 seconds. Please review carefully.</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-deep-teal text-white py-3 rounded-lg hover:bg-sage transition-colors"
            >
              Confirm Swap
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-deep-teal mb-2">Swap Successful!</h2>
            <p className="text-gray-600">
              Your currency exchange has been completed
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">From</span>
              <span className="font-bold text-deep-teal">
                {formatCurrency(parseFloat(fromAmount), fromCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">To</span>
              <span className="font-bold text-sage">
                {formatCurrency(parseFloat(toAmount), toCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Rate</span>
              <span className="font-medium text-deep-teal">
                1 {fromCurrency} = {getExchangeRate()} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm text-deep-teal">SWP-{Date.now().toString().slice(-8)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  )
}
