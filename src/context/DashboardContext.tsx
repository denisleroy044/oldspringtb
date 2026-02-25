'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getUserById, updateUserBalance as updateBalance } from '@/lib/auth/authService'

interface DashboardContextType {
  user: any
  loading: boolean
  error: string | null
  updateUserBalance: (newBalance: number) => void
  refreshUser: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authUser) {
      const fullUser = getUserById(authUser.id)
      setUser(fullUser)
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [authUser])

  const updateUserBalance = (newBalance: number) => {
    if (user) {
      updateBalance(user.id, newBalance)
      setUser({ ...user, balance: newBalance })
    }
  }

  const refreshUser = () => {
    if (authUser) {
      const fullUser = getUserById(authUser.id)
      setUser(fullUser)
    }
  }

  return (
    <DashboardContext.Provider value={{
      user,
      loading,
      error,
      updateUserBalance,
      refreshUser
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider')
  }
  return context
}
