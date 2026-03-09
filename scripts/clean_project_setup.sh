#!/bin/bash

# Complete Clean Project Setup with Proper Structure

set -e

echo "🏦 Setting up Clean Banking Platform"
echo "====================================="

# Create directory structure
mkdir -p src/app
mkdir -p src/app/auth/login
mkdir -p src/app/auth/signup
mkdir -p src/app/auth/forgot-password
mkdir -p src/app/dashboard
mkdir -p src/app/about
mkdir -p src/app/contact
mkdir -p src/app/services
mkdir -p src/app/wealth-management
mkdir -p src/app/careers
mkdir -p src/app/privacy
mkdir -p src/app/terms
mkdir -p src/components/layout
mkdir -p src/components/ui

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
  const [hoursDropdownOpen, setHoursDropdownOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Wealth Management', href: '/wealth-management' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' }
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>Routing # 655205039</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">24/7 Customer Support</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="tel:+447451272406" className="hover:text-blue-200">+44-800-BANKING</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
                alt="Oldspring Trust Bank"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 border-b-2 border-blue-600 py-1'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                LOGIN
              </Link>
              <Link
                href="/auth/signup"
                className="border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
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
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col space-y-2 border-t">
                  <Link
                    href="/auth/login"
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg text-sm font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    OPEN ACCOUNT
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Branch Hours Strip */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src="/templates/bank-pro/static-strip-icons/ico-clock-new.svg" className="w-4 h-4" alt="" />
                <span className="font-medium">Branch Hours:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <span>Mon-Thu: 8:30-5:00</span>
                <span className="hidden sm:inline">|</span>
                <span>Fri: 8:30-6:00</span>
                <span className="hidden sm:inline">|</span>
                <span>Sat: 9:00-1:00</span>
              </div>
            </div>
            <a href="mailto:support@oldspringtrust.com" className="text-blue-600 hover:text-blue-700 font-medium hidden md:block">
              support@oldspringtrust.com
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
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Quick Bar */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <img src="/templates/bank-pro/icons/footer-icons/citadel-credit-union-routing-number.svg" className="w-8 h-8" alt="" />
              <div>
                <div className="text-sm text-gray-400">Routing #</div>
                <div className="font-semibold">655205039</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <img src="/templates/bank-pro/icons/prefooter-icons/icoclock.png" className="w-8 h-8" alt="" />
              <div>
                <div className="text-sm text-gray-400">Branch Hours</div>
                <div className="text-sm">Mon-Thu: 8:30-5:00 | Fri: 8:30-6:00</div>
                <div className="text-sm">Sat: 9:00-1:00</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <img src="/templates/bank-pro/icons/footer-icons/call-citadel-credit-union.svg" className="w-8 h-8" alt="" />
              <div>
                <div className="text-sm text-gray-400">Customer Service</div>
                <a href="mailto:support@oldspringtrust.com" className="text-sm hover:text-blue-400">
                  support@oldspringtrust.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <img src="/templates/bank-pro/footer-images/live-video-call.png" className="w-8 h-8" alt="" />
              <div>
                <div className="text-sm text-gray-400">Video Connect</div>
                <button 
                  onClick={() => alert('Please contact us via email')}
                  className="text-sm hover:text-blue-400"
                >
                  Chat Virtually
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <img 
              src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
              alt="Oldspring Trust"
              className="h-12 mb-4 brightness-200"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Building strength together for over 80 years. We're committed to serving those who work every day to build a better future for us all.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
              <li><Link href="/wealth-management" className="text-gray-400 hover:text-white">Wealth Management</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Security Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>100 Bishopsgate, London</li>
              <li>EC2N 4AG, United Kingdom</li>
              <li><a href="tel:+447451272406" className="hover:text-white">+44-800-BANKING</a></li>
              <li><a href="mailto:support@oldspringtrust.com" className="hover:text-white">support@oldspringtrust.com</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img src="/templates/bank-pro/blue-seal-200-42-bbb-80015515.png" className="h-12" alt="BBB" />
              <img src="/templates/bank-pro/images/assets/ncua-lender.png" className="h-8" alt="NCUA Lender" />
              <img src="/templates/bank-pro/images/assets/ncua-cert.png" className="h-8" alt="NCUA Certified" />
            </div>
            <span className="text-sm text-gray-400">Federally Insured by NCUA</span>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            © {new Date().getFullYear()} Oldspring Trust Bank. All Rights Reserved.
          </p>
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
  title: 'Oldspring Trust Bank - Mobile Banking, Credit Cards, Mortgages',
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
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
EOF

# ============================================
# GLOBAL CSS
# ============================================
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-gray-900 antialiased;
  }
}

@layer components {
  .container {
    @apply max-w-7xl mx-auto px-4;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors;
  }
  
  .btn-outline {
    @apply border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow;
  }
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
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Global Wealth Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Welcome to Global Wealth Management
            </p>
            <p className="text-lg md:text-xl mb-12 text-blue-50">
              We build lasting relationships based on trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/login" className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100">
                Internet Banking
              </Link>
              <Link href="/auth/signup" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10">
                Open an Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10065000+</div>
              <div className="text-gray-600">Customer Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">$83.7bn</div>
              <div className="text-gray-600">Assets under management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">£71.2bn</div>
              <div className="text-gray-600">Assets under management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">11300+</div>
              <div className="text-gray-600">Staff members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Welcome to Global Wealth Management
            </h2>
            <div className="prose prose-lg mx-auto">
              <p className="text-gray-600 mb-4">
                First, we are locally owned and managed. Decisions are made by people who know you, 
                and care about your needs. We are your neighbors. As a result, you gain from our 
                knowledgeable and responsive service and true understanding of what this community needs.
              </p>
              <p className="text-gray-600 mb-4">
                If you want a bank where customers are known by name and made to feel welcome as soon 
                as they come in the door, we are the bank you're looking for.
              </p>
              <p className="text-gray-600">
                Second, our mission is to help you attain financial success. At Global Wealth Management, 
                it begins with the customer, his or her wants and needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Personal Banking</h3>
              <p className="text-gray-600">Current accounts, loans, savings, and convenient payment solutions designed to suit your financial needs.</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Business Banking</h3>
              <p className="text-gray-600">Comprehensive range of products to meet the financial services needs of your business.</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Wealth Management</h3>
              <p className="text-gray-600">Expert leadership and personalized attention to help you achieve financial success.</p>
            </div>
          </div>
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
export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-3xl">
            Global Wealth Management works tirelessly to provide consumers, corporations, governments and institutions 
            with a broad range of financial services and products.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
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
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Trust</h3>
              <p className="text-gray-600">Building lasting relationships based on trust and integrity.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-600">Striving for excellence in everything we do.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
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
export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl">
            Comprehensive banking services and asset management designed to meet your financial needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Personal Banking</h2>
              <p className="text-gray-600 mb-4">
                Whether you want a current account, a loan, to save, invest or simply convenient payment solutions 
                via cards, your mobile phone or the internet, our Personal Banking products and services are designed 
                to suit your financial needs.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Current Accounts
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Savings & Investments
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Loans & Credit Cards
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Mobile Banking
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Business Banking</h2>
              <p className="text-gray-600 mb-4">
                Most of our managers and associates are ready to assist you with all of your business banking needs. 
                Each business is unique. We offer a comprehensive range of products for your business.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Business Accounts
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Commercial Loans
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Merchant Services
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Cash Management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Open an account today and experience the difference.</p>
          <div className="flex justify-center gap-4">
            <a href="/auth/signup" className="btn-primary">Open an Account</a>
            <a href="/contact" className="btn-outline">Contact Us</a>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ============================================
# WEALTH MANAGEMENT PAGE
# ============================================
cat > src/app/wealth-management/page.tsx << 'EOF'
export default function WealthManagementPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wealth Management</h1>
          <p className="text-xl max-w-3xl">
            Expert leadership that includes experienced executive officers, private bankers, and relationship officers.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <p className="text-lg text-gray-600 mb-8">
            Global Wealth Management is flourishing with expert leadership that includes experienced and local 
            executive officers, private bankers, branch managers, and commercial relationship officers. This group 
            works closely with our board to provide big-bank services in a community bank atmosphere.
          </p>
          <p className="text-lg text-gray-600">
            We have the resources and technology to offer big bank like products and services, but are small enough 
            to know you by name. We take the time to learn about our customers' needs.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Wealth Management Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Investment Planning</h3>
              <p className="text-gray-600">Customized investment strategies to help you reach your financial goals.</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Retirement Planning</h3>
              <p className="text-gray-600">Plan for a secure and comfortable retirement.</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Estate Planning</h3>
              <p className="text-gray-600">Preserve your wealth for future generations.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ============================================
# CONTACT PAGE WITH FORM
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
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl">
            Get in touch with our team for personalized assistance with your banking needs.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-600">+44-800-BANKING</p>
              <p className="text-sm text-gray-500">24/7 Customer Support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-600">12 Haslar Road, Gosport</p>
              <p className="text-sm text-gray-500">Hampshire PO12, UK</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <a href="mailto:support@globalwealthbm.com" className="text-blue-600 hover:text-blue-700">
                support@globalwealthbm.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">Send us a Message</h2>
          
          {isSubmitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-center">
              Thank you for your message. We'll get back to you soon!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
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
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className="flex-grow bg-gray-50">
        {children}
      </div>
      <Footer />
    </>
  )
}
EOF

# ============================================
# LOGIN PAGE
# ============================================
cat > src/app/auth/login/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate login - replace with actual authentication
    setTimeout(() => {
      if (formData.email && formData.password) {
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <img 
            src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
            alt="Oldspring Trust"
            className="h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>

            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-500">Email: demo@globalwealth.com</p>
          <p className="text-xs text-gray-500">Password: password123</p>
        </div>
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Simulate signup - replace with actual registration
    setTimeout(() => {
      router.push('/auth/login?registered=true')
    }, 1000)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <img 
            src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
            alt="Oldspring Trust"
            className="h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join Global Wealth Management</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Create a password"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
EOF

# ============================================
# FORGOT PASSWORD PAGE
# ============================================
cat > src/app/auth/forgot-password/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate password reset email
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <img 
            src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
            alt="Oldspring Trust"
            className="h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">Enter your email to receive reset instructions</p>
        </div>

        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-center">
            <p className="mb-2">✓ Reset instructions sent!</p>
            <p className="text-sm">Please check your email for further instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
EOF

# ============================================
# SIMPLE DASHBOARD
# ============================================
cat > src/app/dashboard/page.tsx << 'EOF'
'use client'

import Link from 'next/link'

export default function DashboardPage() {
  // Mock user data
  const user = {
    name: 'John Doe',
    accounts: [
      { type: 'Checking', number: '****1234', balance: 5250.75 },
      { type: 'Savings', number: '****5678', balance: 12750.50 },
      { type: 'Credit Card', number: '****9012', balance: -450.25 }
    ],
    recentTransactions: [
      { date: '2025-02-14', description: 'Grocery Store', amount: -85.32 },
      { date: '2025-02-13', description: 'Salary Deposit', amount: 3250.00 },
      { date: '2025-02-12', description: 'Netflix Subscription', amount: -15.99 }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
          <p className="text-gray-600">Here's an overview of your accounts</p>
        </div>

        {/* Account Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {user.accounts.map((account, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-600 mb-1">{account.type}</p>
              <p className="text-xs text-gray-400 mb-2">{account.number}</p>
              <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(account.balance).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {user.recentTransactions.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

# ============================================
# PRIVACY POLICY PAGE
# ============================================
cat > src/app/privacy/page.tsx << 'EOF'
export default function PrivacyPage() {
  return (
    <>
      <section className="bg-blue-900 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl">How we protect and handle your information</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl prose">
          <h2>Our Commitment to Privacy</h2>
          <p>
            Your privacy is important to us. To better protect your privacy we provide this notice explaining our 
            online information practices and the choices you can make about the way your information is collected and used.
          </p>

          <h2>The Information We Collect</h2>
          <p>
            This notice applies to all information collected or submitted on the Global Wealth Management website. 
            On some pages, you can order products, make requests, and register to receive materials. The types of 
            personal information collected at these pages are:
          </p>
          <ul>
            <li>Name</li>
            <li>Address</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Account information</li>
          </ul>

          <h2>The Way We Use Information</h2>
          <p>
            We use the information you provide about yourself when placing an order only to complete that order. 
            We do not share this information with outside parties except to the extent necessary to complete that order.
          </p>
          <p>
            We use return email addresses to answer the email we receive. Such addresses are not used for any other 
            purpose and are not shared with outside parties.
          </p>

          <h2>Our Commitment to Data Security</h2>
          <p>
            To prevent unauthorized access, maintain data accuracy, and ensure the correct use of information, we 
            have put in place appropriate physical, electronic, and managerial procedures to safeguard and secure 
            the information we collect online.
          </p>
        </div>
      </section>
    </>
  )
}
EOF

# ============================================
# TERMS OF SERVICE PAGE
# ============================================
cat > src/app/terms/page.tsx << 'EOF'
export default function TermsPage() {
  return (
    <>
      <section className="bg-blue-900 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl">Please read these terms carefully</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl prose">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>Use of Services</h2>
          <p>
            You agree to use our services only for lawful purposes and in accordance with these Terms of Service. 
            You are responsible for maintaining the confidentiality of your account and password.
          </p>

          <h2>Electronic Communications</h2>
          <p>
            When you visit our website or send emails to us, you are communicating with us electronically. You consent 
            to receive communications from us electronically.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Global Wealth Management shall not be liable for any direct, indirect, incidental, special, consequential 
            or exemplary damages resulting from the use or inability to use the service.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms shall be governed and construed in accordance with the laws of the United Kingdom, without 
            regard to its conflict of law provisions.
          </p>
        </div>
      </section>
    </>
  )
}
EOF

# ============================================
# CAREERS PAGE
# ============================================
cat > src/app/careers/page.tsx << 'EOF'
export default function CareersPage() {
  return (
    <>
      <section className="bg-blue-900 text-white py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl max-w-3xl">
            Build a rewarding career with Global Wealth Management
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why Work With Us?</h2>
            <p className="text-lg text-gray-600 mb-8">
              At Global Wealth Management, we're committed to helping our employees grow and succeed. 
              We offer competitive benefits, professional development opportunities, and a supportive 
              work environment.
            </p>

            <h3 className="text-2xl font-bold mb-4">Benefits</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Competitive salary and bonus structure
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Health, dental, and vision insurance
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                401(k) with company match
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Paid time off and holidays
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Professional development opportunities
              </li>
            </ul>

            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Current Openings</h3>
              <p className="text-gray-600 mb-4">
                We're always looking for talented individuals to join our team.
              </p>
              <a 
                href="mailto:careers@globalwealth.com" 
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Send Your Resume
              </a>
              <p className="text-sm text-gray-500 mt-4">careers@globalwealth.com</p>
            </div>
          </div>
        </div>
      </section>
    </>
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
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
EOF

echo ""
echo "✅ Clean Project Setup Complete!"
echo "================================"
echo ""
echo "📁 Pages Created:"
echo "   • Homepage"
echo "   • About"
echo "   • Services"
echo "   • Wealth Management"
echo "   • Contact (with form)"
echo "   • Careers"
echo "   • Privacy Policy"
echo "   • Terms of Service"
echo "   • Login (with header/footer)"
echo "   • Signup (with header/footer)"
echo "   • Forgot Password"
echo "   • Dashboard"
echo ""
echo "🧩 Components:"
echo "   • Header (mobile responsive)"
echo "   • Footer"
echo ""
echo "🚀 Next Steps:"
echo "   1. Copy your templates folder to: public/templates/bank-pro/"
echo "   2. Run: npm run dev"
echo "   3. Visit: http://localhost:3000"
echo ""
echo "✅ Your clean banking platform is ready!"