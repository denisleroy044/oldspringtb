export interface ChatMessage {
  id: string
  userId: string
  sender: 'user' | 'agent' | 'system'
  senderName: string
  message: string
  timestamp: string
  read: boolean
  attachments?: {
    name: string
    url: string
    type: string
  }[]
}

export interface ChatSession {
  id: string
  userId: string
  userName: string
  status: 'active' | 'resolved' | 'closed'
  department: 'general' | 'technical' | 'billing' | 'security'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subject: string
  messages: ChatMessage[]
  assignedTo?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  rating?: number
  feedback?: string
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  category: 'account' | 'transaction' | 'card' | 'technical' | 'other'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  description: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}
