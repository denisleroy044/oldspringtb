'use client'

import { useState, useEffect } from 'react'
import {
  CreditCard,
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
  Ban,
  Plus,
  Save,
  X,
  Truck
} from 'lucide-react'

interface CardRequest {
  id: string
  userId: string
  userEmail: string
  userName: string
  cardType: 'visa' | 'mastercard' | 'amex'
  cardNumber?: string
  cardHolderName?: string
  expiryMonth?: number
  expiryYear?: number
  cvv?: string
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'blocked'
  requestReason?: string
  adminNotes?: string
  deliveryAddress?: string
  createdAt: string
}

export default function CardsPage() {
  const [cards, setCards] = useState<CardRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/admin/cards')
      const data = await response.json()
      setCards(data.cards || [])
    } catch (err) {
      setError('Failed to fetch cards')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (cardId: string) => {
    try {
      await fetch('/api/admin/cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, action: 'approve' })
      })
      fetchCards()
    } catch (err) {
      console.error('Error approving card:', err)
    }
  }

  const handleReject = async (cardId: string) => {
    try {
      await fetch('/api/admin/cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, action: 'reject' })
      })
      fetchCards()
    } catch (err) {
      console.error('Error rejecting card:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      blocked: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const filteredCards = cards.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false
    if (search) {
      return c.userName?.toLowerCase().includes(search.toLowerCase()) ||
             c.userEmail?.toLowerCase().includes(search.toLowerCase())
    }
    return true
  })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Card Management</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={fetchCards}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No cards found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{card.userName}</h3>
                    <span className="text-sm text-gray-500">{card.userEmail}</span>
                    {getStatusBadge(card.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Type: {card.cardType}</p>
                  {card.cardNumber && (
                    <p className="font-mono text-sm">**** **** **** {card.cardNumber.slice(-4)}</p>
                  )}
                </div>
                {card.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(card.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(card.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
