'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

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
    if (value.length > 1) return // Only allow single digit

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = () => {
    setTimer(60)
    setCanResend(false)
    // Resend OTP logic here
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
                  Verify Your<br />
                  <span className="text-soft-gold">Identity</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  We've sent a 6-digit verification code to your email. Enter the code below to verify your identity and continue.
                </p>

                {/* Security Features */}
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

                {/* Support Info */}
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
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <form className="space-y-8">
                  {/* OTP Input Grid */}
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
                        />
                      ))}
                    </div>
                  </div>

                  {/* Timer and Resend */}
                  <div className="text-center">
                    {!canResend ? (
                      <p className="text-sm text-gray-500">
                        Resend code in <span className="font-medium text-deep-teal">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-sm font-medium text-soft-gold hover:text-deep-teal transition-colors"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative">Verify & Continue</span>
                  </button>

                  {/* Back Links */}
                  <div className="flex items-center justify-between mt-6">
                    <Link 
                      href="/auth/forgot-password" 
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
        </div>
      </main>
      <Footer />
    </>
  )
}
