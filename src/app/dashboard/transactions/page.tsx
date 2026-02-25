'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

function TransactionsContent() {
  const { transactions, user } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [filter, setFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30d')
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('sidebarChange' as any, handleSidebarChange)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  if (!authUser) {
    return null
  }

  const filters = ['all', 'completed', 'pending', 'failed']
  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'This year' },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'credit' ? '↓' : '↑'
  }

  const getTypeColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  const filteredTransactions = transactions?.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false
    if (searchTerm && !t.accountName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const totalInflow = transactions?.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0) || 0
  const totalOutflow = transactions?.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0) || 0

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 flex flex-col ${
        !isMobile && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
      }`}>
        <Header />
        <main className="flex-1 pt-20 lg:pt-24 px-4 lg:px-6 pb-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">Transactions</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">View and manage your transaction history</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">Total Transactions</p>
              <p className="text-xl lg:text-2xl font-bold text-[#1e3a5f]">{transactions?.length || 0}</p>
            </div>
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">Total Inflow</p>
              <p className="text-xl lg:text-2xl font-bold text-green-600">${totalInflow.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">Total Outflow</p>
              <p className="text-xl lg:text-2xl font-bold text-red-600">${totalOutflow.toLocaleString()}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 lg:pl-10 pr-3 lg:pr-4 py-2 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                />
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 absolute left-3 top-2.5 lg:top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Status Filter */}
              <div className="flex space-x-1 lg:space-x-2 overflow-x-auto pb-1">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium capitalize whitespace-nowrap transition ${
                      filter === f
                        ? 'bg-[#1e3a5f] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 lg:px-4 py-2 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">
            {transactions?.length === 0 ? (
              <div className="px-4 lg:px-6 py-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-500 mb-2">No transactions yet</p>
                <p className="text-sm text-gray-400">Your transactions will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] lg:min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions?.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{transaction.date}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center mr-2 lg:mr-3 ${
                              transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <span className={`text-sm lg:text-base ${getTypeColor(transaction.type)}`}>
                                {getTypeIcon(transaction.type)}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs lg:text-sm font-medium text-gray-900">{transaction.accountName}</p>
                              <p className="text-xs text-gray-500">ID: {transaction.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{transaction.accountNumber}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{transaction.bankName}</td>
                        <td className={`px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-bold ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <DashboardProvider>
      <TransactionsContent />
    </DashboardProvider>
  )
}
