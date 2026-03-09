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
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
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
