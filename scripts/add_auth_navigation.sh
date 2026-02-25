#!/bin/bash

# Add Home and Back Navigation to Auth Pages

set -e

echo "🧭 Adding Navigation to Auth Pages"
echo "=================================="

# ============================================
# UPDATE AUTH LAYOUT WITH HOME BUTTON
# ============================================
cat > src/app/auth/layout.tsx << 'EOF'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative">
      {/* Home Button - Always visible on auth pages */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 flex items-center space-x-2 text-gray-600 hover:text-[#1e3a5f] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-sm font-medium">Home</span>
      </Link>
      
      {children}
    </div>
  )
}
EOF

# ============================================
# UPDATE LOGIN PAGE WITH BACK TO HOME
# ============================================
cat > src/app/auth/login/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem('user', email)
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
      {/* Mobile Home Button (visible on small screens) */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 md:hidden flex items-center space-x-1 text-gray-500 hover:text-[#1e3a5f]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm">Back</span>
      </Link>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#1e3a5f] rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">G</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="demo@globalwealth.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-[#1e3a5f] rounded border-gray-300" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link href="/auth/forgot-password" className="text-sm text-[#1e3a5f] hover:text-[#2b4c7a]">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1e3a5f] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-[#1e3a5f] font-semibold hover:text-[#2b4c7a]">
          Sign up
        </Link>
      </p>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs font-medium text-gray-500 mb-2">Demo Credentials:</p>
        <p className="text-xs text-gray-600">Email: demo@globalwealth.com</p>
        <p className="text-xs text-gray-600">Password: password123</p>
      </div>
    </div>
  )
}
EOF

# ============================================
# CREATE FORGOT PASSWORD PAGE (OTP STEP 1)
# ============================================
mkdir -p src/app/auth/forgot-password
cat > src/app/auth/forgot-password/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate sending OTP
    setTimeout(() => {
      router.push('/auth/verify-otp')
    }, 1000)
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
      {/* Back Button */}
      <Link 
        href="/auth/login" 
        className="absolute top-4 left-4 flex items-center space-x-1 text-gray-500 hover:text-[#1e3a5f] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm">Back to Login</span>
      </Link>

      <div className="text-center mb-8 mt-8">
        <div className="w-16 h-16 bg-[#e68a2e] rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
        <p className="text-gray-600 mt-2">Enter your email and we'll send you a verification code</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1e3a5f] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link href="/auth/login" className="text-[#1e3a5f] font-semibold hover:text-[#2b4c7a]">
          Sign in
        </Link>
      </p>
    </div>
  )
}
EOF

# ============================================
# CREATE OTP VERIFICATION PAGE (STEP 2)
# ============================================
mkdir -p src/app/auth/verify-otp
cat > src/app/auth/verify-otp/page.tsx << 'EOF'
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VerifyOTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }

    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value !== '' && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const otpString = otp.join('')
    // Simulate verification
    setTimeout(() => {
      router.push('/auth/reset-password')
    }, 1000)
  }

  const resendCode = () => {
    setTimeLeft(60)
    // Resend logic here
    alert('New code sent!')
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
      {/* Back Button */}
      <Link 
        href="/auth/forgot-password" 
        className="absolute top-4 left-4 flex items-center space-x-1 text-gray-500 hover:text-[#1e3a5f] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm">Back</span>
      </Link>

      <div className="text-center mb-8 mt-8">
        <div className="w-16 h-16 bg-[#e68a2e] rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Verify Your Identity</h1>
        <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Verification Code
          </label>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                required
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-600">
              Resend code in <span className="font-semibold text-[#1e3a5f]">{timeLeft}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={resendCode}
              className="text-sm text-[#1e3a5f] hover:text-[#2b4c7a] font-semibold"
            >
              Resend Code
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.some(d => d === '')}
          className="w-full bg-[#1e3a5f] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        <Link href="/auth/login" className="text-[#1e3a5f] hover:text-[#2b4c7a]">
          ← Back to Login
        </Link>
      </p>
    </div>
  )
}
EOF

# ============================================
# CREATE RESET PASSWORD PAGE (STEP 3)
# ============================================
mkdir -p src/app/auth/reset-password
cat > src/app/auth/reset-password/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      router.push('/auth/login?reset=true')
    }, 1000)
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
      {/* Back Button */}
      <Link 
        href="/auth/verify-otp" 
        className="absolute top-4 left-4 flex items-center space-x-1 text-gray-500 hover:text-[#1e3a5f] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm">Back</span>
      </Link>

      <div className="text-center mb-8 mt-8">
        <div className="w-16 h-16 bg-[#e68a2e] rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="text-gray-600 mt-2">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="Enter new password"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="Confirm new password"
            required
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">Password requirements:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• At least one uppercase letter</li>
            <li>• At least one number</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1e3a5f] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}
EOF

# ============================================
# UPDATE SIGNUP PAGE WITH BACK BUTTON
# ============================================
cat > src/app/auth/signup/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
      {/* Back Button */}
      <Link 
        href="/auth/login" 
        className="absolute top-4 left-4 flex items-center space-x-1 text-gray-500 hover:text-[#1e3a5f] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm">Back to Login</span>
      </Link>

      <div className="text-center mb-8 mt-8">
        <div className="w-16 h-16 bg-[#1e3a5f] rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">G</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600">Join Global Wealth Management</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1e3a5f] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#1e3a5f] font-semibold hover:text-[#2b4c7a]">
          Sign in
        </Link>
      </p>
    </div>
  )
}
EOF

echo ""
echo "✅ Navigation Added to Auth Pages!"
echo "=================================="
echo ""
echo "📱 New Pages Created:"
echo "   • Forgot Password - First step (email input)"
echo "   • Verify OTP - 6-digit code entry with auto-focus"
echo "   • Reset Password - New password setup"
echo ""
echo "🧭 Navigation Features:"
echo "   • Home button on all auth pages (top-left)"
echo "   • Back buttons on OTP and reset password pages"
echo "   • OTP inputs auto-focus to next field"
echo "   • Countdown timer for resend code"
echo "   • Password validation and requirements"
echo ""
echo "🚀 Run: npm run dev"
echo "   Test the flow:"
echo "   1. /auth/login - Click 'Forgot password?'"
echo "   2. /auth/forgot-password - Enter email"
echo "   3. /auth/verify-otp - Enter 6-digit code"
echo "   4. /auth/reset-password - Set new password"
echo ""
echo "✅ Navigation is now complete!"
EOF

chmod +x scripts/add_auth_navigation.sh

echo "Run: ./scripts/add_auth_navigation.sh"