'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CardsPage() {
  const [showApply, setShowApply] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Virtual Cards</h1>
        <button
          onClick={() => setShowApply(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + New Card
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">ACTIVE CARDS</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">PENDING APPLICATIONS</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* No Cards */}
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">💳</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Cards Yet</h3>
        <p className="text-gray-600 mb-4">Get started by applying for your first virtual card.</p>
        <button
          onClick={() => setShowApply(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Apply for Card
        </button>
      </div>

      {/* Apply Modal */}
      {showApply && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Apply for Virtual Card</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Debit Card</option>
                  <option>Credit Card</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Submit
                </button>
                <button
                  onClick={() => setShowApply(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
