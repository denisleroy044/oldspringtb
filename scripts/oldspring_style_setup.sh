#!/bin/bash

# Oldspring Trust Bank Style Transformation Script
# This script transforms your banking platform to match the Oldspring Trust design

set -e

echo "🏦 Transforming to Oldspring Trust Bank Style"
echo "=============================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️ $1${NC}"; }
print_header() { echo -e "${BLUE}📁 $1${NC}"; }

# ============================================
# UPDATE TAILWIND CONFIG WITH OLOSPRING COLORS
# ============================================
print_header "Updating Tailwind configuration with Oldspring colors"

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
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c0d6ff',
          300: '#a0c2ff',
          400: '#6085b3',
          500: '#2b4d73',  // Oldspring Trust navy blue
          600: '#1e3a5f',  // Darker navy
          700: '#142b44',
          800: '#0e1f33',
          900: '#0a1726',
        },
        secondary: {
          50: '#fef4e6',
          100: '#fde9cd',
          200: '#fbd29b',
          300: '#f9bc69',
          400: '#f7a537',
          500: '#e68a2e',  // Warm gold accent
          600: '#c4711f',
          700: '#9e5918',
          800: '#784312',
          900: '#522d0c',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
EOF
print_success "Tailwind config updated"

# ============================================
# UPDATE GLOBAL CSS
# ============================================
print_header "Updating global styles"

cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-gray-800 antialiased;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold;
  }
}

@layer components {
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors;
  }
  
  .btn-outline {
    @apply border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-card p-6;
  }
  
  .nav-link {
    @apply text-gray-700 hover:text-primary-600 font-medium transition-colors;
  }
}
EOF
print_success "Global styles updated"

# ============================================
# CREATE UPDATED HOMEPAGE WITH OLOSPRING DESIGN
# ============================================
print_header "Creating Oldspring Trust homepage"

cat > src/app/page.tsx << 'EOF'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Oldspring styling */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">Oldspring Trust</span>
              <span className="ml-2 text-sm text-gray-500">Bank</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/bank" className="nav-link">Bank</Link>
              <Link href="/save" className="nav-link">Save</Link>
              <Link href="/borrow" className="nav-link">Borrow</Link>
              <Link href="/invest" className="nav-link">Wealth & Retire</Link>
              <Link href="/insure" className="nav-link">Insure</Link>
              <Link href="/learn-and-plan" className="nav-link">Learn & Plan</Link>
              <Link href="/payments" className="nav-link">Payments</Link>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden lg:block">Routing # 655205039</span>
              <Link 
                href="/auth/login" 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                LOGIN
              </Link>
              <Link 
                href="/auth/signup" 
                className="border border-primary-600 text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
              >
                OPEN ACCOUNT
              </Link>
            </div>
          </div>
        </div>

        {/* Branch Hours and Contact Strip */}
        <div className="bg-gray-50 border-t border-gray-200 py-2">
          <div className="container-custom flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Routing #</span>
                <span className="font-semibold">655205039</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Branch Hours:</span>
                <span className="text-gray-800">Mon-Thurs 8:30-5:00 | Fri 8:30-6:00 | Sat 9:00-1:00</span>
              </div>
            </div>
            <Link href="mailto:support@oldspringtrust.com" className="text-primary-600 hover:text-primary-700">
              support@oldspringtrust.com
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Oldspring Trust Bank</h1>
            <p className="text-xl mb-8 text-gray-100">
              We do banking differently. We believe that people come first, and that everyone deserves a great experience every step of the way – whether it's face to face, over the phone, online or on our app.
            </p>
          </div>
        </div>
      </section>

      {/* Rates Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Today's Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Rate Card 1 */}
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">3.75%</div>
              <div className="text-sm text-gray-500 mb-1">APY</div>
              <h3 className="font-semibold mb-2">High Yield Savings</h3>
              <Link href="/save" className="text-primary-600 text-sm hover:underline">Learn More →</Link>
            </div>

            {/* Rate Card 2 */}
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">3.65%</div>
              <div className="text-sm text-gray-500 mb-1">APY</div>
              <h3 className="font-semibold mb-2">18 Month Certificate</h3>
              <Link href="/save#certificates" className="text-primary-600 text-sm hover:underline">Learn More →</Link>
            </div>

            {/* Rate Card 3 */}
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">4.00%</div>
              <div className="text-sm text-gray-500 mb-1">APY</div>
              <h3 className="font-semibold mb-2">36 Month Certificate</h3>
              <Link href="/save#certificates" className="text-primary-600 text-sm hover:underline">Learn More →</Link>
            </div>

            {/* Rate Card 4 */}
            <div className="card text-center">
              <div className="text-sm text-gray-600 mb-1">AS LOW AS</div>
              <div className="text-3xl font-bold text-primary-600 mb-2">15.49%</div>
              <div className="text-sm text-gray-500 mb-1">APR*</div>
              <h3 className="font-semibold mb-2">Cash Rewards Mastercard</h3>
              <Link href="/borrow#creditcards" className="text-primary-600 text-sm hover:underline">Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* How Can We Help Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">How Can We Help You Today?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { href: "/bank", icon: "💰", label: "Instant Accounts" },
              { href: "/borrow#creditcards", icon: "💳", label: "Credit Cards" },
              { href: "/borrow", icon: "🏦", label: "Loans" },
              { href: "/business", icon: "💼", label: "Business Banking" },
              { href: "/invest", icon: "📈", label: "Wealth & Retire" },
              { href: "/about", icon: "ℹ️", label: "About Us" },
            ].map((item, index) => (
              <Link key={index} href={item.href} className="card text-center hover:shadow-lg transition-shadow group">
                <div className="text-4xl mb-3">{item.icon}</div>
                <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12">
                <h2 className="text-3xl font-bold mb-4">Get €300* With a Checking Account Built for You</h2>
                <p className="text-gray-600 mb-6">
                  For a limited time, get a €300 when you open any new checking account! Select "Learn More" to see important offer details.
                </p>
                <Link href="/bank/checking" className="btn-primary inline-block">
                  Learn More
                </Link>
              </div>
              <div className="bg-primary-600 p-12 text-white">
                <p className="text-2xl font-bold mb-4">Building Strength Together</p>
                <p className="mb-6">
                  Oldspring Trust is built on the promise to serve those who work every day to build a better future for us all.
                </p>
                <Link href="/about" className="text-white border-b-2 border-white pb-1 hover:text-gray-200">
                  Learn our story →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Hear From Our Customers</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <p className="text-gray-600 mb-4">
                "I am impressed with the customer service and speed of payout"
              </p>
              <p className="font-semibold text-primary-600">— Ralph Morris</p>
            </div>
            <div className="card">
              <p className="text-gray-600 mb-4">
                "All one has to do is to look at your investment to see how well it is being looked after."
              </p>
              <p className="font-semibold text-primary-600">— Ted Moralee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white pt-16 pb-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Oldspring Trust</h3>
              <p className="text-gray-300 text-sm">
                Building Strength Together for over 80 years.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/news" className="hover:text-white">News & Events</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/faqs" className="hover:text-white">FAQs</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/sitemap" className="hover:text-white">Sitemap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>100 Bishopsgate, London</li>
                <li>EC2N 4AG, United Kingdom</li>
                <li><a href="mailto:support@oldspringtrust.com" className="hover:text-white">support@oldspringtrust.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-800 pt-8 text-center text-sm text-gray-400">
            <p>Federally Insured by NCUA | © 2025 Oldspring Trust Bank. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
EOF
print_success "Homepage created with Oldspring design"

# ============================================
# CREATE BANK SECTION PAGES
# ============================================
print_header "Creating Bank section pages"

# Bank page
mkdir -p src/app/bank
cat > src/app/bank/page.tsx << 'EOF'
import Link from 'next/link'

export default function BankPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header is handled by layout */}
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-4">Banking</h1>
        <p className="text-xl text-gray-600 mb-12">Simple, secure, and rewarding banking solutions</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Checking Accounts</h2>
            <p className="text-gray-600 mb-6">Everyday banking with rewards and no monthly fees.</p>
            <Link href="/bank/checking" className="text-primary-600 hover:text-primary-700 font-medium">
              Learn More →
            </Link>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Savings Accounts</h2>
            <p className="text-gray-600 mb-6">Grow your money with competitive rates.</p>
            <Link href="/save" className="text-primary-600 hover:text-primary-700 font-medium">
              Learn More →
            </Link>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Credit Cards</h2>
            <p className="text-gray-600 mb-6">Rewards cards that work for you.</p>
            <Link href="/borrow#creditcards" className="text-primary-600 hover:text-primary-700 font-medium">
              Learn More →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Bank page created"

# ============================================
# CREATE SAVE SECTION PAGES
# ============================================
print_header "Creating Save section pages"

mkdir -p src/app/save
cat > src/app/save/page.tsx << 'EOF'
import Link from 'next/link'

export default function SavePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-4">Save</h1>
        <p className="text-xl text-gray-600 mb-12">Build your future with smart savings solutions</p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h2 className="text-2xl font-bold mb-2">High Yield Savings</h2>
            <div className="text-4xl font-bold text-primary-600 mb-4">3.75% APY</div>
            <p className="text-gray-600 mb-6">Earn more on your savings with no monthly fees.</p>
            <Link href="/save/high-yield" className="btn-primary inline-block">
              Open Account
            </Link>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold mb-2">18 Month Certificate</h2>
            <div className="text-4xl font-bold text-primary-600 mb-4">3.65% APY</div>
            <p className="text-gray-600 mb-6">Lock in a great rate for 18 months.</p>
            <Link href="/save/certificates" className="btn-primary inline-block">
              Open Certificate
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-semibold mb-2">Money Market</h3>
            <p className="text-gray-600">Higher rates on larger balances</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">IRA Savings</h3>
            <p className="text-gray-600">Save for retirement with tax advantages</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Kids Club</h3>
            <p className="text-gray-600">Start your child's savings journey</p>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Save page created"

# ============================================
# CREATE BORROW SECTION PAGES
# ============================================
print_header "Creating Borrow section pages"

mkdir -p src/app/borrow
cat > src/app/borrow/page.tsx << 'EOF'
import Link from 'next/link'

export default function BorrowPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-4">Borrow</h1>
        <p className="text-xl text-gray-600 mb-12">Flexible lending solutions for life's big moments</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Mortgages</h2>
            <p className="text-gray-600 mb-4">Rates as low as 6.375% APR*</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>• 10 Year Fixed: 6.375%</li>
              <li>• 30 Year Fixed: 6.875%</li>
              <li>• 10/1 ARM: 6.625%</li>
            </ul>
            <Link href="/borrow/mortgage" className="text-primary-600 hover:text-primary-700 font-medium">
              Learn More →
            </Link>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Auto Loans</h2>
            <p className="text-gray-600 mb-4">Rates as low as 5.89% APR*</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>• New Auto (up to 66 months): 5.89%</li>
              <li>• Used Auto (up to 66 months): 6.19%</li>
            </ul>
            <Link href="/borrow/auto" className="text-primary-600 hover:text-primary-700 font-medium">
              Learn More →
            </Link>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Personal Loans</h2>
            <p className="text-gray-600 mb-4">Rates as low as 11.99% APR*</p>
            <p className="text-gray-600 mb-6">Flexible terms for any purpose</p>
            <Link href="/borrow/personal" className="text-primary-600 hover:text-primary-700 font-medium">
              Learn More →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Borrow page created"

# ============================================
# CREATE INVEST SECTION
# ============================================
print_header "Creating Invest section pages"

mkdir -p src/app/invest
cat > src/app/invest/page.tsx << 'EOF'
import Link from 'next/link'

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-4">Wealth & Retire</h1>
        <p className="text-xl text-gray-600 mb-12">Build strength for tomorrow with expert guidance</p>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Investment Team</h2>
            <p className="text-gray-600 mb-6">
              Work with experienced advisors who understand your goals and help you build a secure financial future.
            </p>
            <Link href="/invest/team" className="btn-primary inline-block">
              Meet Our Team
            </Link>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Retirement Planning</h2>
            <p className="text-gray-600 mb-6">
              From IRAs to 401(k) rollovers, we'll help you plan for the retirement you deserve.
            </p>
            <Link href="/invest/retirement" className="btn-primary inline-block">
              Start Planning
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Invest page created"

# ============================================
# UPDATE AUTH PAGES WITH OLOSPRING STYLE
# ============================================
print_header "Updating auth pages with Oldspring style"

# Update login page
cat > src/app/auth/login/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-primary-600">
          Oldspring Trust
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="demo@oldspringtrust.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                defaultValue="password123"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Login page updated"

# Update signup page
cat > src/app/auth/signup/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-primary-600">
          Oldspring Trust
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Signup page updated"

# ============================================
# CREATE DASHBOARD WITH OLOSPRING STYLE
# ============================================
print_header "Updating dashboard with Oldspring style"

cat > src/app/dashboard/page.tsx << 'EOF'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary-600">Oldspring Trust</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, John Doe</span>
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-700">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container-custom py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome back, John Doe
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-3xl font-bold text-primary-600">$755,300.00</p>
            <p className="text-xs text-gray-500 mt-1">Routing #: 655205039</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-3xl font-bold text-gray-900">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">Monthly Deposits</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">All Time</p>
            <p className="text-3xl font-bold text-gray-900">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">Total Volume</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Account Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Checking Account</span>
                <span className="font-semibold">$755,300.00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Savings Account</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Credit Card</span>
                <span className="font-semibold text-green-600">$0.00</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <p className="text-gray-500 text-center py-8">No recent transactions</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/transfers" className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow">
              <span className="block text-2xl mb-2">💰</span>
              <span className="text-sm font-medium">Transfer</span>
            </Link>
            <Link href="/payments" className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow">
              <span className="block text-2xl mb-2">💳</span>
              <span className="text-sm font-medium">Pay Bills</span>
            </Link>
            <Link href="/deposit" className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow">
              <span className="block text-2xl mb-2">📥</span>
              <span className="text-sm font-medium">Deposit</span>
            </Link>
            <Link href="/statements" className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow">
              <span className="block text-2xl mb-2">📄</span>
              <span className="text-sm font-medium">Statements</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
EOF
print_success "Dashboard updated"

# ============================================
# CREATE ADDITIONAL PAGES
# ============================================
print_header "Creating additional pages"

# About page
mkdir -p src/app/about
cat > src/app/about/page.tsx << 'EOF'
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-4">About Oldspring Trust</h1>
        <p className="text-xl text-gray-600 mb-8">Building Strength Together for Over 80 Years</p>
        
        <div className="prose max-w-3xl">
          <p className="mb-4">
            Oldspring Trust is a not-for-profit credit union bank built on the unshakeable promise to serve those who work every day to build a better future for us all.
          </p>
          <p className="mb-4">
            For over 80 years, we've delivered a breadth of financial services, expert guidance, and innovative tools to help strengthen and grow businesses, families, and our local communities.
          </p>
          <p>
            We are your Oldspring Trust, and we are Building Strength Together.
          </p>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "About page created"

# Contact page
mkdir -p src/app/contact
cat > src/app/contact/page.tsx << 'EOF'
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12">We're here to help</p>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a href="mailto:support@oldspringtrust.com" className="text-primary-600 hover:text-primary-700">
                  support@oldspringtrust.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-gray-600">100 Bishopsgate, London<br />EC2N 4AG, United Kingdom</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Hours</h3>
                <p className="text-gray-600">Mon-Thurs: 8:30 a.m.-5:00 p.m.<br />Friday: 8:30 a.m.-6:00 p.m.<br />Saturday: 9:00 a.m.-1:00 p.m.</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <textarea
                rows={4}
                placeholder="Your Message"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              ></textarea>
              <button className="btn-primary w-full">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Contact page created"

# Careers page
mkdir -p src/app/careers
cat > src/app/careers/page.tsx << 'EOF'
export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-4">Careers at Oldspring Trust</h1>
        <p className="text-xl text-gray-600 mb-8">Join our team and help build strength together</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Why Work With Us</h2>
            <p className="text-gray-600 mb-4">
              At Oldspring Trust, we're committed to serving our members and our community. Join a team that values integrity, service, and innovation.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Competitive benefits package</li>
              <li>• Professional development opportunities</li>
              <li>• Community-focused culture</li>
              <li>• Work-life balance</li>
            </ul>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
            <p className="text-gray-600">Check back soon for current openings or send your resume to careers@oldspringtrust.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Careers page created"

# ============================================
# CREATE LAYOUT UPDATES
# ============================================
print_header "Updating layouts"

# Update marketing layout
cat > src/app/marketing/layout.tsx << 'EOF'
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
EOF
print_success "Marketing layout updated"

# Update root layout if needed
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
EOF
print_success "Root layout updated"

# ============================================
# FINAL MESSAGE
# ============================================
echo ""
echo "🎉 ==============================================="
echo "🎉 OLOSPRING TRUST TRANSFORMATION COMPLETE!"
echo "🎉 ==============================================="
echo ""
echo "📊 New Pages Created:"
echo "   ✅ Homepage - Oldspring Trust style"
echo "   ✅ Bank section"
echo "   ✅ Save section"
echo "   ✅ Borrow section"
echo "   ✅ Invest section"
echo "   ✅ About page"
echo "   ✅ Contact page"
echo "   ✅ Careers page"
echo "   ✅ Updated login/signup"
echo "   ✅ Updated dashboard"
echo ""
echo "🚀 To view your new design:"
echo "   npm run dev"
echo "   Open: http://localhost:3001"
echo ""
echo "🎨 New Color Scheme:"
echo "   Primary Navy: #2b4d73"
echo "   Gold Accent: #e68a2e"
echo ""
echo "✅ Transformation complete! Your banking platform now has the Oldspring Trust style!"
echo ""
EOF

# Make the script executable
chmod +x scripts/oldspring_style_setup.sh

echo "✅ Oldspring style script created at scripts/oldspring_style_setup.sh"
echo ""
echo "To run the transformation:"
echo "  cd online-banking-platform"
echo "  ./scripts/oldspring_style_setup.sh"