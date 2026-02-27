import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function InvestPage() {
  const investOptions = [
    { 
      href: '/invest/team', 
      name: 'Our Investment Team', 
      icon: '/images/3d/team.png',
      alt: 'Investment Team',
      desc: 'Meet our experienced financial advisors' 
    },
    { 
      href: '/invest/estate', 
      name: 'Estate Planning', 
      icon: '/images/3d/glasshomeownersinsurance.png',
      alt: 'Estate Planning',
      desc: 'Plan for the future of your legacy' 
    },
    { 
      href: '/invest/retirement', 
      name: 'Retirement Planning', 
      icon: '/images/3d/glassinvest.png',
      alt: 'Retirement Planning',
      desc: 'Build the retirement you deserve' 
    },
    { 
      href: '/invest/ira', 
      name: 'IRA Rollover', 
      icon: '/images/3d/glassrollover.png',
      alt: 'IRA Rollover',
      desc: 'Simplify your retirement savings' 
    },
    { 
      href: '/invest/financial', 
      name: 'Financial Planning', 
      icon: '/images/3d/glassbarchart.png',
      alt: 'Financial Planning',
      desc: 'Comprehensive planning for every life stage' 
    },
    { 
      href: '/invest/investing', 
      name: 'Online Investing', 
      icon: '/images/3d/glassinvestment.png',
      alt: 'Online Investing',
      desc: 'Take control of your investments' 
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 overflow-hidden">
        {/* Hero Section with 3D Glass Invest Icon */}
        <section className="py-20 bg-gradient-to-br from-[#1e3a5f] to-[#2E8B57] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Invest in Your Future</h1>
                <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                  Whether you're just starting to invest or planning for retirement, our team of experts is here to help you every step of the way.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="/auth/signup"
                    className="group relative px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative">Get Started</span>
                  </Link>
                  <Link
                    href="#investment-options"
                    className="group relative px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative">Explore Options</span>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-3xl scale-75 group-hover:scale-110 transition-all duration-700"></div>
                {/* 3D Glass Invest Icon */}
                <div className="relative w-[400px] h-[400px] group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/3d/glassinvest.png"
                    alt="Invest in Your Future"
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

        {/* Investment Options Section */}
        <section id="investment-options" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Choose Your Investment Path</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From personalized advice to self-directed investing, we have options to match every investor's needs.
              </p>
            </div>

            {/* Featured Banner */}
            <div className="bg-gradient-to-r from-[#2E8B57] to-[#FF8C00] rounded-2xl shadow-xl p-8 mb-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-4">Partner With Our CFS Advisors</h2>
                <p className="text-lg mb-6 max-w-2xl">Build strength for tomorrow. Schedule your complimentary consultation today.</p>
                <Link href="/invest/consultation" className="inline-flex items-center bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition group">
                  Get Started
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investOptions.map((option) => (
                <Link key={option.href} href={option.href} className="group">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                    <div className="relative w-20 h-20 mb-4 mx-auto">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                      {/* 3D Glass Icon */}
                      <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                        <Image
                          src={option.icon}
                          alt={option.alt}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-[#1e3a5f] mb-2 group-hover:text-[#2E8B57] transition-colors text-center">{option.name}</h2>
                    <p className="text-gray-600 mb-4 text-center">{option.desc}</p>
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
                <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Open an investment account today and take the first step toward securing your financial future.
                </p>
                <Link
                  href="/auth/signup"
                  className="group relative inline-block px-8 py-4 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Open an Account</span>
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
