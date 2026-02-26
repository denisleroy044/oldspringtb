'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accountType, setAccountType] = useState('personal')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          accountType
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      router.push('/auth/login?registered=true')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
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
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Benefits with Glass Images */}
            <ScrollAnimation animation="fadeInLeft" className="hidden lg:block sticky top-24">
              <div className="pr-12">
                {/* Logo */}
                <div className="relative w-32 h-16 mb-8">
                  <Image
                    src="/images/logo/favicon.png"
                    alt="Oldspring Trust"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
                
                <h1 className="text-5xl font-black text-deep-teal mb-6 leading-tight">
                  Start Your Journey<br />
                  <span className="text-soft-gold">With Oldspring Trust</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join thousands of satisfied customers who trust us with their financial future. Open your account in minutes.
                </p>

                {/* Benefits Grid with Glass Images */}
                <div className="grid grid-cols-2 gap-6">
                  {/* No Fees - moneybag.png */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-12 h-12 bg-soft-gold/20 rounded-lg flex items-center justify-center mb-3 p-2">
                      <div className="relative w-full h-full">
                        <Image
                          src="/images/3d/moneybag.png"
                          alt="No Fees"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="font-bold text-deep-teal mb-1">No Fees</h3>
                    <p className="text-xs text-gray-600">Zero monthly maintenance fees</p>
                  </div>
                  
                  {/* Instant Access - glassaccount.png */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-12 h-12 bg-sage/20 rounded-lg flex items-center justify-center mb-3 p-2">
                      <div className="relative w-full h-full">
                        <Image
                          src="/images/3d/glassaccount.png"
                          alt="Instant Access"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="font-bold text-deep-teal mb-1">Instant Access</h3>
                    <p className="text-xs text-gray-600">Get your account instantly</p>
                  </div>
                  
                  {/* Bank-Grade Security - glasssafe.png */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-12 h-12 bg-deep-teal/20 rounded-lg flex items-center justify-center mb-3 p-2">
                      <div className="relative w-full h-full">
                        <Image
                          src="/images/3d/glasssafe.png"
                          alt="Bank-Grade Security"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="font-bold text-deep-teal mb-1">Bank-Grade Security</h3>
                    <p className="text-xs text-gray-600">256-bit encryption</p>
                  </div>
                  
                  {/* Free Debit Card - glasscreditcard.png */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-12 h-12 bg-soft-gold/20 rounded-lg flex items-center justify-center mb-3 p-2">
                      <div className="relative w-full h-full">
                        <Image
                          src="/images/3d/glasscreditcard.png"
                          alt="Free Debit Card"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="font-bold text-deep-teal mb-1">Free Debit Card</h3>
                    <p className="text-xs text-gray-600">Get your card in 5-7 days</p>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-soft-gold">
                  <p className="text-gray-600 italic mb-3">
                    "Opening my account took less than 5 minutes. The digital banking experience is seamless!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-deep-teal to-sage rounded-full flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <p className="font-semibold text-deep-teal">James Donaldson</p>
                      <p className="text-xs text-gray-500">Customer since 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Right Column - Signup Form */}
            <ScrollAnimation animation="fadeInRight">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-deep-teal mb-2">Create Your Account</h2>
                  <p className="text-gray-600">Join Oldspring Trust and start building your financial future</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Account Type Selection with Glass Images */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setAccountType('personal')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      accountType === 'personal'
                        ? 'border-soft-gold bg-soft-gold/5'
                        : 'border-gray-200 hover:border-soft-gold hover:bg-soft-gold/5'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 mb-2 relative">
                        <Image
                          src="/images/3d/glasssecure.png"
                          alt="Personal Banking"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className={`font-medium ${
                        accountType === 'personal' ? 'text-soft-gold' : 'text-gray-600'
                      }`}>Personal</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setAccountType('business')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      accountType === 'business'
                        ? 'border-soft-gold bg-soft-gold/5'
                        : 'border-gray-200 hover:border-soft-gold hover:bg-soft-gold/5'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 mb-2 relative">
                        <Image
                          src="/images/3d/glassbusiness.png"
                          alt="Business Banking"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className={`font-medium ${
                        accountType === 'business' ? 'text-soft-gold' : 'text-gray-600'
                      }`}>Business</span>
                    </div>
                  </button>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Password */}
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
                        minLength={8}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                        placeholder="Create a password"
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
                    <p className="text-xs text-gray-500 mt-2">
                      Must be at least 8 characters with 1 uppercase, 1 number & 1 special character
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
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

                  {/* Terms & Conditions */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded transition-all duration-300 ${
                        agreeTerms 
                          ? 'bg-soft-gold border-soft-gold' 
                          : 'bg-white border-gray-300 group-hover:border-soft-gold'
                      }`}>
                        {agreeTerms && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-soft-gold transition-colors">
                      I agree to the{' '}
                      <Link href="/terms" className="font-semibold text-deep-teal hover:text-soft-gold">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="font-semibold text-deep-teal hover:text-soft-gold">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {/* Create Account Button */}
                  <button
                    type="submit"
                    disabled={!agreeTerms || loading}
                    className={`w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group ${
                      (!agreeTerms || loading) && 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative">{loading ? 'Creating Account...' : 'Create Account'}</span>
                  </button>

                  {/* Sign In Link */}
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      href="/auth/login" 
                      className="font-semibold text-deep-teal hover:text-soft-gold transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>

                  {/* Security Note */}
                  <p className="text-center text-xs text-gray-400">
                    By creating an account, you agree to receive electronic communications
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
