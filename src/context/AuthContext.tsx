'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, logout as authLogout } from '@/lib/auth/authService'

interface AuthContextType {
  user: any | null
  loading: boolean
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = () => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }

  const logout = () => {
    authLogout()
    setUser(null)
  }

  const refreshUser = () => {
    loadUser()
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
