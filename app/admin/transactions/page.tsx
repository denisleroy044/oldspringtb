'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Search,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Bell,
  Send,
  Download,
  Upload
} from 'lucide-react'

interface TransactionRequest {
  id: string
  userId: string
  userEmail: string
  userName: string
  type: 'deposit' | 'withdrawal' | 'transfer'
  amount: number
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  createdAt: string
  metadata?: {
    bankName?: string
    accountName?: string
    accountNumber?: string
    recipientName?: string
    recipientBank?: string
    recipientAccount?: string
  }
}

export default function AdminTransactionsPage() {
  const [requests, setRequests] = useState<TransactionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<TransactionRequest | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      // This will fetch from your actual database
      const response = await fetch('/api/admin/transaction-requests')
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (err) {
      setError('Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    setProcessing(requestId)
    try {
      const response = await fetch('/api/admin/transaction-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'approve' })
      })
      
      if (response.ok) {
        // Update local state
        setRequests(requests.map(r => 
          r.id === requestId ? { ...r, status: 'approved' } : r
        ))
      }
    } catch (err) {
      console.error('Error approving request:', err)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setProcessing(requestId)
    try {
      const response = await fetch('/api/admin/transaction-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'reject' })
      })
      
      if (response.ok) {
        setRequests(requests.map(r => 
          r.id === requestId ? { ...r, status: 'rejected' } : r
        ))
      }
    } catch (err) {
      console.error('Error rejecting request:', err)
    } finally {
      setProcessing(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center gap-1 w-fit">
          <Clock className="w-4 h-4" />
          Pending
        </span>
      case 'approved':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1 w-fit">
          <CheckCircle className="w-4 h-4" />
          Approved
        </span>
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-1 w-fit">
          <XCircle className="w-4 h-4" />
          Rejected
        </span>
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1 w-fit">
          <CheckCircle className="w-4 h-4" />
          Completed
        </span>
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'deposit':
        return <div className="p-2 bg-green-100 rounded-lg"><Download className="w-5 h-5 text-green-600" /></div>
      case 'withdrawal':
        return <div className="p-2 bg-red-100 rounded-lg"><Upload className="w-5 h-5 text-red-600" /></div>
      case 'transfer':
        return <div className="p-2 bg-blue-100 rounded-lg"><Send className="w-5 h-5 text-blue-600" /></div>
      default:
        return null
    }
  }

  const filteredRequests = requests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        r.userEmail?.toLowerCase().includes(searchLower) ||
        r.userName?.toLowerCase().includes(searchLower) ||
        r.description?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Requests</h1>
            <p className="text-gray-600 mt-2">Manage user deposit, withdrawal, and transfer requests</p>
          </div>
          <button
            onClick={fetchRequests}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
            <p className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Approved Today</p>
            <p className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(requests.reduce((sum, r) => sum + r.amount, 0))}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-500">No transaction requests match your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {getTypeIcon(request.type)}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{request.userName}</h3>
                        <span className="text-sm text-gray-500">{request.userEmail}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-gray-700 mb-2">{request.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-gray-900">{formatCurrency(request.amount)}</span>
                        <span className="text-gray-500">{formatDate(request.createdAt)}</span>
                      </div>
                      {request.metadata && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                          {request.metadata.bankName && (
                            <p className="text-gray-600">Bank: {request.metadata.bankName}</p>
                          )}
                          {request.metadata.accountName && (
                            <p className="text-gray-600">Account: {request.metadata.accountName}</p>
                          )}
                          {request.metadata.accountNumber && (
                            <p className="text-gray-600">Number: {request.metadata.accountNumber}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processing === request.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {processing === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={processing === request.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowDetails(true)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                {getTypeIcon(selectedRequest.type)}
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{selectedRequest.type}</p>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedRequest.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Requested</p>
                  <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">User</p>
                <p className="font-medium">{selectedRequest.userName}</p>
                <p className="text-sm text-gray-600">{selectedRequest.userEmail}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{selectedRequest.description}</p>
              </div>

              {selectedRequest.metadata && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Banking Details</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedRequest.metadata).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id)
                      setShowDetails(false)
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Request
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id)
                      setShowDetails(false)
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Request
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
