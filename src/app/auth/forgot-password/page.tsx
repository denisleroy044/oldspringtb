'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { useState } from 'react'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset request
    setIsSubmitted(true)
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
                  Forgot Your<br />
                  <span className="text-soft-gold">Password?</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  No worries! We'll send you reset instructions to your email address. Follow the link to create a new password and get back to your account.
                </p>

                {/* Feature List */}
                <div className="space-y-4">
                  {[
                    'Quick and secure process',
                    'Link expires in 24 hours',
                    'No account? Create one',
                    '24/7 customer support'
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

                {/* Decorative Elements */}
                <div className="mt-12 flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-deep-teal/10 to-sage/10 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">🔐</span>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-soft-gold/10 to-sage/10 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">📧</span>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-sage/10 to-deep-teal/10 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">⚡</span>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Right Column - Forgot Password Form */}
            <ScrollAnimation animation="fadeInRight">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-deep-teal mb-2">Reset Password</h2>
                  <p className="text-gray-600">
                    {!isSubmitted 
                      ? "Enter your email address and we'll send you instructions" 
                      : "Check your email for reset instructions"}
                  </p>
                </div>

                {!isSubmitted ? (
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    {/* Send Reset Link Button */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      <span className="relative">Send Reset Link</span>
                    </button>

                    {/* Back to Login Link */}
                    <div className="text-center mt-6">
                      <Link 
                        href="/auth/login" 
                        className="text-sm font-medium text-deep-teal hover:text-soft-gold transition-colors inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Sign In
                      </Link>
                    </div>
                  </form>
                ) : (
                  <div className="text-center space-y-6">
                    {/* Success Message */}
                    <div className="w-20 h-20 mx-auto bg-soft-gold/20 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-soft-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-deep-teal mb-2">Check Your Email</h3>
                      <p className="text-gray-600">
                        We've sent password reset instructions to:<br />
                        <span className="font-medium text-deep-teal">{email}</span>
                      </p>
                    </div>

                    <div className="bg-soft-gold/10 rounded-xl p-4 text-sm text-gray-600">
                      <p>Didn't receive the email? Check your spam folder or</p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="text-deep-teal font-medium hover:text-soft-gold transition-colors"
                      >
                        try another email address
                      </button>
                    </div>

                    {/* Resend Link */}
                    <button
                      className="text-sm text-deep-teal hover:text-soft-gold transition-colors"
                    >
                      Resend email
                    </button>
                  </div>
                )}
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
