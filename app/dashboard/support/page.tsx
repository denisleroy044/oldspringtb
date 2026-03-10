'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  MessageCircle,
  Headphones,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Paperclip,
  Image,
  FileText,
  X,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Star,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  BookOpen,
  Video,
  FileQuestion,
  LifeBuoy
} from 'lucide-react'

interface Ticket {
  id: string
  ticketNumber: string
  category: string
  subject: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
}

interface Message {
  id: string
  message: string
  isAdmin: boolean
  createdAt: string
}

export default function SupportPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'faq'>('chat')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [chatConnected, setChatConnected] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  
  // New ticket form
  const [ticketForm, setTicketForm] = useState({
    category: 'general',
    subject: '',
    description: '',
    priority: 'medium'
  })

  // FAQ categories
  const faqs = [
    {
      category: 'Account',
      icon: LifeBuoy,
      questions: [
        { q: 'How do I change my password?', a: 'Go to Security settings and click on "Change Password".' },
        { q: 'How do I update my profile information?', a: 'Visit your Profile page to update personal information.' },
        { q: 'I forgot my password, what should I do?', a: 'Click on "Forgot Password" on the login page to reset it.' }
      ]
    },
    {
      category: 'Transactions',
      icon: Clock,
      questions: [
        { q: 'How long do transfers take?', a: 'Domestic transfers typically take 1-2 business days.' },
        { q: 'Why was my transaction declined?', a: 'This could be due to insufficient funds or security restrictions.' },
        { q: 'How do I dispute a transaction?', a: 'Contact support immediately with the transaction details.' }
      ]
    },
    {
      category: 'Security',
      icon: AlertCircle,
      questions: [
        { q: 'How do I enable two-factor authentication?', a: 'Go to Security settings and enable 2FA.' },
        { q: 'What should I do if I suspect fraud?', a: 'Contact support immediately and change your password.' },
        { q: 'How do I view active sessions?', a: 'Check your Security page to see all active sessions.' }
      ]
    },
    {
      category: 'Payments',
      icon: Mail,
      questions: [
        { q: 'How do I make a payment?', a: 'Use the Transfer or Bill Pay features in your dashboard.' },
        { q: 'When will my payment be processed?', a: 'Payments are typically processed on the same business day.' },
        { q: 'Can I schedule recurring payments?', a: 'Yes, you can set up automatic payments for bills.' }
      ]
    }
  ]

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/support/tickets')
      const data = await response.json()
      setTickets(data.tickets || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  const startLiveChat = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/support/chat/start', {
        method: 'POST'
      })
      const data = await response.json()
      if (response.ok) {
        setChatId(data.chatId)
        setChatConnected(true)
        setMessages([
          {
            id: '1',
            message: 'Hello! How can we help you today?',
            isAdmin: true,
            createdAt: new Date().toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Error starting chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return

    setSending(true)
    try {
      const response = await fetch('/api/support/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          message: newMessage
        })
      })

      if (response.ok) {
        setMessages([...messages, {
          id: Date.now().toString(),
          message: newMessage,
          isAdmin: false,
          createdAt: new Date().toISOString()
        }])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const createTicket = async () => {
    if (!ticketForm.subject || !ticketForm.description) return

    setLoading(true)
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm)
      })

      if (response.ok) {
        setShowNewTicket(false)
        setTicketForm({ category: 'general', subject: '', description: '', priority: 'medium' })
        fetchTickets()
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const endChat = async () => {
    if (!chatId) return

    try {
      await fetch('/api/support/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId })
      })
      setChatConnected(false)
      setChatId(null)
      setMessages([])
    } catch (error) {
      console.error('Error ending chat:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-green-100 text-green-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'resolved': return 'bg-purple-100 text-purple-700'
      case 'closed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-deep-teal">Support</h1>
        <p className="text-gray-500 text-sm mt-1">Get help with your account and questions</p>
      </div>

      {/* Support Options */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setActiveTab('chat')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            activeTab === 'chat'
              ? 'border-soft-gold bg-soft-gold/5'
              : 'border-gray-200 hover:border-soft-gold hover:bg-soft-gold/5'
          }`}
        >
          <div className="w-12 h-12 bg-soft-gold/10 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-soft-gold" />
          </div>
          <h3 className="font-semibold text-deep-teal mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600">Chat with support in real-time</p>
          <p className="text-xs text-soft-gold mt-2">Average response: &lt; 2 min</p>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            activeTab === 'tickets'
              ? 'border-soft-gold bg-soft-gold/5'
              : 'border-gray-200 hover:border-soft-gold hover:bg-soft-gold/5'
          }`}
        >
          <div className="w-12 h-12 bg-soft-gold/10 rounded-full flex items-center justify-center mb-4">
            <Headphones className="w-6 h-6 text-soft-gold" />
          </div>
          <h3 className="font-semibold text-deep-teal mb-2">Support Tickets</h3>
          <p className="text-sm text-gray-600">Create and track support tickets</p>
          <p className="text-xs text-soft-gold mt-2">Response within 24 hours</p>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            activeTab === 'faq'
              ? 'border-soft-gold bg-soft-gold/5'
              : 'border-gray-200 hover:border-soft-gold hover:bg-soft-gold/5'
          }`}
        >
          <div className="w-12 h-12 bg-soft-gold/10 rounded-full flex items-center justify-center mb-4">
            <HelpCircle className="w-6 h-6 text-soft-gold" />
          </div>
          <h3 className="font-semibold text-deep-teal mb-2">FAQ</h3>
          <p className="text-sm text-gray-600">Find answers to common questions</p>
          <p className="text-xs text-soft-gold mt-2">Instant answers</p>
        </button>
      </div>

      {/* Live Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
          {!chatConnected ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-soft-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-soft-gold" />
              </div>
              <h2 className="text-xl font-bold text-deep-teal mb-2">Start a Live Chat</h2>
              <p className="text-gray-500 mb-6">Connect with a support agent in real-time</p>
              <button
                onClick={startLiveChat}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 btn-shimmer"
              >
                {loading ? 'Connecting...' : 'Start Chat'}
              </button>
            </div>
          ) : (
            <div className="h-[500px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-deep-teal">Support Agent</span>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
                <button
                  onClick={endChat}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.isAdmin
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-gradient-to-r from-deep-teal to-sage text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isAdmin ? 'text-gray-500' : 'text-white/70'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 btn-shimmer"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {/* New Ticket Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowNewTicket(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all btn-shimmer"
            >
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
          </div>

          {/* Tickets List */}
          {tickets.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
              <Headphones className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-deep-teal mb-2">No Support Tickets</h3>
              <p className="text-gray-500 mb-6">Create a ticket and we'll help you out</p>
              <button
                onClick={() => setShowNewTicket(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all btn-shimmer"
              >
                <Plus className="w-5 h-5" />
                Create a Ticket
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm text-gray-600">
                          {ticket.ticketNumber}
                        </td>
                        <td className="px-6 py-4 font-medium text-deep-teal">
                          {ticket.subject}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {ticket.category}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => router.push(`/dashboard/support/tickets/${ticket.id}`)}
                            className="text-soft-gold hover:text-deep-teal"
                          >
                            <ChevronRight className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {faqs.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.category} className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-soft-gold/10 rounded-lg">
                      <Icon className="w-5 h-5 text-soft-gold" />
                    </div>
                    <h2 className="font-semibold text-deep-teal">{section.category}</h2>
                  </div>
                </div>
                <div className="divide-y">
                  {section.questions.map((faq, index) => (
                    <div key={index} className="p-4">
                      <p className="font-medium text-deep-teal mb-2">{faq.q}</p>
                      <p className="text-sm text-gray-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-deep-teal">Create Support Ticket</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                >
                  <option value="general">General Question</option>
                  <option value="account">Account Issue</option>
                  <option value="technical">Technical Problem</option>
                  <option value="billing">Billing Question</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="Please provide detailed information about your issue..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewTicket(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createTicket}
                  disabled={!ticketForm.subject || !ticketForm.description || loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 btn-shimmer"
                >
                  {loading ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
