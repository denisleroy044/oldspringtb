'use client'

import Link from 'next/link'

const actions = [
  { name: 'Make a Deposit', href: '/dashboard/deposit', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', color: 'bg-green-500' },
  { name: 'Transfer Funds', href: '/dashboard/transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'bg-blue-500' },
  { name: 'Market Watch', href: '/dashboard/market', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'bg-purple-500' },
  { name: 'Manage Card', href: '/dashboard/card', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', color: 'bg-orange-500' },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group p-4 border border-gray-200 rounded-lg hover:border-[#1e3a5f] hover:shadow-md transition"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-[#1e3a5f]">{action.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
