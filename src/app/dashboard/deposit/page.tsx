'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpService'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

interface DepositMethod {
  id: string
  type: 'bank' | 'card' | 'cash' | 'wire'
  name: string
  icon: string
  processingTime: string
  fee: string
  minAmount: number
  maxAmount: number
}

interface BankAccount {
  id: string
  name: string
  accountNumber: string
  routingNumber: string
  isVerified: boolean
}

export default function DepositPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<string>('bank')
  const [amount, setAmount] = useState('')
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Mock bank accounts
  const bankAccounts: BankAccount[] = [
    {
      id: '1',
      name: 'Chase Checking',
      accountNumber: '****5678',
      routingNumber: '021000021',
      isVerified: true
    },
    {
      id: '2',
      name: 'Wells Fargo Savings',
      accountNumber: '****1234',
      routingNumber: '121000248',
      isVerified: true
    }
  ]

  const depositMethods: DepositMethod[] = [
    {
      id: 'bank',
      type: 'bank',
      name: 'Bank Transfer',
      icon: '🏦',
      processingTime: '1-2 business days',
      fee: 'Free',
      minAmount: 10,
      maxAmount: 50000
    },
    {
      id: 'card',
      type: 'card',
      name: 'Debit/Credit Card',
      icon: '💳',
      processingTime: 'Instant',
      fee: '2.5%',
      minAmount: 5,
      maxAmount: 5000
    },
    {
      id: 'wire',
      type: 'wire',
      name: 'Wire Transfer',
      icon: '⚡',
      processingTime: 'Same day',
      fee: '$25',
      minAmount: 1000,
      maxAmount: 100000
    }
  ]

  const selectedMethodData = depositMethods.find(m => m.id === selectedMethod)

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const depositAmount = parseFloat(amount)
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' })
      return
    }

    if (selectedMethodData && (depositAmount < selectedMethodData.minAmount || depositAmount > selectedMethodData.maxAmount)) {
      setMessage({ 
        type: 'error', 
        text: `Amount must be between $${selectedMethodData.minAmount} and $${selectedMethodData.maxAmount}` 
      })
      return
    }

    setIsLoading(true)

    try {
      // For bank transfers, we might need OTP for verification
      if (selectedMethod === 'bank' && !selectedBankAccount) {
        setMessage({ type: 'error', text: 'Please select a bank account' })
        setIsLoading(false)
        return
      }

      // Request OTP for verification
      const response = await requestOTP(user?.email || '', 'deposit', user?.name)
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowOtpModal(true)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process deposit request' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    if (!otpRequestId || !user) return false

    try {
      const isValid = await verifyOTP(otpRequestId, code)
      if (isValid) {
        // Process the deposit
        setMessage({ 
          type: 'success', 
          text: `Successfully deposited $${amount}. It will be available in your account ${selectedMethodData?.processingTime.toLowerCase()}.` 
        })
        
        // Reset form
        setAmount('')
        setSelectedBankAccount('')
        setCardNumber('')
        setCardExpiry('')
        setCardCvv('')
        setShowOtpModal(false)
        setOtpRequestId(null)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <ScrollAnimation animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-deep-teal mb-2">Deposit Funds</h1>
              <p className="text-gray-600">Add money to your account securely</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {/* Deposit Methods */}
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold text-deep-teal mb-4">Deposit Methods</h2>
                <div className="space-y-3">
                  {depositMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === method.id
                          ? 'border-soft-gold bg-soft-gold/5'
                          : 'border-gray-200 hover:border-soft-gold hover:bg-soft-gold/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-xs text-gray-500">{method.processingTime} • {method.fee}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit Form */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold text-deep-teal mb-4">
                    Deposit via {selectedMethodData?.name}
                  </h2>

                  <form onSubmit={handleDeposit} className="space-y-6">
                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min={selectedMethodData?.minAmount}
                          max={selectedMethodData?.maxAmount}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          required
                        />
                      </div>
                      {selectedMethodData && (
                        <p className="text-xs text-gray-500 mt-2">
                          Min: {formatCurrency(selectedMethodData.minAmount)} • Max: {formatCurrency(selectedMethodData.maxAmount)}
                        </p>
                      )}
                    </div>

                    {/* Bank Account Selection (for bank transfer) */}
                    {selectedMethod === 'bank' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Bank Account
                        </label>
                        <select
                          value={selectedBankAccount}
                          onChange={(e) => setSelectedBankAccount(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          required
                        >
                          <option value="">Choose an account</option>
                          {bankAccounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.name} • {account.accountNumber}
                            </option>
                          ))}
                        </select>
                        <button className="text-sm text-soft-gold hover:text-deep-teal mt-2 transition-colors">
                          + Add new bank account
                        </button>
                      </div>
                    )}

                    {/* Card Details (for card deposits) */}
                    {selectedMethod === 'card' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '')
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4)
                                }
                                setCardExpiry(value)
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Wire Transfer Instructions */}
                    {selectedMethod === 'wire' && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800 mb-2">Wire Transfer Instructions</h3>
                        <p className="text-sm text-blue-700 mb-2">
                          Please use the following details for wire transfer:
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li><strong>Bank:</strong> Oldspring Trust</li>
                          <li><strong>Account Name:</strong> {user?.name}</li>
                          <li><strong>Account Number:</strong> 123456789</li>
                          <li><strong>Routing Number:</strong> 655205039</li>
                          <li><strong>SWIFT/BIC:</strong> OLDSPR22</li>
                        </ul>
                        <p className="text-xs text-blue-600 mt-2">
                          Funds will be credited within 24 hours after we receive the wire.
                        </p>
                      </div>
                    )}

                    {/* Fee Disclosure */}
                    {selectedMethodData && selectedMethodData.fee !== 'Free' && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">
                          A fee of {selectedMethodData.fee} will apply to this transaction.
                          {amount && ` Estimated fee: ${formatCurrency(parseFloat(amount || '0') * 0.025)}`}
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Continue to Deposit'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </main>
        <DashboardFooter />
      </div>

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
