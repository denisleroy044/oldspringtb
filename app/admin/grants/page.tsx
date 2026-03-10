'use client'

import { useState, useEffect } from 'react'
import {
  Gift,
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
  User,
  FileText,
  Plus,
  Save,
  X
} from 'lucide-react'

interface Grant {
  id: string
  userId: string
  userEmail: string
  userName: string
  amount: number
  purpose: string
  type: string
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed'
  adminNotes?: string
  offerDetails?: {
    approvedAmount?: number
    disbursementDate?: string
    conditions?: string
  }
  createdAt: string
  updatedAt: string
}

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [offerForm, setOfferForm] = useState({
    approvedAmount: 0,
    conditions: '',
    adminNotes: ''
  })

  useEffect(() => {
    fetchGrants()
  }, [])

  const fetchGrants = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/grants')
      const data = await response.json()
      setGrants(data.grants || [])
    } catch (err) {
      setError('Failed to fetch grants')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOffer = async (grantId: string) => {
    setProcessing(grantId)
    try {
      const response = await fetch('/api/admin/grants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantId,
          action: 'offer',
          offerDetails: {
            approvedAmount: offerForm.approvedAmount,
            conditions: offerForm.conditions
          },
          adminNotes: offerForm.adminNotes
        })
      })
      
      if (response.ok) {
        setShowOfferModal(false)
        fetchGrants()
      }
    } catch (err) {
      console.error('Error creating offer:', err)
    } finally {
      setProcessing(null)
    }
  }

  const handleApprove = async (grantId: string) => {
    setProcessing(grantId)
    try {
      const response = await fetch('/api/admin/grants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grantId, action: 'approve' })
      })
      
      if (response.ok) {
        setGrants(grants.map(g => g.id === grantId ? { ...g, status: 'approved' } : g))
      }
    } catch (err) {
      console.error('Error approving grant:', err)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (grantId: string) => {
    setProcessing(grantId)
    try {
      const response = await fetch('/api/admin/grants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grantId, action: 'reject' })
      })
      
      if (response.ok) {
        setGrants(grants.map(g => g.id === grantId ? { ...g, status: 'rejected' } : g))
      }
    } catch (err) {
      console.error('Error rejecting grant:', err)
    } finally {
      setProcessing(null)
    }
  }

  const handleDisburse = async (grantId: string) => {
    setProcessing(grantId)
    try {
      const response = await fetch('/api/admin/grants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grantId, action: 'disburse' })
      })
      
      if (response.ok) {
        setGrants(grants.map(g => g.id === grantId ? { ...g, status: 'disbursed' } : g))
      }
    } catch (err) {
      console.error('Error disbursing grant:', err)
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

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${styles[status as keyof typeof styles]}`}>
        {status === 'pending' && <Clock className="w-4 h-4" />}
        {status === 'approved' && <CheckCircle className="w-4 h-4" />}
        {status === 'rejected' && <XCircle className="w-4 h-4" />}
        {status === 'disbursed' && <DollarSign className="w-4 h-4" />}
        {status === 'completed' && <CheckCircle className="w-4 h-4" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const filteredGrants = grants.filter(g => {
    if (filter !== 'all' && g.status !== filter) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        g.userEmail?.toLowerCase().includes(searchLower) ||
        g.userName?.toLowerCase().includes(searchLower) ||
        g.purpose?.toLowerCase().includes(searchLower)
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
            <h1 className="text-3xl font-bold text-gray-900">Grant Applications</h1>
            <p className="text-gray-600 mt-2">Manage and approve user grant requests</p>
          </div>
          <button
            onClick={fetchGrants}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {grants.filter(g => g.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Approved</p>
            <p className="text-2xl font-bold text-blue-600">
              {grants.filter(g => g.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Disbursed</p>
            <p className="text-2xl font-bold text-purple-600">
              {grants.filter(g => g.status === 'disbursed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(grants.reduce((sum, g) => sum + g.amount, 0))}
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
                placeholder="Search by user or purpose..."
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
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="disbursed">Disbursed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Grants List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredGrants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Grant Applications</h3>
            <p className="text-gray-500">No grant applications match your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGrants.map((grant) => (
              <div
                key={grant.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <User className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{grant.userName}</h3>
                        <p className="text-sm text-gray-500">{grant.userEmail}</p>
                      </div>
                      {getStatusBadge(grant.status)}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Amount Requested</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(grant.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-semibold text-gray-900">{grant.type || 'General'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900">{new Date(grant.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{grant.purpose}</p>
                    
                    {grant.offerDetails && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-800 mb-2">Approved Offer</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-green-700">Amount:</span>{' '}
                            <span className="font-medium">{formatCurrency(grant.offerDetails.approvedAmount || 0)}</span>
                          </div>
                          {grant.offerDetails.conditions && (
                            <div className="col-span-2">
                              <span className="text-green-700">Conditions:</span>{' '}
                              <span className="font-medium">{grant.offerDetails.conditions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedGrant(grant)
                        setShowDetails(true)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {grant.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedGrant(grant)
                            setOfferForm({
                              approvedAmount: grant.amount,
                              conditions: '',
                              adminNotes: ''
                            })
                            setShowOfferModal(true)
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Create Offer
                        </button>
                        <button
                          onClick={() => handleReject(grant.id)}
                          disabled={processing === grant.id}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    
                    {grant.status === 'approved' && (
                      <button
                        onClick={() => handleDisburse(grant.id)}
                        disabled={processing === grant.id}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-1 disabled:opacity-50"
                      >
                        <DollarSign className="w-4 h-4" />
                        Disburse
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {showOfferModal && selectedGrant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create Grant Offer</h2>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-pink-800">Creating offer for {selectedGrant.userName}</p>
                <p className="text-sm text-pink-600 mt-1">Requested: {formatCurrency(selectedGrant.amount)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approved Amount ($)
                </label>
                <input
                  type="number"
                  value={offerForm.approvedAmount}
                  onChange={(e) => setOfferForm({ ...offerForm, approvedAmount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conditions (Optional)
                </label>
                <textarea
                  value={offerForm.conditions}
                  onChange={(e) => setOfferForm({ ...offerForm, conditions: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any conditions for this grant..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes
                </label>
                <textarea
                  value={offerForm.adminNotes}
                  onChange={(e) => setOfferForm({ ...offerForm, adminNotes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about this offer..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => handleCreateOffer(selectedGrant.id)}
                disabled={processing === selectedGrant.id}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing === selectedGrant.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Create Offer
              </button>
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
