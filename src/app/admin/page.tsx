'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export default function AdminPage() {
  const { user: authUser } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin
    if (!authUser || authUser.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    fetchUsers()
  }, [authUser, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid gap-4">
        {users.map((user: any) => (
          <div key={user.id} className="border p-4 rounded">
            <p>{user.email}</p>
            <p>{user.firstName} {user.lastName}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
