'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { loadUsers, saveUsers, addUserNotification, User } from '@/lib/auth/authService'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const { user: authUser } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'USER' as 'USER' | 'ADMIN',
    balance: 0
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Check if user is admin (using role field)
  useEffect(() => {
    if (!authUser || authUser.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    loadUsersData()
  }, [authUser, router])

  const loadUsersData = async () => {
    try {
      const usersData = await loadUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name || '',
      email: user.email,
      role: user.role,
      balance: user.balance
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!selectedUser) return

    try {
      // Ensure role is properly typed as 'USER' | 'ADMIN'
      const updatedRole = editForm.role as 'USER' | 'ADMIN'
      
      const updatedUsers: User[] = users.map(u => 
        u.id === selectedUser.id 
          ? { 
              ...u, 
              name: editForm.name,
              email: editForm.email,
              role: updatedRole,
              balance: editForm.balance
            }
          : u
      )
      
      await saveUsers(updatedUsers)
      setUsers(updatedUsers)
      
      await addUserNotification(selectedUser.id, {
        title: '👤 Account Updated by Admin',
        message: 'Your account information has been updated by an administrator.',
        type: 'info'
      })

      setMessage({ type: 'success', text: 'User updated successfully!' })
      setIsEditing(false)
      setSelectedUser(null)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user.' })
    }
  }

  const handleToggleRole = async (user: User) => {
    try {
      const newRole: 'USER' | 'ADMIN' = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
      
      const updatedUsers: User[] = users.map(u =>
        u.id === user.id
          ? { ...u, role: newRole }
          : u
      )
      
      await saveUsers(updatedUsers)
      setUsers(updatedUsers)
      
      await addUserNotification(user.id, {
        title: '🔄 Role Updated',
        message: `Your account role has been changed to ${newRole.toLowerCase()}.`,
        type: 'info'
      })

      setMessage({ type: 'success', text: `User role changed to ${newRole}` })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update role.' })
    }
  }

  const handleUpdateBalance = async (user: User, newBalance: number) => {
    try {
      const updatedUsers: User[] = users.map(u =>
        u.id === user.id
          ? { ...u, balance: newBalance }
          : u
      )
      
      await saveUsers(updatedUsers)
      setUsers(updatedUsers)
      
      await addUserNotification(user.id, {
        title: '💰 Balance Updated',
        message: `Your account balance has been updated to $${newBalance.toLocaleString()}.`,
        type: 'info'
      })

      setMessage({ type: 'success', text: 'Balance updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update balance.' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-deep-teal mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage users and monitor system activity</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-deep-teal">User Management</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-deep-teal to-sage rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${user.balance?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-deep-teal hover:text-soft-gold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleRole(user)}
                        className="text-deep-teal hover:text-soft-gold transition-colors"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => {
                          const newBalance = prompt('Enter new balance:', user.balance?.toString())
                          if (newBalance !== null) {
                            handleUpdateBalance(user, parseFloat(newBalance))
                          }
                        }}
                        className="text-deep-teal hover:text-soft-gold transition-colors"
                      >
                        Update Balance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit User Modal */}
        {isEditing && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-deep-teal mb-4">Edit User</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'USER' | 'ADMIN' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                  <input
                    type="number"
                    value={editForm.balance}
                    onChange={(e) => setEditForm({ ...editForm, balance: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setSelectedUser(null)
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
