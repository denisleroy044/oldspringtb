'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { updateUserProfile, changePassword, toggleTwoFactor, updateNotificationPreferences, updateAvatar, addUserNotification } from '@/lib/auth/authService'
import { requestOTP, verifyOTP } from '@/lib/otp/otpService'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AccountContent />
    </div>
  )
}

function AccountContent() {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarState, setSidebarState] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null)
  const [otpCode, setOtpCode] = useState('')
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<{
    type: 'profile' | 'password' | '2fa' | 'notifications' | 'avatar'
    data?: any
  } | null>(null)
  
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    sms: false
  })
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || ['', '']
      setEditForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || ''
      })
      setTwoFactorEnabled(user.twoFactorEnabled || false)
      if (user.notificationPreferences) {
        setNotificationPrefs(user.notificationPreferences)
      }
    }
  }, [user])

  useEffect(() => {
    const handleSidebarChange = () => {
      setSidebarState(Date.now())
    }
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('sidebarChange' as any, handleSidebarChange)
    window.addEventListener('resize', checkMobile)
    checkMobile()
    
    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setIsLoading(true)
    
    try {
      const updated = await updateUserProfile({
        id: user.id,
        name: `${editForm.firstName} ${editForm.lastName}`.trim(),
        email: editForm.email
      })
      
      addUserNotification(user.id, {
        title: '✅ Profile Updated',
        message: 'Your profile information has been successfully updated.',
        type: 'success'
      })
      
      setUser(updated)
      setIsEditing(false)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    
    setIsLoading(true)
    
    try {
      const success = await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      if (success) {
        addUserNotification(user.id, {
          title: '🔐 Password Changed',
          message: 'Your password has been successfully updated.',
          type: 'success'
        })
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setMessage({ type: 'success', text: 'Password changed successfully!' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorToggle = async () => {
    if (!user) return
    
    setIsLoading(true)
    
    try {
      // Pass user.name for personalization in the OTP email
      const response = await requestOTP(user.email, '2fa', user.name)
      if (response.requestId) {
        setOtpRequestId(response.requestId)
        setPendingAction({ type: '2fa', data: !twoFactorEnabled })
        setShowOtpModal(true)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to request OTP. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationSubmit = async () => {
    if (!user) return
    
    setIsLoading(true)
    
    try {
      const updated = await updateNotificationPreferences(notificationPrefs)
      addUserNotification(user.id, {
        title: '⚙️ Preferences Updated',
        message: 'Your notification preferences have been saved.',
        type: 'success'
      })
      setMessage({ type: 'success', text: 'Notification preferences updated!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update preferences.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarSubmit = async () => {
    if (!user || !avatarFile) return
    
    setIsLoading(true)
    
    try {
      const result = await updateAvatar(avatarFile)
      addUserNotification(user.id, {
        title: '🖼️ Avatar Updated',
        message: 'Your profile picture has been changed.',
        type: 'success'
      })
      setMessage({ type: 'success', text: 'Avatar updated successfully!' })
      setAvatarFile(null)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update avatar.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    if (!otpRequestId || !pendingAction || !user) return
    
    setIsLoading(true)
    
    try {
      const isValid = await verifyOTP(otpRequestId, otpCode)
      if (isValid) {
        if (pendingAction.type === '2fa') {
          const newState = await toggleTwoFactor(pendingAction.data)
          setTwoFactorEnabled(newState)
          addUserNotification(user.id, {
            title: newState ? '🔒 Two-Factor Enabled' : '🔓 Two-Factor Disabled',
            message: newState ? 'Your account is now more secure.' : 'Two-factor authentication has been turned off.',
            type: 'success'
          })
        }
        setShowOtpModal(false)
        setOtpCode('')
        setPendingAction(null)
        setMessage({ type: 'success', text: 'Verification successful!' })
      } else {
        setMessage({ type: 'error', text: 'Invalid OTP code.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Verification failed.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your account settings.</p>
          <Link href="/auth/login" className="bg-deep-teal text-white px-6 py-3 rounded-lg hover:bg-soft-gold transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 md:p-8 transition-all duration-300 ${isMobile ? 'ml-0' : 'ml-64'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-deep-teal mb-2">Account Settings</h1>
        <p className="text-gray-600 mb-8">Manage your profile, security, and preferences</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'security', label: 'Security', icon: '🔒' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' },
            { id: 'appearance', label: 'Appearance', icon: '🎨' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${
                activeTab === tab.id
                  ? 'border-soft-gold text-deep-teal'
                  : 'border-transparent text-gray-500 hover:text-deep-teal'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <ScrollAnimation animation="fadeIn">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-deep-teal">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-soft-gold hover:text-deep-teal transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-deep-teal text-white px-6 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        if (user) {
                          const nameParts = user.name?.split(' ') || ['', '']
                          setEditForm({
                            firstName: nameParts[0] || '',
                            lastName: nameParts.slice(1).join(' ') || '',
                            email: user.email || ''
                          })
                        }
                      }}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="font-medium">{editForm.firstName || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="font-medium">{editForm.lastName || 'Not set'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium capitalize">{user.role?.toLowerCase() || 'user'}</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollAnimation>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <ScrollAnimation animation="fadeIn">
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-deep-teal mb-4">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-deep-teal text-white px-6 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-deep-teal">Two-Factor Authentication</h2>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={handleTwoFactorToggle}
                    disabled={isLoading}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                      twoFactorEnabled ? 'bg-soft-gold' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {twoFactorEnabled 
                    ? 'Two-factor authentication is enabled. You\'ll need a verification code from your email to sign in.' 
                    : 'Enable two-factor authentication to protect your account with an additional verification step.'}
                </p>
              </div>
            </div>
          </ScrollAnimation>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <ScrollAnimation animation="fadeIn">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-deep-teal mb-4">Notification Preferences</h2>
              <p className="text-sm text-gray-500 mb-6">Choose how you want to receive notifications</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xl">📧</span>
                    </div>
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.email}
                      onChange={() => handleNotificationChange('email')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-soft-gold rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-soft-gold"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-xl">📱</span>
                    </div>
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Real-time alerts in your browser</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.push}
                      onChange={() => handleNotificationChange('push')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-soft-gold rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-soft-gold"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">💬</span>
                    </div>
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Text messages for important alerts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPrefs.sms}
                      onChange={() => handleNotificationChange('sms')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-soft-gold rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-soft-gold"></div>
                  </label>
                </div>

                <button
                  onClick={handleNotificationSubmit}
                  disabled={isLoading}
                  className="mt-4 bg-deep-teal text-white px-6 py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </ScrollAnimation>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <ScrollAnimation animation="fadeIn">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-deep-teal mb-4">Appearance</h2>
              
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : user.avatar ? (
                          <img src={user.avatar} alt="Current avatar" className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0) || 'U'
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-soft-gold/20 file:text-deep-teal hover:file:bg-soft-gold/30"
                      />
                      <p className="text-xs text-gray-500 mt-2">Recommended: Square image, at least 200x200px</p>
                      {avatarFile && (
                        <button
                          onClick={handleAvatarSubmit}
                          disabled={isLoading}
                          className="mt-3 bg-deep-teal text-white px-4 py-2 rounded-lg text-sm hover:bg-soft-gold transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Uploading...' : 'Upload New Avatar'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        )}

        {/* OTP Modal */}
        {showOtpModal && otpRequestId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-deep-teal mb-2">Verify Your Identity</h3>
              <p className="text-gray-600 mb-4">Enter the 6-digit verification code sent to {user.email}.</p>
              
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent mb-4 text-center text-2xl tracking-widest"
                maxLength={6}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleOtpVerify}
                  disabled={isLoading || otpCode.length !== 6}
                  className="flex-1 bg-deep-teal text-white py-3 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </button>
                <button
                  onClick={() => {
                    setShowOtpModal(false)
                    setOtpCode('')
                    setPendingAction(null)
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
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
