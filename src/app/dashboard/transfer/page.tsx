'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface TransferForm {
  fromAccount: string
  toAccount: string
  amount: string
  description: string
  transferType: 'internal' | 'external'
}

// Mock function to simulate OTP request
const requestOTP = async (email: string, purpose: string, name?: string) => {
  console.log(`Requesting OTP for ${email} for ${purpose} ${name ? `with name ${name}` : ''}`)
  return { requestId: 'mock-request-id' }
}

export default function TransferPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TransferContent />
        </div>
      </main>
      <Footer />
    </>
  )
}

function TransferContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpRequestId, setOtpRequestId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<TransferForm>({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transferType: 'internal'
  })

  useEffect(() => {
    // Mock accounts data
    const mockAccounts = [
      { id: '1', name: 'Checking Account', balance: 5280.42, accountNumber: '****1234' },
      { id: '2', name: 'Savings Account', balance: 12750.89, accountNumber: '****5678' },
    ]

    setTimeout(() => {
      setAccounts(mockAccounts)
      setLoading(false)
    }, 1000)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTransfer = async () => {
    if (!user?.email) {
      alert('Please log in to continue')
      return
    }

    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    try {
      const response = await requestOTP(
        user.email, 
        'money transfer', 
        user.name || undefined
      )
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowOtpModal(true)
      }
    } catch (error) {
      console.error('Failed to request OTP:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOtpSubmit = async () => {
    if (!otp) return

    setIsProcessing(true)
    try {
      // Verify OTP and process transfer
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setShowOtpModal(false)
      setOtp('')
      
      // Reset form
      setFormData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
        transferType: 'internal'
      })
      
      alert('Transfer completed successfully!')
    } catch (error) {
      console.error('Failed to process transfer:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to make transfers</p>
        <Link href="/auth/login" className="mt-4 inline-block bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-soft-gold transition-colors">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-teal">Transfer Money</h1>
        <p className="text-gray-600 mt-2">Transfer funds between your accounts or to others</p>
      </div>

      {/* Transfer Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transfer Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="transferType"
                value="internal"
                checked={formData.transferType === 'internal'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Between My Accounts
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="transferType"
                value="external"
                checked={formData.transferType === 'external'}
                onChange={handleInputChange}
                className="mr-2"
              />
              To Someone Else
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Account
            </label>
            <select
              name="fromAccount"
              value={formData.fromAccount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            >
              <option value="">Select account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - ${account.balance.toFixed(2)} ({account.accountNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Account
            </label>
            {formData.transferType === 'internal' ? (
              <select
                name="toAccount"
                value={formData.toAccount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              >
                <option value="">Select account</option>
                {accounts
                  .filter(a => a.id !== formData.fromAccount)
                  .map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name} - ${account.balance.toFixed(2)} ({account.accountNumber})
                    </option>
                  ))}
              </select>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  name="toAccount"
                  placeholder="Account Number"
                  value={formData.toAccount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
                <input
                  type="text"
                  name="routingNumber"
                  placeholder="Routing Number (optional)"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
                <input
                  type="text"
                  name="beneficiaryName"
                  placeholder="Beneficiary Name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
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
              placeholder="Add a note or description"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>

          <button
            onClick={handleTransfer}
            disabled={isProcessing}
            className="w-full bg-deep-teal text-white py-3 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Continue to Transfer'}
          </button>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">Verify Transfer</h2>
            
            <p className="text-gray-600 mb-6">
              Enter the 6-digit code sent to your email to confirm this transfer.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOtpModal(false)
                  setOtp('')
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6 || isProcessing}
                className="flex-1 bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
