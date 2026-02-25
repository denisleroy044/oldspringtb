'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpService'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

interface Bill {
  id: string
  company: string
  accountNumber: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue' | 'scheduled'
  category: string
  autoPay: boolean
}

export default function BillsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [showPayModal, setShowPayModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Mock accounts (in production, fetch from user accounts)
  const accounts = [
    { id: '1', name: 'Primary Checking', balance: 5280.42 },
    { id: '2', name: 'High-Yield Savings', balance: 12750.89 }
  ]

  // Mock bills data
  useEffect(() => {
    const mockBills: Bill[] = [
      {
        id: '1',
        company: 'Electric Company',
        accountNumber: '**** 1234',
        amount: 145.67,
        dueDate: '2024-04-15',
        status: 'pending',
        category: 'Utilities',
        autoPay: false
      },
      {
        id: '2',
        company: 'Water Works',
        accountNumber: '**** 5678',
        amount: 89.50,
        dueDate: '2024-04-20',
        status: 'pending',
        category: 'Utilities',
        autoPay: true
      },
      {
        id: '3',
        company: 'Internet Provider',
        accountNumber: '**** 9012',
        amount: 79.99,
        dueDate: '2024-04-10',
        status: 'overdue',
        category: 'Internet',
        autoPay: false
      },
      {
        id: '4',
        company: 'Credit Card',
        accountNumber: '**** 3456',
        amount: 450.00,
        dueDate: '2024-04-05',
        status: 'paid',
        category: 'Credit Card',
        autoPay: true
      }
    ]
    setBills(mockBills)
    setLoading(false)
  }, [])

  const handlePayBill = (bill: Bill) => {
    setSelectedBill(bill)
    setPaymentAmount(bill.amount.toString())
    setShowPayModal(true)
  }

  const handleSchedulePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBill || !selectedAccount || !paymentAmount) return

    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' })
      return
    }

    const selectedAcct = accounts.find(a => a.id === selectedAccount)
    if (!selectedAcct) return

    if (amount > selectedAcct.balance) {
      setMessage({ type: 'error', text: 'Insufficient funds' })
      return
    }

    try {
      const response = await requestOTP(user?.email || '', 'bill payment', user?.name)
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowOtpModal(true)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to request OTP' })
    }
  }

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    if (!otpRequestId || !selectedBill || !selectedAccount || !user) return false

    try {
      const isValid = await verifyOTP(otpRequestId, code)
      if (isValid) {
        // Process payment
        setMessage({ 
          type: 'success', 
          text: scheduleDate 
            ? `Payment scheduled for ${new Date(scheduleDate).toLocaleDateString()}` 
            : 'Payment completed successfully' 
        })
        
        // Update bill status
        setBills(prev => prev.map(b => 
          b.id === selectedBill.id 
            ? { ...b, status: scheduleDate ? 'scheduled' : 'paid' } 
            : b
        ))
        
        setShowPayModal(false)
        setShowOtpModal(false)
        setOtpRequestId(null)
        setSelectedBill(null)
        setPaymentAmount('')
        setSelectedAccount('')
        setScheduleDate('')
        return true
      } else {
        setMessage({ type: 'error', text: 'Invalid OTP code' })
        return false
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Verification failed' })
      return false
    }
  }

  const filteredBills = filterStatus === 'all' 
    ? bills 
    : bills.filter(bill => bill.status === filterStatus)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bills...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <ScrollAnimation animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-deep-teal mb-2">Bill Pay</h1>
              <p className="text-gray-600">Manage and pay your bills securely</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            {/* Filters */}
            <div className="mb-6 flex gap-3">
              {['all', 'pending', 'paid', 'overdue', 'scheduled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-deep-teal text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Bills List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBills.length > 0 ? (
                      filteredBills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-gray-900">{bill.company}</p>
                              {bill.autoPay && (
                                <span className="text-xs text-soft-gold">AutoPay enabled</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {bill.accountNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            {formatCurrency(bill.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(bill.dueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bill.status)}`}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {bill.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {bill.status !== 'paid' && bill.status !== 'scheduled' && (
                              <button
                                onClick={() => handlePayBill(bill)}
                                className="text-deep-teal hover:text-soft-gold transition-colors font-medium"
                              >
                                {bill.status === 'overdue' ? 'Pay Now' : 'Pay Bill'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          No bills found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollAnimation>
        </main>
        <DashboardFooter />
      </div>

      {/* Pay Bill Modal */}
      {showPayModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-deep-teal mb-4">Pay Bill</h3>
            
            <form onSubmit={handleSchedulePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={selectedBill.company}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} - {formatCurrency(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (Optional)</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for immediate payment</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPayModal(false)
                    setSelectedBill(null)
                    setPaymentAmount('')
                    setSelectedAccount('')
                    setScheduleDate('')
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Modal - Using standardized props */}
      <OTPModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false)
          setOtpRequestId(null)
        }}
        onVerify={handleOtpVerify}
        email={user?.email}
      />
    </div>
  )
}
