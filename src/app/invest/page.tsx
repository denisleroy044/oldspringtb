import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function InvestPage() {
  const investOptions = [
    { href: '/invest/team', name: 'Our Investment Team', icon: '👥', desc: 'Meet our experienced financial advisors' },
    { href: '/invest/estate', name: 'Estate Planning', icon: '📋', desc: 'Plan for the future of your legacy' },
    { href: '/invest/retirement', name: 'Retirement Planning', icon: '🌅', desc: 'Build the retirement you deserve' },
    { href: '/invest/ira', name: 'IRA Rollover', icon: '🔄', desc: 'Simplify your retirement savings' },
    { href: '/invest/financial', name: 'Financial Planning', icon: '📊', desc: 'Comprehensive planning for every life stage' },
    { href: '/invest/investing', name: 'Online Investing', icon: '📈', desc: 'Take control of your investments' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Invest in Your Future</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're just starting to invest or planning for retirement, our team of experts is here to help you every step of the way.
            </p>
          </div>

          {/* Featured Banner */}
          <div className="bg-gradient-to-r from-[#2E8B57] to-[#FF8C00] rounded-2xl shadow-xl p-8 mb-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Partner With Our CFS Advisors</h2>
            <p className="text-lg mb-6 max-w-2xl">Build strength for tomorrow. Schedule your complimentary consultation today.</p>
            <Link href="/invest/consultation" className="inline-flex items-center bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investOptions.map((option) => (
              <Link key={option.href} href={option.href} className="group">
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2E8B57]/20 to-[#FF8C00]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{option.icon}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1e3a5f] mb-2 group-hover:text-[#2E8B57] transition-colors">{option.name}</h2>
                  <p className="text-gray-600 mb-4">{option.desc}</p>
                  <span className="text-[#FF8C00] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
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
