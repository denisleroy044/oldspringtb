'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye,
  EyeOff,
  Wallet,
  History,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  PiggyBank,
  Plus,
  RefreshCw
} from 'lucide-react'

interface Account {
  id: string
  accountType: string
  displayName: string
  accountNumber: string
  maskedNumber: string
  balance: number
}

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  status: 'completed' | 'pending' | 'failed'
  date: string
}

interface DashboardData {
  user: { firstName: string; lastName: string; email: string }
  accounts: Account[]
  recentTransactions: Transaction[]
  totals: {
    totalBalance: number
    monthlyIncome: number
    monthlySpending: number
    accountCount: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { user: authUser, isLoading: authLoading } = useAuth()
  const [showBalance, setShowBalance] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!authUser) {
        router.push('/auth/login?redirect=/dashboard')
      } else {
        fetchDashboardData()
      }
    }
  }, [authLoading, authUser])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/dashboard')
      const result = await response.json()
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?redirect=/dashboard')
          return
        }
        throw new Error(result.error || `Error: ${response.status}`)
      }
      
      setData(result)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-deep-teal border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authUser) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-deep-teal border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData} 
            className="bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-deep-teal/90 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">No Data Available</h2>
          <p className="text-gray-600">No dashboard data found.</p>
        </div>
      </div>
    )
  }

  const { user, accounts, recentTransactions, totals } = data
  const displayName = user?.firstName || authUser?.firstName || 'User'
  const lastFourTransactions = recentTransactions?.slice(0, 4) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
            Welcome back, <span className="text-deep-teal dark:text-soft-gold">{displayName}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your financial summary</p>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Balance</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            {showBalance ? formatCurrency(totals.totalBalance) : '••••••'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {totals.accountCount} {totals.accountCount === 1 ? 'account' : 'accounts'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</p>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">
            {showBalance ? formatCurrency(totals.monthlyIncome) : '••••••'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Spending</p>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">
            {showBalance ? formatCurrency(totals.monthlySpending) : '••••••'}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Wallet className="w-5 h-5 text-deep-teal dark:text-soft-gold" />
                Your Accounts
              </h2>
              {accounts.length > 0 && (
                <Link href="/dashboard/accounts" className="text-sm text-deep-teal dark:text-soft-gold hover:underline">
                  View all
                </Link>
              )}
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
              {accounts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No accounts yet</div>
              ) : (
                accounts.map((account) => (
                  <Link key={account.id} href={`/dashboard/accounts/${account.id}`} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        account.accountType === 'CHECKING' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      }`}>
                        {account.accountType === 'CHECKING' ? <Wallet className="w-5 h-5" /> : <PiggyBank className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{account.displayName}</p>
                        <p className="text-sm text-gray-500">{account.maskedNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {showBalance ? formatCurrency(account.balance) : '••••••'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-deep-teal dark:text-soft-gold" />
                Recent Activity
              </h2>
              {recentTransactions.length > 0 && (
                <Link href="/dashboard/transactions" className="text-sm text-deep-teal dark:text-soft-gold hover:underline">
                  View all
                </Link>
              )}
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {lastFourTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No transactions yet</div>
              ) : (
                lastFourTransactions.map((tx) => (
                  <Link key={tx.id} href={`/dashboard/transactions/${tx.id}`} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === 'credit'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                      }`}>
                        {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium text-gray-900 dark:text-white">{tx.description}</p>
                          <p className={`font-semibold ${
                            tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">{formatDate(tx.date)}</span>
                          <span className="text-gray-300">•</span>
                          <span className={`capitalize ${
                            tx.status === 'completed' ? 'text-green-600' :
                            tx.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
