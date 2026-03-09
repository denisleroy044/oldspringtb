'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building,
  CreditCard,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Copy,
  Calendar,
  DollarSign,
  Wallet,
  ExternalLink,
  Download,
  Share2,
  Printer,
  Bitcoin
} from 'lucide-react'

interface WithdrawalDetail {
  id: string
  amount: number
  method: string
  fee: number
  reference: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  createdAt: string
  processedAt?: string
  completedAt?: string
  accountNumber?: string
  accountType?: string
  recipientName?: string
  recipientAccount?: string
  recipientBank?: string
  recipientRouting?: string
  recipientAddress?: string
  notes?: string
}

export default function WithdrawalDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [withdrawal, setWithdrawal] = useState<WithdrawalDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchWithdrawal()
    }
  }, [params.id])

  const fetchWithdrawal = async () => {
    try {
      const response = await fetch(`/api/withdrawals/${params.id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch withdrawal')
      }
      
      setWithdrawal(data.withdrawal)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'PROCESSING':
        return <Loader2 className="w-6 h-6 text-soft-gold animate-spin" />
      case 'PENDING':
        return <Clock className="w-6 h-6 text-blue-500" />
      case 'FAILED':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'CANCELLED':
        return <AlertCircle className="w-6 h-6 text-gray-500" />
      default:
        return <Clock className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-700'
      case 'PENDING':
        return 'bg-blue-100 text-blue-700'
      case 'FAILED':
        return 'bg-red-100 text-red-700'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building className="w-5 h-5" />
      case 'wire':
        return <Globe className="w-5 h-5" />
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
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
          <p className="text-gray-500">Loading withdrawal details...</p>
        </div>
      </div>
    )
  }

  if (error || !withdrawal) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 text-center max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-600" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Withdrawal</h2>
          <p className="text-sm mb-4">{error || 'Withdrawal not found'}</p>
          <button
            onClick={() => router.push('/dashboard/withdrawals')}
            className="bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-sage"
          >
            Back to Withdrawals
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
          <h1 className="text-2xl font-bold text-deep-teal">Withdrawal Details</h1>
          <p className="text-gray-500 text-sm mt-1">Reference: {withdrawal.reference}</p>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(withdrawal.status)}
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`text-lg font-semibold ${getStatusColor(withdrawal.status).split(' ')[1]}`}>
                {withdrawal.status}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-2xl font-bold text-deep-teal">{formatCurrency(withdrawal.amount)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Method Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h2 className="text-lg font-semibold text-deep-teal mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-soft-gold" />
              Withdrawal Method
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-soft-gold/10 rounded-full flex items-center justify-center">
                  {getMethodIcon(withdrawal.method)}
                </div>
                <div>
                  <p className="font-medium text-deep-teal">
                    {withdrawal.method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </p>
                  <p className="text-sm text-gray-500">Fee: {formatCurrency(withdrawal.fee)}</p>
                </div>
              </div>

              {withdrawal.recipientName && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Recipient Name</p>
                  <p className="font-medium text-deep-teal">{withdrawal.recipientName}</p>
                </div>
              )}

              {withdrawal.recipientBank && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                  <p className="font-medium text-deep-teal">{withdrawal.recipientBank}</p>
                </div>
              )}

              {(withdrawal.recipientAccount || withdrawal.recipientAddress) && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">
                    {withdrawal.method === 'crypto' ? 'Wallet Address' : 'Account Number'}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-gray-100 px-3 py-2 rounded flex-1 font-mono">
                      {withdrawal.recipientAccount || withdrawal.recipientAddress}
                    </code>
                    <button
                      onClick={() => copyToClipboard(withdrawal.recipientAccount || withdrawal.recipientAddress || '', 'account')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      {copied === 'account' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}
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
                  <p className="font-medium text-deep-teal">Request Submitted</p>
                  <p className="text-sm text-gray-500">{formatDate(withdrawal.createdAt)}</p>
                </div>
              </div>
              
              {withdrawal.processedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-soft-gold rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-deep-teal">Processing Started</p>
                    <p className="text-sm text-gray-500">{formatDate(withdrawal.processedAt)}</p>
                  </div>
                </div>
              )}

              {withdrawal.completedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-deep-teal">Completed</p>
                    <p className="text-sm text-gray-500">{formatDate(withdrawal.completedAt)}</p>
                  </div>
                </div>
              )}

              {withdrawal.status === 'FAILED' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-red-600">Failed</p>
                    {withdrawal.notes && (
                      <p className="text-sm text-gray-500 mt-1">Reason: {withdrawal.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {withdrawal.status === 'CANCELLED' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-gray-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-600">Cancelled</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white">
            <h3 className="text-sm font-medium text-white/80 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Amount</span>
                <span className="font-bold">{formatCurrency(withdrawal.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee</span>
                <span>{formatCurrency(withdrawal.fee)}</span>
              </div>
              <div className="border-t border-white/20 my-2"></div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(withdrawal.amount + withdrawal.fee)}</span>
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
                  // Generate and download receipt
                }}
                className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Download PDF</span>
              </button>
              <button
                onClick={() => {
                  // Share receipt
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
              If you have any questions about this withdrawal, our support team is here to help.
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
