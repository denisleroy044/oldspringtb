'use client'

import { useState, useEffect } from 'react'
import { useDashboardContext } from '@/context/DashboardContext'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

interface Transaction {
  id: string
  date: string
  description: string
  merchant: string
  amount: number
  type: 'credit' | 'debit'
  status: 'completed' | 'pending' | 'failed'
  category: string
  accountNumber: string
  bankName?: string
}

export function TransactionsTable() {
  const { user } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'income' | 'payments' | 'pending'>('all')

  useEffect(() => {
    // Load transactions from localStorage (in production, this would be from your database)
    if (authUser) {
      const savedTransactions = localStorage.getItem(`transactions_${authUser.id}`)
      
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      } else {
        // NEW USER - Start with empty array, NO mock data
        setTransactions([])
        
        // Initialize empty transactions in localStorage
        localStorage.setItem(`transactions_${authUser.id}`, JSON.stringify([]))
      }
    }
    setLoading(false)
  }, [authUser])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string, category: string) => {
    // Map categories to icons (matches your transactions page)
    const icons: Record<string, string> = {
      'Shopping': '🛒',
      'Income': '💰',
      'Entertainment': '🎬',
      'Dining': '🍔',
      'Transport': '🚗',
      'Utilities': '💡',
      'Healthcare': '🏥',
      'Education': '📚',
      'Travel': '✈️',
      'Transfer': '↔️'
    }
    return icons[category] || (type === 'credit' ? '📥' : '📤')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true
    if (filter === 'income') return tx.type === 'credit'
    if (filter === 'payments') return tx.type === 'debit'
    if (filter === 'pending') return tx.status === 'pending'
    return true
  }).slice(0, 4) // Show only 4 most recent

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2b4c7a] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="font-semibold">Recent Transactions</h3>
          </div>
          <Link 
            href="/dashboard/transactions" 
            className="text-xs text-white/80 hover:text-white transition flex items-center"
          >
            View All
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Quick Filters - Only show if there are transactions */}
      {transactions.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex space-x-3 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`font-medium transition ${
              filter === 'all' ? 'text-[#1e3a5f]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`font-medium transition ${
              filter === 'income' ? 'text-[#1e3a5f]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter('payments')}
            className={`font-medium transition ${
              filter === 'payments' ? 'text-[#1e3a5f]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`font-medium transition ${
              filter === 'pending' ? 'text-[#1e3a5f]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending
          </button>
        </div>
      )}

      {/* Transaction List - Shows empty state for new users */}
      {transactions.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h4>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Your transaction history will appear here once you make your first deposit or transfer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/deposit"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#2b4c7a] transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Make a Deposit
            </Link>
            <Link
              href="/dashboard/transfer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transfer Funds
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Transactions typically appear within minutes
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredTransactions.map((tx) => (
            <Link
              key={tx.id}
              href={`/dashboard/transactions?id=${tx.id}`}
              className="block px-4 py-3 hover:bg-gray-50 transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {/* Icon - matches transactions page */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'credit' ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <span className="text-lg">{getTypeIcon(tx.type, tx.category)}</span>
                  </div>
                  
                  {/* Transaction Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {tx.merchant}
                      </p>
                      {tx.status === 'pending' && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{tx.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-0.5">
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span>{formatTime(tx.date)}</span>
                      <span>•</span>
                      <span>{tx.accountNumber}</span>
                      {tx.bankName && tx.bankName !== 'Oldspring Trust' && (
                        <>
                          <span>•</span>
                          <span className="truncate">{tx.bankName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right ml-4">
                  <p className={`text-base font-semibold ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 group-hover:text-[#1e3a5f] transition">
                    Details →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
