'use client'

import { useState, useEffect } from 'react'
import {
  Ticket,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Calendar,
  Tag,
  Flag,
  Send,
  Paperclip,
  MoreVertical,
  Reply,
  Check,
  Ban
} from 'lucide-react'

interface Ticket {
  id: string
  ticketNumber: string
  userId: string
  userEmail: string
  userName: string
  subject: string
  message: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  attachments?: string[]
  assignedTo?: string
  assignedName?: string
  createdAt: string
  updatedAt: string
  replyCount?: number
}

interface Reply {
  id: string
  ticketId: string
  userId: string
  userName: string
  message: string
  isAdmin: boolean
  attachments?: string[]
  createdAt: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [replies, setReplies] = useState<Reply[]>([])
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/admin/tickets')
      const data = await response.json()
      setTickets(data.tickets || [])
    } catch (err) {
      setError('Failed to fetch tickets')
    } finally {
      setLoading(false)
    }
  }

  const fetchTicketReplies = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}/replies`)
      const data = await response.json()
      setReplies(data.replies || [])
    } catch (err) {
      console.error('Error fetching replies:', err)
    }
  }

  const handleViewTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket)
    await fetchTicketReplies(ticket.id)
    setShowTicketModal(true)
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return

    setSendingReply(true)
    try {
      const response = await fetch(`/api/admin/tickets/${selectedTicket.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyMessage,
          isAdmin: true
        })
      })

      if (response.ok) {
        setReplyMessage('')
        await fetchTicketReplies(selectedTicket.id)
        await fetchTickets() // Refresh tickets list
      }
    } catch (err) {
      console.error('Error sending reply:', err)
    } finally {
      setSendingReply(false)
    }
  }

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      await fetch('/api/admin/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status })
      })
      fetchTickets()
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: status as any })
      }
    } catch (err) {
      console.error('Error updating ticket:', err)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[priority as keyof typeof styles]}`}>
        {priority}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-blue-100 text-blue-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  const filteredTickets = tickets.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    if (search) {
      return t.ticketNumber?.toLowerCase().includes(search.toLowerCase()) ||
             t.userName?.toLowerCase().includes(search.toLowerCase()) ||
             t.subject?.toLowerCase().includes(search.toLowerCase())
    }
    return true
  })

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-2">Manage and respond to user support requests</p>
          </div>
          <button
            onClick={fetchTickets}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border">
            <p className="text-sm text-gray-500 mb-1">Open Tickets</p>
            <p className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'open').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border">
            <p className="text-sm text-gray-500 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border">
            <p className="text-sm text-gray-500 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-blue-600">
              {tickets.filter(t => t.status === 'resolved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border">
            <p className="text-sm text-gray-500 mb-1">Urgent</p>
            <p className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Ticket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No tickets found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-500">#{ticket.ticketNumber}</span>
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{ticket.subject}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{ticket.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {ticket.userName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {ticket.userEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                      {ticket.replyCount > 0 && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <MessageCircle className="w-4 h-4" />
                          {ticket.replyCount} replies
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewTicket(ticket)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Ticket #{selectedTicket.ticketNumber}</h2>
                  <p className="text-sm text-gray-500">{selectedTicket.subject}</p>
                </div>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Ticket Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">User</p>
                    <p className="font-medium">{selectedTicket.userName}</p>
                    <p className="text-sm text-gray-600">{selectedTicket.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'open')}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          selectedTicket.status === 'open' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'in-progress')}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          selectedTicket.status === 'in-progress' 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          selectedTicket.status === 'resolved' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        Resolved
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                  </div>
                </div>
              </div>

              {/* Original Message */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Original Message</h3>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-gray-700">{selectedTicket.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Replies */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Replies</h3>
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`flex ${reply.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${reply.isAdmin ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-4`}>
                        <p className="text-sm text-gray-600 mb-1">
                          {reply.isAdmin ? 'Admin' : reply.userName}
                        </p>
                        <p className="text-gray-700">{reply.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(reply.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <div>
                <h3 className="font-medium mb-2">Add Reply</h3>
                <div className="flex gap-2">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {sendingReply ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
