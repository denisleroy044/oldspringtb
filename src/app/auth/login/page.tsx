'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password')
      }

      // Store user data in localStorage or cookies if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        sessionStorage.setItem('user', JSON.stringify(data.user))
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with logo */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/logo.png"
                alt="Oldspring Trust"
                width={160}
                height={48}
                className="w-auto h-12 object-contain"
                priority
              />
            </Link>
            <div className="text-right text-sm text-gray-600">
              <p>Routing # 655205039</p>
              <p>24/7 Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Welcome Back Text */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-deep-teal mb-4">Welcome Back to Oldspring Trust</h2>
          <p className="text-gray-600 leading-relaxed">
            Access your accounts, manage your finances, and stay in control of your financial future—all from one secure place.
          </p>
        </div>

        {/* Feature */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-6 h-6 bg-soft-gold/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-soft-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-gray-700">24/7 account access</span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        <div>
          <h3 className="text-2xl font-semibold text-deep-teal mb-2">Sign In</h3>
          <p className="text-gray-600 mb-6">Welcome back! Please enter your details</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-soft-gold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-soft-gold border-gray-300 rounded focus:ring-soft-gold"
                />
                <span className="text-sm text-gray-600 group-hover:text-soft-gold transition-colors">
                  Remember me
                </span>
              </label>
              
              <Link 
                href="/auth/forgot-password" 
                className="text-sm font-medium text-deep-teal hover:text-soft-gold transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-deep-teal text-white py-3 rounded-lg font-medium hover:bg-soft-gold transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="font-semibold text-deep-teal hover:text-soft-gold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
