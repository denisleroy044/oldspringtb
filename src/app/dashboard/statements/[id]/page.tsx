'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Landmark,
  Wallet,
  CreditCard,
  Building,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw
} from 'lucide-react'

interface StatementDetail {
  statement: {
    id: string
    statementNumber: string
    statementType: string
    periodStart: string
    periodEnd: string
    accountName: string
    accountNumberMasked: string
    accountType: string
    openingBalance: number
    closingBalance: number
    totalDeposits: number
    totalWithdrawals: number
    totalTransfersIn: number
    totalTransfersOut: number
    totalFees: number
    totalInterestEarned: number
    transactionCount: number
    creditTransactionCount: number
    debitTransactionCount: number
    generatedAt: string
    pdfUrl?: string
    csvUrl?: string
    dailyBalanceData: any
    spendingByCategory: any
  }
  breakdown: Array<{
    category: string
    subcategory?: string
    description?: string
    amount: number
    count: number
    percentage: number
  }>
  transactions: Array<{
    id: string
    description: string
    amount: number
    type: string
    status: string
    date: string
  }>
}

export default function StatementDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState<StatementDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'transactions'>('overview')

  useEffect(() => {
    if (params.id) {
      fetchStatement()
    }
  }, [params.id])

  const fetchStatement = async () => {
    try {
      const response = await fetch(`/api/statements/${params.id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch statement')
      }
      
      setData(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'CHECKING':
        return <Wallet className="w-5 h-5" />
      case 'SAVINGS':
        return <Landmark className="w-5 h-5" />
      case 'CREDIT':
        return <CreditCard className="w-5 h-5" />
      default:
        return <Building className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading statement details...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 text-center max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-600" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Statement</h2>
          <p className="text-sm mb-4">{error || 'Statement not found'}</p>
          <button
            onClick={() => router.push('/dashboard/statements')}
            className="bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-sage"
          >
            Back to Statements
          </button>
        </div>
      </div>
    )
  }

  const { statement, breakdown, transactions } = data
  const netChange = statement.closingBalance - statement.openingBalance

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-deep-teal" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Account Statement</h1>
          <p className="text-gray-500 text-sm mt-1">
            {statement.statementType} • {statement.statementNumber}
          </p>
        </div>
      </div>

      {/* Account Summary Card */}
      <div className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              {getAccountIcon(statement.accountType)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{statement.accountName}</h2>
              <p className="text-sm text-white/80">{statement.accountNumberMasked}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            {statement.statementType}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-white/80">Period</p>
            <p className="font-semibold">
              {new Date(statement.periodStart).toLocaleDateString()} - {new Date(statement.periodEnd).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/80">Opening Balance</p>
            <p className="font-semibold">{formatCurrency(statement.openingBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-white/80">Closing Balance</p>
            <p className="font-semibold text-xl">{formatCurrency(statement.closingBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-white/80">Net Change</p>
            <p className={`font-semibold ${netChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {netChange >= 0 ? '+' : ''}{formatCurrency(netChange)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4 text-gray-500" />
          <span className="text-sm">Download PDF</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Printer className="w-4 h-4 text-gray-500" />
          <span className="text-sm">Print</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Share2 className="w-4 h-4 text-gray-500" />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'overview'
                ? 'text-soft-gold border-b-2 border-soft-gold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'breakdown'
                ? 'text-soft-gold border-b-2 border-soft-gold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Category Breakdown
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'transactions'
                ? 'text-soft-gold border-b-2 border-soft-gold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Transactions
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
              <p className="text-sm text-gray-500 mb-2">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(statement.totalDeposits)}</p>
              <p className="text-xs text-gray-500 mt-1">{statement.creditTransactionCount} transactions</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
              <p className="text-sm text-gray-500 mb-2">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(statement.totalWithdrawals)}</p>
              <p className="text-xs text-gray-500 mt-1">{statement.debitTransactionCount} transactions</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
              <p className="text-sm text-gray-500 mb-2">Average Daily Balance</p>
              <p className="text-2xl font-bold text-deep-teal">
                {formatCurrency((statement.openingBalance + statement.closingBalance) / 2)}
              </p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h3 className="font-semibold text-deep-teal mb-4">Additional Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Transfers In</p>
                <p className="font-medium text-deep-teal">{formatCurrency(statement.totalTransfersIn || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Transfers Out</p>
                <p className="font-medium text-deep-teal">{formatCurrency(statement.totalTransfersOut || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fees Charged</p>
                <p className="font-medium text-red-600">{formatCurrency(statement.totalFees || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Interest Earned</p>
                <p className="font-medium text-green-600">{formatCurrency(statement.totalInterestEarned || 0)}</p>
              </div>
            </div>
          </div>

          {/* Daily Balance Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
            <h3 className="font-semibold text-deep-teal mb-4">Daily Balance Trend</h3>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-gray-300" />
              <span className="text-gray-400 ml-2">Chart visualization would go here</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'breakdown' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <h3 className="font-semibold text-deep-teal mb-4">Spending by Category</h3>
          {breakdown.length > 0 ? (
            <div className="space-y-4">
              {breakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-deep-teal">{item.category}</span>
                    <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-soft-gold rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</span>
                  </div>
                  {item.subcategory && (
                    <p className="text-xs text-gray-500 mt-1">{item.subcategory}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No breakdown data available</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-deep-teal">{tx.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
