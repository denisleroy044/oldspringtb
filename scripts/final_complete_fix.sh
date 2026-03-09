#!/bin/bash

# Final Complete Fix for All Issues

set -e

echo "🔧 Final Complete Fix for All Issues"
echo "===================================="

# ============================================
# FIXED HEADER - NO JAVASCRIPT: LINKS
# ============================================
cat > src/components/layout/Header.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [branchHoursOpen, setBranchHoursOpen] = useState(false)
  const pathname = usePathname()

  // Don't show header on dashboard or auth pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth')) {
    return null
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
              alt="Oldspring Trust Bank"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            
            {/* Bank Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                Bank
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 w-96 bg-white shadow-xl border rounded-lg p-6 hidden group-hover:block z-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Bank</h4>
                    <ul className="space-y-2">
                      <li><Link href="/accounts" className="text-gray-600 hover:text-blue-600 text-sm">Oldspring Trust Accounts</Link></li>
                      <li><Link href="/credit-cards" className="text-gray-600 hover:text-blue-600 text-sm">Credit Cards</Link></li>
                      <li><Link href="/online-banking" className="text-gray-600 hover:text-blue-600 text-sm">Online & Mobile Banking</Link></li>
                      <li><Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm">Why Bank with Oldspring Trust?</Link></li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">Get rewards on Us</h4>
                    <p className="text-sm text-gray-600 mb-2">For a limited time, get a reward when you bank with us!</p>
                    <Link href="/checking-accounts" className="text-blue-600 text-sm font-medium hover:underline">Learn More →</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                Save
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 w-80 bg-white shadow-xl border rounded-lg p-6 hidden group-hover:block z-50">
                <h4 className="font-bold text-gray-900 mb-2">Save</h4>
                <ul className="space-y-2">
                  <li><Link href="/save#HighYieldSavings" className="text-gray-600 hover:text-blue-600 text-sm">High Yield Savings</Link></li>
                  <li><Link href="/save#StarSavings" className="text-gray-600 hover:text-blue-600 text-sm">Star Savings</Link></li>
                  <li><Link href="/save#Certificates" className="text-gray-600 hover:text-blue-600 text-sm">Certificates</Link></li>
                  <li><Link href="/save#HolidayClub" className="text-gray-600 hover:text-blue-600 text-sm">Holiday Club</Link></li>
                  <li><Link href="/save#MoneyMarket" className="text-gray-600 hover:text-blue-600 text-sm">Money Market</Link></li>
                </ul>
              </div>
            </div>

            {/* Borrow Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                Borrow
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 w-80 bg-white shadow-xl border rounded-lg p-6 hidden group-hover:block z-50">
                <h4 className="font-bold text-gray-900 mb-2">Borrow</h4>
                <ul className="space-y-2">
                  <li><Link href="/borrow#creditcard" className="text-gray-600 hover:text-blue-600 text-sm">Credit Cards</Link></li>
                  <li><Link href="/borrow#mortgage" className="text-gray-600 hover:text-blue-600 text-sm">Mortgage & Home Loan</Link></li>
                  <li><Link href="/borrow#personal" className="text-gray-600 hover:text-blue-600 text-sm">Personal Loans</Link></li>
                  <li><Link href="/borrow#auto" className="text-gray-600 hover:text-blue-600 text-sm">Auto Loans</Link></li>
                  <li><Link href="/borrow#student" className="text-gray-600 hover:text-blue-600 text-sm">Student Loans</Link></li>
                </ul>
              </div>
            </div>

            <Link href="/invest" className="text-gray-700 hover:text-blue-600 font-medium">Wealth & Retire</Link>
            <Link href="/insure" className="text-gray-700 hover:text-blue-600 font-medium">Insure</Link>
            <Link href="/learn-and-plan" className="text-gray-700 hover:text-blue-600 font-medium">Learn & Plan</Link>
            <Link href="/payments" className="text-gray-700 hover:text-blue-600 font-medium">Payments</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <span className="text-sm font-semibold text-blue-800">Routing # 655205039</span>
            
            {/* Branch Hours Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setBranchHoursOpen(!branchHoursOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
              >
                <img src="/templates/bank-pro/images/assets/ico-clock.svg" className="w-5 h-5" alt="" />
                <span className="text-sm">Branch Hours</span>
              </button>
              {branchHoursOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border p-4 z-50">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Mon-Thurs</span>
                      <span className="text-gray-600">8:30-5:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Friday</span>
                      <span className="text-gray-600">8:30-6:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-gray-600">9:00-1:00</span>
                    </div>
                  </div>
                  <Link href="mailto:support@oldspringtrust.com" className="block mt-3 text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    Schedule Appointment
                  </Link>
                </div>
              )}
            </div>

            <a href="mailto:support@oldspringtrust.com" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <img src="/templates/bank-pro/prefooter-icons/ico-star-circle.svg" className="w-5 h-5" alt="" />
              <span className="text-sm">support@oldspringtrust.com</span>
            </a>

            <Link
              href="/auth/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              LOGIN
            </Link>
            <Link
              href="/auth/signup"
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
            >
              OPEN ACCOUNT
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="py-2 text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/bank" className="py-2 text-gray-700 hover:text-blue-600">Bank</Link>
              <Link href="/save" className="py-2 text-gray-700 hover:text-blue-600">Save</Link>
              <Link href="/borrow" className="py-2 text-gray-700 hover:text-blue-600">Borrow</Link>
              <Link href="/invest" className="py-2 text-gray-700 hover:text-blue-600">Wealth & Retire</Link>
              <Link href="/insure" className="py-2 text-gray-700 hover:text-blue-600">Insure</Link>
              <Link href="/learn-and-plan" className="py-2 text-gray-700 hover:text-blue-600">Learn & Plan</Link>
              <Link href="/payments" className="py-2 text-gray-700 hover:text-blue-600">Payments</Link>
              <div className="pt-4 border-t flex flex-col space-y-2">
                <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded text-center">LOGIN</Link>
                <Link href="/auth/signup" className="border border-blue-600 text-blue-600 px-4 py-2 rounded text-center">OPEN ACCOUNT</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
EOF

# ============================================
# FIXED FOOTER - NO JAVASCRIPT: LINKS
# ============================================
cat > src/components/layout/Footer.tsx << 'EOF'
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  // Don't show footer on dashboard or auth pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth')) {
    return null
  }

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    alert('Temporarily unavailable, please contact us via Email')
  }

  return (
    <>
      {/* Quick Bar */}
      <div className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <img src="/templates/bank-pro/icons/footer-icons/citadel-credit-union-routing-number.svg" className="w-10 h-10 filter brightness-0 invert" alt="" />
              <div>
                <div className="text-sm text-blue-200">Routing #</div>
                <div className="font-semibold">655205039</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <img src="/templates/bank-pro/icons/prefooter-icons/icoclock.png" className="w-10 h-10 filter brightness-0 invert" alt="" />
              <div>
                <div className="text-sm text-blue-200">Branch Hours</div>
                <div className="text-sm">Mon-Thu: 8:30-5:00 | Fri: 8:30-6:00</div>
                <div className="text-sm">Sat: 9:00-1:00</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <img src="/templates/bank-pro/icons/footer-icons/call-citadel-credit-union.svg" className="w-10 h-10 filter brightness-0 invert" alt="" />
              <div>
                <div className="text-sm text-blue-200">Customer Service</div>
                <a href="mailto:support@oldspringtrust.com" className="text-sm hover:text-blue-300">
                  support@oldspringtrust.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <img src="/templates/bank-pro/footer-images/live-video-call.png" className="w-10 h-10 filter brightness-0 invert" alt="" />
              <div>
                <div className="text-sm text-blue-200">Video Connect</div>
                <button 
                  onClick={handleVideoClick}
                  className="text-sm hover:text-blue-300"
                >
                  Chat Virtually
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-yellow-400">Building Strength Together</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Oldspring Trust is a not-for-profit credit union bank built on the unshakeable promise to serve those who work every day to build a better future for us all. For over 80 years, we've delivered a breadth of financial services, expert guidance, and innovative tools to help strengthen and grow businesses, families, and our local communities.
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-yellow-400">About</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                  <li><Link href="/about" className="text-gray-400 hover:text-white">Who we are</Link></li>
                  <li><Link href="/customer-support" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                  <li><Link href="/news" className="text-gray-400 hover:text-white">News & Events</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-yellow-400">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                  <li><Link href="/giving-back" className="text-gray-400 hover:text-white">Giving Back</Link></li>
                  <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/faqs" className="text-gray-400 hover:text-white">FAQs</Link></li>
                </ul>
              </div>
            </div>

            {/* Member Services */}
            <div>
              <h3 className="font-semibold mb-4 text-yellow-400">Member Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/payments" className="text-gray-400 hover:text-white">Loan Payments</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Referral Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Oldspring Trust Security™</a></li>
                <li><a href="mailto:support@oldspringtrust.com" className="text-gray-400 hover:text-white">Email Us</a></li>
              </ul>
              <div className="mt-6">
                <img src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" className="h-12 filter brightness-200" alt="" />
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <p>100 Bishopsgate, London</p>
                <p>EC2N 4AG, United Kingdom</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex space-x-6 text-sm text-gray-400">
                <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                <Link href="/faqs" className="hover:text-white">FAQs</Link>
                <a href="#" className="hover:text-white">Sitemap</a>
              </div>

              <div className="flex items-center space-x-4">
                <img src="/templates/bank-pro/blue-seal-200-42-bbb-80015515.png" className="h-12" alt="BBB" />
                <img src="/templates/bank-pro/images/assets/ncua-lender.png" className="h-8" alt="NCUA Lender" />
                <img src="/templates/bank-pro/images/assets/ncua-cert.png" className="h-8" alt="NCUA Certified" />
                <span className="text-xs text-gray-400">Federally Insured by NCUA</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-6">
              © 2025 Oldspring Trust Bank. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
EOF

# ============================================
# FIXED AUTH LAYOUT - NO OVERLAYS
# ============================================
cat > src/app/auth/layout.tsx << 'EOF'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simple layout with no overlays
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      margin: 0,
      position: 'relative',
      zIndex: 1
    }}>
      {children}
    </div>
  )
}
EOF

# ============================================
# FIXED LOGIN PAGE - WORKING VERSION
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
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate login
    setTimeout(() => {
      if (email === 'demo@oldspringtrust.com' && password === 'password123') {
        localStorage.setItem('userEmail', email)
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      maxWidth: '28rem',
      width: '100%',
      padding: '2rem'
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img 
          src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
          alt="Oldspring Trust"
          style={{ height: '3rem', width: 'auto', margin: '0 auto 1rem' }}
        />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Welcome Back</h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Sign in to your account</p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none'
            }}
            placeholder="demo@oldspringtrust.com"
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none'
            }}
            placeholder="••••••••"
            required
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '1rem', height: '1rem' }} 
            />
            <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>Remember me</span>
          </label>
          <Link href="/auth/forgot-password" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link href="/auth/signup" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>

      {/* Demo credentials */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Demo Credentials:</p>
        <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>Email: demo@oldspringtrust.com</p>
        <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>Password: password123</p>
      </div>
    </div>
  )
}
EOF

# ============================================
# FIXED SIGNUP PAGE
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
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Simulate signup
    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      maxWidth: '28rem',
      width: '100%',
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img 
          src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
          alt="Oldspring Trust"
          style={{ height: '3rem', width: 'auto', margin: '0 auto 1rem' }}
        />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Create Account</h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Join Oldspring Trust</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none'
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
            marginTop: '0.5rem'
          }}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
EOF

# ============================================
# FIXED DASHBOARD LAYOUT
# ============================================
cat > src/app/dashboard/layout.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/auth/login')
      return
    }
    setUser(email)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          border: '2px solid #e5e7eb',
          borderTopColor: '#2563eb',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <img 
            src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
            alt="Oldspring Trust"
            style={{ height: '2rem' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{user}</span>
            <button
              onClick={() => {
                localStorage.removeItem('userEmail')
                router.push('/')
              }}
              style={{
                fontSize: '0.875rem',
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '80rem',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        {children}
      </main>
    </div>
  )
}
EOF

# ============================================
# SIMPLE DASHBOARD HOME
# ============================================
cat > src/app/dashboard/page.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || ''
    const name = email.split('@')[0] || 'User'
    setUserName(name)
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        Welcome back, {userName}!
      </h1>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ color: '#6b7280' }}>Your dashboard is ready. Start managing your finances.</p>
      </div>
    </div>
  )
}
EOF

# ============================================
# FIXED ROOT LAYOUT
# ============================================
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Oldspring Trust Bank - Mobile Banking, Credit Cards, Mortgages, Auto Loan',
  description: 'Mobile Banking, Credit Cards, Mortgages, Auto Loan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
EOF

# ============================================
# CLEAN GLOBAL CSS
# ============================================
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  color: #1f2937;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
EOF

echo ""
echo "✅ Final Complete Fix Applied!"
echo "=============================="
echo ""
echo "🔧 Fixes applied:"
echo "   • Removed all javascript: links"
echo "   • Fixed overlay issues"
echo "   • Working login with demo credentials"
echo "   • Clean dashboard layout"
echo "   • Proper navigation"
echo ""
echo "🚀 To test:"
echo "   1. npm run dev"
echo "   2. Open http://localhost:3000"
echo "   3. Go to /auth/login"
echo "   4. Login with: demo@oldspringtrust.com / password123"
echo ""
echo "✅ All issues should now be fixed!"
EOF

chmod +x scripts/final_complete_fix.sh

echo "Run: ./scripts/final_complete_fix.sh to fix all issues!"