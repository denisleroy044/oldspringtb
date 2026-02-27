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
                <button className="bg-[#FF8C00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E67E00] transition">Enroll Now</button>
                <button className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-[#1e3a5f] hover:text-white transition">Learn More</button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-80 h-80">
                <Image
                  src="/images/3d/glassmobile.png"
                  alt="Mobile Banking"
                  width={320}
                  height={320}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-8 text-center">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Mobile App</h3>
              <p className="text-gray-600">Check balances, transfer funds, and deposit checks from your smartphone.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2E8B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Secure & Safe</h3>
              <p className="text-gray-600">Bank with peace of mind using our advanced security features and encryption.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FF8C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">24/7 Access</h3>
              <p className="text-gray-600">Bank on your schedule with around-the-clock access to your accounts.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2E8B57] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">Enroll in online banking today and experience the future of banking.</p>
              <button className="bg-[#FF8C00] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#E67E00] transition shadow-lg">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
