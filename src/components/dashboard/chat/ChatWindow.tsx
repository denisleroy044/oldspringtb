'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { 
  startChat, 
  sendMessage, 
  getChatSession, 
  getUserActiveChat,
  endChat,
  rateChat
} from '@/lib/chat/chatService'
import { ChatSession, ChatMessage } from '@/types/chat'

interface ChatWindowProps {
  onClose?: () => void
  initialDepartment?: 'general' | 'technical' | 'billing' | 'security'
}

export function ChatWindow({ onClose, initialDepartment = 'general' }: ChatWindowProps) {
  const { user } = useAuth()
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      // Check for existing active chat
      const activeChat = getUserActiveChat(user.id)
      if (activeChat) {
        setSession(activeChat)
        setMessages(activeChat.messages)
      } else {
        // Start new chat
        const newSession = startChat(
          user.id,
          user.accountName,
          initialDepartment,
          'Support Request'
        )
        setSession(newSession)
        setMessages(newSession.messages)
      }
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Poll for new messages
    if (!session) return

    const interval = setInterval(() => {
      const updatedSession = getChatSession(session.id)
      if (updatedSession && updatedSession.messages.length > messages.length) {
        setMessages(updatedSession.messages)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [session, messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!session || !inputMessage.trim() || !user) return

    const newMessage = sendMessage(session.id, user.id, inputMessage)
    setMessages([...messages, newMessage])
    setInputMessage('')
    
    // Focus back on input
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEndChat = () => {
    if (!session || !user) return
    
    endChat(session.id, user.id)
    setShowRating(true)
  }

  const handleSubmitRating = () => {
    if (!session) return
    
    rateChat(session.id, rating, feedback)
    setShowRating(false)
    if (onClose) onClose()
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) return null

  if (showRating) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-full">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2b4c7a] text-white p-4 rounded-t-2xl">
          <h3 className="font-semibold">Rate Your Experience</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            How would you rate your support experience?
          </p>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Additional feedback (optional)"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] mb-4"
          />
          <button
            onClick={handleSubmitRating}
            className="w-full bg-[#1e3a5f] text-white py-3 rounded-xl font-medium hover:bg-[#2b4c7a] transition"
          >
            Submit Rating
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-full flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2b4c7a] text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Customer Support</h3>
          <p className="text-xs opacity-90">
            {session?.status === 'active' ? 'Online' : 'Chat Ended'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {session?.status === 'active' && (
            <button
              onClick={handleEndChat}
              className="p-1 hover:bg-white/20 rounded transition"
              title="End Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                msg.sender === 'user'
                  ? 'bg-[#1e3a5f] text-white'
                  : msg.sender === 'agent'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-gray-200 text-gray-600 italic'
              }`}
            >
              {msg.sender !== 'user' && (
                <p className="text-xs font-semibold mb-1 opacity-75">
                  {msg.senderName}
                </p>
              )}
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-right mt-1 opacity-75">
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {session?.status === 'active' && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-4 py-2 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2b4c7a] transition disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
