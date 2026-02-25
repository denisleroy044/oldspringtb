'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpUtils'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { 
  updateUserProfile, 
  changePassword, 
  toggleTwoFactor, 
  updateNotificationPreferences,
  updateAvatar,
  addUserNotification
} from '@/lib/auth/authService'

function AccountContent() {
  const { user, refreshUser } = useDashboardContext()
  const { user: authUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [activeTab, setActiveTab] = useState('profile')
  const [showOTP, setShowOTP] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  
  // Password change states
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  
  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  
  // Notification preferences
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    push: true
  })
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('sidebarChange' as any, handleSidebarChange)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Load user data into edit form
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }

    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [user])

  if (!authUser) {
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
  ]

  const handleOTPRequest = async (action: string) => {
    const response = await requestOTP(user?.phone || '1234567890', action)
    if (response.success && response.requestId) {
      setOtpRequestId(response.requestId)
      setShowOTP(true)
    }
  }

  const handleOTPVerify = async (code: string): Promise<boolean> => {
    if (code === 'RESEND') {
      const response = await requestOTP(user?.phone || '1234567890', 'account update')
      if (response.requestId) {
        setOtpRequestId(response.requestId)
      }
      return true
    }

    const isValid = await verifyOTP(otpRequestId, code)
    
    if (isValid) {
      // If we were changing password, save it
      if (showChangePassword) {
        handlePasswordChange()
      }
      if (isEditing) {
        handleSaveProfile()
      }
      setShowChangePassword(false)
      setIsEditing(false)
    }
    
    return isValid
  }

  const handleSaveProfile = () => {
    if (!user) return
    
    const updated = updateUserProfile(user.id, {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
      accountName: `${editForm.firstName} ${editForm.lastName}`
    })
    
    if (updated) {
      addUserNotification(user.id, {
        title: '✅ Profile Updated',
        message: 'Your profile information has been successfully updated.',
        type: 'success'
      })
      refreshUser()
    }
  }

  const handlePasswordChange = () => {
    if (!user) return
    
    // Validate
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('New passwords do not match')
      return
    }
    
    if (passwordData.new.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    
    const result = changePassword(user.id, passwordData.current, passwordData.new)
    
    if (result.success) {
      setPasswordSuccess('Password changed successfully!')
      setPasswordError('')
      setPasswordData({ current: '', new: '', confirm: '' })
      
      addUserNotification(user.id, {
        title: '🔐 Password Changed',
        message: 'Your password has been successfully updated.',
        type: 'success'
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(''), 3000)
    } else {
      setPasswordError(result.message)
    }
  }

  const handleToggle2FA = () => {
    if (!user) return
    
    const newState = !twoFAEnabled
    const result = toggleTwoFactor(user.id, newState)
    
    if (result.success) {
      setTwoFAEnabled(newState)
    }
  }

  const handleTogglePreference = (key: keyof typeof preferences) => {
    if (!user) return
    
    const newPrefs = {
      ...preferences,
      [key]: !preferences[key]
    }
    setPreferences(newPrefs)
    
    updateNotificationPreferences(user.id, newPrefs)
    
    addUserNotification(user.id, {
      title: '⚙️ Preferences Updated',
      message: `Notification preferences have been updated.`,
      type: 'info'
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    
    // In a real app, you'd upload to a server
    // For demo, we'll create a local object URL
    const reader = new FileReader()
    reader.onloadend = () => {
      const avatarUrl = reader.result as string
      updateAvatar(user.id, avatarUrl)
      
      addUserNotification(user.id, {
        title: '🖼️ Avatar Updated',
        message: 'Your profile picture has been changed.',
        type: 'success'
      })
      
      refreshUser()
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 flex flex-col ${
        !isMobile && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
      }`}>
        <Header />
        <main className="flex-1 pt-20 lg:pt-24 px-4 lg:px-6 pb-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">Account Settings</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Manage your profile and preferences</p>
          </div>

          {/* Profile Overview Card */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="relative group">
                  <img
                    src={user?.avatar || '/assets/img/avatars/default-avatar.svg'}
                    alt={user?.accountName}
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-[#1e3a5f] object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-[#e68a2e] text-white p-1.5 lg:p-2 rounded-full hover:bg-[#f5a344] transition opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">{user?.accountName}</h2>
                  <p className="text-xs lg:text-sm text-gray-500 capitalize">{user?.accountStatus}</p>
                  <p className="text-xs text-gray-400 mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditing(!isEditing)
                  if (!isEditing) {
                    setEditForm({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || '',
                      phone: user.phone || ''
                    })
                  }
                }}
                className="px-4 lg:px-6 py-2 text-sm lg:text-base border-2 border-[#1e3a5f] text-[#1e3a5f] rounded-lg lg:rounded-xl font-semibold hover:bg-[#1e3a5f] hover:text-white transition"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg">
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex space-x-4 lg:space-x-8 px-4 lg:px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 lg:py-4 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? 'border-[#1e3a5f] text-[#1e3a5f]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-1 lg:mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 lg:p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={isEditing ? editForm.firstName : user?.firstName || ''}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={isEditing ? editForm.lastName : user?.lastName || ''}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={isEditing ? editForm.email : user?.email || ''}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={isEditing ? editForm.phone : user?.phone || ''}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 lg:px-4 py-2 text-sm lg:text-base border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-[#1e3a5f] transition disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 lg:px-6 py-2 text-sm lg:text-base border-2 border-gray-300 rounded-lg lg:rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleOTPRequest('profile update')}
                        className="px-4 lg:px-6 py-2 text-sm lg:text-base bg-[#1e3a5f] text-white rounded-lg lg:rounded-xl font-semibold hover:bg-[#2b4c7a] transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-4 lg:space-y-6">
                  {/* Password Change Section */}
                  <div className="p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm lg:text-base font-semibold text-gray-900">Password</h3>
                        <p className="text-xs text-gray-500">Change your password regularly</p>
                      </div>
                      <button
                        onClick={() => setShowChangePassword(!showChangePassword)}
                        className="text-xs lg:text-sm text-[#1e3a5f] font-semibold hover:text-[#2b4c7a] transition"
                      >
                        {showChangePassword ? 'Cancel' : 'Change'}
                      </button>
                    </div>

                    {showChangePassword && (
                      <div className="space-y-3 mt-4">
                        {passwordSuccess && (
                          <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs text-green-600">{passwordSuccess}</p>
                          </div>
                        )}
                        {passwordError && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-600">{passwordError}</p>
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.current}
                            onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a5f] transition"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.new}
                            onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a5f] transition"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirm}
                            onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a5f] transition"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <button
                          onClick={() => handleOTPRequest('password change')}
                          disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
                          className="w-full mt-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#2b4c7a] transition disabled:opacity-50"
                        >
                          Update Password
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm lg:text-base font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={handleToggle2FA}
                        className={`px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm rounded-lg transition ${
                          twoFAEnabled 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-[#1e3a5f] text-white hover:bg-[#2b4c7a]'
                        }`}
                      >
                        {twoFAEnabled ? '✅ Enabled' : 'Enable 2FA'}
                      </button>
                    </div>
                    {twoFAEnabled && (
                      <p className="text-xs text-green-600 mt-2">
                        Two-factor authentication is active. Your account is extra secure.
                      </p>
                    )}
                  </div>

                  {/* Login History Preview */}
                  <div className="p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                    <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-2">Recent Login</h3>
                    <p className="text-xs text-gray-600">
                      Last login: {new Date(user?.lastLogin).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-4 lg:space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                    <div>
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900">Email Notifications</h3>
                      <p className="text-xs text-gray-500">Receive transaction alerts and updates via email</p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('email')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        preferences.email ? 'bg-[#1e3a5f]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.email ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                    <div>
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900">SMS Alerts</h3>
                      <p className="text-xs text-gray-500">Get text messages for large transactions and security alerts</p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('sms')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        preferences.sms ? 'bg-[#1e3a5f]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.sms ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                    <div>
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900">Push Notifications</h3>
                      <p className="text-xs text-gray-500">Receive real-time notifications in your browser</p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('push')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        preferences.push ? 'bg-[#1e3a5f]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.push ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    Changes to your preferences are saved automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
        <DashboardFooter />
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerify={handleOTPVerify}
        phoneNumber={user?.phone || '****'}
        purpose="verify changes"
      />
    </div>
  )
}

export default function AccountPage() {
  return (
    <DashboardProvider>
      <AccountContent />
    </DashboardProvider>
  )
}
