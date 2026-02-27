import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function CertificatesPage() {
  const certificateTerms = [
    { term: '6 months', rate: '2.50% APY' },
    { term: '12 months', rate: '3.00% APY' },
    { term: '18 months', rate: '3.25% APY' },
    { term: '24 months', rate: '3.50% APY' },
    { term: '36 months', rate: '3.75% APY' },
    { term: '48 months', rate: '4.00% APY' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop"
            alt="Couple planning certificate savings"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Certificate Accounts</h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Guaranteed returns with fixed-rate terms
              </p>
            </div>
          </div>
        </section>

        {/* Account Details */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="inline-block bg-soft-gold text-deep-teal px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  Fixed-Rate Certificates
                </div>
                <h2 className="text-3xl font-bold text-deep-teal mb-4">Certificates of Deposit</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Lock in competitive rates with terms ranging from 6 months to 48 months. 
                  Perfect for savers who don't need immediate access to their funds.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {certificateTerms.map((cert, index) => (
                  <div key={index} className="bg-sage/5 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-deep-teal mb-2">{cert.term}</h3>
                    <p className="text-3xl font-bold text-soft-gold mb-2">{cert.rate}</p>
                    <p className="text-sm text-gray-500">Fixed rate</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Certificate Features</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">Fixed interest rate for entire term</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">FDIC insured up to $250,000</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">Open with as little as $500</span>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">Interest compounded daily</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">Automatic renewal options</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-sage text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">Grace period at maturity</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/auth/signup"
                  className="inline-block bg-deep-teal text-white px-8 py-4 rounded-xl font-semibold hover:bg-soft-gold transition-all duration-300 transform hover:scale-105"
                >
                  Open a Certificate
                </Link>
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
