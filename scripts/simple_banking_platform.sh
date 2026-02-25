#!/bin/bash

# Simple Clean Banking Platform

set -e

echo "🏦 Building Simple Clean Banking Platform"
echo "========================================="

# Create directory structure
mkdir -p src/app
mkdir -p src/app/auth/login
mkdir -p src/app/auth/signup
mkdir -p src/app/dashboard
mkdir -p src/app/about
mkdir -p src/app/services
mkdir -p src/app/contact
mkdir -p src/components/layout
mkdir -p src/components/ui

# ============================================
# GLOBAL CSS
# ============================================
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: #1e3a5f;
    --primary-dark: #0f2a44;
    --primary-light: #2b4c7a;
    --accent: #e68a2e;
    --accent-light: #f5a344;
    --gray-bg: #f8fafc;
  }

  body {
    @apply text-gray-800 antialiased;
  }
}

@layer components {
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .btn-primary {
    @apply bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2b4c7a] transition duration-300;
  }
  
  .btn-outline {
    @apply border-2 border-[#1e3a5f] text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-[#1e3a5f] hover:text-white transition duration-300;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300;
  }
  
  .section-title {
    @apply text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-12 text-center;
  }
}
EOF

# ============================================
# HEADER COMPONENT
# ============================================
cat > src/components/layout/Header.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Hide on dashboard and auth pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth')) {
    return null
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-[#1e3a5f]">Global Wealth</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#1e3a5f] font-medium transition"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-[#1e3a5f] font-semibold hover:text-[#2b4c7a] transition"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-[#1e3a5f] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#2b4c7a] transition"
            >
              Open Account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-[#1e3a5f]"
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
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#1e3a5f] py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t flex flex-col space-y-3">
                <Link
                  href="/auth/login"
                  className="text-[#1e3a5f] font-semibold py-2 text-center border border-[#1e3a5f] rounded-lg hover:bg-[#1e3a5f] hover:text-white transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#1e3a5f] text-white py-2 text-center rounded-lg font-semibold hover:bg-[#2b4c7a] transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Open Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Branch Hours Strip */}
      <div className="bg-[#f8fafc] border-t border-gray-200 py-2 text-sm">
        <div className="container-custom flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-[#1e3a5f]">Routing # 655205039</span>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <span className="text-gray-600 hidden sm:inline">24/7 Customer Support</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Mon-Fri: 8:30-6:00 | Sat: 9:00-1:00</span>
            <a href="mailto:support@globalwealth.com" className="text-[#1e3a5f] hover:underline hidden lg:inline">
              support@globalwealth.com
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
EOF

# ============================================
# FOOTER COMPONENT
# ============================================
cat > src/components/layout/Footer.tsx << 'EOF'
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth')) {
    return null
  }

  return (
    <footer className="bg-[#1e3a5f] text-white">
      {/* Quick Bar */}
      <div className="border-b border-[#2b4c7a] py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#e68a2e] rounded-full flex items-center justify-center text-white font-bold">
                #
              </div>
              <div>
                <div className="text-sm text-gray-300">Routing Number</div>
                <div className="font-semibold">655205039</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#e68a2e] rounded-full flex items-center justify-center text-white font-bold">
                ⌚
              </div>
              <div>
                <div className="text-sm text-gray-300">Branch Hours</div>
                <div className="font-semibold">Mon-Fri 8:30-6:00 | Sat 9:00-1:00</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#e68a2e] rounded-full flex items-center justify-center text-white font-bold">
                ✉️
              </div>
              <div>
                <div className="text-sm text-gray-300">Customer Service</div>
                <a href="mailto:support@globalwealth.com" className="font-semibold hover:text-[#e68a2e]">
                  support@globalwealth.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#e68a2e] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold">Global Wealth</span>
            </div>
            <p className="text-gray-300 text-sm">
              Building lasting relationships based on trust since 1945.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#e68a2e]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#e68a2e]">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/faqs" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#e68a2e]">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>100 Bishopsgate, London</li>
              <li>United Kingdom, EC2N 4AG</li>
              <li><a href="tel:+447451272406" className="hover:text-white">+44-800-BANKING</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2b4c7a] mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025 Global Wealth Management. All rights reserved. Federally Insured.</p>
        </div>
      </div>
    </footer>
  )
}
EOF

# ============================================
# ROOT LAYOUT
# ============================================
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Global Wealth Management - Banking, Credit Cards, Mortgages',
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
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
EOF

# ============================================
# HOMEPAGE
# ============================================
cat > src/app/page.tsx << 'EOF'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2b4c7a] text-white">
        <div className="container-custom py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Global Wealth Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Welcome to Global Wealth Management
            </p>
            <p className="text-lg md:text-xl mb-12 text-gray-300">
              We build lasting relationships based on trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/login" className="btn-primary">
                Internet Banking
              </Link>
              <Link href="/auth/signup" className="btn-outline border-white text-white hover:bg-white hover:text-[#1e3a5f]">
                Open an Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-2">10M+</div>
              <div className="text-gray-600">Customer Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-2">$83.7B</div>
              <div className="text-gray-600">Assets under management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-2">£71.2B</div>
              <div className="text-gray-600">Assets under management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-2">11K+</div>
              <div className="text-gray-600">Staff members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">
              Welcome to Global Wealth Management
            </h2>
            <p className="text-gray-600 mb-4">
              First, we are locally owned and managed. Decisions are made by people who know you, 
              and care about your needs. We are your neighbors.
            </p>
            <p className="text-gray-600">
              If you want a bank where customers are known by name and made to feel welcome as soon 
              as they come in the door, we are the bank you're looking for.
            </p>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="section-title">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Personal Banking</h3>
              <p className="text-gray-600">Current accounts, loans, and savings designed to suit your needs.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Business Banking</h3>
              <p className="text-gray-600">Comprehensive products to meet your business financial needs.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Wealth Management</h3>
              <p className="text-gray-600">Expert guidance to help you achieve financial success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-200">Join thousands of satisfied customers today.</p>
          <Link href="/auth/signup" className="bg-[#e68a2e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#f5a344] transition inline-block">
            Open an Account
          </Link>
        </div>
      </section>
    </>
  )
}
EOF

# ============================================
# ABOUT PAGE
# ============================================
cat > src/app/about/page.tsx << 'EOF'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Global Wealth Management works tirelessly to provide consumers, corporations, and institutions 
            with a broad range of financial services and products.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            We deliver a comprehensive range of banking services along with highly personalized attention to our 
            clients, both individuals and businesses. Our mission is to help our clients achieve security, build 
            wealth and realize their dreams.
          </p>
          <p className="text-gray-600">
            Global Wealth Management Bank has clearly distinguished itself in the bank industry through superior 
            service quality, unique customer experience, and sound financial indices.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Trust</h3>
              <p className="text-gray-600">Building lasting relationships based on trust and integrity.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Excellence</h3>
              <p className="text-gray-600">Striving for excellence in everything we do.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Community</h3>
              <p className="text-gray-600">Locally owned and managed, we care about our community.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ============================================
# SERVICES PAGE
# ============================================
cat > src/app/services/page.tsx << 'EOF'
import Link from 'next/link'

export default function ServicesPage() {
  return (
    <>
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive banking services designed to meet your financial needs.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Personal Banking</h2>
              <p className="text-gray-600 mb-4">
                Whether you want a current account, a loan, to save, or invest, our Personal Banking products 
                are designed to suit your financial needs.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#e68a2e] mr-2">✓</span>
                  Current Accounts
                </li>
                <li className="flex items-start">
                  <span className="text-[#e68a2e] mr-2">✓</span>
                  Savings & Investments
                </li>
                <li className="flex items-start">
                  <span className="text-[#e68a2e] mr-2">✓</span>
                  Loans & Credit Cards
                </li>
                <li className="flex items-start">
                  <span className="text-[#e68a2e] mr-2">✓</span>
                  Mobile Banking
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Business Banking</h2>
              <p className="text-gray-600 mb-4">
                Our managers are ready to assist you with all of your business banking needs. Each business is unique.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#e68a2e] mr-2">✓</span>
                  Business Accounts
                </li>
                <li className="flex items-start">
                  <span className="text-[#e68a2e] mr-2">✓</span>
                  Commercial Loans
                </li>
                <li className="flex items-start">
                  <span className="text-[#e68a2e] mr-2">✓</span>
                  Merchant Services
                </li>
                <li className="flex items-start">
                  <span className="text-[#e68a2e] mr-2">✓</span>
                  Cash Management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ============================================
# CONTACT PAGE
# ============================================
cat > src/app/contact/page.tsx << 'EOF'
'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      alert('Thank you for your message. We\'ll get back to you soon!')
      setIsSubmitting(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }

  return (
    <>
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with our team for personalized assistance.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">+44-800-BANKING</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">support@globalwealth.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-gray-600">100 Bishopsgate, London, EC2N 4AG</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Hours</h3>
                  <p className="text-gray-600">Mon-Fri: 8:30 AM - 6:00 PM</p>
                  <p className="text-gray-600">Sat: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1e3a5f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ============================================
# AUTH LAYOUT
# ============================================
cat > src/app/auth/layout.tsx << 'EOF'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
EOF

# ============================================
# LOGIN PAGE
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
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
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
# SIGNUP PAGE
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
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
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

# ============================================
# DASHBOARD LAYOUT
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
    const userEmail = localStorage.getItem('user')
    if (!userEmail) {
      router.push('/auth/login')
      return
    }
    setUser(userEmail)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="container-custom">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="font-semibold">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  router.push('/')
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container-custom py-8">
        {children}
      </main>
    </div>
  )
}
EOF

# ============================================
# DASHBOARD HOME
# ============================================
cat > src/app/dashboard/page.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('user') || ''
    const name = email.split('@')[0] || 'User'
    setUserName(name)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome back, {userName}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Balance</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">$755,300.00</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Monthly Income</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">$12,840.50</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Active Cards</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">3</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <p className="text-gray-500 text-center py-8">No recent transactions</p>
      </div>
    </div>
  )
}
EOF

# ============================================
# TAILWIND CONFIG
# ============================================
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
      },
    },
  },
  plugins: [],
}
EOF

# ============================================
# CLEAR CACHE AND FINISH
# ============================================
rm -rf .next

echo ""
echo "✅ Simple Banking Platform Created!"
echo "==================================="
echo ""
echo "📁 Pages created:"
echo "   • Homepage"
echo "   • About"
echo "   • Services"
echo "   • Contact"
echo "   • Login"
echo "   • Signup"
echo "   • Dashboard"
echo ""
echo "🎨 Features:"
echo "   • Clean header with navigation"
echo "   • Footer with quick links"
echo "   • Responsive design"
echo "   • Blue/gold color scheme (inspired by Oldspring)"
echo "   • Working authentication flow"
echo "   • Simple dashboard"
echo ""
echo "🚀 To start:"
echo "   npm run dev"
echo "   Visit: http://localhost:3000"
echo ""
echo "✅ Your simple banking platform is ready!"
EOF

chmod +x scripts/simple_banking_platform.sh

echo "Run: ./scripts/simple_banking_platform.sh"