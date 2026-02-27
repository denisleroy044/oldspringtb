import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function PaymentsPage() {
  const paymentOptions = [
    { 
      href: '/payments/auto-loan', 
      name: 'Auto Loan Customer Center', 
      icon: '/images/3d/glassautoinsurance.png',
      alt: 'Auto Loan Center',
      desc: 'Manage your auto loan, make payments, and view statements online.' 
    },
    { 
      href: '/payments/one-time', 
      name: 'One Time Payments', 
      icon: '/images/3d/glassaccount.png',
      alt: 'One Time Payments',
      desc: 'Make a quick, secure one-time payment without logging in.' 
    },
    { 
      href: '/payments/mail', 
      name: 'Pay by Mail', 
      icon: '/images/3d/mailbox.png',
      alt: 'Pay by Mail',
      desc: 'Traditional payment option - send your payment to our lockbox address.' 
    },
    { 
      href: '/payments/branch', 
      name: 'Pay at Branch', 
      icon: '/images/3d/glasshome.png',
      alt: 'Pay at Branch',
      desc: 'Visit us in person at any of our convenient branch locations.' 
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 overflow-hidden">
        {/* Hero Section with 3D Glass Credit Card Icon */}
        <section className="py-20 bg-gradient-to-br from-[#1e3a5f] to-[#2E8B57] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Payments & Transfers</h1>
                <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                  Fast, secure ways to send and receive money. Make payments, manage auto loans, and choose the option that works best for you.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="/auth/login"
                    className="group relative px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative">Make a Payment</span>
                  </Link>
                  <Link
                    href="#payment-options"
                    className="group relative px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative">View Options</span>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-3xl scale-75 group-hover:scale-110 transition-all duration-700"></div>
                {/* 3D Glass Credit Card Icon */}
                <div className="relative w-[400px] h-[400px] group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/3d/glasscreditcard.png"
                    alt="Payments"
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

        {/* Payment Options Section */}
        <section id="payment-options" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Choose Your Payment Method</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We offer multiple convenient ways to make your payments. Select the option that works best for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {paymentOptions.map((option) => (
                <Link key={option.href} href={option.href} className="group">
                  <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                    <div className="relative w-24 h-24 mb-6 mx-auto">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                      {/* 3D Glass Icon */}
                      <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                        <Image
                          src={option.icon}
                          alt={option.alt}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#FF8C00] transition-colors text-center">{option.name}</h2>
                    <p className="text-gray-600 mb-6 text-center">{option.desc}</p>
                    <div className="flex justify-center">
                      <span className="text-[#2E8B57] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                        Learn more
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <h2 className="text-3xl font-bold mb-4">Need Help with Your Payment?</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Our customer service team is available 24/7 to assist you with any payment questions.
                </p>
                <Link
                  href="/contact"
                  className="group relative inline-block px-8 py-4 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Contact Us</span>
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
