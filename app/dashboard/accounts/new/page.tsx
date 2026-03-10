'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, PiggyBank, Briefcase, AlertCircle } from 'lucide-react'

export default function NewAccountPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [accountType, setAccountType] = useState('checking')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const accountOptions = [
    {
      id: 'checking',
      name: 'Checking Account',
      icon: CreditCard,
      description: 'Everyday spending, bills, and purchases',
      features: ['Debit card included', 'Online banking', 'Mobile check deposit'],
      prefix: '033'
    },
    {
      id: 'savings',
      name: 'Savings Account',
      icon: PiggyBank,
      description: 'Save for goals and earn interest',
      features: ['High-yield interest', 'No monthly fees', 'Goal tracking'],
      prefix: '077'
    },
    {
      id: 'business',
      name: 'Business Account',
      icon: Briefcase,
      description: 'For your business finances',
      features: ['Business debit card', 'Invoice management', 'Multi-user access'],
      prefix: '055'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/accounts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      router.push(`/dashboard/accounts/${data.accountId}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/accounts" className="inline-flex items-center gap-2 text-deep-teal hover:text-soft-gold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Accounts
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-sage/20">
        <h1 className="text-2xl font-bold text-deep-teal mb-2">Open New Account</h1>
        <p className="text-gray-500 mb-6">Choose the account type that fits your needs</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {accountOptions.map((option) => {
              const Icon = option.icon
              return (
                <label
                  key={option.id}
                  className={`cursor-pointer p-4 border-2 rounded-xl transition-all ${
                    accountType === option.id
                      ? 'border-soft-gold bg-soft-gold/5'
                      : 'border-gray-200 hover:border-soft-gold/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={option.id}
                    checked={accountType === option.id}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      accountType === option.id ? 'bg-soft-gold text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-deep-teal mb-2">{option.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{option.description}</p>
                    <ul className="text-xs text-left text-gray-600 space-y-1">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-soft-gold">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </label>
              )
            })}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Open Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
