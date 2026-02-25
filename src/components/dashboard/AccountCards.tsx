'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { OpenAccountModal } from './OpenAccountModal'

interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit'
  balance: number
  accountNumber: string
  status: 'active' | 'frozen' | 'closed'
}

export function AccountCards() {
  const { user: authUser } = useAuth()
  const [showOpenAccountModal, setShowOpenAccountModal] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Primary Checking',
      type: 'checking',
      balance: 5280.42,
      accountNumber: '****1234',
      status: 'active'
    },
    {
      id: '2',
      name: 'High-Yield Savings',
      type: 'savings',
      balance: 12750.89,
      accountNumber: '****5678',
      status: 'active'
    }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getAccountIcon = (type: string) => {
    switch(type) {
      case 'checking': return '💰'
      case 'savings': return '🏦'
      case 'credit': return '💳'
      default: return '💰'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'frozen': return 'bg-blue-100 text-blue-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAccountOpened = () => {
    // Refresh accounts list (in real app, fetch from API)
    // For now, just show success message via the modal
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
            <div
              key={account.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-3xl">{getAccountIcon(account.type)}</span>
                  <p className="font-medium text-gray-900 mt-2">{account.name}</p>
                  <p className="text-xs text-gray-500">{account.accountNumber}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(account.status)}`}>
                  {account.status}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-deep-teal">
                  {formatCurrency(account.balance)}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm text-deep-teal hover:text-soft-gold transition-colors mr-4">
                  View Details
                </button>
                <button className="text-sm text-deep-teal hover:text-soft-gold transition-colors">
                  Transfer
                </button>
              </div>
            </div>
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

      {/* Open Account Modal - Using correct props */}
      <OpenAccountModal
        isOpen={showOpenAccountModal}
        onClose={() => setShowOpenAccountModal(false)}
        onSuccess={handleAccountOpened}
      />
    </>
  )
}
