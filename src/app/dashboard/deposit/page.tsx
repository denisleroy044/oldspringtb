'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpUtils'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

function DepositContent() {
  const { user, updateUserBalance } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('bank')
  const [showOTP, setShowOTP] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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

    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  if (!authUser) {
    return null
  }

  const depositMethods = [
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'From your external bank account' },
    { id: 'card', name: 'Debit/Credit Card', icon: '💳', description: 'Instant deposit with card' },
    { id: 'wire', name: 'Wire Transfer', icon: '🌐', description: 'International wire transfer' },
  ]

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    setIsProcessing(true)
    
    const response = await requestOTP(user?.phone || '1234567890', 'deposit')
    if (response.success && response.requestId) {
      setOtpRequestId(response.requestId)
      setShowOTP(true)
    }
    
    setIsProcessing(false)
  }

  const handleOTPVerify = async (code: string): Promise<boolean> => {
    if (code === 'RESEND') {
      const response = await requestOTP(user?.phone || '1234567890', 'deposit')
      if (response.requestId) {
        setOtpRequestId(response.requestId)
      }
      return true
    }

    const isValid = await verifyOTP(otpRequestId, code)
    
    if (isValid) {
      const depositAmount = parseFloat(amount)
      const newBalance = (user?.balance || 0) + depositAmount
      updateUserBalance(newBalance)
      setSuccess(true)
      
      setTimeout(() => {
        setSuccess(false)
        setAmount('')
      }, 3000)
    }
    
    return isValid
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
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
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">Deposit Funds</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Add money to your account securely</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-in">
              <div className="flex items-center">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm lg:text-base font-semibold text-green-800">Deposit Successful!</p>
                  <p className="text-xs lg:text-sm text-green-600">${amount} has been added to your account</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Deposit Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6">
                {/* Current Balance */}
                <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-gradient-to-r from-[#1e3a5f] to-[#2b4c7a] rounded-lg lg:rounded-xl text-white">
                  <p className="text-xs lg:text-sm opacity-90">Current Balance</p>
                  <p className="text-xl lg:text-2xl font-bold">${user?.balance.toLocaleString()}</p>
                </div>

                {/* Deposit Methods */}
                <div className="mb-4 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                    Select Deposit Method
                  </label>
                  <div className="grid grid-cols-3 gap-2 lg:gap-3">
                    {depositMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-2 lg:p-3 border-2 rounded-lg lg:rounded-xl text-center transition ${
                          selectedMethod === method.id
                            ? 'border-[#1e3a5f] bg-[#1e3a5f] bg-opacity-5'
                            : 'border-gray-200 hover:border-[#1e3a5f] hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl lg:text-2xl mb-1 block">{method.icon}</span>
                        <p className="text-xs font-medium hidden lg:block">{method.name}</p>
                        <p className="text-xs font-medium lg:hidden">{method.name.split(' ')[0]}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-4 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                    Deposit Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 lg:left-4 top-2 lg:top-3 text-lg lg:text-2xl text-gray-500">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      className="w-full pl-8 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 text-lg lg:text-2xl border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                    />
                  </div>
                </div>

                {/* Quick Amounts */}
                <div className="mb-4 lg:mb-6">
                  <p className="text-xs text-gray-600 mb-2">Quick amounts</p>
                  <div className="flex flex-wrap gap-2">
                    {[100, 500, 1000, 5000].map((quickAmount) => (
                      <button
                        key={quickAmount}
                        onClick={() => setAmount(quickAmount.toString())}
                        className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm border-2 border-gray-200 rounded-lg hover:border-[#1e3a5f] hover:bg-gray-50 transition"
                      >
                        ${quickAmount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deposit Button */}
                <button
                  onClick={handleDeposit}
                  disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                  className="w-full bg-[#1e3a5f] text-white py-3 lg:py-4 px-4 lg:px-6 rounded-lg lg:rounded-xl text-sm lg:text-base font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 lg:h-5 lg:w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Continue to Deposit'
                  )}
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6">
                <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-3 lg:mb-4">Deposit Information</h3>
                
                <div className="space-y-3 lg:space-y-4">
                  <div className="p-2 lg:p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs lg:text-sm font-medium text-blue-800 mb-1">Processing Time</p>
                    <p className="text-xs text-blue-600">Bank transfer: 1-2 business days</p>
                    <p className="text-xs text-blue-600">Card: Instant</p>
                    <p className="text-xs text-blue-600">Wire: 2-3 business days</p>
                  </div>

                  <div className="p-2 lg:p-3 bg-green-50 rounded-lg">
                    <p className="text-xs lg:text-sm font-medium text-green-800 mb-1">Limits</p>
                    <p className="text-xs text-green-600">Minimum: $1.00</p>
                    <p className="text-xs text-green-600">Maximum: $50,000 per day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <DashboardFooter />
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerify={handleOTPVerify}
        phoneNumber={user?.phone || '****'}
        purpose="deposit verification"
      />
    </div>
  )
}

export default function DepositPage() {
  return (
    <DashboardProvider>
      <DepositContent />
    </DashboardProvider>
  )
}
