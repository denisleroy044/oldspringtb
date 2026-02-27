import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function FinancialPlanningPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2E8B57] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/invest" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors group">
              <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Invest
            </Link>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Financial Planning</h1>
                <p className="text-xl text-gray-200 mb-6">
                  Comprehensive planning for every life stage, helping you make informed decisions about your financial future.
                </p>
                <Link
                  href="/invest/consultation"
                  className="group relative inline-block px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Start Planning</span>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="relative w-[400px] h-[300px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/invest/financial-planning.jpg"
                    alt="Financial planning meeting"
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

        {/* Planning Areas */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Areas of Financial Planning</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive guidance across all aspects of your financial life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Budgeting & Cash Flow</h3>
                <p className="text-gray-600">Create a sustainable spending plan that aligns with your goals.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Investment Strategy</h3>
                <p className="text-gray-600">Build a diversified portfolio tailored to your risk tolerance.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Tax Planning</h3>
                <p className="text-gray-600">Minimize your tax burden and maximize your wealth.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Education Funding</h3>
                <p className="text-gray-600">Plan for your children's educational expenses.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Insurance Review</h3>
                <p className="text-gray-600">Ensure you have the right protection for your family.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Retirement Planning</h3>
                <p className="text-gray-600">Prepare for the lifestyle you want in retirement.</p>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="mt-16 bg-gradient-to-r from-[#1e3a5f] to-[#2E8B57] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative text-center">
                <h2 className="text-3xl font-bold mb-4">Take Control of Your Financial Future</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Work with our advisors to create a comprehensive financial plan.
                </p>
                <Link
                  href="/invest/consultation"
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
