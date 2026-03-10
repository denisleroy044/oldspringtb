'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Calendar,
  TrendingUp,
  DollarSign,
  Euro,
  PoundSterling,
  JapaneseYen,
  Bitcoin,
  Download,
  Share2,
  Printer,
  ExternalLink
} from 'lucide-react'

interface SwapDetail {
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
  fromAccount?: string
  toAccount?: string
}

export default function SwapDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [swap, setSwap] = useState<SwapDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchSwap()
    }
  }, [params.id])

  const fetchSwap = async () => {
    try {
      const response = await fetch(`/api/swap/${params.id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch swap')
      }
      
      setSwap(data.swap)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    })
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading swap details...</p>
        </div>
      </div>
    )
  }

  if (error || !swap) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 text-center max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-600" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Swap</h2>
          <p className="text-sm mb-4">{error || 'Swap not found'}</p>
          <button
            onClick={() => router.push('/dashboard/swap/history')}
            className="bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-sage"
          >
            Back to History
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-deep-teal" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Swap Details</h1>
          <p className="text-gray-500 text-sm mt-1">Reference: {swap.reference}</p>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {swap.status === 'COMPLETED' ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : swap.status === 'PENDING' ? (
              <Clock className="w-6 h-6 text-soft-gold" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`text-lg font-semibold ${
                swap.status === 'COMPLETED' ? 'text-green-600' :
                swap.status === 'PENDING' ? 'text-soft-gold' :
                'text-red-600'
              }`}>
                {swap.status}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="font-medium text-deep-teal">{formatDate(swap.completedAt || swap.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Swap Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h2 className="text-lg font-semibold text-deep-teal mb-4">Swap Details</h2>
            
            <div className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-sm opacity-80">You sold</p>
                  <p className="text-2xl font-bold">{formatCurrency(swap.fromAmount, swap.fromCurrency)}</p>
                  <p className="text-sm opacity-80 mt-1">{swap.fromCurrency}</p>
                </div>
                <ArrowLeft className="w-6 h-6 mx-4 rotate-180" />
                <div className="text-center flex-1">
                  <p className="text-sm opacity-80">You received</p>
                  <p className="text-2xl font-bold">{formatCurrency(swap.toAmount, swap.toCurrency)}</p>
                  <p className="text-sm opacity-80 mt-1">{swap.toCurrency}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Exchange Rate</span>
                <span className="font-medium text-deep-teal">
                  1 {swap.fromCurrency} = {swap.rate.toFixed(4)} {swap.toCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Inverse Rate</span>
                <span className="font-medium text-deep-teal">
                  1 {swap.toCurrency} = {(1 / swap.rate).toFixed(4)} {swap.fromCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Fee (0.1%)</span>
                <span className="font-medium text-sage">{formatCurrency(swap.fee, swap.fromCurrency)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Reference</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 px-3 py-1 rounded font-mono">{swap.reference}</code>
                  <button
                    onClick={() => copyToClipboard(swap.reference, 'reference')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copied === 'reference' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h2 className="text-lg font-semibold text-deep-teal mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-soft-gold" />
              Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-deep-teal">Swap Initiated</p>
                  <p className="text-sm text-gray-500">{formatDate(swap.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-deep-teal">Swap Completed</p>
                  <p className="text-sm text-gray-500">{formatDate(swap.completedAt || swap.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white">
            <h3 className="text-sm font-medium text-white/80 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>You sent</span>
                <span className="font-bold">{formatCurrency(swap.fromAmount, swap.fromCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>You received</span>
                <span className="font-bold">{formatCurrency(swap.toAmount, swap.toCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee</span>
                <span>{formatCurrency(swap.fee, swap.fromCurrency)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h3 className="font-semibold text-deep-teal mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => window.print()}
                className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Printer className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Print Receipt</span>
              </button>
              <button
                onClick={() => {
                  // Generate receipt
                }}
                className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Download Receipt</span>
              </button>
              <button
                onClick={() => {
                  // Share
                }}
                className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Share2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Share</span>
              </button>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-soft-gold/5 rounded-xl p-6 border border-soft-gold/20">
            <h3 className="font-semibold text-deep-teal mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you have any questions about this currency swap, our support team is here to help.
            </p>
            <Link
              href="/dashboard/support"
              className="block text-center px-4 py-2 bg-deep-teal text-white rounded-lg hover:bg-sage transition-colors text-sm font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
