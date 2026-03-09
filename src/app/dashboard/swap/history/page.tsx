'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Repeat,
  Calendar,
  DollarSign,
  Euro,
  PoundSterling,
  JapaneseYen,
  Bitcoin,
  TrendingUp,
  Copy,
  ExternalLink
} from 'lucide-react'

interface Swap {
  id: string
  fromCurrency: string
  toCurrency: string
  fromAmount: number
  toAmount: number
  rate: number
  fee: number
  reference: string
  status: string
  completedAt: string
  createdAt: string
}

export default function SwapHistoryPage() {
  const router = useRouter()
  const [swaps, setSwaps] = useState<Swap[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchSwaps()
  }, [])

  const fetchSwaps = async () => {
    try {
      const response = await fetch('/api/swap')
      const data = await response.json()
      
      if (response.ok) {
        setSwaps(data.swaps || [])
      }
    } catch (error) {
      console.error('Error fetching swaps:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CHF': 'Fr',
      'CAD': 'C$',
      'AUD': 'A$',
      'CNY': '¥',
      'BTC': '₿',
      'ETH': 'Ξ'
    }
    return symbols[code] || code
  }

  const getCurrencyIcon = (code: string) => {
    switch (code) {
      case 'USD': return <DollarSign className="w-4 h-4" />
      case 'EUR': return <Euro className="w-4 h-4" />
      case 'GBP': return <PoundSterling className="w-4 h-4" />
      case 'JPY': return <JapaneseYen className="w-4 h-4" />
      case 'BTC': return <Bitcoin className="w-4 h-4" />
      default: return <TrendingUp className="w-4 h-4" />
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (days === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filteredSwaps = swaps.filter(s => 
    filter === 'all' || s.status === filter.toUpperCase()
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading swap history...</p>
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
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-deep-teal" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-deep-teal">Swap History</h1>
            <p className="text-gray-500 text-sm mt-1">Track your currency exchanges</p>
          </div>
        </div>
        <Link
          href="/dashboard/swap"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Repeat className="w-4 h-4" />
          New Swap
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'completed', 'pending', 'failed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-deep-teal text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Swaps List */}
      {filteredSwaps.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <div className="w-20 h-20 bg-soft-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Repeat className="w-10 h-10 text-soft-gold" />
          </div>
          <h3 className="text-lg font-semibold text-deep-teal mb-2">No swaps yet</h3>
          <p className="text-gray-500 mb-6">Start by exchanging currencies</p>
          <Link
            href="/dashboard/swap"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Repeat className="w-4 h-4" />
            Make a Swap
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => (
            <div
              key={swap.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-sage/20 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-soft-gold/10 rounded-full flex items-center justify-center">
                    {getCurrencyIcon(swap.fromCurrency)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-deep-teal">
                        {formatCurrency(swap.fromAmount, swap.fromCurrency)}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold text-deep-teal">
                        {formatCurrency(swap.toAmount, swap.toCurrency)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        swap.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        swap.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {swap.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Rate: 1 {swap.fromCurrency} = {swap.rate.toFixed(4)} {swap.toCurrency}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(swap.completedAt || swap.createdAt)}
                      </span>
                      <span>Fee: {formatCurrency(swap.fee, swap.fromCurrency)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
                    <code className="text-xs font-mono">{swap.reference}</code>
                    <button
                      onClick={() => copyToClipboard(swap.reference, swap.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {copied === swap.id ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <Link
                    href={`/dashboard/swap/${swap.id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-deep-teal" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
