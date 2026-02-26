'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'credit' | 'debit'
  status: 'completed' | 'pending' | 'failed'
  accountId: string
}

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TransactionsContent />
      </div>
    </div>
  )
}

function TransactionsContent() {
  const router = useRouter()
  const { user: authUser } = useAuth()
  const [filter, setFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30d')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock transactions data
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-03-15',
      description: 'Salary Deposit',
      category: 'Income',
      amount: 3500.00,
      type: 'credit',
      status: 'completed',
      accountId: 'acc1'
    },
    {
      id: '2',
      date: '2024-03-14',
      description: 'Whole Foods Market',
      category: 'Groceries',
      amount: 156.78,
      type: 'debit',
      status: 'completed',
      accountId: 'acc1'
    },
    {
      id: '3',
      date: '2024-03-13',
      description: 'Netflix Subscription',
      category: 'Entertainment',
      amount: 15.99,
      type: 'debit',
      status: 'completed',
      accountId: 'acc1'
    },
    {
      id: '4',
      date: '2024-03-12',
      description: 'Uber Ride',
      category: 'Transportation',
      amount: 24.50,
      type: 'debit',
      status: 'completed',
      accountId: 'acc1'
    },
    {
      id: '5',
      date: '2024-03-11',
      description: 'Amazon.com',
      category: 'Shopping',
      amount: 89.99,
      type: 'debit',
      status: 'pending',
      accountId: 'acc1'
    },
    {
      id: '6',
      date: '2024-03-10',
      description: 'Transfer to Savings',
      category: 'Transfer',
      amount: 500.00,
      type: 'debit',
      status: 'completed',
      accountId: 'acc1'
    }
  ]

  const filteredTransactions = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalCredits = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDebits = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <main className="flex-1 p-4 md:p-8">
      <ScrollAnimation animation="fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep-teal mb-2">Transactions</h1>
          <p className="text-gray-600">View and filter your transaction history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Total Credits</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Total Debits</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Net Flow</p>
            <p className={`text-2xl font-bold ${totalCredits - totalDebits >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalCredits - totalDebits)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="mt-6 text-right">
          <button
            onClick={() => alert('Export functionality coming soon!')}
            className="bg-deep-teal text-white px-6 py-2 rounded-lg hover:bg-soft-gold transition-colors"
          >
            Export as CSV
          </button>
        </div>
      </ScrollAnimation>
    </main>
  )
}
export const dynamic = 'force-dynamic'
