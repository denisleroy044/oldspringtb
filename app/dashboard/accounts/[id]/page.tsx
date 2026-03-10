'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params promise using React.use()
  const { id } = React.use(params)
  const router = useRouter()
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccountDetails()
  }, [id]) // Now id is properly resolved

  const fetchAccountDetails = async () => {
    try {
      const response = await fetch(`/api/dashboard/accounts/${id}`)
      const data = await response.json()
      setAccount(data)
    } catch (error) {
      console.error('Error fetching account:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Account Details</h1>
      <pre className="bg-gray-100 p-4 rounded-lg">
        {JSON.stringify(account, null, 2)}
      </pre>
    </div>
  )
}
