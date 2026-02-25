'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpUtils'
import { 
  billers, 
  loadScheduledBills, 
  scheduleBill, 
  payBill, 
  cancelBill,
  toggleAutoPay,
  getUpcomingBills,
  getBillHistory
} from '@/lib/bills/billService'

function BillsContent() {
  const { user, updateUserBalance } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'schedule'>('upcoming')
  const [bills, setBills] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [upcoming, setUpcoming] = useState<any[]>([])
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedBill, setSelectedBill] = useState<any>(null)
  const [showOTP, setShowOTP] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    billerId: '',
    accountNumber: '',
    amount: '',
    dueDate: '',
    paymentMethod: 'bank' as 'bank' | 'card',
    autoPay: false,
    reminderDays: 3
  })

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('sidebarChange' as any, handleSidebarChange)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (authUser) {
      loadUserBills()
    }

    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [authUser])

  const loadUserBills = () => {
    if (!authUser) return
    const userBills = loadScheduledBills(authUser.id)
    setBills(userBills)
    setUpcoming(getUpcomingBills(authUser.id))
    setHistory(getBillHistory(authUser.id))
  }

  if (!authUser || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  const handleScheduleBill = () => {
    if (!authUser) return

    const amount = parseFloat(scheduleForm.amount)
    if (amount <= 0) return

    const newBill = scheduleBill(
      authUser.id,
      scheduleForm.billerId,
      scheduleForm.accountNumber,
      amount,
      scheduleForm.dueDate,
      scheduleForm.paymentMethod,
      scheduleForm.autoPay,
      scheduleForm.reminderDays
    )

    setBills([...bills, newBill])
    setUpcoming(getUpcomingBills(authUser.id))
    setShowScheduleModal(false)
    setScheduleForm({
      billerId: '',
      accountNumber: '',
      amount: '',
      dueDate: '',
      paymentMethod: 'bank',
      autoPay: false,
      reminderDays: 3
    })
  }

  const handlePayBill = async () => {
    if (!authUser || !selectedBill) return

    const response = await requestOTP(user.phone, 'bill payment')
    if (response.success && response.requestId) {
      setOtpRequestId(response.requestId)
      setShowOTP(true)
    }
  }

  const handleOTPVerify = async (code: string): Promise<boolean> => {
    if (code === 'RESEND') {
      const response = await requestOTP(user.phone, 'bill payment')
      if (response.requestId) {
        setOtpRequestId(response.requestId)
      }
      return true
    }

    const isValid = await verifyOTP(otpRequestId, code)
    
    if (isValid && selectedBill) {
      const result = payBill(authUser.id, selectedBill.id, user.balance)
      
      if (result.success) {
        updateUserBalance(result.newBalance)
        loadUserBills()
        setShowPayModal(false)
        setSelectedBill(null)
      } else {
        alert(result.message)
      }
    }
    
    setShowOTP(false)
    return isValid
  }

  const handleToggleAutoPay = (bill: any) => {
    if (!authUser) return
    const updated = toggleAutoPay(authUser.id, bill.id)
    if (updated) {
      loadUserBills()
    }
  }

  const handleCancelBill = (billId: string) => {
    if (!authUser) return
    if (confirm('Are you sure you want to cancel this scheduled bill?')) {
      cancelBill(authUser.id, billId)
      loadUserBills()
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'paid': return 'bg-green-100 text-green-700'
      case 'failed': return 'bg-red-100 text-red-700'
      case 'cancelled': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 flex flex-col ${
        !isMobile && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
      }`}>
        <Header />
        <main className="flex-1 pt-20 lg:pt-24 px-4 lg:px-6 pb-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">Bill Pay</h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">Pay bills, schedule payments, and manage auto-pay</p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#2b4c7a] transition flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Schedule New Bill
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Upcoming Bills</p>
              <p className="text-xl font-bold text-[#1e3a5f]">{upcoming.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Total Due</p>
              <p className="text-xl font-bold text-[#1e3a5f]">
                ${upcoming.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Auto-Pay Enabled</p>
              <p className="text-xl font-bold text-[#1e3a5f]">
                {bills.filter((b: any) => b.autoPay).length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Paid This Month</p>
              <p className="text-xl font-bold text-[#1e3a5f]">
                {history.filter((h: any) => {
                  const paidDate = new Date(h.paidAt)
                  const now = new Date()
                  return paidDate.getMonth() === now.getMonth() &&
                         paidDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6">
              <nav className="flex space-x-6">
                {[
                  { id: 'upcoming', name: 'Upcoming Bills', icon: '📅' },
                  { id: 'history', name: 'Payment History', icon: '📜' },
                  { id: 'schedule', name: 'Browse Billers', icon: '🏢' }
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
              {/* Upcoming Bills Tab */}
              {activeTab === 'upcoming' && (
                <div>
                  {upcoming.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">📭</div>
                      <p className="text-gray-500 mb-2">No upcoming bills</p>
                      <p className="text-sm text-gray-400">Schedule your first bill payment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcoming.map((bill) => {
                        const daysUntil = getDaysUntilDue(bill.dueDate)
                        return (
                          <div key={bill.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#1e3a5f] transition">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                                  {bill.billerLogo}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{bill.billerName}</h3>
                                  <p className="text-sm text-gray-500">Account: {bill.accountNumber}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(bill.status)}`}>
                                      {bill.status}
                                    </span>
                                    {bill.autoPay && (
                                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                        Auto-Pay
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-[#1e3a5f]">${bill.amount.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                                <p className={`text-xs ${
                                  daysUntil < 0 ? 'text-red-600' :
                                  daysUntil <= 3 ? 'text-orange-600' :
                                  'text-green-600'
                                }`}>
                                  {daysUntil < 0 ? 'Overdue' : `${daysUntil} days left`}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                              <button
                                onClick={() => handleToggleAutoPay(bill)}
                                className={`px-3 py-1.5 text-xs rounded-lg transition ${
                                  bill.autoPay
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {bill.autoPay ? 'Auto-Pay On' : 'Enable Auto-Pay'}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBill(bill)
                                  setShowPayModal(true)
                                }}
                                disabled={bill.status === 'paid'}
                                className="px-3 py-1.5 bg-[#1e3a5f] text-white text-xs rounded-lg hover:bg-[#2b4c7a] transition disabled:opacity-50"
                              >
                                Pay Now
                              </button>
                              <button
                                onClick={() => handleCancelBill(bill.id)}
                                className="px-3 py-1.5 border-2 border-red-200 text-red-600 text-xs rounded-lg hover:bg-red-50 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  {history.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">📜</div>
                      <p className="text-gray-500 mb-2">No payment history</p>
                      <p className="text-sm text-gray-400">Your paid bills will appear here</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biller</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {history.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-4 py-3 text-sm">{new Date(payment.paidAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3 font-medium">{payment.billerName}</td>
                              <td className="px-4 py-3 text-sm">{payment.accountNumber}</td>
                              <td className="px-4 py-3 text-right font-medium">${payment.amount.toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm capitalize">{payment.paymentMethod}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  Paid
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule/Browse Tab */}
              {activeTab === 'schedule' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {billers.map((biller) => (
                      <div
                        key={biller.id}
                        className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#1e3a5f] transition cursor-pointer"
                        onClick={() => {
                          setScheduleForm({ ...scheduleForm, billerId: biller.id })
                          setShowScheduleModal(true)
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                            {biller.logo}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{biller.name}</h3>
                            <p className="text-xs text-gray-500 capitalize">{biller.category}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{biller.accountNumberPattern}</p>
                        <div className="mt-3 flex space-x-2">
                          {biller.paymentMethods.map(method => (
                            <span key={method} className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
                              {method}
                            </span>
                          ))}
                        </div>
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

      {/* Schedule Bill Modal - Fixed size and scrollable */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Schedule New Bill</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Biller</label>
                  <select
                    value={scheduleForm.billerId}
                    onChange={(e) => setScheduleForm({...scheduleForm, billerId: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                  >
                    <option value="">Choose a biller</option>
                    {billers.map(biller => (
                      <option key={biller.id} value={biller.id}>
                        {biller.name} ({biller.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={scheduleForm.accountNumber}
                    onChange={(e) => setScheduleForm({...scheduleForm, accountNumber: e.target.value})}
                    placeholder="Enter account number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={scheduleForm.amount}
                    onChange={(e) => setScheduleForm({...scheduleForm, amount: e.target.value})}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={scheduleForm.dueDate}
                    onChange={(e) => setScheduleForm({...scheduleForm, dueDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setScheduleForm({...scheduleForm, paymentMethod: 'bank'})}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        scheduleForm.paymentMethod === 'bank'
                          ? 'bg-[#1e3a5f] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Bank Account
                    </button>
                    <button
                      onClick={() => setScheduleForm({...scheduleForm, paymentMethod: 'card'})}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        scheduleForm.paymentMethod === 'card'
                          ? 'bg-[#1e3a5f] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Credit Card
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoPay"
                    checked={scheduleForm.autoPay}
                    onChange={(e) => setScheduleForm({...scheduleForm, autoPay: e.target.checked})}
                    className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                  />
                  <label htmlFor="autoPay" className="text-sm text-gray-700">
                    Enable Auto-Pay (automatic payment on due date)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder {scheduleForm.reminderDays} days before
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={scheduleForm.reminderDays}
                    onChange={(e) => setScheduleForm({...scheduleForm, reminderDays: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 day</span>
                    <span>3 days</span>
                    <span>7 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleBill}
                  disabled={!scheduleForm.billerId || !scheduleForm.accountNumber || !scheduleForm.amount || !scheduleForm.dueDate}
                  className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2b4c7a] disabled:opacity-50"
                >
                  Schedule Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Bill Modal */}
      {showPayModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Payment</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Biller:</span>
                  <span className="font-semibold">{selectedBill.billerName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-[#1e3a5f]">${selectedBill.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Account:</span>
                  <span className="font-mono">{selectedBill.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Balance:</span>
                  <span className="font-semibold">${user.balance.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                You will receive an OTP to complete this transaction.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowPayModal(false)
                    setSelectedBill(null)
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayBill}
                  className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2b4c7a]"
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerify={handleOTPVerify}
        phoneNumber={user.phone}
        purpose="bill payment"
      />
    </div>
  )
}

export default function BillsPage() {
  return (
    <DashboardProvider>
      <BillsContent />
    </DashboardProvider>
  )
}
