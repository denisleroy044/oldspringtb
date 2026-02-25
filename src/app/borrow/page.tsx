import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function BorrowPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Borrow with Confidence</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From credit cards to mortgages, we offer competitive rates and flexible terms to help you achieve your goals.
            </p>
          </div>

          {/* Featured Banner */}
          <div className="bg-gradient-to-r from-[#FF8C00] to-[#2E8B57] rounded-2xl shadow-xl p-8 mb-12 text-white">
            <h2 className="text-3xl font-bold mb-2">0% Intro APR* for 15 Months</h2>
            <p className="text-lg mb-6 max-w-2xl">Pay no interest until 2025 on all purchases with a new credit card from Oldspring Trust.</p>
            <Link href="/borrow/credit-cards" className="inline-flex items-center bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Learn More
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/borrow/credit-cards" className="group">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#FF8C00]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">💳</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#FF8C00] transition-colors">Credit Cards</h2>
                <p className="text-gray-600 mb-4">Choose from rewards cards, low APR options, and cards designed to build credit.</p>
                <span className="text-[#FF8C00] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/borrow/mortgage" className="group">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#2E8B57]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🏠</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#2E8B57] transition-colors">Mortgage & Home Loans</h2>
                <p className="text-gray-600 mb-4">Make your dream home a reality with our competitive mortgage rates and personalized service.</p>
                <span className="text-[#2E8B57] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link href="/borrow/personal" className="group md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#FF8C00]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">💰</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#FF8C00] transition-colors">Personal Loans</h2>
                <p className="text-gray-600 mb-4">Fund your next big purchase, consolidate debt, or cover unexpected expenses with our flexible personal loans.</p>
                <span className="text-[#FF8C00] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
