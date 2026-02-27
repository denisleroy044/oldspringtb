import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function MoneyMarketPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop"
            alt="Professional with money market account"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Money Market Account</h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Higher rates with flexible access to your funds
              </p>
            </div>
          </div>
        </section>

        {/* Account Details */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <div className="inline-block bg-soft-gold text-deep-teal px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    Premium Savings
                  </div>
                  <h2 className="text-3xl font-bold text-deep-teal mb-4">Money Market</h2>
                  <div className="text-5xl font-bold text-soft-gold mb-4">2.75% APY</div>
                  <p className="text-gray-600 mb-6">
                    Earn higher rates while maintaining check-writing and debit card access to your funds.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">Check-writing privileges</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">Debit card access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">No monthly fees with $2,500 balance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">Open with as little as $1,000</span>
                    </div>
                  </div>
                  <Link
                    href="/auth/signup"
                    className="inline-block bg-deep-teal text-white px-8 py-4 rounded-xl font-semibold hover:bg-soft-gold transition-all duration-300 transform hover:scale-105"
                  >
                    Open Account
                  </Link>
                </div>
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop"
                    alt="Mobile banking access"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Tiered Interest Rates</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-sage/5 rounded-lg">
                    <span className="font-semibold text-deep-teal">$1,000 - $9,999</span>
                    <span className="text-soft-gold font-bold">2.25% APY</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-sage/10 rounded-lg">
                    <span className="font-semibold text-deep-teal">$10,000 - $24,999</span>
                    <span className="text-soft-gold font-bold">2.50% APY</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-sage/15 rounded-lg">
                    <span className="font-semibold text-deep-teal">$25,000 - $49,999</span>
                    <span className="text-soft-gold font-bold">2.75% APY</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-sage/20 rounded-lg">
                    <span className="font-semibold text-deep-teal">$50,000+</span>
                    <span className="text-soft-gold font-bold">3.00% APY</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  Rates are variable and subject to change. Fees may reduce earnings.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/save"
                className="inline-flex items-center text-deep-teal hover:text-soft-gold font-medium transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Savings
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
