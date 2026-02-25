'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'

interface Message {
  id: string
  sender: 'user' | 'agent'
  content: string
  timestamp: Date
  agentName?: string
}

interface ChatSession {
  id: string
  userId: string
  userName: string
  department: string
  status: 'active' | 'closed' | 'waiting'
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export function ChatWindow() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [session, setSession] = useState<ChatSession | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedDepartment, setSelectedDepartment] = useState('general')

  const departments = [
    { id: 'general', name: 'General Support' },
    { id: 'accounts', name: 'Accounts & Cards' },
    { id: 'transfers', name: 'Transfers & Payments' },
    { id: 'loans', name: 'Loans & Mortgages' },
    { id: 'technical', name: 'Technical Support' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startChat = async () => {
    if (!user) return

    // Mock starting a chat session
    const newSession: ChatSession = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name || 'User',
      department: selectedDepartment,
      status: 'active',
      messages: [
        {
          id: '1',
          sender: 'agent',
          content: `Hello ${user.name}! How can I help you with ${departments.find(d => d.id === selectedDepartment)?.name.toLowerCase()} today?`,
          timestamp: new Date(),
          agentName: 'Sarah'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setSession(newSession)
    setMessages(newSession.messages)
  }

  const sendMessage = () => {
    if (!inputMessage.trim() || !session) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    // Simulate agent typing
    setIsTyping(true)

    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: "Thanks for your message. An agent will respond shortly. For immediate assistance, you can call our 24/7 support line at +44 (0)20 1234 5678.",
        timestamp: new Date(),
        agentName: 'Support Team'
      }
      setMessages(prev => [...prev, agentMessage])
      setIsTyping(false)
    }, 1500)
  }

  const endChat = () => {
    setSession(null)
    setMessages([])
    setIsOpen(false)
  }

  if (!user) return null

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-deep-teal text-white p-4 rounded-full shadow-lg hover:bg-soft-gold transition-colors z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-deep-teal to-sage text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Customer Support</h3>
              <p className="text-xs opacity-90">24/7 available</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-soft-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="h-96 flex flex-col">
            {!session ? (
              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Hello {user.name}! How can we help you today?
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={startChat}
                  className="w-full bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors"
                >
                  Start Chat
                </button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-deep-teal text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.sender === 'agent' && (
                          <p className="text-xs font-semibold mb-1">{message.agentName}</p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm text-gray-500">Agent is typing...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                  <button
                    onClick={endChat}
                    className="text-xs text-red-600 hover:text-red-800 mt-2"
                  >
                    End Chat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
