import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function BorrowPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 overflow-hidden">
        {/* Hero Section with 3D Glass Checklist Icon */}
        <section className="py-20 bg-gradient-to-br from-[#1e3a5f] to-[#2E8B57] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Borrow with Confidence</h1>
                <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                  From credit cards to mortgages, we offer competitive rates and flexible terms to help you achieve your goals.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="/auth/signup"
                    className="group relative px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative">Apply Now</span>
                  </Link>
                  <Link
                    href="#loan-options"
                    className="group relative px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative">Explore Options</span>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-3xl scale-75 group-hover:scale-110 transition-all duration-700"></div>
                {/* 3D Glass Checklist Icon */}
                <div className="relative w-[400px] h-[400px] group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/3d/checklist.png"
                    alt="Borrowing Options"
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

        {/* Loan Products Section */}
        <section id="loan-options" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Featured Banner */}
            <div className="bg-gradient-to-r from-[#FF8C00] to-[#2E8B57] rounded-2xl shadow-xl p-8 mb-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-2">0% Intro APR* for 15 Months</h2>
                <p className="text-lg mb-6 max-w-2xl">Pay no interest until 2025 on all purchases with a new credit card from Oldspring Trust.</p>
                <Link href="/borrow/credit-cards" className="inline-flex items-center bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition group">
                  Learn More
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Choose Your Loan Type</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find the right borrowing solution for your needs with competitive rates and flexible terms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Link href="/borrow/credit-cards" className="group">
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <div className="relative w-20 h-20 mb-4">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                    {/* 3D Glass Credit Card Icon */}
                    <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src="/images/3d/glasscreditcard.png"
                        alt="Credit Cards"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
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
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <div className="relative w-20 h-20 mb-4">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                    {/* 3D Glass Homeowners Insurance Icon */}
                    <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src="/images/3d/glasshomeownersinsurance.png"
                        alt="Mortgage & Home Loans"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
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
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative w-20 h-20 mb-4">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                    {/* 3D Glass Checklist Icon */}
                    <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src="/images/3d/checklist.png"
                        alt="Personal Loans"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
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

            {/* Additional Information Banner */}
            <div className="mt-16 bg-gradient-to-r from-[#1e3a5f] to-[#2E8B57] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Check your rate in minutes with no impact to your credit score. Apply online today!
                </p>
                <Link
                  href="/auth/signup"
                  className="group relative inline-block px-8 py-4 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Check Your Rate</span>
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
