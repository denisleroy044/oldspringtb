'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Shield,
  Lock,
  Smartphone,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Key,
  LogOut,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Fingerprint
} from 'lucide-react'

interface SecuritySettings {
  twoFactorEnabled: boolean
  twoFactorMethod: string
  rememberMe: boolean
  sessionTimeout: number
  maxSessions: number
  loginAlerts: boolean
  suspiciousActivityAlerts: boolean
  passwordLastChanged: string
  passwordExpiryDays: number
}

interface Session {
  id: string
  deviceName: string
  deviceType: string
  browser: string
  os: string
  ipAddress: string
  location: string
  isCurrent: boolean
  lastActive: string
  createdAt: string
}

export default function SecurityPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [settings, setSettings] = useState<SecuritySettings | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [show2FAForm, setShow2FAForm] = useState(false)
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    try {
      setLoading(true)
      
      // Fetch security settings
      const settingsRes = await fetch('/api/user/security')
      const settingsData = await settingsRes.json()
      setSettings(settingsData.settings || null)
      
      // Fetch active sessions
      const sessionsRes = await fetch('/api/user/sessions')
      const sessionsData = await sessionsRes.json()
      setSessions(sessionsData.sessions || [])
      
    } catch (error) {
      console.error('Error fetching security data:', error)
      setError('Failed to load security settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: keyof SecuritySettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value })
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/user/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update security settings')
      }

      setSuccess('Security settings updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    // Validate passwords
    if (!passwordData.currentPassword) {
      setError('Please enter your current password')
      return
    }

    if (!passwordData.newPassword) {
      setError('Please enter a new password')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Current password is incorrect')
        }
        throw new Error(data.error || 'Failed to change password')
      }

      // Clear form
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
      
      // Show success message
      setSuccess('Password changed successfully!')
      
      // Refresh security data to update password last changed
      fetchSecurityData()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/user/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })

      if (response.ok) {
        fetchSecurityData()
        setSuccess('Session revoked successfully')
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (error) {
      console.error('Error revoking session:', error)
    }
  }

  const handleRevokeAllSessions = async () => {
    try {
      const response = await fetch('/api/user/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true })
      })

      if (response.ok) {
        fetchSecurityData()
        setSuccess('All other sessions revoked successfully')
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (error) {
      console.error('Error revoking sessions:', error)
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />
      case 'tablet':
        return <Smartphone className="w-5 h-5" />
      default:
        return <Globe className="w-5 h-5" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return 'Yesterday'
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading security settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-deep-teal">Security</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account security and privacy</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2 animate-slideDown">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2 animate-slideDown">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Password Section */}
        <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-soft-gold/10 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-soft-gold" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-deep-teal">Password</h2>
                  <p className="text-sm text-gray-500">Last changed: {settings?.passwordLastChanged ? new Date(settings.passwordLastChanged).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all btn-shimmer"
                >
                  Change Password
                </button>
              )}
            </div>
          </div>

          {showPasswordForm && (
            <div className="p-6 bg-gray-50">
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-medium mb-2">Password Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>At least 8 characters long</li>
                    <li>Contains at least one uppercase letter</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      setError(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 btn-shimmer"
                  >
                    {saving ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-soft-gold/10 rounded-full flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-soft-gold" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-deep-teal">Two-Factor Authentication</h2>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings?.twoFactorEnabled}
                  onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
              </label>
            </div>

            {settings?.twoFactorEnabled && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Two-factor authentication is enabled
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-deep-teal">Security Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-deep-teal">Remember Me</p>
                <p className="text-sm text-gray-500">Stay logged in across sessions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings?.rememberMe}
                  onChange={(e) => handleSettingChange('rememberMe', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-deep-teal">Login Alerts</p>
                <p className="text-sm text-gray-500">Get notified of new logins to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings?.loginAlerts}
                  onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-deep-teal">Suspicious Activity Alerts</p>
                <p className="text-sm text-gray-500">Get alerts for suspicious account activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings?.suspiciousActivityAlerts}
                  onChange={(e) => handleSettingChange('suspiciousActivityAlerts', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <select
                value={settings?.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
                <option value="480">8 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Active Sessions</label>
              <select
                value={settings?.maxSessions}
                onChange={(e) => handleSettingChange('maxSessions', parseInt(e.target.value))}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              >
                <option value="3">3 sessions</option>
                <option value="5">5 sessions</option>
                <option value="10">10 sessions</option>
                <option value="20">20 sessions</option>
                <option value="50">50 sessions</option>
              </select>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 btn-shimmer"
            >
              {saving ? 'Saving...' : 'Save Security Settings'}
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-deep-teal">Active Sessions</h2>
              {sessions.length > 1 && (
                <button
                  onClick={handleRevokeAllSessions}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Revoke All Other Sessions
                </button>
              )}
            </div>
          </div>
          <div className="divide-y">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-deep-teal">{session.deviceName || 'Unknown Device'}</p>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {session.browser} on {session.os}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.ipAddress} • {session.location || 'Unknown location'} • Last active {formatDate(session.lastActive)}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No active sessions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
