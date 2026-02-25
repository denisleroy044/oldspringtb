'use client'

import { useDashboardContext } from '@/context/DashboardContext'

export function RecentActivity() {
  const { transactions } = useDashboardContext()

  if (!transactions) return null

  const recentTransactions = transactions.slice(0, 3)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {transaction.type === 'credit' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  )}
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{transaction.accountName}</p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
            </div>
            <p className={`text-sm font-semibold ${
              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
