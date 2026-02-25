'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { useState, useEffect } from 'react'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpUtils'
import { useAuth } from '@/context/AuthContext'

interface TransferDetails {
  accountNumber: string
  accountName: string
  bankName: string
  amount: string
  swiftCode: string
  routingNumber: string
  description: string
  transferType: 'internal' | 'external' | 'international'
}

function TransferContent() {
  const { user, updateUserBalance } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [step, setStep] = useState(1)
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({
    accountNumber: '',
    accountName: '',
    bankName: '',
    amount: '',
    swiftCode: '',
    routingNumber: '',
    description: '',
    transferType: 'internal'
  })
  const [showOTP, setShowOTP] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
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

  const transferTypes = [
    { id: 'internal', name: 'Internal Transfer', description: 'Between Oldspring accounts', icon: '🏦' },
    { id: 'external', name: 'External Transfer', description: 'To other US banks', icon: '🏛️' },
    { id: 'international', name: 'International', description: 'Worldwide transfer', icon: '🌍' },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTransferDetails(prev => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!transferDetails.accountNumber || transferDetails.accountNumber.length < 10) {
      setError('Please enter a valid account number')
      return false
    }
    if (!transferDetails.accountName) {
      setError('Please enter the account name')
      return false
    }
    if (transferDetails.transferType !== 'internal' && !transferDetails.bankName) {
      setError('Please enter the bank name')
      return false
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    const amount = parseFloat(transferDetails.amount)
    if (!transferDetails.amount || amount <= 0) {
      setError('Please enter a valid amount')
      return false
    }
    if (amount > (user?.balance || 0)) {
      setError('Insufficient funds')
      return false
    }
    if (transferDetails.transferType === 'international' && !transferDetails.swiftCode) {
      setError('SWIFT code is required for international transfers')
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setError('')
  }

  const handleTransfer = async () => {
    setIsProcessing(true)
    
    const response = await requestOTP(user?.accountNumber || '1234567890', 'transfer')
    if (response.success && response.requestId) {
      setOtpRequestId(response.requestId)
      setShowOTP(true)
    }
    
    setIsProcessing(false)
  }

  const handleOTPVerify = async (code: string): Promise<boolean> => {
    if (code === 'RESEND') {
      const response = await requestOTP(user?.accountNumber || '1234567890', 'transfer')
      if (response.requestId) {
        setOtpRequestId(response.requestId)
      }
      return true
    }

    const isValid = await verifyOTP(otpRequestId, code)
    
    if (isValid) {
      const amount = parseFloat(transferDetails.amount)
      const newBalance = (user?.balance || 0) - amount
      updateUserBalance(newBalance)
      setSuccess(true)
      
      setTimeout(() => {
        setSuccess(false)
        setStep(1)
        setTransferDetails({
          accountNumber: '',
          accountName: '',
          bankName: '',
          amount: '',
          swiftCode: '',
          routingNumber: '',
          description: '',
          transferType: 'internal'
        })
      }, 3000)
    }
    
    return isValid
  }

  const getFee = () => {
    const amount = parseFloat(transferDetails.amount) || 0
    switch (transferDetails.transferType) {
      case 'internal': return 0
      case 'external': return amount * 0.01
      case 'international': return amount * 0.03 + 25
      default: return 0
    }
  }

  const getTotal = () => {
    const amount = parseFloat(transferDetails.amount) || 0
    return amount + getFee()
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
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">Transfer Funds</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Send money securely with OTP verification</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-in">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-800">Transfer Successful!</p>
                  <p className="text-sm text-green-600">${transferDetails.amount} sent to {transferDetails.accountName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rest of your transfer form JSX */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-6 lg:mb-8">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-sm lg:text-base ${
                        s <= step ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {s < step ? (
                          <svg className="w-3 h-3 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          s
                        )}
                      </div>
                      {s < 3 && (
                        <div className={`flex-1 h-0.5 lg:h-1 mx-1 lg:mx-2 ${
                          s < step ? 'bg-[#1e3a5f]' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs lg:text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Step 1: Recipient Details */}
                {step === 1 && (
                  <div className="space-y-3 lg:space-y-4">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Recipient Details</h2>

                    {/* Transfer Type */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                        Transfer Type
                      </label>
                      <div className="grid grid-cols-3 gap-2 lg:gap-3">
                        {transferTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setTransferDetails(prev => ({ ...prev, transferType: type.id as any }))}
                            className={`p-2 lg:p-3 border-2 rounded-lg lg:rounded-xl text-center transition ${
                              transferDetails.transferType === type.id
                                ? 'border-[#1e3a5f] bg-[#1e3a5f] bg-opacity-5'
                                : 'border-gray-200 hover:border-[#1e3a5f]'
                            }`}
                          >
                            <span className="text-xl lg:text-2xl mb-1 block">{type.icon}</span>
                            <p className="text-xs font-medium hidden lg:block">{type.name}</p>
                            <p className="text-xs font-medium lg:hidden">{type.name.split(' ')[0]}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={transferDetails.accountNumber}
                        onChange={handleInputChange}
                        placeholder="Enter account number"
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Account Name
                      </label>
                      <input
                        type="text"
                        name="accountName"
                        value={transferDetails.accountName}
                        onChange={handleInputChange}
                        placeholder="Enter account holder name"
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                      />
                    </div>

                    {transferDetails.transferType !== 'internal' && (
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={transferDetails.bankName}
                          onChange={handleInputChange}
                          placeholder="Enter bank name"
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Amount & Details */}
                {step === 2 && (
                  <div className="space-y-3 lg:space-y-4">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Amount & Details</h2>

                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 lg:left-4 top-2 lg:top-3 text-lg lg:text-2xl text-gray-500">$</span>
                        <input
                          type="number"
                          name="amount"
                          value={transferDetails.amount}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          min="1"
                          step="0.01"
                          className="w-full pl-8 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 text-lg lg:text-2xl border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                        />
                      </div>
                    </div>

                    {transferDetails.transferType === 'international' && (
                      <>
                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                            SWIFT Code
                          </label>
                          <input
                            type="text"
                            name="swiftCode"
                            value={transferDetails.swiftCode}
                            onChange={handleInputChange}
                            placeholder="Enter SWIFT code"
                            className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                            Routing Number
                          </label>
                          <input
                            type="text"
                            name="routingNumber"
                            value={transferDetails.routingNumber}
                            onChange={handleInputChange}
                            placeholder="Enter routing number"
                            className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        name="description"
                        value={transferDetails.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Add a note to this transfer"
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Confirm */}
                {step === 3 && (
                  <div className="space-y-3 lg:space-y-4">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Review & Confirm</h2>

                    <div className="bg-gray-50 rounded-lg lg:rounded-xl p-3 lg:p-4 space-y-2 lg:space-y-3">
                      <div className="flex justify-between text-sm lg:text-base">
                        <span className="text-gray-600">From Account</span>
                        <span className="font-semibold">{user?.accountNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm lg:text-base">
                        <span className="text-gray-600">To Account</span>
                        <span className="font-semibold">{transferDetails.accountNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm lg:text-base">
                        <span className="text-gray-600">Account Name</span>
                        <span className="font-semibold">{transferDetails.accountName}</span>
                      </div>
                      {transferDetails.bankName && (
                        <div className="flex justify-between text-sm lg:text-base">
                          <span className="text-gray-600">Bank</span>
                          <span className="font-semibold">{transferDetails.bankName}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 my-2 pt-2">
                        <div className="flex justify-between text-base lg:text-lg">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-bold text-[#1e3a5f]">${parseFloat(transferDetails.amount).toLocaleString()}</span>
                        </div>
                        {getFee() > 0 && (
                          <div className="flex justify-between text-xs lg:text-sm mt-1">
                            <span className="text-gray-500">Transfer Fee</span>
                            <span className="text-gray-700">${getFee().toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                          <span className="text-gray-700">Total Debit</span>
                          <span className="text-[#1e3a5f]">${getTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {transferDetails.description && (
                      <div className="p-2 lg:p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs lg:text-sm text-gray-600">Note: {transferDetails.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4 lg:mt-6">
                  {step > 1 && (
                    <button
                      onClick={handleBack}
                      className="px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base border-2 border-gray-300 rounded-lg lg:rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                  )}
                  <div className="flex-1" />
                  {step < 3 ? (
                    <button
                      onClick={handleNext}
                      className="px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base bg-[#1e3a5f] text-white rounded-lg lg:rounded-xl font-semibold hover:bg-[#2b4c7a] transition"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleTransfer}
                      disabled={isProcessing}
                      className="px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base bg-[#1e3a5f] text-white rounded-lg lg:rounded-xl font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 lg:h-5 lg:w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Confirm Transfer'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6">
                <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-3 lg:mb-4">Transfer Information</h3>
                
                <div className="space-y-3 lg:space-y-4">
                  <div className="p-2 lg:p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs lg:text-sm font-medium text-blue-800 mb-1">Available Balance</p>
                    <p className="text-lg lg:text-2xl font-bold text-[#1e3a5f]">
                      ${user?.balance.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-2 lg:p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs lg:text-sm font-medium text-yellow-800 mb-1">Transfer Times</p>
                    <p className="text-xs text-yellow-600">Internal: Instant</p>
                    <p className="text-xs text-yellow-600">External: 1-2 business days</p>
                    <p className="text-xs text-yellow-600">International: 3-5 business days</p>
                  </div>

                  <div className="p-2 lg:p-3 bg-green-50 rounded-lg">
                    <p className="text-xs lg:text-sm font-medium text-green-800 mb-1">Security</p>
                    <p className="text-xs text-green-600">✓ OTP verification required</p>
                    <p className="text-xs text-green-600">✓ 256-bit encryption</p>
                    <p className="text-xs text-green-600">✓ Fraud monitoring</p>
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
        purpose="transfer authorization"
      />
    </div>
  )
}

export default function TransferPage() {
  return (
    <DashboardProvider>
      <TransferContent />
    </DashboardProvider>
  )
}
