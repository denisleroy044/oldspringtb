'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface DepositForm {
  accountId: string
  amount: string
  depositType: 'check' | 'cash' | 'transfer'
  checkNumber?: string
  checkFront?: File
  checkBack?: File
}

// Mock function to simulate OTP request
const requestOTP = async (email: string, purpose: string, name?: string) => {
  console.log(`Requesting OTP for ${email} for ${purpose} ${name ? `with name ${name}` : ''}`)
  return { requestId: 'mock-request-id' }
}

export default function DepositPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DepositContent />
        </div>
      </main>
      <Footer />
    </>
  )
}

function DepositContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpRequestId, setOtpRequestId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<DepositForm>({
    accountId: '',
    amount: '',
    depositType: 'check',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'checkFront' | 'checkBack') => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [field]: e.target.files[0]
      })
    }
  }

  const handleDeposit = async () => {
    if (!user?.email) {
      alert('Please log in to continue')
      return
    }

    if (!formData.accountId || !formData.amount) {
      alert('Please fill in all required fields')
      return
    }

    if (formData.depositType === 'check' && (!formData.checkNumber || !formData.checkFront || !formData.checkBack)) {
      alert('Please provide check number and images of both sides of the check')
      return
    }

    setIsProcessing(true)
    try {
      // Request OTP for verification
      const response = await requestOTP(
        user.email, 
        'deposit', 
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
      // Verify OTP and process deposit
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setShowOtpModal(false)
      setOtp('')
      
      // Reset form
      setFormData({
        accountId: '',
        amount: '',
        depositType: 'check',
      })
      
      alert('Deposit submitted successfully! It will be processed within 1-2 business days.')
    } catch (error) {
      console.error('Failed to process deposit:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to make a deposit</p>
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
        <h1 className="text-3xl font-bold text-deep-teal">Make a Deposit</h1>
        <p className="text-gray-600 mt-2">Deposit funds into your accounts securely</p>
      </div>

      {/* Deposit Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="depositType"
                value="check"
                checked={formData.depositType === 'check'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Check Deposit
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="depositType"
                value="cash"
                checked={formData.depositType === 'cash'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Cash Deposit
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="depositType"
                value="transfer"
                checked={formData.depositType === 'transfer'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Transfer from External
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit To
            </label>
            <select
              name="accountId"
              value={formData.accountId}
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

          {formData.depositType === 'check' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check Number
                </label>
                <input
                  type="text"
                  name="checkNumber"
                  value={formData.checkNumber || ''}
                  onChange={handleInputChange}
                  placeholder="Enter check number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check Front Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'checkFront')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a clear image of the front of your check
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check Back Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'checkBack')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a clear image of the back of your check (must be endorsed)
                </p>
              </div>
            </>
          )}

          {formData.depositType === 'cash' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Cash deposits can be made at any Oldspring Trust branch or ATM. Please visit a branch for cash deposits over $10,000.
              </p>
            </div>
          )}

          {formData.depositType === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External Account Number
              </label>
              <input
                type="text"
                name="externalAccount"
                placeholder="Enter external account number"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                External transfers may take 3-5 business days to complete
              </p>
            </div>
          )}

          <button
            onClick={handleDeposit}
            disabled={isProcessing}
            className="w-full bg-deep-teal text-white py-3 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Continue Deposit'}
          </button>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">Verify Deposit</h2>
            
            <p className="text-gray-600 mb-6">
              Enter the 6-digit code sent to your email to confirm this deposit.
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
