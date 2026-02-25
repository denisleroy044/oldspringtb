import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function SavePage() {
  const savingsProducts = [
    { href: '/save/high-yield', name: 'High Yield Savings', rate: '3.75% APY', icon: '📈', color: 'from-blue-500 to-blue-700' },
    { href: '/save/holiday-club', name: 'Holiday Club', rate: '1.25% APY', icon: '🎄', color: 'from-green-500 to-green-700' },
    { href: '/save/star', name: 'Star Savings', rate: '2.50% APY', icon: '⭐', color: 'from-yellow-500 to-yellow-700' },
    { href: '/save/kids-club', name: 'Kids Club', rate: '2.00% APY', icon: '🧸', color: 'from-pink-500 to-pink-700' },
    { href: '/save/certificates', name: 'Certificates', rate: '3.25% APY', icon: '📜', color: 'from-purple-500 to-purple-700' },
    { href: '/save/money-market', name: 'Money Market', rate: '2.75% APY', icon: '💰', color: 'from-indigo-500 to-indigo-700' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Save for Your Future</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're saving for a rainy day, a special occasion, or retirement, we have the right savings account for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingsProducts.map((product) => (
              <Link key={product.href} href={product.href} className="group">
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`w-16 h-16 bg-gradient-to-br ${product.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl text-white">{product.icon}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1e3a5f] mb-2 group-hover:text-[#FF8C00] transition-colors">{product.name}</h2>
                  <p className="text-3xl font-bold text-[#2E8B57] mb-3">{product.rate}</p>
                  <p className="text-gray-600 mb-4">Open with as little as $100. No monthly fees.</p>
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
