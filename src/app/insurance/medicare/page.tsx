import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function MedicarePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2E8B57] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/insurance" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors group">
              <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Insurance
            </Link>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Medicare Insurance</h1>
                <p className="text-xl text-gray-200 mb-6">
                  Navigate Medicare with confidence. Our dedicated Medicare Specialists are here to help you understand your options.
                </p>
                <Link
                  href="/auth/signup"
                  className="group relative inline-block px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Talk to a Specialist</span>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="relative w-[400px] h-[300px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1579684288335-ed1f9c9d7ea2?w=800&auto=format&fit=crop"
                    alt="Senior couple with Medicare specialist"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Medicare Options */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Understanding Medicare</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We'll help you navigate the different parts of Medicare and find the coverage that fits your needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">Medicare Part A</h3>
                <p className="text-gray-600">Hospital insurance covering inpatient stays, skilled nursing facilities, hospice care, and some home health care.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">Medicare Part B</h3>
                <p className="text-gray-600">Medical insurance covering doctor visits, outpatient care, preventive services, and medical supplies.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">Medicare Part D</h3>
                <p className="text-gray-600">Prescription drug coverage that helps lower your medication costs.</p>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2E8B57] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Navigate Medicare Together?</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Schedule a free consultation with one of our Medicare Specialists today.
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
      </main>
      <Footer />
    </>
  )
}
