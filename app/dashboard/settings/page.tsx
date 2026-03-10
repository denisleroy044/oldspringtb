'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'next/navigation'
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Clock,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  Layout,
  Bell,
  Shield,
  Palette,
  Type,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'

interface UserSettings {
  // Display settings
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  currency: string
  
  // Dashboard settings
  defaultDashboard: string
  showBalances: boolean
  showTransactions: boolean
  showGoals: boolean
  
  // Privacy settings
  profileVisibility: 'public' | 'private' | 'contacts'
  activityVisibility: 'public' | 'private' | 'contacts'
  
  // Accessibility settings
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
}

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  
  // Safely use theme with error handling
  let themeContext;
  try {
    themeContext = useTheme();
  } catch (error) {
    console.error('Theme context error:', error);
    // Return a loading state or redirect if theme context is not available
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Theme context not available. Please refresh the page.</p>
        </div>
      </div>
    );
  }
  
  const { theme: currentTheme, setTheme: setCurrentTheme, resolvedTheme } = themeContext;
  
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'display' | 'dashboard' | 'privacy' | 'accessibility'>('display')

  useEffect(() => {
    setMounted(true)
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/settings')
      const data = await response.json()
      
      if (response.ok) {
        setSettings(data.settings || {})
      } else {
        // Set default settings
        setSettings({
          theme: currentTheme,
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          currency: 'USD',
          defaultDashboard: 'overview',
          showBalances: true,
          showTransactions: true,
          showGoals: true,
          profileVisibility: 'private',
          activityVisibility: 'private',
          reducedMotion: false,
          highContrast: false,
          fontSize: 'medium'
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (settings) {
      setSettings({ ...settings, theme: newTheme })
      // Update theme in real-time
      setCurrentTheme(newTheme)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings')
      }

      setSuccess('Settings saved successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const SettingSection = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-sage/20 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-soft-gold/10 dark:bg-soft-gold/20 rounded-lg">
            <Icon className="w-5 h-5 text-soft-gold" />
          </div>
          <h2 className="font-semibold text-deep-teal dark:text-soft-gold">{title}</h2>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  )

  if (loading || !mounted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal dark:text-soft-gold mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-deep-teal dark:text-soft-gold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Customize your experience</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Current theme: {resolvedTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} 
          {settings?.theme === 'system' ? ' (System)' : ''}
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-lg flex items-center gap-2 animate-slideDown">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg flex items-center gap-2 animate-slideDown">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('display')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'display'
              ? 'bg-deep-teal text-white dark:bg-soft-gold dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Display
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-deep-teal text-white dark:bg-soft-gold dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'privacy'
              ? 'bg-deep-teal text-white dark:bg-soft-gold dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Privacy
        </button>
        <button
          onClick={() => setActiveTab('accessibility')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === 'accessibility'
              ? 'bg-deep-teal text-white dark:bg-soft-gold dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Accessibility
        </button>
      </div>

      {settings && (
        <div className="space-y-6">
          {/* Display Settings */}
          {activeTab === 'display' && (
            <>
              <SettingSection title="Theme" icon={settings.theme === 'dark' ? Moon : Sun}>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'system'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        settings.theme === theme
                          ? 'border-soft-gold bg-soft-gold/5 dark:border-soft-gold dark:bg-soft-gold/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-soft-gold dark:hover:border-soft-gold'
                      }`}
                    >
                      {theme === 'light' && <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />}
                      {theme === 'dark' && <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-400" />}
                      {theme === 'system' && <Monitor className="w-6 h-6 mx-auto mb-2 text-gray-500 dark:text-gray-400" />}
                      <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{theme}</span>
                    </button>
                  ))}
                </div>
              </SettingSection>

              <SettingSection title="Language & Region" icon={Globe}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                      className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                      className="w-full md:w-96 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Format</label>
                      <select
                        value={settings.timeFormat}
                        onChange={(e) => setSettings({...settings, timeFormat: e.target.value as '12h' | '24h'})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="12h">12-hour (12:00 PM)</option>
                        <option value="24h">24-hour (13:00)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>
                </div>
              </SettingSection>
            </>
          )}

          {/* Dashboard Settings */}
          {activeTab === 'dashboard' && (
            <SettingSection title="Dashboard Preferences" icon={Layout}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Dashboard View</label>
                  <select
                    value={settings.defaultDashboard}
                    onChange={(e) => setSettings({...settings, defaultDashboard: e.target.value})}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="overview">Overview</option>
                    <option value="accounts">Accounts</option>
                    <option value="transactions">Transactions</option>
                    <option value="goals">Goals</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Show Balances</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Display account balances on dashboard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.showBalances}
                        onChange={(e) => setSettings({...settings, showBalances: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Show Transactions</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Display recent transactions on dashboard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.showTransactions}
                        onChange={(e) => setSettings({...settings, showTransactions: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Show Goals</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Display financial goals on dashboard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.showGoals}
                        onChange={(e) => setSettings({...settings, showGoals: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
                    </label>
                  </div>
                </div>
              </div>
            </SettingSection>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <SettingSection title="Privacy" icon={Shield}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Visibility</label>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => setSettings({...settings, profileVisibility: e.target.value as 'public' | 'private' | 'contacts'})}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="private">Private</option>
                    <option value="contacts">Contacts Only</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activity Visibility</label>
                  <select
                    value={settings.activityVisibility}
                    onChange={(e) => setSettings({...settings, activityVisibility: e.target.value as 'public' | 'private' | 'contacts'})}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="private">Private</option>
                    <option value="contacts">Contacts Only</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    Your privacy is important to us. We never share your personal information without your consent.
                  </p>
                </div>
              </div>
            </SettingSection>
          )}

          {/* Accessibility Settings */}
          {activeTab === 'accessibility' && (
            <SettingSection title="Accessibility" icon={Palette}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSettings({...settings, fontSize: size})}
                        className={`flex-1 py-2 px-4 border-2 rounded-lg transition-all capitalize ${
                          settings.fontSize === size
                            ? 'border-soft-gold bg-soft-gold/5 dark:border-soft-gold dark:bg-soft-gold/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-soft-gold dark:hover:border-soft-gold'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Reduced Motion</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Minimize animations throughout the app</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.reducedMotion}
                        onChange={(e) => setSettings({...settings, reducedMotion: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">High Contrast</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better visibility</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.highContrast}
                        onChange={(e) => setSettings({...settings, highContrast: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
                    </label>
                  </div>
                </div>
              </div>
            </SettingSection>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 btn-shimmer flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
