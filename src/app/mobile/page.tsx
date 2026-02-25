'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function MobilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-deep-teal text-white p-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Oldspring Trust</Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-white border-b border-gray-200 p-4">
          <nav className="space-y-2">
            <Link href="/" className="block py-2 text-gray-700 hover:text-soft-gold">Home</Link>
            <Link href="/bank" className="block py-2 text-gray-700 hover:text-soft-gold">Bank</Link>
            <Link href="/save" className="block py-2 text-gray-700 hover:text-soft-gold">Save</Link>
            <Link href="/borrow" className="block py-2 text-gray-700 hover:text-soft-gold">Borrow</Link>
            <Link href="/invest" className="block py-2 text-gray-700 hover:text-soft-gold">Invest</Link>
            <Link href="/insurance" className="block py-2 text-gray-700 hover:text-soft-gold">Insurance</Link>
            <Link href="/learn" className="block py-2 text-gray-700 hover:text-soft-gold">Learn</Link>
            <Link href="/payments" className="block py-2 text-gray-700 hover:text-soft-gold">Payments</Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-deep-teal mb-4">Mobile Banking</h1>
        <p className="text-gray-600 mb-6">Access your accounts on the go</p>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-deep-teal text-white p-4 rounded-lg text-center"
          >
            <span className="block text-xl mb-1">🔐</span>
            Login
          </button>
          <button
            onClick={() => router.push('/auth/signup')}
            className="bg-soft-gold text-deep-teal p-4 rounded-lg text-center"
          >
            <span className="block text-xl mb-1">📝</span>
            Sign Up
          </button>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-deep-teal mb-4">Features</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="text-soft-gold">✓</span>
              <span>24/7 Account Access</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-soft-gold">✓</span>
              <span>Mobile Check Deposit</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-soft-gold">✓</span>
              <span>Real-time Alerts</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-soft-gold">✓</span>
              <span>Secure Messaging</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
