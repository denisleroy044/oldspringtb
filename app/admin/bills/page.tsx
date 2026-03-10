'use client'

import { useState, useEffect } from 'react'
import {
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
  DollarSign,
  Calendar
} from 'lucide-react'

interface Bill {
  id: string
  userId: string
  userEmail: string
  userName: string
  billType: string
  providerName: string
  accountNumber: string
  amount: number
  dueDate?: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  createdAt: string
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const response = await fetch('/api/admin/bills')
      const data = await response.json()
      setBills(data.bills || [])
    } catch (err) {
      setError('Failed to fetch bills')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (billId: string) => {
    try {
      await fetch('/api/admin/bills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billId, action: 'mark-paid' })
      })
      fetchBills()
    } catch (err) {
      console.error('Error marking bill as paid:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const filteredBills = bills.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false
    if (search) {
      return b.userName?.toLowerCase().includes(search.toLowerCase()) ||
             b.providerName?.toLowerCase().includes(search.toLowerCase())
    }
    return true
  })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Bill Payments</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchBills}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bills List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Receipt className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No bills found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBills.map((bill) => (
            <div key={bill.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{bill.userName}</h3>
                    <span className="text-sm text-gray-500">{bill.userEmail}</span>
                    {getStatusBadge(bill.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {bill.providerName} - {bill.billType}
                  </p>
                  <p className="text-sm text-gray-500">Account: {bill.accountNumber}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    ${bill.amount.toLocaleString()}
                  </p>
                </div>
                {bill.status === 'pending' && (
                  <button
                    onClick={() => handleMarkPaid(bill.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
