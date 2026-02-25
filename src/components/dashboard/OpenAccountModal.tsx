'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { requestOTP, verifyOTP } from '@/lib/otp/otpService'
import { OTPModal } from './otp/OTPModal'

interface OpenAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function OpenAccountModal({ isOpen, onClose, onSuccess }: OpenAccountModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<'checking' | 'savings' | 'credit'>('checking')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [ssn, setSsn] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [employmentStatus, setEmploymentStatus] = useState('employed')
  const [annualIncome, setAnnualIncome] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  if (!isOpen) return null

  const handleContinue = () => {
    if (step === 1) {
      if (!firstName || !lastName || !email || !phone) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' })
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!address || !city || !state || !zipCode || !ssn) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' })
        return
      }
      setStep(3)
    } else if (step === 3) {
      if (!agreedToTerms) {
        setMessage({ type: 'error', text: 'You must agree to the terms and conditions' })
        return
      }
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Request OTP for verification
      const response = await requestOTP(email, 'account opening', `${firstName} ${lastName}`)
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowOtpModal(true)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to request verification code' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    if (!otpRequestId) return false

    try {
      const isValid = await verifyOTP(otpRequestId, code)
      if (isValid) {
        // Process account opening
        setMessage({ type: 'success', text: 'Account opened successfully!' })
        setShowOtpModal(false)
        onSuccess()
        setTimeout(() => {
          onClose()
        }, 2000)
        return true
      } else {
        setMessage({ type: 'error', text: 'Invalid verification code' })
        return false
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Verification failed' })
      return false
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
    setMessage(null)
  }

  const getAccountTypeIcon = () => {
    switch(accountType) {
      case 'checking': return '💰'
      case 'savings': return '🏦'
      case 'credit': return '💳'
      default: return '💰'
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-deep-teal">Open New Account</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full ${
                    s <= step ? 'bg-soft-gold' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            {/* Step 1: Account Type & Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Account Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'checking', label: 'Checking', icon: '💰' },
                      { type: 'savings', label: 'Savings', icon: '🏦' },
                      { type: 'credit', label: 'Credit Card', icon: '💳' }
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setAccountType(option.type as any)}
                        className={`p-4 border-2 rounded-xl text-center transition-all ${
                          accountType === option.type
                            ? 'border-soft-gold bg-soft-gold/5'
                            : 'border-gray-200 hover:border-soft-gold hover:bg-soft-gold/5'
                        }`}
                      >
                        <span className="text-3xl block mb-2">{option.icon}</span>
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Security Number (Last 4 digits)
                  </label>
                  <input
                    type="password"
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="1234"
                    maxLength={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">We only need the last 4 digits for verification</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment Status
                    </label>
                    <select
                      value={employmentStatus}
                      onChange={(e) => setEmploymentStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    >
                      <option value="employed">Employed</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="retired">Retired</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Income
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-soft-gold/5 rounded-lg p-4">
                  <h3 className="font-semibold text-deep-teal mb-3">Account Summary</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Account Type:</dt>
                      <dd className="font-medium text-gray-900 capitalize">{accountType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Name:</dt>
                      <dd className="font-medium text-gray-900">{firstName} {lastName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Email:</dt>
                      <dd className="font-medium text-gray-900">{email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Phone:</dt>
                      <dd className="font-medium text-gray-900">{phone}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Address:</dt>
                      <dd className="font-medium text-gray-900">{address}, {city}, {state} {zipCode}</dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded transition-all duration-300 ${
                        agreedToTerms 
                          ? 'bg-soft-gold border-soft-gold' 
                          : 'bg-white border-gray-300 group-hover:border-soft-gold'
                      }`}>
                        {agreedToTerms && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-soft-gold transition-colors">
                      I agree to the <a href="/terms" className="text-deep-teal hover:text-soft-gold">Terms of Service</a> and 
                      <a href="/privacy" className="text-deep-teal hover:text-soft-gold"> Privacy Policy</a>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className={`flex-1 bg-gradient-to-r from-deep-teal to-sage text-white py-3 rounded-lg font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 ${
                  step === 1 ? '' : ''
                }`}
              >
                {isLoading ? 'Processing...' : step === 3 ? 'Submit Application' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal - Using standardized props */}
      <OTPModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false)
          setOtpRequestId(null)
        }}
        onVerify={handleOtpVerify}
        email={email}
      />
    </>
  )
}
