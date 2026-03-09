'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpService'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit'
  balance: number
  accountNumber: string
}

interface TransferRecipient {
  id: string
  name: string
  accountNumber: string
  bankName: string
  isSaved: boolean
}

export default function TransferPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'internal' | 'external' | 'saved'>('internal')
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [toExternalAccount, setToExternalAccount] = useState({
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    accountName: ''
  })
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState('monthly')
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Mock accounts
  const accounts: Account[] = [
    {
      id: '1',
      name: 'Primary Checking',
      type: 'checking',
      balance: 5280.42,
      accountNumber: '****1234'
    },
    {
      id: '2',
      name: 'High-Yield Savings',
      type: 'savings',
      balance: 12750.89,
      accountNumber: '****5678'
    },
    {
      id: '3',
      name: 'Rewards Credit Card',
      type: 'credit',
      balance: -3249.25,
      accountNumber: '****9012'
    }
  ]

  // Mock saved recipients
  const savedRecipients: TransferRecipient[] = [
    {
      id: '1',
      name: 'John Doe',
      accountNumber: '****4321',
      bankName: 'Chase Bank',
      isSaved: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      accountNumber: '****8765',
      bankName: 'Wells Fargo',
      isSaved: true
    },
    {
      id: '3',
      name: 'Rent Payment',
      accountNumber: '****2468',
      bankName: 'Property Management',
      isSaved: true
    }
  ]

  const selectedFromAccount = accounts.find(a => a.id === fromAccount)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fromAccount) {
      setMessage({ type: 'error', text: 'Please select a from account' })
      return
    }

    if (activeTab === 'internal' && !toAccount) {
      setMessage({ type: 'error', text: 'Please select a destination account' })
      return
    }

    if (activeTab === 'external' && (!toExternalAccount.accountNumber || !toExternalAccount.routingNumber)) {
      setMessage({ type: 'error', text: 'Please enter external account details' })
      return
    }

    const transferAmount = parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' })
      return
    }

    if (selectedFromAccount && transferAmount > selectedFromAccount.balance && selectedFromAccount.type !== 'credit') {
      setMessage({ type: 'error', text: 'Insufficient funds' })
      return
    }

    setIsLoading(true)

    try {
      // Request OTP for verification
      const response = await requestOTP(user?.email || '', 'transfer', user?.name)
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowOtpModal(true)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to request OTP' })
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    if (!otpRequestId || !user) return false

    try {
      const isValid = await verifyOTP(otpRequestId, code)
      if (isValid) {
        // Process transfer
        setMessage({ 
          type: 'success', 
          text: scheduleDate 
            ? `Transfer of $${amount} scheduled for ${new Date(scheduleDate).toLocaleDateString()}` 
            : `Transfer of $${amount} completed successfully` 
        })
        
        // Reset form
        setFromAccount('')
        setToAccount('')
        setToExternalAccount({
          accountNumber: '',
          routingNumber: '',
          bankName: '',
          accountName: ''
        })
        setAmount('')
        setDescription('')
        setScheduleDate('')
        setIsRecurring(false)
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
    } finally {
      setIsLoading(false)
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
              <h1 className="text-3xl font-bold text-deep-teal mb-2">Transfer Money</h1>
              <p className="text-gray-600">Send money to your accounts or external banks</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {[
                { id: 'internal', label: 'Between My Accounts', icon: '🏦' },
                { id: 'external', label: 'External Transfer', icon: '🌐' },
                { id: 'saved', label: 'Saved Recipients', icon: '⭐' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-soft-gold text-deep-teal'
                      : 'border-transparent text-gray-500 hover:text-deep-teal'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <form onSubmit={handleTransfer} className="space-y-6">
                {/* From Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Account
                  </label>
                  <select
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    required
                  >
                    <option value="">Select account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.balance)} ({account.accountNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Internal Transfer - To Account */}
                {activeTab === 'internal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Account
                    </label>
                    <select
                      value={toAccount}
                      onChange={(e) => setToAccount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      required
                    >
                      <option value="">Select destination account</option>
                      {accounts
                        .filter(a => a.id !== fromAccount)
                        .map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} - {formatCurrency(account.balance)} ({account.accountNumber})
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* External Transfer - To Account Details */}
                {activeTab === 'external' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={toExternalAccount.accountName}
                        onChange={(e) => setToExternalAccount({ ...toExternalAccount, accountName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={toExternalAccount.bankName}
                        onChange={(e) => setToExternalAccount({ ...toExternalAccount, bankName: e.target.value })}
                        placeholder="Chase Bank"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={toExternalAccount.accountNumber}
                          onChange={(e) => setToExternalAccount({ ...toExternalAccount, accountNumber: e.target.value })}
                          placeholder="123456789"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Routing Number
                        </label>
                        <input
                          type="text"
                          value={toExternalAccount.routingNumber}
                          onChange={(e) => setToExternalAccount({ ...toExternalAccount, routingNumber: e.target.value })}
                          placeholder="021000021"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Saved Recipients */}
                {activeTab === 'saved' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Recipient
                    </label>
                    <div className="space-y-3">
                      {savedRecipients.map((recipient) => (
                        <div
                          key={recipient.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-soft-gold cursor-pointer transition-colors"
                          onClick={() => {
                            setToExternalAccount({
                              accountNumber: recipient.accountNumber,
                              routingNumber: '****',
                              bankName: recipient.bankName,
                              accountName: recipient.name
                            })
                            setActiveTab('external')
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-deep-teal">{recipient.name}</p>
                              <p className="text-sm text-gray-500">{recipient.bankName} • {recipient.accountNumber}</p>
                            </div>
                            <span className="text-soft-gold">⭐</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                      min="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Rent payment, Gift, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  />
                </div>

                {/* Schedule & Recurring */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule (Optional)
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isRecurring}
                          onChange={(e) => setIsRecurring(e.target.checked)}
                          className="rounded border-gray-300 text-soft-gold focus:ring-soft-gold"
                        />
                        Make recurring
                      </div>
                    </label>
                    {isRecurring && (
                      <select
                        value={recurringFrequency}
                        onChange={(e) => setRecurringFrequency(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Transfer Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : scheduleDate ? 'Schedule Transfer' : 'Transfer Now'}
                </button>
              </form>
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
          setIsLoading(false)
        }}
        onVerify={handleOtpVerify}
        email={user?.email}
      />
    </div>
  )
}
