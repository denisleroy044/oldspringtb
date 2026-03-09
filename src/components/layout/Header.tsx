'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/images/logo/logo.png" 
              alt="Oldspring Trust" 
              className="h-8 w-auto"
              onError={(e) => {
                // Fallback if image fails
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.className = 'text-deep-teal font-bold text-xl';
                  fallback.textContent = 'Oldspring Trust';
                  parent.appendChild(fallback);
                }
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-deep-teal transition-colors">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-deep-teal transition-colors">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-deep-teal transition-colors">Contact</Link>
            <Link href="/auth/login" className="bg-deep-teal text-white px-4 py-2 rounded-lg hover:bg-deep-teal/90 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="border-2 border-deep-teal text-deep-teal px-4 py-2 rounded-lg hover:bg-deep-teal/5 transition-colors">
              Open Account
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-deep-teal py-2">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-deep-teal py-2">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-deep-teal py-2">Contact</Link>
              <Link href="/auth/login" className="bg-deep-teal text-white px-4 py-2 rounded-lg text-center">Sign In</Link>
              <Link href="/auth/signup" className="border-2 border-deep-teal text-deep-teal px-4 py-2 rounded-lg text-center">Open Account</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
