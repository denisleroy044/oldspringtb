'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  getAdminUser, 
  getSystemStats, 
  getAllUsers, 
  getUserDetails,
  updateUserStatus,
  toggleAccountFreeze,
  toggleCardBlock,
  getSupportTickets,
  updateTicket,
  sendBulkNotification,
  getSystemAlerts,
  acknowledgeAlert
} from '@/lib/admin/adminService'
import { getPendingRequests, approveRequest, rejectRequest, getRequestStats } from '@/lib/account/accountRequestService'
import { useAuth } from '@/context/AuthContext'

export default function AdminPage() {
  const router = useRouter()
  const { user: authUser } = useAuth()
  const [admin, setAdmin] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [requestStats, setRequestStats] = useState<any>({ pending: 0, approved: 0, rejected: 0 })
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [ticketReply, setTicketReply] = useState('')
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'critical' | 'promo',
    targetType: 'all' as 'all' | 'specific',
    targetUserIds: [] as string[]
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!authUser?.isAdmin) {
      router.push('/auth/login')
      return
    }

    loadData()
  }, [authUser])

  const loadData = () => {
    setAdmin(getAdminUser())
    setStats(getSystemStats())
    setUsers(getAllUsers())
    setTickets(getSupportTickets())
    setAlerts(getSystemAlerts())
    setRequests(getPendingRequests())
    setRequestStats(getRequestStats())
  }

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
  )

  const handleViewUser = (userId: string) => {
    const details = getUserDetails(userId)
    setUserDetails(details)
    setShowUserModal(true)
  }

  const handleUpdateStatus = (userId: string, status: string) => {
    updateUserStatus(userId, status as any, 'Admin action')
    loadData()
    if (selectedUser?.id === userId) {
      handleViewUser(userId)
    }
  }

  const handleFreezeAccount = (userId: string, accountId: string, freeze: boolean) => {
    toggleAccountFreeze(userId, accountId, freeze)
    if (selectedUser?.id === userId) {
      handleViewUser(userId)
    }
  }

  const handleBlockCard = (userId: string, cardId: string, block: boolean) => {
    toggleCardBlock(userId, cardId, block)
    if (selectedUser?.id === userId) {
      handleViewUser(userId)
    }
  }

  const handleTicketReply = () => {
    if (!selectedTicket || !ticketReply.trim()) return
    updateTicket(selectedTicket.id, selectedTicket.status, ticketReply)
    setTickets(getSupportTickets())
    setTicketReply('')
    setShowTicketModal(false)
  }

  const handleSendNotification = () => {
    if (!admin) return
    
    sendBulkNotification({
      title: notificationForm.title,
      message: notificationForm.message,
      type: notificationForm.type,
      targetType: notificationForm.targetType,
      targetUserIds: notificationForm.targetUserIds
    }, admin.id)

    setShowNotifyModal(false)
    setNotificationForm({
      title: '',
      message: '',
      type: 'info',
      targetType: 'all',
      targetUserIds: []
    })
  }

  const handleApproveRequest = (request: any) => {
    if (!admin) return
    approveRequest(request.id, request.userId, admin.id, admin.username, adminNote)
    loadData()
    setShowRequestModal(false)
    setSelectedRequest(null)
    setAdminNote('')
  }

  const handleRejectRequest = (request: any) => {
    if (!admin || !rejectionReason) return
    rejectRequest(request.id, request.userId, admin.id, admin.username, rejectionReason)
    loadData()
    setShowRequestModal(false)
    setSelectedRequest(null)
    setRejectionReason('')
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-yellow-100 text-yellow-700',
      locked: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      open: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    }
    return colors[priority] || 'bg-gray-100 text-gray-700'
  }

  if (!authUser?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Access denied. Admin only.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-[#1e3a5f] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#e68a2e] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-300">Welcome back, {admin?.firstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-[#2b4c7a] px-3 py-1 rounded-full">
                {admin?.role.replace('_', ' ')}
              </span>
              <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-[#1e3a5f]">{stats.totalUsers}</p>
              <p className="text-xs text-green-600 mt-1">↑ {stats.activeUsers} active</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-500 mb-1">Total Accounts</p>
              <p className="text-2xl font-bold text-[#1e3a5f]">{stats.totalAccounts}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
              <p className="text-2xl font-bold text-[#e68a2e]">{requestStats.pending}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-500 mb-1">Open Tickets</p>
              <p className="text-2xl font-bold text-[#1e3a5f]">{stats.openTickets}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-500 mb-1">System Uptime</p>
              <p className="text-2xl font-bold text-[#1e3a5f]">{stats.systemUptime}%</p>
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 overflow-x-auto">
            <nav className="flex space-x-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'users', name: 'User Management', icon: '👥' },
                { id: 'requests', name: 'Account Requests', icon: '📋' },
                { id: 'tickets', name: 'Support Tickets', icon: '🎫' },
                { id: 'alerts', name: 'System Alerts', icon: '⚠️' },
                { id: 'notifications', name: 'Broadcast', icon: '📢' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-[#1e3a5f] text-[#1e3a5f]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                  {tab.id === 'requests' && requestStats.pending > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                      {requestStats.pending}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1e3a5f] hover:bg-gray-50 transition text-center"
                  >
                    <span className="text-3xl mb-2 block">👥</span>
                    <p className="font-medium">Manage Users</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1e3a5f] hover:bg-gray-50 transition text-center relative"
                  >
                    <span className="text-3xl mb-2 block">📋</span>
                    <p className="font-medium">Account Requests</p>
                    {requestStats.pending > 0 && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                        {requestStats.pending} pending
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1e3a5f] hover:bg-gray-50 transition text-center"
                  >
                    <span className="text-3xl mb-2 block">🎫</span>
                    <p className="font-medium">Support Tickets</p>
                  </button>
                  <button
                    onClick={() => setShowNotifyModal(true)}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1e3a5f] hover:bg-gray-50 transition text-center"
                  >
                    <span className="text-3xl mb-2 block">📢</span>
                    <p className="font-medium">Broadcast Message</p>
                  </button>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a5f] w-64"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Accounts</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm capitalize">{user.accountType}</td>
                          <td className="px-4 py-3 text-right font-medium">${user.totalBalance.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">{user.accountCount}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.kycStatus === 'verified' ? 'bg-green-100 text-green-700' :
                              user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {user.kycStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleViewUser(user.id)}
                              className="text-[#1e3a5f] hover:text-[#2b4c7a] text-sm font-medium"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Account Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Opening Requests</h2>
                {requests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-gray-500">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#1e3a5f] transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.userName}</h3>
                            <p className="text-sm text-gray-600">{request.userEmail}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Account Type</p>
                            <p className="text-sm font-medium capitalize">{request.type}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Initial Deposit</p>
                            <p className="text-sm font-medium">${request.initialDeposit.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Account Name</p>
                            <p className="text-sm font-medium">{request.accountName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Submitted</p>
                            <p className="text-sm font-medium">{new Date(request.submittedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowRequestModal(true)
                            }}
                            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2b4c7a] transition"
                          >
                            Review Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Support Tickets Tab */}
            {activeTab === 'tickets' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Support Tickets</h2>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#1e3a5f] transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(ticket.status)}`}>
                              {ticket.status}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">From: {ticket.userName}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{ticket.description}</p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket)
                            setShowTicketModal(true)
                          }}
                          className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2b4c7a] transition"
                        >
                          View & Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Request Review Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Review Account Request</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <p><span className="text-gray-600">User:</span> <span className="font-medium">{selectedRequest.userName}</span></p>
                  <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedRequest.userEmail}</span></p>
                  <p><span className="text-gray-600">Account Type:</span> <span className="font-medium capitalize">{selectedRequest.type}</span></p>
                  <p><span className="text-gray-600">Account Name:</span> <span className="font-medium">{selectedRequest.accountName}</span></p>
                  <p><span className="text-gray-600">Initial Deposit:</span> <span className="font-medium">${selectedRequest.initialDeposit.toLocaleString()}</span></p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Add any notes about this request..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason (Required for rejection)</label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowRequestModal(false)
                    setSelectedRequest(null)
                    setAdminNote('')
                    setRejectionReason('')
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveRequest(selectedRequest)}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectRequest(selectedRequest)}
                  disabled={!rejectionReason}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
