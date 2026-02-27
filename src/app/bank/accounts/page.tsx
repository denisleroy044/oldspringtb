'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function BankAccountsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/bank" className="inline-flex items-center text-[#2E8B57] hover:text-[#FF8C00] mb-6 transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Banking
          </Link>
          
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Oldspring Trust Accounts</h1>
          <p className="text-xl text-gray-600 mb-8">Choose the account that fits your lifestyle.</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#FF8C00] transition-colors">Personal Checking</h2>
              <p className="text-gray-600 mb-4">Perfect for everyday banking with no monthly maintenance fees.</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2E8B57] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No monthly fees
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2E8B57] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free debit card
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2E8B57] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mobile check deposit
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="group relative inline-block px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative">Open Account</span>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#2E8B57] transition-colors">Interest Checking</h2>
              <p className="text-gray-600 mb-4">Earn interest while enjoying the flexibility of a checking account.</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2E8B57] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  0.50% APY
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2E8B57] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free checks
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#2E8B57] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Overdraft protection
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="group relative inline-block px-6 py-3 bg-[#2E8B57] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#267A48] hover:scale-105 hover:-translate-y-1"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative">Open Account</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
