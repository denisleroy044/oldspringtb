'use client'

import { useState, useEffect } from 'react'
import { Loader2, RefreshCw, Plus, Minus, CheckCircle, AlertCircle, Calendar } from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  balance: number
  accounts?: Array<{
    id: string
    type: string
    number: string
    balance: number
    status: string
    bankName?: string
    accountName?: string
  }>
}

export default function AdminFundsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit')
  const [customDate, setCustomDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !amount || !description) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          type: transactionType,
          amount: parseFloat(amount),
          description,
          customDate: customDate || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process transaction')
      }

      setSuccess(`Successfully ${transactionType === 'credit' ? 'added' : 'removed'} $${amount} ${transactionType === 'credit' ? 'to' : 'from'} ${selectedUser.name}`)
      
      // Reset form
      setAmount('')
      setDescription('')
      setCustomDate('')
      
      fetchUsers() // Refresh user data
      
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Funds Management</h1>
            <p className="text-gray-600 mt-2">Add or remove funds from user accounts</p>
          </div>
          <button
            onClick={fetchUsers}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Users</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {users.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No users found
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedUser?.id === user.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Balance: {formatCurrency(user.balance || 0)}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              Accounts: {user.accounts?.length || 0}
                            </span>
                          </div>
                          
                          {/* Show user's accounts if any */}
                          {user.accounts && user.accounts.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-medium text-gray-500">Accounts:</p>
                              {user.accounts.map(acc => (
                                <div key={acc.id} className="text-xs bg-gray-50 p-2 rounded">
                                  <div className="font-medium">{acc.bankName || 'Oldspring Trust Bank'}</div>
                                  <div>{acc.accountName || user.name}</div>
                                  <div className="text-gray-600">{acc.number}</div>
                                  <div className="text-green-600 font-medium mt-1">{formatCurrency(acc.balance)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {selectedUser?.id === user.id && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedUser ? `Manage Funds for ${selectedUser.name}` : 'Select a User'}
              </h2>

              {selectedUser ? (
                <form onSubmit={handleAddFunds} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Balance
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(selectedUser.balance || 0)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Type
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setTransactionType('credit')}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                          transactionType === 'credit'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Add Funds
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransactionType('debit')}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                          transactionType === 'debit'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                        Remove Funds
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Deposit, Transfer, Payment"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Date (Optional)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Leave empty for current date/time</p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                        transactionType === 'credit'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {submitting ? 'Processing...' : transactionType === 'credit' ? 'Add Funds' : 'Remove Funds'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    New balance will be: {formatCurrency(
                      (selectedUser.balance || 0) + 
                      (transactionType === 'credit' ? parseFloat(amount || '0') : -parseFloat(amount || '0'))
                    )}
                  </p>
                </form>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a user from the list to manage their funds</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
