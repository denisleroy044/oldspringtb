'use client'

import { useState, useEffect } from 'react'

export default function AdminTestPage() {
  const [transactions, setTransactions] = useState<any>(null)
  const [users, setUsers] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testAllApis()
  }, [])

  const testAllApis = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Test transactions
      const txRes = await fetch('/api/admin/transactions')
      const txData = await txRes.json()
      setTransactions({ status: txRes.status, data: txData })
    } catch (e) {
      setTransactions({ error: String(e) })
    }

    try {
      // Test users
      const usersRes = await fetch('/api/admin/users')
      const usersData = await usersRes.json()
      setUsers({ status: usersRes.status, data: usersData })
    } catch (e) {
      setUsers({ error: String(e) })
    }

    try {
      // Test stats
      const statsRes = await fetch('/api/admin/stats')
      const statsData = await statsRes.json()
      setStats({ status: statsRes.status, data: statsData })
    } catch (e) {
      setStats({ error: String(e) })
    }

    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin API Test</h1>
      
      {loading && <div>Testing APIs...</div>}
      
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      
      <div className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Transactions API</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(transactions, null, 2)}
          </pre>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Users API</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Stats API</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
      </div>
      
      <button 
        onClick={testAllApis}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Again
      </button>
    </div>
  )
}
