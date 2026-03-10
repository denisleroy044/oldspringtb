'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { 
  Plus,
  Eye,
  EyeOff,
  CreditCard,
  PiggyBank,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Hourglass
} from 'lucide-react'

interface Account {
  id: string
  type: string
  displayName: string
  accountNumber: string
  maskedNumber: string
  balance: number
  currency: string
  status: string
  createdAt: string
}

interface AccountRequest {
  id: string
  accountType: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function AccountsPage() {
  const { user } = useAuth()
  const [showBalances, setShowBalances] = useState(true)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [requests, setRequests] = useState<AccountRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestType, setRequestType] = useState('CHECKING')
  const [showRequests, setShowRequests] = useState(false)

  useEffect(() => {
    fetchAccounts()
    fetchRequests()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load accounts')
      }
      
      setAccounts(data.accounts || [])
    } catch (err) {
      console.error('Error fetching accounts:', err)
      setError(err.message)
    }
  }

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/accounts/requests')
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (err) {
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNewAccountRequest = async () => {
    try {
      const response = await fetch('/api/accounts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType: requestType.toLowerCase() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setShowRequestModal(false)
      fetchRequests()
      alert('Account request submitted! An admin will review your request.')
    } catch (err: any) {
      alert(err.message)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getAccountIcon = (type: string) => {
    switch(type) {
      case 'CHECKING': return '💰'
      case 'SAVINGS': return '🏦'
      default: return '💳'
    }
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gold-trim-bottom pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-deep-teal">Accounts</h1>
          <p className="text-gray-500 mt-1">Manage all your banking accounts</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="p-2 bg-white rounded-lg shadow-sm border border-soft-gold/20 hover:bg-gray-50 transition-colors"
          >
            {showBalances ? <EyeOff className="w-5 h-5 text-deep-teal" /> : <Eye className="w-5 h-5 text-deep-teal" />}
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-sage transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Request Account</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Balance</p>
          <p className="text-2xl font-bold text-deep-teal">
            {showBalances ? formatCurrency(totalBalance) : '••••••'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Accounts</p>
          <p className="text-2xl font-bold text-deep-teal">{accounts.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
          <p className="text-2xl font-bold text-soft-gold">{pendingRequests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Active Accounts</p>
          <p className="text-2xl font-bold text-deep-teal">
            {accounts.filter(a => a.status === 'ACTIVE').length}
          </p>
        </div>
      </div>

      {/* Pending Requests Section */}
      {requests.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-deep-teal">Account Requests</h2>
            <button
              onClick={() => setShowRequests(!showRequests)}
              className="text-sm text-soft-gold hover:text-deep-teal"
            >
              {showRequests ? 'Hide' : 'Show'} Requests
            </button>
          </div>

          {showRequests && (
            <div className="space-y-4">
              {requests.filter(r => r.status === 'PENDING').map((req) => (
                <div key={req.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Hourglass className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-deep-teal">
                          {req.accountType} Account Request
                        </p>
                        <p className="text-xs text-gray-500">
                          Requested {formatDate(req.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Pending Approval
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Link
            key={account.id}
            href={`/dashboard/accounts/${account.id}`}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-sage/20 hover:shadow-xl transition-all"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-deep-teal rounded-full flex items-center justify-center text-white text-xl">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-deep-teal">{account.displayName}</h3>
                    <p className="text-xs text-gray-500">{account.maskedNumber}</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Balance</span>
                <span className="text-xl font-bold text-deep-teal">
                  {showBalances ? formatCurrency(account.balance) : '••••••'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <div className="text-6xl mb-4">🏦</div>
          <h3 className="text-lg font-medium text-deep-teal mb-2">No Accounts Yet</h3>
          <p className="text-gray-500 mb-4">Get started by requesting your first account</p>
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-sage transition-colors"
          >
            Request Account
          </button>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-deep-teal mb-4">Request New Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'CHECKING', name: 'Checking', icon: '💰' },
                    { id: 'SAVINGS', name: 'Savings', icon: '🏦' },
                    { id: 'BUSINESS', name: 'Business', icon: '💼' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setRequestType(type.id)}
                      className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                        requestType === type.id
                          ? 'border-soft-gold bg-soft-gold/5'
                          : 'border-gray-200 hover:border-soft-gold/50'
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className={`text-xs font-medium ${
                        requestType === type.id ? 'text-soft-gold' : 'text-gray-700'
                      }`}>
                        {type.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-soft-gold/5 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-deep-teal">Note:</span> Your request will be reviewed by an admin. 
                  You'll be notified once it's approved.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleNewAccountRequest}
                  className="flex-1 bg-deep-teal text-white py-2 rounded-lg hover:bg-sage transition-colors"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
