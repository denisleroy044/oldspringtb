'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserAccounts, BankAccount } from '@/lib/db/accountService'
import { OpenAccountModal } from './OpenAccountModal'
import Link from 'next/link'

export function AccountCards() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOpenAccountModal, setShowOpenAccountModal] = useState(false)

  useEffect(() => {
    async function loadAccounts() {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const data = await getUserAccounts(user.id)
        setAccounts(data)
      } catch (err) {
        console.error('Error loading accounts:', err)
        setError('Failed to load accounts')
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [user?.id])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getAccountIcon = (type: string) => {
    switch(type) {
      case 'CHECKING': return '💰'
      case 'SAVINGS': return '🏦'
      case 'CREDIT': return '💳'
      default: return '💰'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'FROZEN': return 'bg-blue-100 text-blue-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAccountOpened = async () => {
    // Refresh accounts list
    if (user?.id) {
      const data = await getUserAccounts(user.id)
      setAccounts(data)
    }
  }

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-deep-teal mb-4">Your Accounts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-28"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-deep-teal mb-4">Your Accounts</h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-deep-teal">Your Accounts</h2>
          <button
            onClick={() => setShowOpenAccountModal(true)}
            className="text-sm bg-soft-gold text-deep-teal px-4 py-2 rounded-lg hover:bg-deep-teal hover:text-white transition-colors"
          >
            + Open New Account
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Link
              key={account.id}
              href={`/dashboard/accounts/${account.id}`}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all block"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-3xl">{getAccountIcon(account.type)}</span>
                  <p className="font-medium text-gray-900 mt-2">{account.name}</p>
                  <p className="text-xs text-gray-500">{account.accountNumber}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(account.status)}`}>
                  {account.status.toLowerCase()}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-deep-teal">
                  {formatCurrency(account.balance)}
                </p>
              </div>
            </Link>
          ))}

          {/* Add Account Card */}
          <button
            onClick={() => setShowOpenAccountModal(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[200px]"
          >
            <span className="text-4xl text-soft-gold mb-2">+</span>
            <p className="text-sm font-medium text-gray-600">Open New Account</p>
          </button>
        </div>
      </div>

      <OpenAccountModal
        isOpen={showOpenAccountModal}
        onClose={() => setShowOpenAccountModal(false)}
        onSuccess={handleAccountOpened}
      />
    </>
  )
}
