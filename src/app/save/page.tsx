import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function SavePage() {
  const savingsProducts = [
    { 
      href: '/save/high-yield', 
      name: 'High Yield Savings', 
      rate: '3.75% APY', 
      icon: '/images/3d/glassinvestment.png',
      alt: 'High Yield Savings',
      color: 'from-blue-500 to-blue-700' 
    },
    { 
      href: '/save/holiday-club', 
      name: 'Holiday Club', 
      rate: '1.25% APY', 
      icon: '/images/3d/glasschristmastree.png',
      alt: 'Holiday Club Savings',
      color: 'from-green-500 to-green-700' 
    },
    { 
      href: '/save/star', 
      name: 'Star Savings', 
      rate: '2.50% APY', 
      icon: '/images/3d/glassstar.png',
      alt: 'Star Savings',
      color: 'from-yellow-500 to-yellow-700' 
    },
    { 
      href: '/save/kids-club', 
      name: 'Kids Club', 
      rate: '2.00% APY', 
      icon: '/images/3d/piggybank.png',
      alt: 'Kids Club Savings',
      color: 'from-pink-500 to-pink-700' 
    },
    { 
      href: '/save/certificates', 
      name: 'Certificates', 
      rate: '3.25% APY', 
      icon: '/images/3d/checklist.png',
      alt: 'Certificate Savings',
      color: 'from-purple-500 to-purple-700' 
    },
    { 
      href: '/save/money-market', 
      name: 'Money Market', 
      rate: '2.75% APY', 
      icon: '/images/3d/moneybag.png',
      alt: 'Money Market Savings',
      color: 'from-indigo-500 to-indigo-700' 
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 overflow-hidden">
        {/* Hero Section with 3D Glass Secure Icon */}
        <section className="py-20 bg-gradient-to-br from-[#1e3a5f] to-[#2E8B57] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Save for Your Future</h1>
                <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                  Whether you're saving for a rainy day, a special occasion, or retirement, 
                  we have the right savings account to help you reach your goals.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="/auth/signup"
                    className="group relative px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative">Open a Savings Account</span>
                  </Link>
                  <Link
                    href="#savings-products"
                    className="group relative px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative">Explore Options</span>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-3xl scale-75 group-hover:scale-110 transition-all duration-700"></div>
                {/* 3D Glass Secure Icon */}
                <div className="relative w-[400px] h-[400px] group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/3d/glasssecure.png"
                    alt="Secure Savings"
                    width={400}
                    height={400}
                    className="w-full h-full object-contain drop-shadow-2xl animate-float"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Savings Products Section */}
        <section id="savings-products" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Choose Your Savings Account</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each account is designed with your unique goals in mind. Compare features and find your perfect match.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savingsProducts.map((product) => (
                <Link key={product.href} href={product.href} className="group">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                      {/* 3D Glass Icon */}
                      <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                        <Image
                          src={product.icon}
                          alt={product.alt}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-[#1e3a5f] mb-2 group-hover:text-[#FF8C00] transition-colors text-center">{product.name}</h2>
                    <p className="text-3xl font-bold text-[#2E8B57] mb-3 text-center">{product.rate}</p>
                    <p className="text-gray-600 mb-4 text-center">Open with as little as $100. No monthly fees.</p>
                    <div className="flex justify-center">
                      <span className="text-[#FF8C00] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                        Learn more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Additional Information Banner */}
            <div className="mt-16 bg-gradient-to-r from-[#1e3a5f] to-[#2E8B57] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative text-center">
                <h2 className="text-3xl font-bold mb-4">Start Saving Today</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Open any savings account with as little as $100 and enjoy competitive rates, 
                  no monthly fees, and 24/7 access to your funds.
                </p>
                <Link
                  href="/auth/signup"
                  className="group relative inline-block px-8 py-4 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Get Started</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Add animation styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
            }
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
          `
        }} />
      </main>
      <Footer />
    </>
  )
}
