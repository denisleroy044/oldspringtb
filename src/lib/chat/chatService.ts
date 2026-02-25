import { ChatSession, ChatMessage, SupportTicket } from '@/types/chat'
import { addUserNotification } from '@/lib/auth/authService'

// Store chat sessions
const chatSessions: Map<string, ChatSession> = new Map()

// Mock agent responses
const agentResponses = [
  "Thank you for contacting Oldspring Trust support. How may I help you today?",
  "I understand your concern. Let me look into that for you.",
  "Could you please provide more details about the issue?",
  "I've checked your account and I'm here to help.",
  "Is there anything else I can assist you with?",
  "Thank you for your patience. I'm working on resolving this.",
  "I've processed your request. You should see the changes shortly.",
  "Is there anything specific you'd like to know about our services?",
  "I'm sorry you're experiencing this issue. Let me help you resolve it.",
  "Great news! I've successfully resolved this for you."
]

// Start a new chat session
export const startChat = (
  userId: string,
  userName: string,
  department: 'general' | 'technical' | 'billing' | 'security' = 'general',
  subject: string = 'Support Request',
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
): ChatSession => {
  const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const welcomeMessage: ChatMessage = {
    id: `msg_${Date.now()}_1`,
    userId,
    sender: 'system',
    senderName: 'System',
    message: 'Welcome to Oldspring Trust Support. An agent will be with you shortly.',
    timestamp: new Date().toISOString(),
    read: false
  }

  const session: ChatSession = {
    id: sessionId,
    userId,
    userName,
    status: 'active',
    department,
    priority,
    subject,
    messages: [welcomeMessage],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  chatSessions.set(sessionId, session)

  // Simulate agent joining after a delay
  setTimeout(() => {
    simulateAgentResponse(sessionId)
  }, 5000)

  return session
}

// Send a message
export const sendMessage = (
  sessionId: string,
  userId: string,
  message: string
): ChatMessage => {
  const session = chatSessions.get(sessionId)
  if (!session) throw new Error('Chat session not found')

  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    sender: 'user',
    senderName: session.userName,
    message,
    timestamp: new Date().toISOString(),
    read: false
  }

  session.messages.push(newMessage)
  session.updatedAt = new Date().toISOString()
  chatSessions.set(sessionId, session)

  // Simulate agent response
  setTimeout(() => {
    simulateAgentResponse(sessionId)
  }, 3000)

  return newMessage
}

// Simulate agent response
const simulateAgentResponse = (sessionId: string) => {
  const session = chatSessions.get(sessionId)
  if (!session || session.status !== 'active') return

  const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)]
  
  const agentMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: session.userId,
    sender: 'agent',
    senderName: 'Support Agent',
    message: randomResponse,
    timestamp: new Date().toISOString(),
    read: false
  }

  session.messages.push(agentMessage)
  session.updatedAt = new Date().toISOString()
  chatSessions.set(sessionId, session)

  // Send notification to user
  addUserNotification(session.userId, {
    title: '💬 New Message from Support',
    message: randomResponse.substring(0, 50) + '...',
    type: 'info'
  })
}

// Get chat session
export const getChatSession = (sessionId: string): ChatSession | undefined => {
  return chatSessions.get(sessionId)
}

// Get user's active chat
export const getUserActiveChat = (userId: string): ChatSession | undefined => {
  const sessions = Array.from(chatSessions.values())
  return sessions.find(s => s.userId === userId && s.status === 'active')
}

// End chat session
export const endChat = (sessionId: string, userId: string): boolean => {
  const session = chatSessions.get(sessionId)
  if (!session || session.userId !== userId) return false

  session.status = 'resolved'
  session.updatedAt = new Date().toISOString()
  session.resolvedAt = new Date().toISOString()
  chatSessions.set(sessionId, session)

  const closingMessage: ChatMessage = {
    id: `msg_${Date.now()}`,
    userId,
    sender: 'system',
    senderName: 'System',
    message: 'This chat session has ended. Thank you for contacting Oldspring Trust.',
    timestamp: new Date().toISOString(),
    read: false
  }

  session.messages.push(closingMessage)
  chatSessions.set(sessionId, session)

  return true
}

// Rate chat
export const rateChat = (sessionId: string, rating: number, feedback?: string): boolean => {
  const session = chatSessions.get(sessionId)
  if (!session) return false

  session.rating = rating
  session.feedback = feedback
  chatSessions.set(sessionId, session)

  return true
}

// Create support ticket
export const createTicket = (
  userId: string,
  subject: string,
  category: 'account' | 'transaction' | 'card' | 'technical' | 'other',
  description: string,
  attachments?: string[]
): SupportTicket => {
  const ticket: SupportTicket = {
    id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    subject,
    category,
    status: 'open',
    priority: 'medium',
    description,
    attachments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // In production, save to database
  console.log('Ticket created:', ticket)

  addUserNotification(userId, {
    title: '🎫 Support Ticket Created',
    message: `Your ticket #${ticket.id} has been created. We'll respond within 24 hours.`,
    type: 'info'
  })

  return ticket
}
