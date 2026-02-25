'use client'

import { useState } from 'react'
import { accountProducts } from '@/lib/account/products'
import { submitAccountRequest } from '@/lib/account/accountRequestService'
import { OTPModal } from './otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpUtils'

interface OpenAccountModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  userEmail: string
  userPhone: string
}

export function OpenAccountModal({ isOpen, onClose, userId, userName, userEmail, userPhone }: OpenAccountModalProps) {
  const [step, setStep] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [accountName, setAccountName] = useState('')
  const [initialDeposit, setInitialDeposit] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const product = selectedProduct ? accountProducts.find(p => p.id === selectedProduct) : null

  const handleContinue = () => {
    if (step === 1 && selectedProduct) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setError('')
  }

  const handleClose = () => {
    setStep(1)
    setSelectedProduct(null)
    setAccountName('')
    setInitialDeposit('')
    setError('')
    onClose()
  }

  const handleSubmit = async () => {
    if (!selectedProduct || !product) return

    const amount = parseFloat(initialDeposit)
    if (amount < product.minimumDeposit) {
      setError(`Minimum deposit is $${product.minimumDeposit}`)
      return
    }

    setIsSubmitting(true)
    setError('')

    // Request OTP
    const otpResponse = await requestOTP(userPhone, 'Account Opening Verification')
    if (otpResponse.success && otpResponse.requestId) {
      setOtpRequestId(otpResponse.requestId)
      setShowOTP(true)
    } else {
      setError('Failed to send OTP. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleOTPVerify = async (code: string): Promise<boolean> => {
    if (code === 'RESEND') {
      const response = await requestOTP(userPhone, 'Account Opening Verification')
      if (response.requestId) {
        setOtpRequestId(response.requestId)
      }
      return true
    }

    const isValid = await verifyOTP(otpRequestId, code)
    
    if (isValid && selectedProduct && product) {
      const amount = parseFloat(initialDeposit)
      const result = submitAccountRequest(
        userId,
        userName,
        userEmail,
        product.type,
        accountName || `${product.name} - ${userName}`,
        amount
      )

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          handleClose()
          setSuccess(false)
        }, 3000)
      } else {
        setError(result.message || 'Failed to submit request')
      }
    }
    
    setIsSubmitting(false)
    return isValid
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
          <p className="text-gray-600 mb-6">
            Your account request has been submitted for review. You'll hear back within 1-2 business days.
          </p>
          <button
            onClick={handleClose}
            className="w-full px-4 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2b4c7a] transition"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">Open New Account</h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    s <= step ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      s < step ? 'bg-[#1e3a5f]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 mb-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Choose Account Type */}
          {step === 1 && (
            <div className="px-6 pb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Select Account Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accountProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                      selectedProduct === product.id
                        ? 'border-[#1e3a5f] bg-[#1e3a5f] bg-opacity-5'
                        : 'border-gray-200 hover:border-[#1e3a5f]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${product.gradient} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {product.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{product.name}</h5>
                        <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {product.interestRate}% APY
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            Min ${product.minimumDeposit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && product && (
            <div className="px-6 pb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Account Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder={`e.g., My ${product.name}`}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Deposit
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(e.target.value)}
                      placeholder="0.00"
                      min={product.minimumDeposit}
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum deposit: ${product.minimumDeposit}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Account Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Account Type:</span>
                      <span className="font-semibold text-blue-900">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Interest Rate:</span>
                      <span className="font-semibold text-blue-900">{product.interestRate}% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Monthly Fee:</span>
                      <span className="font-semibold text-blue-900">${product.monthlyFee}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-200">
                      <span className="text-blue-700">Initial Deposit:</span>
                      <span className="font-semibold text-blue-900">
                        ${parseFloat(initialDeposit || '0').toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && product && (
            <div className="px-6 pb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Review Your Request</h4>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-semibold">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Name:</span>
                  <span className="font-semibold">{accountName || `${product.name} - ${userName}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Initial Deposit:</span>
                  <span className="font-semibold text-[#1e3a5f]">${parseFloat(initialDeposit).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-2">What happens next?</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Your request will be reviewed by our team
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      You'll receive a notification within 1-2 business days
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Once approved, the account will be opened and funds transferred
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Back
                </button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <button
                  onClick={handleContinue}
                  disabled={step === 1 && !selectedProduct}
                  className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2b4c7a] transition disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!initialDeposit || parseFloat(initialDeposit) < (product?.minimumDeposit || 0) || isSubmitting}
                  className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2b4c7a] transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Submit Request'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTP}
        onClose={() => {
          setShowOTP(false)
          setIsSubmitting(false)
        }}
        onVerify={handleOTPVerify}
        phoneNumber={userPhone}
        purpose="Account Opening Verification"
      />
    </>
  )
}
