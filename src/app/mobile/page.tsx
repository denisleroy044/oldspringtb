export const dynamic = 'force-dynamic'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function MobileAppPage() {
  const { user } = useAuth()
  const [selectedDevice, setSelectedDevice] = useState<'ios' | 'android'>('ios')

  const features = [
    { icon: '📱', title: 'Mobile Banking', description: 'Bank anywhere, anytime' },
    { icon: '🔐', title: 'Biometric Login', description: 'Face ID & Fingerprint' },
    { icon: '💳', title: 'Card Control', description: 'Freeze/unfreeze cards' },
    { icon: '📸', title: 'Mobile Deposit', description: 'Deposit checks with camera' },
    { icon: '📍', title: 'ATM Locator', description: 'Find nearby ATMs' },
    { icon: '🔔', title: 'Push Notifications', description: 'Real-time alerts' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e3a5f] to-[#0f2a44]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#e68a2e] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="text-white font-semibold">Oldspring Mobile</span>
            </Link>
            <Link
              href={user ? '/dashboard' : '/'}
              className="text-white hover:text-gray-200 transition"
            >
              ← Back
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Banking in Your Pocket
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get the Oldspring Trust mobile app and experience banking on the go. 
            Secure, fast, and packed with features.
          </p>
        </div>

        {/* App Download Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* iOS App */}
          <div className={`bg-white rounded-2xl shadow-2xl p-8 transform transition hover:scale-105 ${
            selectedDevice === 'ios' ? 'ring-4 ring-[#e68a2e]' : ''
          }`}>
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">🍎</span>
              <h2 className="text-2xl font-bold text-gray-900">iOS App</h2>
              <p className="text-gray-600 mt-2">For iPhone and iPad</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">iOS 14.0 or later</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Face ID & Touch ID</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Apple Watch compatible</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDevice('ios')}
              className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-semibold hover:bg-[#2b4c7a] transition flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span>Download on App Store</span>
            </button>
          </div>

          {/* Android App */}
          <div className={`bg-white rounded-2xl shadow-2xl p-8 transform transition hover:scale-105 ${
            selectedDevice === 'android' ? 'ring-4 ring-[#e68a2e]' : ''
          }`}>
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">🤖</span>
              <h2 className="text-2xl font-bold text-gray-900">Android App</h2>
              <p className="text-gray-600 mt-2">For phones and tablets</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Android 8.0 or later</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Fingerprint scanner</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Wear OS compatible</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDevice('android')}
              className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-semibold hover:bg-[#2b4c7a] transition flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.5,11.5 20.16,11.77L17.38,13.5L14.7,10.81L17.38,8.12L20.16,9.85M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <span>Get it on Google Play</span>
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto mb-20">
          <div className="text-center text-white mb-6">
            <h3 className="text-2xl font-bold mb-2">Scan to Download</h3>
            <p className="text-gray-300">Point your camera at the QR code</p>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-2xl">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-300 mt-4 text-sm">
            QR code will direct you to the appropriate app store
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
              <span className="text-4xl mb-3 block">{feature.icon}</span>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Security Note */}
        <div className="mt-16 bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center">
          <p className="text-green-300 text-sm">
            🔒 Your security is our priority. The mobile app uses the same bank-level encryption 
            as our website, plus additional device-specific security features.
          </p>
        </div>
      </main>
    </div>
  )
}
