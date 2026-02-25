'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { ChatWindow } from '@/components/dashboard/chat/ChatWindow'
import { createTicket } from '@/lib/chat/chatService'

function SupportContent() {
  const { user } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'faq'>('chat')
  const [showChat, setShowChat] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'account' as 'account' | 'transaction' | 'card' | 'technical' | 'other',
    description: ''
  })
  const [ticketSuccess, setTicketSuccess] = useState(false)

  if (!authUser || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  const faqs = [
    {
      q: 'How do I reset my password?',
      a: 'Go to Account Settings > Security and click on "Change Password". You\'ll need to verify your identity with an OTP.'
    },
    {
      q: 'What should I do if my card is lost or stolen?',
      a: 'Immediately freeze your card from the Card Management page, then contact support to request a replacement.'
    },
    {
      q: 'How long do transfers take?',
      a: 'Internal transfers are instant. External transfers take 1-2 business days. International transfers take 3-5 business days.'
    },
    {
      q: 'Is my money insured?',
      a: 'Yes, all deposits are FDIC insured up to $250,000 per depositor.'
    },
    {
      q: 'How do I enable two-factor authentication?',
      a: 'Go to Account Settings > Security and click "Enable 2FA". Follow the setup instructions.'
    },
    {
      q: 'What are the daily transfer limits?',
      a: 'Standard accounts have a $10,000 daily limit. Premium accounts have a $25,000 daily limit.'
    }
  ]

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    
    createTicket(
      authUser.id,
      ticketForm.subject,
      ticketForm.category,
      ticketForm.description
    )

    setTicketSuccess(true)
    setTicketForm({ subject: '', category: 'account', description: '' })
    
    setTimeout(() => setTicketSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <main className="flex-1 pt-24 px-6 pb-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">Help & Support</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Get help with your account or issues</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6">
              <nav className="flex space-x-6">
                {[
                  { id: 'chat', name: 'Live Chat', icon: '💬' },
                  { id: 'tickets', name: 'Support Tickets', icon: '🎫' },
                  { id: 'faq', name: 'FAQ', icon: '❓' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-[#1e3a5f] text-[#1e3a5f]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Live Chat Tab */}
              {activeTab === 'chat' && (
                <div>
                  {!showChat ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💬</div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Chat Support</h2>
                      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                        Connect with a support agent in real-time. Our team is available 24/7 to assist you with any issues.
                      </p>
                      <button
                        onClick={() => setShowChat(true)}
                        className="px-8 py-4 bg-[#1e3a5f] text-white rounded-xl font-semibold hover:bg-[#2b4c7a] transition"
                      >
                        Start Live Chat
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <ChatWindow onClose={() => setShowChat(false)} />
                    </div>
                  )}
                </div>
              )}

              {/* Tickets Tab */}
              {activeTab === 'tickets' && (
                <div>
                  {ticketSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-600">Ticket created successfully! We'll respond within 24 hours.</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmitTicket} className="max-w-2xl mx-auto space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Support Ticket</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                        placeholder="Brief description of the issue"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({...ticketForm, category: e.target.value as any})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                      >
                        <option value="account">Account Issue</option>
                        <option value="transaction">Transaction Issue</option>
                        <option value="card">Card Issue</option>
                        <option value="technical">Technical Problem</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                        rows={5}
                        placeholder="Provide detailed information about the issue..."
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-semibold hover:bg-[#2b4c7a] transition"
                    >
                      Submit Ticket
                    </button>
                  </form>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  <div className="grid gap-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#1e3a5f] transition">
                        <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                        <p className="text-gray-600 text-sm">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  )
}

export default function SupportPage() {
  return (
    <DashboardProvider>
      <SupportContent />
    </DashboardProvider>
  )
}
