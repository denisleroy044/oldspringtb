'use client'

import { useState, useEffect, useRef } from 'react'
import {
  MessageCircle,
  Send,
  User,
  Clock,
  Check,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Search,
  Loader2,
  XCircle,
  Users,
  Bell
} from 'lucide-react'

interface ChatSession {
  id: string
  userId: string
  userEmail: string
  userName: string
  sessionId: string
  status: string
  lastActivity: string
  unread_count: number
}

interface ChatMessage {
  id: string
  sessionId: string
  userId: string
  message: string
  isAdmin: boolean
  isRead: boolean
  createdAt: string
  userEmail?: string
  firstName?: string
  lastName?: string
}

export default function LiveChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    fetchSessions()
    startPolling()
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession.id)
      markAsRead(activeSession.id)
    }
  }, [activeSession])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startPolling = () => {
    pollingRef.current = setInterval(() => {
      if (activeSession) {
        fetchMessages(activeSession.id, true)
      }
      fetchSessions(true)
    }, 3000)
  }

  const fetchSessions = async (silent: boolean = false) => {
    try {
      const response = await fetch('/api/admin/chat/sessions')
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (err) {
      if (!silent) console.error('Error fetching sessions:', err)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const fetchMessages = async (sessionId: string, silent: boolean = false) => {
    try {
      const response = await fetch(`/api/admin/chat/messages?sessionId=${sessionId}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      if (!silent) console.error('Error fetching messages:', err)
    }
  }

  const markAsRead = async (sessionId: string) => {
    try {
      await fetch(`/api/admin/chat/read?sessionId=${sessionId}`, {
        method: 'POST'
      })
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeSession) return

    setSending(true)
    try {
      const response = await fetch('/api/admin/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession.id,
          message: newMessage,
          isAdmin: true
        })
      })

      if (response.ok) {
        setNewMessage('')
        await fetchMessages(activeSession.id)
      }
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  const handleEndChat = async () => {
    if (!activeSession) return

    try {
      await fetch('/api/admin/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: activeSession.id })
      })
      setActiveSession(null)
      fetchSessions()
    } catch (err) {
      console.error('Error ending chat:', err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredSessions = sessions.filter(s => 
    s.userName?.toLowerCase().includes(search.toLowerCase()) ||
    s.userEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sessions Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Active Chats
          </h2>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No active chats</p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setActiveSession(session)}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                  activeSession?.id === session.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{session.userName}</h3>
                  {session.unread_count > 0 && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      {session.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{session.userEmail}</p>
                <p className="text-xs text-gray-400">
                  {new Date(session.lastActivity).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {activeSession ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{activeSession.userName}</h3>
                <p className="text-sm text-gray-500">{activeSession.userEmail}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleEndChat}
                  className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.isAdmin
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border'
                    }`}
                  >
                    {!msg.isAdmin && (
                      <p className="text-xs text-gray-500 mb-1">{activeSession.userName}</p>
                    )}
                    <p>{msg.message}</p>
                    <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${
                      msg.isAdmin ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                      {msg.isAdmin && (
                        msg.isRead ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a chat to start</h3>
              <p>Choose a conversation from the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
