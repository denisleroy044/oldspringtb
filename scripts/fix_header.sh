#!/bin/bash

# Fix Header Component - Ensure Navigation Shows

set -e

echo "🔧 Fixing Header Navigation"
echo "==========================="

# ============================================
# FIXED HEADER COMPONENT - ALWAYS SHOW ON PUBLIC PAGES
# ============================================
cat > src/components/layout/Header.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBranchHours, setShowBranchHours] = useState(false)
  const pathname = usePathname()

  // Only hide on dashboard and auth pages - show on ALL others including home, about, etc.
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth') || pathname?.startsWith('/user')) {
    return null
  }

  return (
    <header id="header" className="l-header bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="l-header__bottom">
        <div id="header-inner" className="l-header__bottom-inner l-contain max-w-7xl mx-auto px-4">
          {/* Top Row - Logo and Actions */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="l-header__logo flex-shrink-0">
              <img 
                src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
                alt="Oldspring Trust Bank"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Actions - Login/Open Account */}
            <div className="hidden md:flex l-header__action">
              <ul className="l-header__action__l1 flex space-x-3">
                <li className="is-active">
                  <Link 
                    href="/auth/login" 
                    className="inline-block bg-[#1e3a5f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2b4c7a] transition"
                  >
                    LOGIN
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/auth/signup" 
                    className="inline-block border-2 border-[#1e3a5f] text-[#1e3a5f] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1e3a5f] hover:text-white transition"
                  >
                    OPEN ACCOUNT
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-[#1e3a5f] focus:outline-none"
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

          {/* Desktop Navigation - Second Row */}
          <div className="hidden md:flex items-center justify-between py-3 border-t border-gray-100">
            <span className="header__routing font-semibold text-[#1e3a5f]">Routing # 655205039</span>

            <nav id="nav-personal" className="nav-primary">
              <ul className="nav-primary__l1 flex space-x-6">
                <li className="nav-primary__l1-item relative group">
                  <Link href="/" className="nav-primary__l1-item-link text-gray-700 hover:text-[#1e3a5f] font-medium text-sm py-2 inline-block">Home</Link>
                </li>
                <li className="nav-primary__l1-item relative group">
                  <button className="nav-primary__l1-item-link text-gray-700 hover:text-[#1e3a5f] font-medium text-sm py-2 inline-flex items-center">
                    Bank
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 w-96 bg-white shadow-xl border rounded-lg p-6 hidden group-hover:block z-50">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-[#1e3a5f] mb-3">Bank</h4>
                        <ul className="space-y-2">
                          <li><Link href="/accounts" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Oldspring Trust Accounts</Link></li>
                          <li><Link href="/credit-cards" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Credit Cards</Link></li>
                          <li><Link href="#" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Online & Mobile Banking</Link></li>
                          <li><Link href="/about" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Why Bank with Oldspring Trust?</Link></li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold text-[#1e3a5f] mb-2">Get rewards on Us</h4>
                        <p className="text-sm text-gray-600 mb-3">For a limited time, get a reward when you bank with us! Additional terms apply.</p>
                        <Link href="#" className="text-[#1e3a5f] text-sm font-medium hover:underline">Learn More →</Link>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="nav-primary__l1-item relative group">
                  <button className="nav-primary__l1-item-link text-gray-700 hover:text-[#1e3a5f] font-medium text-sm py-2 inline-flex items-center">
                    Save
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 w-80 bg-white shadow-xl border rounded-lg p-6 hidden group-hover:block z-50">
                    <h4 className="font-bold text-[#1e3a5f] mb-3">Save</h4>
                    <ul className="space-y-2">
                      <li><Link href="/save#HighYieldSavings" className="text-gray-600 hover:text-[#1e3a5f] text-sm">High Yield Savings</Link></li>
                      <li><Link href="/save#StarSavings" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Star Savings</Link></li>
                      <li><Link href="/save#Certificates" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Certificates</Link></li>
                      <li><Link href="/save#HolidayClub" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Holiday Club</Link></li>
                      <li><Link href="/save#MoneyMarket" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Money Market</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="nav-primary__l1-item relative group">
                  <button className="nav-primary__l1-item-link text-gray-700 hover:text-[#1e3a5f] font-medium text-sm py-2 inline-flex items-center">
                    Borrow
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 w-80 bg-white shadow-xl border rounded-lg p-6 hidden group-hover:block z-50">
                    <h4 className="font-bold text-[#1e3a5f] mb-3">Borrow</h4>
                    <ul className="space-y-2">
                      <li><Link href="/borrow#creditcard" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Credit Cards</Link></li>
                      <li><Link href="/borrow#mortgage" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Mortgage & Home Loan</Link></li>
                      <li><Link href="/borrow#personal" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Personal Loans</Link></li>
                      <li><Link href="/borrow#auto" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Auto Loans</Link></li>
                      <li><Link href="/borrow#student" className="text-gray-600 hover:text-[#1e3a5f] text-sm">Student Loans</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/invest" className="nav-primary__l1-item-link text-gray-700 hover:text-[#1e3a5f] font-medium text-sm py-2 inline-block">Wealth & Retire</Link>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/insure" className="nav-primary__l1-item-link text-gray-700 hover:text-[#1e3a5f] font-medium text-sm py-2 inline-block">Insure</Link>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/learn-and-plan" className="nav-primary__l1-item-link text-gray-700 hover:text-[#1e3a5f] font-medium text-sm py-2 inline-block">Learn & Plan</Link>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/payments" className="nav-primary__l1-item-link text-gray-700 hover:text-[#1e3a5f] font-medium text-sm py-2 inline-block">Payments</Link>
                </li>
              </ul>
            </nav>

            <div className="l-header__nav-contacts flex items-center space-x-4">
              {/* Branch Hours Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowBranchHours(!showBranchHours)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-[#1e3a5f]"
                >
                  <img src="/templates/bank-pro/images/assets/ico-clock.svg" className="w-5 h-5" alt="" />
                  <span className="text-sm">Branch Hours</span>
                </button>
                {showBranchHours && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border p-4 z-50">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Mon-Thurs</dt>
                        <dd className="text-gray-600">8:30-5:00</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Friday</dt>
                        <dd className="text-gray-600">8:30-6:00</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Saturday</dt>
                        <dd className="text-gray-600">9:00-1:00</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>

              <a href="mailto:support@oldspringtrust.com" className="flex items-center space-x-1 text-gray-600 hover:text-[#1e3a5f]">
                <img src="/templates/bank-pro/prefooter-icons/ico-star-circle.svg" className="w-5 h-5" alt="" />
                <span className="text-sm">support@oldspringtrust.com</span>
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t mt-4">
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="py-2 text-gray-700 hover:text-[#1e3a5f]">Home</Link>
                <Link href="/bank" className="py-2 text-gray-700 hover:text-[#1e3a5f]">Bank</Link>
                <Link href="/save" className="py-2 text-gray-700 hover:text-[#1e3a5f]">Save</Link>
                <Link href="/borrow" className="py-2 text-gray-700 hover:text-[#1e3a5f]">Borrow</Link>
                <Link href="/invest" className="py-2 text-gray-700 hover:text-[#1e3a5f]">Wealth & Retire</Link>
                <Link href="/insure" className="py-2 text-gray-700 hover:text-[#1e3a5f]">Insure</Link>
                <Link href="/learn-and-plan" className="py-2 text-gray-700 hover:text-[#1e3a5f]">Learn & Plan</Link>
                <Link href="/payments" className="py-2 text-gray-700 hover:text-[#1e3a5f]">Payments</Link>
                <div className="pt-4 border-t flex flex-col space-y-2">
                  <Link href="/auth/login" className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-center hover:bg-[#2b4c7a]">LOGIN</Link>
                  <Link href="/auth/signup" className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-4 py-2 rounded-lg text-center hover:bg-[#1e3a5f] hover:text-white">OPEN ACCOUNT</Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
EOF

# ============================================
# CREATE A TEST HOMEPAGE TO VERIFY HEADER
# ============================================
cat > src/app/page.tsx << 'EOF'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1e3a5f] to-[#2b4c7a] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Global Wealth Management</h1>
            <p className="text-2xl mb-8">Welcome to Global Wealth Management</p>
            <p className="text-xl mb-10">We build lasting relationships based on trust.</p>
            <div className="flex space-x-4">
              <Link href="/auth/login" className="bg-white text-[#1e3a5f] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Internet Banking
              </Link>
              <Link href="/auth/signup" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10">
                Open an Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#1e3a5f]">10065000+</div>
              <div className="text-gray-600">Customer Accounts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1e3a5f]">$83.7bn</div>
              <div className="text-gray-600">Assets under management</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1e3a5f]">£71.2bn</div>
              <div className="text-gray-600">Assets under management</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1e3a5f]">11300+</div>
              <div className="text-gray-600">Staff members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1e3a5f]">Welcome to Global Wealth Management</h2>
          <p className="text-gray-600 mb-4">
            First, we are locally owned and managed. Decisions are made by people who know you, and care about your needs. We are your neighbors.
          </p>
          <p className="text-gray-600">
            If you want a bank where customers are known by name and made to feel welcome as soon as they come in the door, we are the bank you're looking for.
          </p>
        </div>
      </section>
    </div>
  )
}
EOF

# ============================================
# CLEAR CACHE AND RESTART
# ============================================
echo "🧹 Clearing Next.js cache..."
rm -rf .next

echo ""
echo "✅ Header Fixed!"
echo "================"
echo ""
echo "The header should now show on:"
echo "  • Homepage (/)"
echo "  • About (/about)"
echo "  • Services (/services)"
echo "  • All public pages"
echo ""
echo "The header will NOT show on:"
echo "  • Dashboard (/dashboard)"
echo "  • Auth pages (/auth/*)"
echo ""
echo "🚀 Run: npm run dev"
echo "   Visit: http://localhost:3000"
echo ""
echo "You should now see the navigation bar at the top!"
EOF

chmod +x scripts/fix_header.sh

echo "Run: ./scripts/fix_header.sh to fix the header!"