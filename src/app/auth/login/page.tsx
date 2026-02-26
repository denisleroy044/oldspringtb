'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password')
      }

      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        sessionStorage.setItem('user', JSON.stringify(data.user))
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream overflow-hidden relative">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-deep-teal/5 via-soft-gold/10 to-sage/5"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-soft-gold/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-deep-teal/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sage/10 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Brand Message with Glass Images */}
            <ScrollAnimation animation="fadeInLeft" className="hidden lg:block">
              <div className="pr-12">
                {/* Logo */}
                <div className="relative w-32 h-16 mb-8">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Oldspring Trust"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
                
                <h1 className="text-5xl font-black text-deep-teal mb-6 leading-tight">
                  Welcome Back to<br />
                  <span className="text-soft-gold">Oldspring Trust</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Access your accounts, manage your finances, and stay in control of your financial future—all from one secure place.
                </p>

                {/* Feature List */}
                <div className="space-y-4 mb-12">
                  {[
                    '24/7 account access',
                    'Secure encrypted banking',
                    'Real-time notifications',
                    'Mobile check deposit'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-soft-gold/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-soft-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Glass Images */}
                <div className="flex gap-4">
                  {/* Padlock - glasssafe.png */}
                  <div className="w-20 h-20 bg-gradient-to-br from-deep-teal/10 to-sage/10 rounded-2xl flex items-center justify-center p-3">
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/3d/glasssafe.png"
                        alt="Secure Banking"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* Bolt - glassaccount.png */}
                  <div className="w-20 h-20 bg-gradient-to-br from-soft-gold/10 to-sage/10 rounded-2xl flex items-center justify-center p-3">
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/3d/glassaccount.png"
                        alt="Fast Banking"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* Credit Card - glasscreditcard.png */}
                  <div className="w-20 h-20 bg-gradient-to-br from-sage/10 to-deep-teal/10 rounded-2xl flex items-center justify-center p-3">
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/3d/glasscreditcard.png"
                        alt="Credit Cards"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Right Column - Login Form */}
            <ScrollAnimation animation="fadeInRight">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-deep-teal mb-2">Sign In</h2>
                  <p className="text-gray-600">Welcome back! Please enter your details</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-soft-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-soft-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded transition-all duration-300 ${
                          rememberMe 
                            ? 'bg-soft-gold border-soft-gold' 
                            : 'bg-white border-gray-300 group-hover:border-soft-gold'
                        }`}>
                          {rememberMe && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
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
                    className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group disabled:opacity-50"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative">{loading ? 'Signing in...' : 'Sign In'}</span>
                  </button>

                  {/* Social Login */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 px-4 hover:border-soft-gold hover:shadow-md transition-all duration-300 group">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-soft-gold">Google</span>
                    </button>
                    
                    <button type="button" className="flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 px-4 hover:border-soft-gold hover:shadow-md transition-all duration-300 group">
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-soft-gold">Facebook</span>
                    </button>
                  </div>

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

                  {/* Security Note */}
                  <p className="text-center text-xs text-gray-400 mt-4">
                    Protected by industry-standard 256-bit encryption
                  </p>
                </form>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
