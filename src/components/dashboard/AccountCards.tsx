'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Account {
  id: string
  name: string
  type: string
  balance: number
  accountNumber: string
}

export default function AccountCards({ accounts }: { accounts: Account[] }) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <div key={account.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-deep-teal mb-2">{account.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{account.type}</p>
          <p className="text-2xl font-bold text-soft-gold mb-4">${account.balance.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mb-4">Account: {account.accountNumber}</p>
          <Link 
            href={`/dashboard/accounts/${account.id}`}
            className="inline-block w-full text-center bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-soft-gold transition-colors"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  )
}
