'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCog,
  ChevronRight,
  Loader2,
  AlertCircle,
  DollarSign,
  Landmark,
  Gift,
  Eye,
  Edit,
  Trash2,
  Ban,
  Check,
  X,
  RefreshCw,
  Wallet
} from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  phone: string
  role: string
  kycStatus: string
  isActive: boolean
  createdAt: string
  balance: number
  accounts: any[]
  transaction_count: number
  total_deposits: number
  pending_loans: number
  pending_grants: number
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users')
      }
      
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setError(error instanceof Error ? error.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleManageFunds = (userId: string) => {
    router.push(`/admin/funds?userId=${userId}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusBadge = (user: User) => {
    if (!user.isActive) {
      return <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full flex items-center gap-1">
        <Ban className="w-3 h-3" />
        Inactive
      </span>
    }
    if (user.kycStatus === 'verified') {
      return <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        KYC Verified
      </span>
    }
    if (user.kycStatus === 'pending') {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full flex items-center gap-1 animate-pulse">
        <Clock className="w-3 h-3" />
        KYC Pending
      </span>
    }
    if (user.kycStatus === 'rejected') {
      return <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        KYC Rejected
      </span>
    }
    return <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Active</span>
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true
    if (filter === 'active') return user.isActive
    if (filter === 'inactive') return !user.isActive
    if (filter === 'kyc-pending') return user.kycStatus === 'pending'
    if (filter === 'kyc-verified') return user.kycStatus === 'verified'
    if (filter === 'kyc-rejected') return user.kycStatus === 'rejected'
    if (filter === 'admins') return user.role === 'admin'
    return true
  }).filter(user => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(search)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-deep-teal" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">
            Total users: {users.length} • 
            Active: {users.filter(u => u.isActive).length} • 
            Pending KYC: {users.filter(u => u.kycStatus === 'pending').length}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/funds"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            Funds Management
          </Link>
          <button 
            onClick={fetchUsers}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email or phone..."
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
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="kyc-pending">KYC Pending</option>
            <option value="kyc-verified">KYC Verified</option>
            <option value="kyc-rejected">KYC Rejected</option>
            <option value="admins">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Users Found
          </h3>
          <p className="text-gray-500">
            {search || filter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No users have signed up yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accounts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-deep-teal to-sage rounded-full flex items-center justify-center text-white font-bold">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                          {user.phone && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-green-600">
                        {formatCurrency(user.balance || 0)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{user.accounts?.length || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{user.transaction_count || 0}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleManageFunds(user.id)}
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          title="Manage Funds"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
