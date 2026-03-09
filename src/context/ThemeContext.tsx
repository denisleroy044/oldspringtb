'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  settings: any
  updateSetting: (key: string, value: any) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [settings, setSettings] = useState<any>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme || 'system'
    setTheme(savedTheme)

    // Load user settings from API
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      const data = await response.json()
      setSettings(data.settings || {})
      
      // Apply settings to document
      applySettings(data.settings || {})
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const applySettings = (newSettings: any) => {
    // Apply theme
    const root = document.documentElement
    
    // Font size
    if (newSettings.fontSize) {
      const sizes = { small: '14px', medium: '16px', large: '18px' }
      root.style.fontSize = sizes[newSettings.fontSize as keyof typeof sizes] || '16px'
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Time format
    if (newSettings.timeFormat) {
      root.style.setProperty('--time-format', newSettings.timeFormat)
    }

    // Currency
    if (newSettings.currency) {
      root.style.setProperty('--currency', newSettings.currency)
    }

    // Language
    if (newSettings.language) {
      root.lang = newSettings.language
    }

    // Dashboard preferences (stored in localStorage for client-side)
    localStorage.setItem('dashboardPrefs', JSON.stringify({
      showBalances: newSettings.showBalances ?? true,
      showTransactions: newSettings.showTransactions ?? true,
      showGoals: newSettings.showGoals ?? true,
      defaultDashboard: newSettings.defaultDashboard || 'overview',
      dashboardDensity: newSettings.dashboardDensity || 'comfortable'
    }))
  }

  useEffect(() => {
    if (!mounted) return

    // Save theme to localStorage
    localStorage.setItem('theme', theme)

    // Apply theme
    const applyTheme = () => {
      const isDark = 
        theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      
      setResolvedTheme(isDark ? 'dark' : 'light')
      
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme()

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme()
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [theme, mounted])

  const updateSetting = async (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    applySettings(newSettings)
    
    // Save to database
    try {
      await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings })
      })
    } catch (error) {
      console.error('Error saving setting:', error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, settings, updateSetting }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
