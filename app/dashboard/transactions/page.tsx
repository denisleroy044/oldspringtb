'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { 
  Search,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  MoreVertical,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Briefcase,
  Gift,
  Film,
  Zap,
  ArrowLeft,
  ArrowRight,
  X
} from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'credit' | 'debit' | 'transfer'
  category: string
  date: string
  fullDate: string
  accountId: string
  accountType: string
  accountNumber: string
  reference?: string
  status: string
}

interface Filters {
  dateRange: string
  type: string
  category: string
  account: string
  minAmount: string
  maxAmount: string
}

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    dateRange: '30d',
    type: 'all',
    category: 'all',
    account: 'all',
    minAmount: '',
    maxAmount: ''
  })

  const itemsPerPage = 20

  useEffect(() => {
    fetchTransactions()
  }, [currentPage, filters])

  useEffect(() => {
    applyFilters()
  }, [searchQuery, transactions])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: ((currentPage - 1) * itemsPerPage).toString()
      })

      if (filters.type !== 'all') params.append('type', filters.type)
      if (filters.account !== 'all') params.append('account', filters.account)

      const response = await fetch(`/api/transactions?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load transactions')
      }
      
      setTransactions(data.transactions || [])
      setTotalPages(Math.ceil(data.total / itemsPerPage))
    } catch (err) {
      console.error('Error fetching transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...transactions]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reference?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      
      switch(filters.dateRange) {
        case '7d':
          cutoff.setDate(now.getDate() - 7)
          break
        case '30d':
          cutoff.setDate(now.getDate() - 30)
          break
        case '90d':
          cutoff.setDate(now.getDate() - 90)
          break
        case '1y':
          cutoff.setFullYear(now.getFullYear() - 1)
          break
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(t => new Date(t.fullDate) >= cutoff)
      }
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category)
    }

    // Amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(t => t.amount >= parseFloat(filters.minAmount))
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(t => t.amount <= parseFloat(filters.maxAmount))
    }

    setFilteredTransactions(filtered)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getTransactionIcon = (type: string, category: string) => {
    if (type === 'credit') return <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><ArrowDownLeft className="w-5 h-5 text-green-600" /></div>
    if (type === 'transfer') return <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Repeat className="w-5 h-5 text-blue-600" /></div>
    
    // Debit transaction - icon based on category
    switch(category) {
      case 'Shopping': return <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-purple-600" /></div>
      case 'Groceries': return <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Coffee className="w-5 h-5 text-green-600" /></div>
      case 'Entertainment': return <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center"><Film className="w-5 h-5 text-pink-600" /></div>
      case 'Transportation': return <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"><Car className="w-5 h-5 text-orange-600" /></div>
      case 'Income': return <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Briefcase className="w-5 h-5 text-green-600" /></div>
      case 'Payment': return <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><Zap className="w-5 h-5 text-red-600" /></div>
      default: return <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-gray-600" /></div>
    }
  }

  const categories = [
    'All Categories',
    'Income',
    'Shopping',
    'Groceries',
    'Entertainment',
    'Transportation',
    'Bills',
    'Transfer'
  ]

  const stats = {
    totalInflow: transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
    totalOutflow: transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0),
    averageTransaction: transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
      : 0
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-teal mb-2">Transactions</h1>
        <p className="text-gray-500">View and manage your complete transaction history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Inflow</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalInflow)}</p>
          <p className="text-xs text-gray-400 mt-2">Credits & Deposits</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Outflow</p>
          <p className="text-2xl font-bold text-deep-teal">{formatCurrency(stats.totalOutflow)}</p>
          <p className="text-xs text-gray-400 mt-2">Debits & Payments</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Average Transaction</p>
          <p className="text-2xl font-bold text-soft-gold">{formatCurrency(stats.averageTransaction)}</p>
          <p className="text-xs text-gray-400 mt-2">Across {transactions.length} transactions</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-sage/20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions by description, category, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${
                showFilters ? 'bg-deep-teal text-white border-deep-teal' : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Transaction Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold"
              >
                <option value="all">All Types</option>
                <option value="credit">Income</option>
                <option value="debit">Expenses</option>
                <option value="transfer">Transfers</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Amount Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-sage/20">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your transactions...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => {
                        setSelectedTransaction(tx)
                        setShowDetails(true)
                      }}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(tx.type, tx.category)}
                          <div>
                            <p className="font-medium text-gray-900">{tx.description}</p>
                            <p className="text-xs text-gray-500">{tx.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{tx.accountType}</p>
                        <p className="text-xs text-gray-400">{tx.accountNumber}</p>
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${
                        tx.type === 'credit' ? 'text-green-600' : 
                        tx.type === 'transfer' ? 'text-blue-600' : 'text-deep-teal'
                      }`}>
                        {tx.type === 'credit' ? '+' : tx.type === 'transfer' ? '↔' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500">No transactions found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-deep-teal">Transaction Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {getTransactionIcon(selectedTransaction.type, selectedTransaction.category)}
                <div>
                  <h3 className="text-lg font-semibold text-deep-teal">{selectedTransaction.description}</h3>
                  <p className="text-sm text-gray-500">{new Date(selectedTransaction.fullDate).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Amount</span>
                  <span className={`text-2xl font-bold ${
                    selectedTransaction.type === 'credit' ? 'text-green-600' : 
                    selectedTransaction.type === 'transfer' ? 'text-blue-600' : 'text-deep-teal'
                  }`}>
                    {selectedTransaction.type === 'credit' ? '+' : 
                     selectedTransaction.type === 'transfer' ? '↔ ' : '-'}{formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-deep-teal">{selectedTransaction.category}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Account</span>
                  <div className="text-right">
                    <p className="font-medium text-deep-teal">{selectedTransaction.accountType}</p>
                    <p className="text-xs text-gray-400">{selectedTransaction.accountNumber}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Reference</span>
                  <span className="font-mono text-sm text-deep-teal">{selectedTransaction.reference || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedTransaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedTransaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
