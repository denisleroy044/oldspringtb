'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Image from 'next/image'

export default function OTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const purpose = searchParams.get('purpose') || 'ACCOUNT_OPENING'
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get email from session storage
    if (purpose === '2FA') {
      const storedEmail = sessionStorage.getItem('2fa_email')
      if (storedEmail) setEmail(storedEmail)
    } else {
      const userEmail = sessionStorage.getItem('signup_email')
      if (userEmail) setEmail(userEmail)
    }
  }, [purpose])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (otpCode: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode, purpose }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      if (purpose === '2FA') {
        sessionStorage.removeItem('2fa_user_id')
        sessionStorage.removeItem('2fa_email')
        router.push('/dashboard')
      } else {
        sessionStorage.removeItem('signup_email')
        router.push('/auth/login?verified=true')
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setTimer(60)
    setCanResend(false)
    setError('')

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }),
      })

      if (!response.ok) throw new Error('Failed to resend code')
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
      setTimer(0)
      setCanResend(true)
    }
  }

  const getPurposeTitle = () => {
    switch(purpose) {
      case '2FA': return 'Two-Factor Authentication'
      case 'PASSWORD_RESET': return 'Reset Password'
      default: return 'Verify Your Email'
    }
  }

  const getPurposeDescription = () => {
    switch(purpose) {
      case '2FA': return 'Enter the 6-digit code from your authenticator app'
      default: return 'Enter the 6-digit code sent to your email'
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Column - Brand Message */}
      <ScrollAnimation animation="fadeInLeft" className="hidden lg:block">
        <div className="pr-12">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-soft-gold/30 rounded-2xl blur-2xl"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-deep-teal to-sage rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-4xl">O</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-deep-teal mb-6 leading-tight">
            {getPurposeTitle()}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {getPurposeDescription()}
          </p>

          <div className="space-y-4">
            {[
              'Code expires in 10 minutes',
              'One-time use only',
              'Secure verification process',
              'Instant account access'
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

          <div className="mt-12 bg-white/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-soft-gold">
            <p className="text-gray-600 text-sm">
              <span className="font-semibold text-deep-teal">Need help?</span> Contact our support team at{' '}
              <a href="mailto:support@oldspring.com" className="text-soft-gold hover:underline">
                support@oldspring.com
              </a>
            </p>
          </div>
        </div>
      </ScrollAnimation>

      {/* Right Column - OTP Form */}
      <ScrollAnimation animation="fadeInRight">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-deep-teal mb-2">Verification Code</h2>
            <p className="text-gray-600">
              {email ? `Code sent to ${email}` : 'Enter the 6-digit code'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Verification Code
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-semibold border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              {!canResend ? (
                <p className="text-sm text-gray-500">
                  Resend code in <span className="font-medium text-deep-teal">{timer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm font-medium text-soft-gold hover:text-deep-teal transition-colors disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleSubmit(otp.join(''))}
              disabled={otp.some(digit => !digit) || loading}
              className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="relative">{loading ? 'Verifying...' : 'Verify & Continue'}</span>
            </button>

            <div className="flex items-center justify-between mt-6">
              <Link 
                href={purpose === '2FA' ? '/auth/login' : '/auth/signup'} 
                className="text-sm text-gray-600 hover:text-soft-gold transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </Link>
              
              <Link 
                href="/auth/login" 
                className="text-sm text-gray-600 hover:text-soft-gold transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </ScrollAnimation>
    </div>
  )
}
