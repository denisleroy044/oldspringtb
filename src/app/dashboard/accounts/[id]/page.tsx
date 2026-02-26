'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { getUserAccounts, getAccountTransactions, transferBetweenAccounts, BankAccount, AccountTransaction } from '@/lib/accounts/accountService'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpService'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export default function AccountDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user: authUser } = useAuth()
  const [account, setAccount] = useState<BankAccount | null>(null)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [transactions, setTransactions] = useState<AccountTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferAmount, setTransferAmount] = useState('')
  const [selectedToAccount, setSelectedToAccount] = useState<string>('')
  const [transferDescription, setTransferDescription] = useState('')
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null)
  const [pendingTransfer, setPendingTransfer] = useState<{
    fromAccountId: string
    toAccountId: string
    amount: number
    description: string
  } | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const loadAccountData = async () => {
      if (!authUser || !params.id) return
      
      try {
        const userAccounts = await getUserAccounts(authUser.id)
        const currentAccount = userAccounts.find(a => a.id === params.id)
        
        if (currentAccount) {
          setAccount(currentAccount)
          setAccounts(userAccounts.filter(a => a.id !== params.id))
          
          const accountTransactions = await getAccountTransactions(params.id as string, 20)
          setTransactions(accountTransactions)
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error loading account:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAccountData()
  }, [authUser, params.id, router])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!account || !selectedToAccount || !transferAmount) return

    const amount = parseFloat(transferAmount)
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' })
      return
    }

    if (amount > account.balance) {
      setMessage({ type: 'error', text: 'Insufficient funds' })
      return
    }

    try {
      const response = await requestOTP(authUser?.email || '', 'transfer', authUser?.name)
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setPendingTransfer({
          fromAccountId: account.id,
          toAccountId: selectedToAccount,
          amount,
          description: transferDescription || 'Account transfer'
        })
        setShowOtpModal(true)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to request OTP' })
    }
  }

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    if (!otpRequestId || !pendingTransfer || !authUser) {
      return false
    }

    try {
      const isValid = await verifyOTP(otpRequestId, code)
      if (isValid) {
        const result = await transferBetweenAccounts(
          pendingTransfer.fromAccountId,
          pendingTransfer.toAccountId,
          pendingTransfer.amount,
          pendingTransfer.description
        )

        if (result.success) {
          // Refresh account data
          const userAccounts = await getUserAccounts(authUser.id)
          const updatedAccount = userAccounts.find(a => a.id === params.id)
          if (updatedAccount) {
            setAccount(updatedAccount)
          }
          
          const accountTransactions = await getAccountTransactions(params.id as string, 20)
          setTransactions(accountTransactions)
          
          setMessage({ type: 'success', text: 'Transfer completed successfully' })
          setShowTransferModal(false)
          setTransferAmount('')
          setSelectedToAccount('')
          setTransferDescription('')
          setShowOtpModal(false)
          setOtpRequestId(null)
          setPendingTransfer(null)
          return true
        } else {
          setMessage({ type: 'error', text: result.error || 'Transfer failed' })
          return false
        }
      } else {
        setMessage({ type: 'error', text: 'Invalid OTP code' })
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading account details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h2>
            <p className="text-gray-600 mb-6">The account you're looking for doesn't exist or you don't have access.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-soft-gold transition-colors"
            >
              Back to Dashboard
            </button>
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
              <button
                onClick={() => router.push('/dashboard')}
                className="text-deep-teal hover:text-soft-gold transition-colors mb-4 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-deep-teal">{account.name}</h1>
                  <p className="text-gray-600">{account.accountNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className="text-4xl font-bold text-soft-gold">{formatCurrency(account.balance)}</p>
                </div>
              </div>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => setShowTransferModal(true)}
                disabled={accounts.length === 0}
                className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-soft-gold text-xl">↗️</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Transfer</p>
              </button>
              
              <button className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-soft-gold text-xl">📄</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Statements</p>
              </button>
              
              <button className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-soft-gold text-xl">⚙️</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Settings</p>
              </button>
              
              <button className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-soft-gold text-xl">📞</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Help</p>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-deep-teal">Recent Transactions</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(tx.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {tx.description}
                            {tx.counterparty && (
                              <span className="block text-xs text-gray-500">{tx.counterparty}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {tx.category || 'other'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                            tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No transactions found
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

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-deep-teal mb-4">Transfer Money</h3>
            
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                <input
                  type="text"
                  value={account.name}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
                <select
                  value={selectedToAccount}
                  onChange={(e) => setSelectedToAccount(e.target.value)}
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
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  max={account.balance}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={transferDescription}
                  onChange={(e) => setTransferDescription(e.target.value)}
                  placeholder="e.g., Rent payment"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
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
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Modal - Using new props */}
      <OTPModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false)
          setOtpRequestId(null)
          setPendingTransfer(null)
        }}
        onVerify={handleOtpVerify}
        email={authUser?.email}
      />
    </div>
  )
}
