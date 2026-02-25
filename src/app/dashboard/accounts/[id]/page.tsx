'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { getUserAccounts, getAccountTransactions, transferBetweenAccounts, BankAccount, AccountTransaction } from '@/lib/accounts/accountService'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpUtils'

function AccountDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [account, setAccount] = useState<BankAccount | null>(null)
  const [transactions, setTransactions] = useState<AccountTransaction[]>([])
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [transferForm, setTransferForm] = useState({
    toAccountId: '',
    amount: '',
    description: ''
  })
  const [showOTP, setShowOTP] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
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

    if (authUser && params.id) {
      const userAccounts = getUserAccounts(authUser.id)
      const currentAccount = userAccounts.find(a => a.id === params.id)
      if (currentAccount) {
        setAccount(currentAccount)
        setAccounts(userAccounts.filter(a => a.id !== params.id))
        const accountTransactions = getAccountTransactions(authUser.id, params.id as string)
        setTransactions(accountTransactions)
      }
    }

    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [authUser, params.id])

  if (!authUser || !user || !account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  const handleTransfer = async () => {
    const amount = parseFloat(transferForm.amount)
    if (amount <= 0) return
    if (amount > account.balance) {
      alert('Insufficient funds')
      return
    }

    const response = await requestOTP(user.phone, 'transfer')
    if (response.success && response.requestId) {
      setOtpRequestId(response.requestId)
      setShowOTP(true)
    }
  }

  const handleOTPVerify = async (code: string): Promise<boolean> => {
    if (code === 'RESEND') {
      const response = await requestOTP(user.phone, 'transfer')
      if (response.requestId) {
        setOtpRequestId(response.requestId)
      }
      return true
    }

    const isValid = await verifyOTP(otpRequestId, code)
    
    if (isValid && authUser) {
      const result = transferBetweenAccounts(
        authUser.id,
        account.id,
        transferForm.toAccountId,
        parseFloat(transferForm.amount),
        transferForm.description
      )

      if (result.success) {
        // Refresh account data
        const userAccounts = getUserAccounts(authUser.id)
        const updatedAccount = userAccounts.find(a => a.id === account.id)
        if (updatedAccount) {
          setAccount(updatedAccount)
          const accountTransactions = getAccountTransactions(authUser.id, account.id)
          setTransactions(accountTransactions)
        }
        setShowTransferModal(false)
        setTransferForm({ toAccountId: '', amount: '', description: '' })
      } else {
        alert(result.message)
      }
    }
    
    return isValid
  }

  const getAccountIcon = (type: string) => {
    switch(type) {
      case 'checking': return '💳'
      case 'savings': return '🏦'
      case 'money_market': return '📈'
      case 'cd': return '⏰'
      default: return '🏦'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'deposit': return '↓'
      case 'withdrawal': return '↑'
      case 'transfer': return '↔️'
      case 'interest': return '📈'
      case 'fee': return '💰'
      default: return '•'
    }
  }

  const getTransactionColor = (type: string) => {
    switch(type) {
      case 'deposit':
      case 'interest':
        return 'text-green-600'
      case 'withdrawal':
      case 'fee':
        return 'text-red-600'
      case 'transfer':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 flex flex-col ${
        !isMobile && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
      }`}>
        <Header />
        <main className="flex-1 pt-20 lg:pt-24 px-4 lg:px-6 pb-6">
          {/* Back Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-6 flex items-center text-gray-600 hover:text-[#1e3a5f] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          {/* Account Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${
                  account.type === 'checking' ? 'from-blue-500 to-blue-700' :
                  account.type === 'savings' ? 'from-green-500 to-green-700' :
                  account.type === 'money_market' ? 'from-purple-500 to-purple-700' :
                  'from-orange-500 to-orange-700'
                } rounded-2xl flex items-center justify-center text-3xl`}>
                  {getAccountIcon(account.type)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{account.accountName}</h1>
                  <p className="text-gray-500 mt-1 capitalize">{account.type.replace('_', ' ')} • {account.accountNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-[#1e3a5f]">${account.balance.toFixed(2)}</p>
              </div>
            </div>

            {/* Account Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              {account.interestRate ? (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                  <p className="font-semibold">{account.interestRate}% APY</p>
                </div>
              ) : null}
              {account.monthlyFee !== undefined && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Monthly Fee</p>
                  <p className="font-semibold">${account.monthlyFee}</p>
                </div>
              )}
              {account.minimumBalance ? (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Minimum Balance</p>
                  <p className="font-semibold">${account.minimumBalance}</p>
                </div>
              ) : null}
              {account.maturityDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Maturity Date</p>
                  <p className="font-semibold">{new Date(account.maturityDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Opened</p>
                <p className="font-semibold">{new Date(account.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="font-semibold capitalize">{account.status}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => setShowTransferModal(true)}
                disabled={accounts.length === 0}
                className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#2b4c7a] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Transfer Money
              </button>
              <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Download Statement
              </button>
              <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                View Details
              </button>
            </div>
          </div>

          {/* Account Features */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {account.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h2>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' || tx.type === 'interest' ? 'bg-green-100' :
                        tx.type === 'withdrawal' || tx.type === 'fee' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        <span className={getTransactionColor(tx.type)}>{getTransactionIcon(tx.type)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${getTransactionColor(tx.type)}`}>
                        {tx.type === 'deposit' || tx.type === 'interest' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Balance: ${tx.balance.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <DashboardFooter />
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transfer Money</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
                <input
                  type="text"
                  value={`${account.accountName} (${account.accountNumber})`}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Account</label>
                <select
                  value={transferForm.toAccountId}
                  onChange={(e) => setTransferForm({...transferForm, toAccountId: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                >
                  <option value="">Select account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountName} ({acc.accountNumber.slice(-4)}) - ${acc.balance.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                    placeholder="0.00"
                    min="0.01"
                    max={account.balance}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={transferForm.description}
                  onChange={(e) => setTransferForm({...transferForm, description: e.target.value})}
                  placeholder="Transfer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-700">
                  Available balance after transfer: ${(account.balance - parseFloat(transferForm.amount || '0')).toFixed(2)}
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={!transferForm.toAccountId || !transferForm.amount}
                  className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2b4c7a] disabled:opacity-50"
                >
                  Continue
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
        purpose="transfer verification"
      />
    </div>
  )
}

export default function AccountDetailPage() {
  return (
    <DashboardProvider>
      <AccountDetailContent />
    </DashboardProvider>
  )
}
