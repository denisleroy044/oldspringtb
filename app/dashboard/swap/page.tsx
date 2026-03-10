'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Euro,
  PoundSterling,
  JapaneseYen,
  SwissFranc,
  Bitcoin,
  Wallet,
  Copy,
  Info,
  BarChart,
  Repeat,
  Sparkles
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

interface Currency {
  code: string
  name: string
  symbol: string
  icon: any
  flag: string
}

interface ExchangeRate {
  from: string
  to: string
  rate: number
  bid: number
  ask: number
  convertedAmount: number
  timestamp: string
  source: string
}

const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', icon: DollarSign, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', icon: Euro, flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', icon: PoundSterling, flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', icon: JapaneseYen, flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', icon: SwissFranc, flag: '🇨🇭' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', icon: DollarSign, flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', icon: DollarSign, flag: '🇦🇺' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', icon: JapaneseYen, flag: '🇨🇳' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', icon: Bitcoin, flag: '₿' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', icon: Bitcoin, flag: 'Ξ' },
]

export default function SwapPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [fromAccount, setFromAccount] = useState<string>('')
  const [toAccount, setToAccount] = useState<string>('')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('EUR')
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [loadingRate, setLoadingRate] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<any>(null)
  const [rateHistory, setRateHistory] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (fromAccount && toCurrency) {
      fetchExchangeRate()
    }
  }, [fromCurrency, toCurrency, fromAmount])

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
                      acc.accountType === 'CURRENCY' ? `${acc.currency} Account` : 'Account',
          maskedNumber: acc.accountNumber ? acc.accountNumber.replace(/\d(?=\d{4})/g, '*') : '****'
        }))
        setAccounts(formattedAccounts)
      }

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExchangeRate = async () => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) return

    setLoadingRate(true)
    try {
      const amount = parseFloat(fromAmount) || 1
      const response = await fetch(`/api/swap/rates?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`)
      const data = await response.json()
      
      if (response.ok) {
        setExchangeRate(data)
        if (fromAmount) {
          setToAmount(data.convertedAmount.toFixed(2))
        }
        
        // Fetch historical trend
        fetchRateHistory(fromCurrency, toCurrency)
      }
    } catch (error) {
      console.error('Error fetching rate:', error)
    } finally {
      setLoadingRate(false)
    }
  }

  const fetchRateHistory = async (from: string, to: string) => {
    // Simulate historical data
    const baseRate = exchangeRate?.rate || 1
    const history = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const variation = (Math.random() - 0.5) * 0.1
      history.push({
        date: date.toLocaleDateString(),
        rate: baseRate * (1 + variation)
      })
    }
    setRateHistory(history)
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount('')
    setToAmount('')
  }

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setFromAmount(value)
    
    if (exchangeRate && value) {
      const converted = parseFloat(value) * exchangeRate.rate
      setToAmount(converted.toFixed(2))
    } else {
      setToAmount('')
    }
  }

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setToAmount(value)
    
    if (exchangeRate && value) {
      const converted = parseFloat(value) / exchangeRate.rate
      setFromAmount(converted.toFixed(2))
    }
  }

  const handleSubmit = async () => {
    if (!fromAccount || !fromAmount || !toCurrency) {
      setError('Please fill in all fields')
      return
    }

    const amount = parseFloat(fromAmount)
    const selectedFromAccount = accounts.find(a => a.id === fromAccount)

    if (!selectedFromAccount) {
      setError('Source account not found')
      return
    }

    if (amount > selectedFromAccount.balance) {
      setError('Insufficient funds')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toAccountId: toAccount || null,
          fromCurrency,
          toCurrency,
          fromAmount: amount,
          exchangeRate: exchangeRate?.rate
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Swap failed')
      }

      setSuccess(data.swap)
      
      // Refresh accounts
      fetchData()

    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount)
  }

  const getCurrencyIcon = (code: string) => {
    const currency = CURRENCIES.find(c => c.code === code)
    return currency?.icon || DollarSign
  }

  const getCurrencyFlag = (code: string) => {
    const currency = CURRENCIES.find(c => c.code === code)
    return currency?.flag || '💱'
  }

  const selectedFromAccountDetails = accounts.find(a => a.id === fromAccount)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading currency exchange...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-sage/20">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-deep-teal mb-2">Swap Successful!</h2>
            <p className="text-gray-600">
              Your currency exchange has been completed
            </p>
          </div>

          <div className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <p className="text-sm opacity-80">You sold</p>
                <p className="text-2xl font-bold">{formatCurrency(success.fromAmount, success.fromCurrency)}</p>
              </div>
              <ArrowRight className="w-6 h-6 mx-4" />
              <div className="text-center flex-1">
                <p className="text-sm opacity-80">You received</p>
                <p className="text-2xl font-bold">{formatCurrency(success.toAmount, success.toCurrency)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-sm opacity-80">Rate</p>
                <p className="font-semibold">1 {success.fromCurrency} = {success.rate.toFixed(4)} {success.toCurrency}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Fee</p>
                <p className="font-semibold">{formatCurrency(success.fee, success.fromCurrency)}</p>
              </div>
            </div>
          </div>

          <div className="bg-soft-gold/5 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-soft-gold" />
              <span className="text-gray-600">Reference: </span>
              <code className="bg-white px-2 py-1 rounded font-mono">{success.reference}</code>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/dashboard/swap/history"
              className="px-4 py-3 border border-deep-teal text-deep-teal rounded-lg hover:bg-deep-teal hover:text-white transition-colors text-center font-medium"
            >
              View History
            </Link>
            <button
              onClick={() => {
                setSuccess(null)
                setFromAmount('')
                setToAmount('')
              }}
              className="px-4 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              New Swap
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold text-deep-teal">Currency Swap</h1>
            <p className="text-gray-500 text-sm mt-1">Exchange currencies at live rates</p>
          </div>
        </div>
        <Link
          href="/dashboard/swap/history"
          className="flex items-center gap-2 px-4 py-2 border border-deep-teal text-deep-teal rounded-lg hover:bg-deep-teal hover:text-white transition-all"
        >
          <Clock className="w-4 h-4" />
          History
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Swap Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            {/* Account Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              >
                <option value="">Select account</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.displayName} ({acc.maskedNumber}) - {formatCurrency(acc.balance, acc.currency)}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Swap Interface */}
            <div className="space-y-4">
              {/* From Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">You send</label>
                <div className="flex gap-2">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-32 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {CURRENCIES.find(c => c.code === fromCurrency)?.symbol || '$'}
                    </span>
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={handleFromAmountChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    />
                  </div>
                </div>
                {selectedFromAccountDetails && fromAmount && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {formatCurrency(selectedFromAccountDetails.balance, selectedFromAccountDetails.currency)}
                  </p>
                )}
              </div>

              {/* Swap Direction Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwapCurrencies}
                  className="p-2 bg-gray-100 rounded-full hover:bg-soft-gold hover:text-white transition-colors"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">You receive</label>
                <div className="flex gap-2">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-32 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {CURRENCIES.find(c => c.code === toCurrency)?.symbol || '$'}
                    </span>
                    <input
                      type="number"
                      value={toAmount}
                      onChange={handleToAmountChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Exchange Rate Info */}
              {loadingRate ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-soft-gold" />
                  <span className="text-sm text-gray-500 ml-2">Fetching live rate...</span>
                </div>
              ) : exchangeRate && fromCurrency !== toCurrency ? (
                <div className="bg-soft-gold/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Exchange Rate</span>
                    <span className="text-xs text-gray-400">Source: {exchangeRate.source}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-deep-teal">
                        1 {fromCurrency} = {exchangeRate.rate.toFixed(4)} {toCurrency}
                      </p>
                      <p className="text-sm text-gray-500">
                        1 {toCurrency} = {(1 / exchangeRate.rate).toFixed(4)} {fromCurrency}
                      </p>
                    </div>
                    <button
                      onClick={fetchExchangeRate}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  
                  {/* Spread */}
                  {exchangeRate.bid && exchangeRate.ask && (
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Bid</p>
                        <p className="font-medium text-sm">{exchangeRate.bid.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ask</p>
                        <p className="font-medium text-sm">{exchangeRate.ask.toFixed(4)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : fromCurrency === toCurrency ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 text-sm">
                  Please select different currencies to swap
                </div>
              ) : null}
            </div>

            {/* Fee Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Swap Fee (0.1%)</span>
                <span className="font-medium text-deep-teal">
                  {fromAmount ? formatCurrency(parseFloat(fromAmount) * 0.001, fromCurrency) : '$0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">You'll get</span>
                <span className="font-bold text-deep-teal">
                  {toAmount ? formatCurrency(parseFloat(toAmount), toCurrency) : `0 ${toCurrency}`}
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!fromAccount || !fromAmount || !toAmount || fromCurrency === toCurrency || submitting}
              className="w-full mt-6 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Swap...
                </>
              ) : (
                <>
                  <Repeat className="w-5 h-5" />
                  Swap Currencies
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Rate Trend */}
          {exchangeRate && rateHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
              <h3 className="font-semibold text-deep-teal mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-soft-gold" />
                7-Day Trend
              </h3>
              <div className="space-y-2">
                {rateHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{item.date}</span>
                    <span className="font-medium text-deep-teal">{item.rate.toFixed(4)}</span>
                    {index > 0 && (
                      <span className={item.rate > rateHistory[index-1].rate ? 'text-green-600' : 'text-red-600'}>
                        {item.rate > rateHistory[index-1].rate ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Pairs */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h3 className="font-semibold text-deep-teal mb-4">Popular Pairs</h3>
            <div className="space-y-3">
              {[
                { from: 'USD', to: 'EUR' },
                { from: 'USD', to: 'GBP' },
                { from: 'EUR', to: 'GBP' },
                { from: 'USD', to: 'JPY' },
                { from: 'BTC', to: 'USD' },
              ].map((pair, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFromCurrency(pair.from)
                    setToCurrency(pair.to)
                  }}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-soft-gold/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCurrencyFlag(pair.from)}</span>
                    <span className="font-medium text-deep-teal">{pair.from}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="text-lg">{getCurrencyFlag(pair.to)}</span>
                    <span className="font-medium text-deep-teal">{pair.to}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white">
            <Sparkles className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="font-semibold mb-2">Why Swap with Us?</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Live exchange rates</li>
              <li>• Low 0.1% fee</li>
              <li>• Instant settlement</li>
              <li>• No hidden charges</li>
              <li>• 24/7 availability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
