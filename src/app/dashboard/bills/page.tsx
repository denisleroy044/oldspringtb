'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Bill {
  id: string
  company: string
  accountNumber: string
  amount: number
  dueDate: string
  category: string
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'SCHEDULED'
  autoPay: boolean
}

// Mock function to simulate OTP request
const requestOTP = async (email: string, purpose: string, name?: string) => {
  console.log(`Requesting OTP for ${email} for ${purpose}`)
  // Simulate API call
  return { requestId: 'mock-request-id' }
}

export default function BillsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BillsContent />
        </div>
      </main>
      <Footer />
    </>
  )
}

function BillsContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [showPayModal, setShowPayModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [otp, setOtp] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('account')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockBills: Bill[] = [
      {
        id: '1',
        company: 'Electric Company',
        accountNumber: '123456789',
        amount: 145.67,
        dueDate: '2024-04-15',
        category: 'Utilities',
        status: 'PENDING',
        autoPay: false
      },
      {
        id: '2',
        company: 'Water Services',
        accountNumber: '987654321',
        amount: 89.50,
        dueDate: '2024-04-20',
        category: 'Utilities',
        status: 'PENDING',
        autoPay: true
      },
      {
        id: '3',
        company: 'Internet Provider',
        accountNumber: '456789123',
        amount: 79.99,
        dueDate: '2024-04-10',
        category: 'Internet',
        status: 'OVERDUE',
        autoPay: false
      },
      {
        id: '4',
        company: 'Credit Card',
        accountNumber: '****1234',
        amount: 450.00,
        dueDate: '2024-04-25',
        category: 'Credit Card',
        status: 'PENDING',
        autoPay: true
      }
    ]

    setTimeout(() => {
      setBills(mockBills)
      setLoading(false)
    }, 1000)
  }, [])

  const handlePayBill = (bill: Bill) => {
    setSelectedBill(bill)
    setShowPayModal(true)
  }

  const handlePaymentSubmit = async () => {
    if (!user?.email) {
      alert('Please log in to continue')
      return
    }

    setIsProcessing(true)
    try {
      const response = await requestOTP(user.email, 'bill payment', user.name || undefined)
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowPayModal(false)
        setShowOtpModal(true)
      }
    } catch (error) {
      console.error('Failed to request OTP:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOtpSubmit = async () => {
    if (!otp || !selectedBill) return

    setIsProcessing(true)
    try {
      // Verify OTP and process payment
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update bill status
      setBills(prev => prev.map(bill => 
        bill.id === selectedBill.id 
          ? { ...bill, status: 'PAID' as const }
          : bill
      ))
      
      setShowOtpModal(false)
      setOtp('')
      setSelectedBill(null)
      
      // Show success message
      alert('Payment processed successfully!')
    } catch (error) {
      console.error('Failed to process payment:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleAutoPay = (billId: string) => {
    setBills(prev => prev.map(bill =>
      bill.id === billId
        ? { ...bill, autoPay: !bill.autoPay }
        : bill
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 bg-green-100'
      case 'OVERDUE':
        return 'text-red-600 bg-red-100'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100'
      case 'SCHEDULED':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const totalDue = bills
    .filter(bill => bill.status !== 'PAID')
    .reduce((sum, bill) => sum + bill.amount, 0)

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your bills</p>
        <Link href="/auth/login" className="mt-4 inline-block bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-soft-gold transition-colors">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-teal">Bills & Payments</h1>
        <p className="text-gray-600 mt-2">Manage and pay your bills securely</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Due</h3>
          <p className="text-3xl font-bold text-deep-teal">${totalDue.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">{bills.filter(b => b.status !== 'PAID').length} bills pending</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Auto-Pay Enabled</h3>
          <p className="text-3xl font-bold text-deep-teal">{bills.filter(b => b.autoPay).length}</p>
          <p className="text-sm text-gray-500 mt-2">Bills on auto-pay</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Next Due Date</h3>
          <p className="text-3xl font-bold text-deep-teal">
            {bills
              .filter(b => b.status !== 'PAID')
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]?.dueDate || 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-2">Closest due date</p>
        </div>
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-deep-teal">Your Bills</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-teal mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bills...</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No bills found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bills.map((bill) => (
              <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-lg font-semibold text-deep-teal">{bill.company}</h3>
                    <p className="text-sm text-gray-500 mt-1">Account: {bill.accountNumber}</p>
                    <p className="text-xs text-gray-400 mt-1">Category: {bill.category}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-deep-teal">${bill.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={bill.autoPay}
                        onChange={() => handleToggleAutoPay(bill.id)}
                        className="rounded border-gray-300 text-soft-gold focus:ring-soft-gold"
                      />
                      Auto-pay
                    </label>

                    {bill.status !== 'PAID' && (
                      <button
                        onClick={() => handlePayBill(bill)}
                        className="bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-soft-gold transition-colors"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pay Bill Modal */}
      {showPayModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">Pay Bill</h2>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-semibold">{selectedBill.company}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-semibold text-2xl text-deep-teal">${selectedBill.amount.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                >
                  <option value="account">Checking Account (****1234)</option>
                  <option value="savings">Savings Account (****5678)</option>
                  <option value="credit">Credit Card (****9012)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPayModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={isProcessing}
                className="flex-1 bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">Verify Payment</h2>
            
            <p className="text-gray-600 mb-6">
              Enter the 6-digit code sent to your email to confirm this payment.
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
                {isProcessing ? 'Verifying...' : 'Verify & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
