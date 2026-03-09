'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Mail,
  Smartphone,
  Globe,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Shield,
  DollarSign,
  Calendar,
  Gift,
  Settings,
  Zap,
  Eye,
  EyeOff,
  BellOff
} from 'lucide-react'

interface NotificationPreferences {
  // Email notifications
  emailNotifications: boolean
  emailTransactions: boolean
  emailPromotions: boolean
  emailSecurity: boolean
  emailNewsletter: boolean
  
  // Push notifications
  pushNotifications: boolean
  pushTransactions: boolean
  pushSecurity: boolean
  pushReminders: boolean
  
  // SMS notifications
  smsNotifications: boolean
  smsTransactions: boolean
  smsSecurity: boolean
  
  // In-app notifications
  inAppNotifications: boolean
  inAppTransactions: boolean
  inAppSecurity: boolean
  inAppPromotions: boolean
  
  // Marketing preferences
  marketingEmails: boolean
  shareData: boolean
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/notifications/preferences')
      const data = await response.json()
      
      if (response.ok) {
        setPreferences(data.preferences || {})
      } else {
        // Set default preferences if none exist
        setPreferences({
          emailNotifications: true,
          emailTransactions: true,
          emailPromotions: false,
          emailSecurity: true,
          emailNewsletter: false,
          pushNotifications: true,
          pushTransactions: true,
          pushSecurity: true,
          pushReminders: true,
          smsNotifications: false,
          smsTransactions: false,
          smsSecurity: true,
          inAppNotifications: true,
          inAppTransactions: true,
          inAppSecurity: true,
          inAppPromotions: false,
          marketingEmails: false,
          shareData: false
        })
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
      setError('Failed to load notification preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (preferences) {
      setPreferences({ ...preferences, [key]: !preferences[key] })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/user/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save preferences')
      }

      setSuccess('Notification preferences saved successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const NotificationSection = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-soft-gold/10 rounded-lg">
            <Icon className="w-5 h-5 text-soft-gold" />
          </div>
          <h2 className="font-semibold text-deep-teal">{title}</h2>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {children}
      </div>
    </div>
  )

  const NotificationToggle = ({ label, description, checked, onChange }: any) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-soft-gold/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-deep-teal peer-checked:to-sage"></div>
      </label>
    </div>
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading notification preferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-deep-teal">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Manage how you receive notifications</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {preferences && (
        <div className="space-y-6">
          {/* Email Notifications */}
          <NotificationSection title="Email Notifications" icon={Mail}>
            <NotificationToggle
              label="Enable Email Notifications"
              description="Receive notifications via email"
              checked={preferences.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            {preferences.emailNotifications && (
              <>
                <div className="border-t my-2"></div>
                <NotificationToggle
                  label="Transactions"
                  description="Get emails about your transactions"
                  checked={preferences.emailTransactions}
                  onChange={() => handleToggle('emailTransactions')}
                />
                <NotificationToggle
                  label="Security Alerts"
                  description="Important security notifications"
                  checked={preferences.emailSecurity}
                  onChange={() => handleToggle('emailSecurity')}
                />
                <NotificationToggle
                  label="Promotions"
                  description="Special offers and promotions"
                  checked={preferences.emailPromotions}
                  onChange={() => handleToggle('emailPromotions')}
                />
                <NotificationToggle
                  label="Newsletter"
                  description="Monthly newsletter and updates"
                  checked={preferences.emailNewsletter}
                  onChange={() => handleToggle('emailNewsletter')}
                />
              </>
            )}
          </NotificationSection>

          {/* Push Notifications */}
          <NotificationSection title="Push Notifications" icon={Bell}>
            <NotificationToggle
              label="Enable Push Notifications"
              description="Receive notifications on your device"
              checked={preferences.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
            {preferences.pushNotifications && (
              <>
                <div className="border-t my-2"></div>
                <NotificationToggle
                  label="Transactions"
                  description="Get notified about transactions"
                  checked={preferences.pushTransactions}
                  onChange={() => handleToggle('pushTransactions')}
                />
                <NotificationToggle
                  label="Security"
                  description="Security alerts and warnings"
                  checked={preferences.pushSecurity}
                  onChange={() => handleToggle('pushSecurity')}
                />
                <NotificationToggle
                  label="Reminders"
                  description="Payment reminders and due dates"
                  checked={preferences.pushReminders}
                  onChange={() => handleToggle('pushReminders')}
                />
              </>
            )}
          </NotificationSection>

          {/* SMS Notifications */}
          <NotificationSection title="SMS Notifications" icon={Smartphone}>
            <NotificationToggle
              label="Enable SMS Notifications"
              description="Receive text messages"
              checked={preferences.smsNotifications}
              onChange={() => handleToggle('smsNotifications')}
            />
            {preferences.smsNotifications && (
              <>
                <div className="border-t my-2"></div>
                <NotificationToggle
                  label="Transactions"
                  description="Get SMS alerts for transactions"
                  checked={preferences.smsTransactions}
                  onChange={() => handleToggle('smsTransactions')}
                />
                <NotificationToggle
                  label="Security"
                  description="Security alerts via SMS"
                  checked={preferences.smsSecurity}
                  onChange={() => handleToggle('smsSecurity')}
                />
              </>
            )}
          </NotificationSection>

          {/* In-App Notifications */}
          <NotificationSection title="In-App Notifications" icon={Globe}>
            <NotificationToggle
              label="Enable In-App Notifications"
              description="Show notifications within the app"
              checked={preferences.inAppNotifications}
              onChange={() => handleToggle('inAppNotifications')}
            />
            {preferences.inAppNotifications && (
              <>
                <div className="border-t my-2"></div>
                <NotificationToggle
                  label="Transactions"
                  description="Show transaction notifications"
                  checked={preferences.inAppTransactions}
                  onChange={() => handleToggle('inAppTransactions')}
                />
                <NotificationToggle
                  label="Security"
                  description="Show security alerts"
                  checked={preferences.inAppSecurity}
                  onChange={() => handleToggle('inAppSecurity')}
                />
                <NotificationToggle
                  label="Promotions"
                  description="Show promotional messages"
                  checked={preferences.inAppPromotions}
                  onChange={() => handleToggle('inAppPromotions')}
                />
              </>
            )}
          </NotificationSection>

          {/* Marketing Preferences */}
          <NotificationSection title="Marketing Preferences" icon={Gift}>
            <NotificationToggle
              label="Marketing Emails"
              description="Receive marketing and promotional emails"
              checked={preferences.marketingEmails}
              onChange={() => handleToggle('marketingEmails')}
            />
            <NotificationToggle
              label="Share Data"
              description="Allow us to share your data with partners (anonymized)"
              checked={preferences.shareData}
              onChange={() => handleToggle('shareData')}
            />
          </NotificationSection>

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
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
