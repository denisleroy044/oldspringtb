import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function InsurancePage() {
  const insuranceProducts = [
    { href: '/insurance/medicare', name: 'Medicare Insurance', icon: '🏥', desc: 'Navigate Medicare with confidence' },
    { href: '/insurance/life', name: 'Life Insurance', icon: '❤️', desc: 'Protect your loved ones' },
    { href: '/insurance/auto', name: 'Auto Insurance', icon: '🚗', desc: 'Coverage for your vehicle' },
    { href: '/insurance/accidental', name: 'Accidental Death', icon: '⚠️', desc: 'Additional protection for unexpected events' },
    { href: '/insurance/homeowners', name: 'Homeowners Insurance', icon: '🏠', desc: 'Protect your most valuable asset' },
    { href: '/insurance/hospital', name: 'Hospital Insurance', icon: '🏨', desc: 'Help cover hospital costs' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Insurance Protection</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protect what matters most with our comprehensive insurance offerings. From health to home, we've got you covered.
            </p>
          </div>

          {/* Featured Banner */}
          <div className="bg-gradient-to-r from-[#FF8C00] to-[#2E8B57] rounded-2xl shadow-xl p-8 mb-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Let's Navigate Medicare Together</h2>
            <p className="text-lg mb-6 max-w-2xl">Oldspring Trust offers dedicated Medicare Specialists to help you better prepare and understand your Medicare options.</p>
            <Link href="/insurance/medicare" className="inline-flex items-center bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Learn More
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insuranceProducts.map((product) => (
              <Link key={product.href} href={product.href} className="group">
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF8C00]/10 to-[#2E8B57]/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{product.icon}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1e3a5f] mb-2 group-hover:text-[#FF8C00] transition-colors">{product.name}</h2>
                  <p className="text-gray-600 mb-4">{product.desc}</p>
                  <span className="text-[#2E8B57] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                    Learn more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
