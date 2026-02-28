'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NotificationPrefs {
  email: boolean
  push: boolean
  sms: boolean
}

interface FormData {
  name: string
  email: string
  phone: string
}

// Mock function to simulate OTP request
const requestOTP = async (email: string, purpose: string, name?: string) => {
  console.log(`Requesting OTP for ${email} for ${purpose} ${name ? `with name ${name}` : ''}`)
  return { requestId: 'mock-request-id' }
}

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AccountContent />
        </div>
      </main>
      <Footer />
    </>
  )
}

function AccountContent() {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpRequestId, setOtpRequestId] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    email: true,
    push: true,
    sms: false
  })
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      })
      setTwoFactorEnabled(user.twoFactorEnabled || false)
      if (user.notificationPreferences) {
        setNotificationPrefs({
          email: user.notificationPreferences.emailEnabled,
          push: user.notificationPreferences.pushEnabled,
          sms: user.notificationPreferences.smsEnabled
        })
      }
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNotificationChange = (key: keyof NotificationPrefs) => {
    setNotificationPrefs({
      ...notificationPrefs,
      [key]: !notificationPrefs[key]
    })
  }

  const handleSaveProfile = async () => {
    if (!user?.email) {
      alert('Please log in to continue')
      return
    }

    setIsLoading(true)
    try {
      const response = await requestOTP(
        user.email, 
        'profile update', 
        user.name || undefined
      )
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowOtpModal(true)
      }
    } catch (error) {
      console.error('Failed to request OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async () => {
    if (!otp || !user) return

    setIsLoading(true)
    try {
      // Verify OTP and update profile
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update local user state
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        notificationPreferences: {
          emailEnabled: notificationPrefs.email,
          pushEnabled: notificationPrefs.push,
          smsEnabled: notificationPrefs.sms,
          theme: user.notificationPreferences?.theme || 'light'
        }
      }
      setUser(updatedUser)
      
      // Update stored user data
      const storage = localStorage.getItem('user') ? localStorage : sessionStorage
      storage.setItem('user', JSON.stringify(updatedUser))
      
      setShowOtpModal(false)
      setOtp('')
      setIsEditing(false)
      
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    if (!user?.email) {
      alert('Please log in to continue')
      return
    }

    setIsLoading(true)
    try {
      const response = await requestOTP(
        user.email, 
        'toggle 2FA', 
        user.name || undefined
      )
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setShowOtpModal(true)
      }
    } catch (error) {
      console.error('Failed to request OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your account</p>
        <Link href="/auth/login" className="mt-4 inline-block bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-soft-gold transition-colors">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-teal">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and security</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'profile'
                ? 'border-soft-gold text-deep-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'security'
                ? 'border-soft-gold text-deep-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'notifications'
                ? 'border-soft-gold text-deep-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Notifications
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-deep-teal">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-soft-gold hover:text-deep-teal transition-colors font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formData.name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formData.phone || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-deep-teal mb-6">Security Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-soft-gold' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
              <Link
                href="/auth/forgot-password"
                className="inline-block bg-white border-2 border-deep-teal text-deep-teal px-6 py-2 rounded-lg hover:bg-deep-teal hover:text-white transition-colors"
              >
                Reset Password
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-deep-teal mb-6">Notification Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleNotificationChange('email')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationPrefs.email ? 'bg-soft-gold' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationPrefs.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
              </div>
              <button
                onClick={() => handleNotificationChange('push')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationPrefs.push ? 'bg-soft-gold' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationPrefs.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-500">Receive text messages for important alerts</p>
              </div>
              <button
                onClick={() => handleNotificationChange('sms')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationPrefs.sms ? 'bg-soft-gold' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationPrefs.sms ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">Verify Action</h2>
            
            <p className="text-gray-600 mb-6">
              Enter the 6-digit code sent to your email to confirm this action.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOtpModal(false)
                  setOtp('')
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6 || isLoading}
                className="flex-1 bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
