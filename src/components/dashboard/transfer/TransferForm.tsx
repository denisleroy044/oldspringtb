'use client'

import { useState } from 'react'
import { useDashboardContext } from '@/context/DashboardContext'
import { useTransferContext } from '@/context/TransferContext'
import { useRouter } from 'next/navigation'

export function TransferForm() {
  const router = useRouter()
  const { user } = useDashboardContext()
  const { createNewTransfer, checkPendingTransfer } = useTransferContext()
  
  const [formData, setFormData] = useState({
    recipientAccountNumber: '',
    recipientAccountName: '',
    amount: '',
    bankName: '',
    swiftCode: '',
    routingNumber: '',
    description: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Check for pending transfer
    const pendingTransfer = checkPendingTransfer(user.personalAccount.number)
    
    if (pendingTransfer) {
      router.push(`/dashboard/transfer?continue=${pendingTransfer.id}`)
      return
    }

    // Validate amount
    const amount = parseFloat(formData.amount)
    if (amount > user.personalAccount.balance) {
      setError('Insufficient funds')
      setIsSubmitting(false)
      return
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0')
      setIsSubmitting(false)
      return
    }

    // Create new transfer
    const transferId = createNewTransfer(user.personalAccount.number, {
      ...formData,
      amount: amount
    })

    // Redirect to transfer progress page
    router.push(`/dashboard/transfer/progress?id=${transferId}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Transfer Funds</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Available Balance</p>
        <p className="text-2xl font-bold text-[#1e3a5f]">
          ${user.personalAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Account Number *
            </label>
            <input
              type="text"
              name="recipientAccountNumber"
              value={formData.recipientAccountNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Account Name *
            </label>
            <input
              type="text"
              name="recipientAccountName"
              value={formData.recipientAccountName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter account name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0.01"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name *
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter bank name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Swift Code *
            </label>
            <input
              type="text"
              name="swiftCode"
              value={formData.swiftCode}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter SWIFT code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Routing Number *
            </label>
            <input
              type="text"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter routing number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="Enter transfer description"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1e3a5f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Continue Transfer'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our terms and conditions
        </p>
      </form>
    </div>
  )
}
