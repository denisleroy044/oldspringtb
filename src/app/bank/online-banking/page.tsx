'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function OnlineBankingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/bank" className="inline-flex items-center text-[#2E8B57] hover:text-[#FF8C00] mb-6 transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Banking
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Online & Mobile Banking</h1>
              <p className="text-xl text-gray-600 mb-6">Bank anytime, anywhere with our secure digital banking platform. Manage your finances from the palm of your hand.</p>
              <div className="flex space-x-4">
                <button className="group relative px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Enroll Now</span>
                </button>
                <button className="group relative px-6 py-3 bg-[#2E8B57] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#267A48] hover:scale-105 hover:-translate-y-1">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Learn More</span>
                </button>
              </div>
            </div>
            <div className="flex justify-center relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-3xl scale-75 group-hover:scale-110 transition-all duration-700"></div>
              {/* 3D Glass Mobile Icon */}
              <div className="relative w-80 h-80 group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/3d/glassmobilephone.png"
                  alt="Mobile Banking"
                  width={320}
                  height={320}
                  className="w-full h-full object-contain drop-shadow-2xl animate-float"
                  priority
                />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-8 text-center">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                {/* 3D Glass Mobile Phone Icon */}
                <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src="/images/3d/glassmobilephone.png"
                    alt="Mobile App"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#FF8C00] transition-colors">Mobile App</h3>
              <p className="text-gray-600">Check balances, transfer funds, and deposit checks from your smartphone.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                {/* 3D Glass Safe Icon */}
                <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src="/images/3d/glasssafe.png"
                    alt="Secure & Safe"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#2E8B57] transition-colors">Secure & Safe</h3>
              <p className="text-gray-600">Bank with peace of mind using our advanced security features and encryption.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                {/* 3D Glass Account Icon */}
                <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src="/images/3d/glassaccount.png"
                    alt="24/7 Access"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#FF8C00] transition-colors">24/7 Access</h3>
              <p className="text-gray-600">Bank on your schedule with around-the-clock access to your accounts.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2E8B57] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">Enroll in online banking today and experience the future of banking.</p>
              <button className="group relative px-8 py-4 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative">Enroll Now</span>
              </button>
            </div>
          </div>
        </div>

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
