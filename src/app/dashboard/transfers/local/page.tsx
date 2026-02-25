'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LocalTransferPage() {
  const [amount, setAmount] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Local Transfer</h1>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Available Balance */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">$755,300.00</p>
        </div>

        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">$100</button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">$500</button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">$1000</button>
            </div>
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter full name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Transfer
            </button>
            <Link href="/dashboard" className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-center hover:bg-gray-50">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
