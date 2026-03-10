'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  Download,
  Eye,
  Calendar,
  ChevronRight,
  Loader2,
  Plus,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  RefreshCw,
  Printer,
  Mail,
  Share2,
  Star,
  Sparkles,
  Award,
  Gift,
  Bell,
  XCircle,
  Landmark,
  Wallet,
  CreditCard,
  Building,
  Home,
  Briefcase,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight
} from 'lucide-react'

interface Statement {
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
  transactionCount: number
  generatedAt: string
  pdfUrl?: string
}

export default function StatementsPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [statements, setStatements] = useState<Statement[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [filter, setFilter] = useState({
    accountId: 'all',
    type: 'all'
  })
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchStatements()
  }, [filter])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch accounts
      const accountsRes = await fetch('/api/accounts')
      const accountsData = await accountsRes.json()
      setAccounts(accountsData.accounts || [])

      // Fetch statements
      await fetchStatements()

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatements = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.accountId !== 'all') params.append('accountId', filter.accountId)
      if (filter.type !== 'all') params.append('type', filter.type)
      
      const res = await fetch(`/api/statements?${params.toString()}`)
      const data = await res.json()
      setStatements(data.statements || [])
    } catch (error) {
      console.error('Error fetching statements:', error)
    }
  }

  const generateStatement = async () => {
    setGenerating(true)
    try {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()

      const response = await fetch('/api/statements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: filter.accountId !== 'all' ? filter.accountId : accounts[0]?.id,
          type: 'MONTHLY',
          year,
          month
        })
      })

      if (response.ok) {
        fetchStatements()
      }
    } catch (error) {
      console.error('Error generating statement:', error)
    } finally {
      setGenerating(false)
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

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
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

  const filteredStatements = statements.filter(s =>
    s.accountName?.toLowerCase().includes(search.toLowerCase()) ||
    s.statementNumber?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading statements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Account Statements</h1>
          <p className="text-gray-500 text-sm mt-1">View and download your account statements</p>
        </div>
        <button
          onClick={generateStatement}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-xl transition-all font-medium disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Generate New Statement
            </>
          )}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Statements</p>
          <p className="text-2xl font-bold text-deep-teal">{statements.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">This Month</p>
          <p className="text-2xl font-bold text-soft-gold">
            {statements.filter(s => {
              const date = new Date(s.periodEnd)
              const now = new Date()
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-sage">
            {statements.reduce((sum, s) => sum + (s.transactionCount || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Average Balance</p>
          <p className="text-2xl font-bold text-deep-teal">
            {formatCurrency(statements.reduce((sum, s) => sum + ((s.openingBalance + s.closingBalance) / 2), 0) / (statements.length || 1))}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-sage/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search statements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter.accountId}
              onChange={(e) => setFilter({...filter, accountId: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            >
              <option value="all">All Accounts</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.displayName}</option>
              ))}
            </select>
            <select
              value={filter.type}
              onChange={(e) => setFilter({...filter, type: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statements Grid */}
      {filteredStatements.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-deep-teal mb-2">No Statements Found</h3>
          <p className="text-gray-500 mb-6">Generate your first statement to get started</p>
          <button
            onClick={generateStatement}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Generate Statement
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStatements.map((statement) => (
            <div
              key={statement.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-sage/20 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-soft-gold/10 rounded-full flex items-center justify-center">
                    {getAccountIcon(statement.accountType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-deep-teal">{statement.accountName}</h3>
                    <p className="text-xs text-gray-500">{statement.accountNumberMasked}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {statement.statementType}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Period</span>
                  <span className="font-medium text-deep-teal">
                    {formatPeriod(statement.periodStart, statement.periodEnd)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Opening Balance</span>
                  <span className="font-medium text-deep-teal">{formatCurrency(statement.openingBalance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Closing Balance</span>
                  <span className="font-bold text-deep-teal">{formatCurrency(statement.closingBalance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Net Change</span>
                  <span className={`font-medium ${
                    statement.closingBalance - statement.openingBalance >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formatCurrency(statement.closingBalance - statement.openingBalance)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <ArrowDownLeft className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Deposits</p>
                  <p className="font-semibold text-green-600 text-sm">{formatCurrency(statement.totalDeposits)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <ArrowUpRight className="w-4 h-4 text-red-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Withdrawals</p>
                  <p className="font-semibold text-red-600 text-sm">{formatCurrency(statement.totalWithdrawals)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{statement.transactionCount} transactions</span>
                <span>Generated {formatDate(statement.generatedAt)}</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/statements/${statement.id}`}
                  className="flex-1 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                {statement.pdfUrl && (
                  <a
                    href={statement.pdfUrl}
                    download
                    className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 text-gray-500" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
