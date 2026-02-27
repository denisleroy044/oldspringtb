import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function InsurancePage() {
  const insuranceProducts = [
    { 
      href: '/insurance/medicare', 
      name: 'Medicare Insurance', 
      icon: '/images/3d/glassmedicareinsurance.png',
      alt: 'Medicare Insurance',
      desc: 'Navigate Medicare with confidence' 
    },
    { 
      href: '/insurance/life', 
      name: 'Life Insurance', 
      icon: '/images/3d/glasslifeinsurance.png',
      alt: 'Life Insurance',
      desc: 'Protect your loved ones' 
    },
    { 
      href: '/insurance/auto', 
      name: 'Auto Insurance', 
      icon: '/images/3d/glassautoinsurance.png',
      alt: 'Auto Insurance',
      desc: 'Coverage for your vehicle' 
    },
    { 
      href: '/insurance/accidental', 
      name: 'Accidental Death', 
      icon: '/images/3d/glassaccidentaldeath.png',
      alt: 'Accidental Death Insurance',
      desc: 'Additional protection for unexpected events' 
    },
    { 
      href: '/insurance/homeowners', 
      name: 'Homeowners Insurance', 
      icon: '/images/3d/glasshomeownersinsurance.png',
      alt: 'Homeowners Insurance',
      desc: 'Protect your most valuable asset' 
    },
    { 
      href: '/insurance/hospital', 
      name: 'Hospital Insurance', 
      icon: '/images/3d/glasshospitalinsurance.png',
      alt: 'Hospital Insurance',
      desc: 'Help cover hospital costs' 
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
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Insurance Protection</h1>
                <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                  Protect what matters most with our comprehensive insurance offerings. From health to home, we've got you covered.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="/auth/signup"
                    className="group relative px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative">Get a Quote</span>
                  </Link>
                  <Link
                    href="#insurance-products"
                    className="group relative px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative">Explore Coverage</span>
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
                    alt="Insurance Protection"
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

        {/* Insurance Products Section */}
        <section id="insurance-products" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Choose Your Coverage</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We offer a wide range of insurance products to protect you, your family, and your assets.
              </p>
            </div>

            {/* Featured Banner */}
            <div className="bg-gradient-to-r from-[#FF8C00] to-[#2E8B57] rounded-2xl shadow-xl p-8 mb-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-4">Let's Navigate Medicare Together</h2>
                <p className="text-lg mb-6 max-w-2xl">Oldspring Trust offers dedicated Medicare Specialists to help you better prepare and understand your Medicare options.</p>
                <Link href="/insurance/medicare" className="inline-flex items-center bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition group">
                  Learn More
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insuranceProducts.map((product) => (
                <Link key={product.href} href={product.href} className="group">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                    <div className="relative w-20 h-20 mb-4 mx-auto">
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
                    <p className="text-gray-600 mb-4 text-center">{product.desc}</p>
                    <div className="flex justify-center">
                      <span className="text-[#2E8B57] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
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
                <h2 className="text-3xl font-bold mb-4">Peace of Mind Starts Here</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Get a free quote today and discover how affordable comprehensive protection can be.
                </p>
                <Link
                  href="/auth/signup"
                  className="group relative inline-block px-8 py-4 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Get Your Quote</span>
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
