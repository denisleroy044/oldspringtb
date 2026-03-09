'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  DollarSign,
  Zap,
  Phone,
  Home,
  Shield,
  Repeat,
  CreditCard,
  Landmark,
  MoreHorizontal,
  ChevronRight,
  Loader2,
  Bell,
  Eye,
  EyeOff,
  FileText,
  Download,
  Filter,
  Search,
  Trash2,
  Edit,
  Copy,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react'

interface Bill {
  id: string
  billName: string
  billNumber?: string
  category: string
  categoryIcon: string
  amount: number
  currency: string
  dueDate: string
  recurring: boolean
  recurringFrequency?: string
  autoPay: boolean
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  paymentReference?: string
  paidAt?: string
  accountNumber?: string
  accountType?: string
}

interface PaymentRequest {
  id: string
  billName: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED'
  reference: string
  createdAt: string
  dueDate: string
  accountNumber?: string
}

export default function BillsPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [bills, setBills] = useState<Bill[]>([])
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddBill, setShowAddBill] = useState(false)
  const [showPayBill, setShowPayBill] = useState<Bill | null>(null)
  const [selectedAccount, setSelectedAccount] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch bills
      const billsRes = await fetch('/api/bills')
      const billsData = await billsRes.json()
      setBills(billsData.bills || [])

      // Fetch payment requests
      const requestsRes = await fetch('/api/bills/payments')
      const requestsData = await requestsRes.json()
      setPaymentRequests(requestsData.requests || [])

      // Fetch categories
      const categoriesRes = await fetch('/api/bills/categories')
      const categoriesData = await categoriesRes.json()
      setCategories(categoriesData.categories || [])

      // Fetch accounts for payment
      const accountsRes = await fetch('/api/accounts')
      const accountsData = await accountsRes.json()
      setAccounts(accountsData.accounts || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    try {
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billName: formData.get('billName'),
          billNumber: formData.get('billNumber'),
          categoryId: formData.get('category'),
          amount: parseFloat(formData.get('amount') as string),
          dueDate: formData.get('dueDate'),
          recurring: formData.get('recurring') === 'on',
          recurringFrequency: formData.get('recurringFrequency'),
          autoPay: formData.get('autoPay') === 'on',
          notes: formData.get('notes')
        })
      })

      if (response.ok) {
        setShowAddBill(false)
        fetchData()
      }
    } catch (error) {
      console.error('Error adding bill:', error)
    }
  }

  const handlePayBill = async () => {
    if (!showPayBill || !selectedAccount) return

    try {
      const response = await fetch('/api/bills/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billId: showPayBill.id,
          accountId: selectedAccount,
          amount: showPayBill.amount
        })
      })

      if (response.ok) {
        setShowPayBill(null)
        setSelectedAccount('')
        fetchData()
      }
    } catch (error) {
      console.error('Error paying bill:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'OVERDUE':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getCategoryIcon = (icon: string) => {
    const icons: Record<string, any> = {
      'zap': Zap,
      'phone': Phone,
      'home': Home,
      'shield': Shield,
      'repeat': Repeat,
      'credit-card': CreditCard,
      'landmark': Landmark,
      'more-horizontal': MoreHorizontal
    }
    const Icon = icons[icon] || MoreHorizontal
    return <Icon className="w-4 h-4" />
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const filteredBills = bills.filter(bill => {
    if (filter === 'pending') return bill.status === 'PENDING'
    if (filter === 'paid') return bill.status === 'PAID'
    if (filter === 'overdue') return bill.status === 'OVERDUE'
    return true
  }).filter(bill =>
    bill.billName.toLowerCase().includes(search.toLowerCase()) ||
    bill.category?.toLowerCase().includes(search.toLowerCase())
  )

  const pendingRequests = paymentRequests.filter(r => r.status === 'PENDING')

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading your bills...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Bills & Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and pay your bills</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingRequests.length > 0 && (
            <div className="relative">
              <Bell className="w-5 h-5 text-soft-gold" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingRequests.length}
              </span>
            </div>
          )}
          <button
            onClick={() => setShowAddBill(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Bill
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
          >
            <option value="all">All Bills</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Bills Grid */}
      {filteredBills.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <div className="w-20 h-20 bg-soft-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-soft-gold" />
          </div>
          <h3 className="text-lg font-semibold text-deep-teal mb-2">No bills found</h3>
          <p className="text-gray-500 mb-6">Add your first bill to get started</p>
          <button
            onClick={() => setShowAddBill(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add a Bill
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBills.map((bill) => (
            <div
              key={bill.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-sage/20 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    bill.status === 'PAID' ? 'bg-green-100' :
                    bill.status === 'OVERDUE' ? 'bg-red-100' : 'bg-soft-gold/10'
                  }`}>
                    {getCategoryIcon(bill.categoryIcon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-deep-teal">{bill.billName}</h3>
                    <p className="text-xs text-gray-500">{bill.category}</p>
                  </div>
                </div>
                {getStatusIcon(bill.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="font-bold text-deep-teal">{formatCurrency(bill.amount, bill.currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Due Date</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className={`text-sm font-medium ${
                      isOverdue(bill.dueDate) && bill.status === 'PENDING' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {formatDate(bill.dueDate)}
                    </span>
                  </div>
                </div>
                {bill.billNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Account</span>
                    <span className="text-sm font-mono text-gray-600">{bill.billNumber}</span>
                  </div>
                )}
                {bill.recurring && (
                  <div className="flex items-center gap-1 text-xs text-soft-gold">
                    <Repeat className="w-3 h-3" />
                    <span>Recurring {bill.recurringFrequency}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {bill.status !== 'PAID' && (
                  <button
                    onClick={() => setShowPayBill(bill)}
                    className="flex-1 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all"
                  >
                    Pay Bill
                  </button>
                )}
                <Link
                  href={`/dashboard/bills/${bill.id}`}
                  className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </Link>
              </div>

              {bill.status === 'PAID' && bill.paidAt && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Paid on {new Date(bill.paidAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Payment Requests */}
      {paymentRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-deep-teal mb-4">Payment Requests</h2>
          <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-deep-teal">{request.billName}</p>
                          <p className="text-xs text-gray-500">Due {formatDate(request.dueDate)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-deep-teal">
                        {formatCurrency(request.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          request.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          request.status === 'PROCESSED' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{request.reference}</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/bills/requests/${request.id}`}
                          className="text-soft-gold hover:text-deep-teal"
                        >
                          <ChevronRight className="w-4 h-4 inline" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Bill Modal */}
      {showAddBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-deep-teal">Add New Bill</h2>
            </div>
            <form onSubmit={handleAddBill} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bill Name</label>
                <input
                  type="text"
                  name="billName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="e.g., Electricity Bill"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bill Number (Optional)</label>
                <input
                  type="text"
                  name="billNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="Account or reference number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="amount"
                    required
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="recurring"
                    className="w-4 h-4 text-soft-gold focus:ring-soft-gold rounded"
                  />
                  <span className="text-sm text-gray-600">Recurring Bill</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="autoPay"
                    className="w-4 h-4 text-soft-gold focus:ring-soft-gold rounded"
                  />
                  <span className="text-sm text-gray-600">Auto Pay</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBill(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Add Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Bill Modal */}
      {showPayBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-deep-teal">Pay Bill</h2>
              <p className="text-sm text-gray-500 mt-1">{showPayBill.billName}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-soft-gold/5 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount Due</span>
                  <span className="font-bold text-deep-teal">{formatCurrency(showPayBill.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date</span>
                  <span className="text-gray-800">{formatDate(showPayBill.dueDate)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pay From</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                >
                  <option value="">Select account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.displayName} ({acc.maskedNumber}) - {formatCurrency(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    This payment will require admin approval before processing. 
                    You'll be notified once it's approved.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPayBill(null)
                    setSelectedAccount('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayBill}
                  disabled={!selectedAccount}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
