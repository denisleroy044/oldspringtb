import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnimatedIcon } from '@/components/ui/AnimatedIcon'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Icons from '@/components/ui/BankingIcons'
import Link from 'next/link'

export default function BankPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 overflow-hidden">
        {/* Hero Section with Icon */}
        <section className="py-20 bg-gradient-to-br from-[#1e3a5f] to-[#2E8B57]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollAnimation animation="fadeInLeft">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Banking Services</h1>
                  <p className="text-xl text-gray-200 mb-6">Discover the perfect banking solutions for your everyday needs. From checking accounts to credit cards, we've got you covered.</p>
                  <div className="flex space-x-4">
                    <Link
                      href="/auth/signup"
                      className="bg-[#FF8C00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E67E00] transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover-lift"
                    >
                      Open Account
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeInRight">
                <div className="flex justify-center">
                  <AnimatedIcon 
                    src="/images/illustrations/bank.svg" 
                    alt="Banking Illustration"
                    size={400}
                    glowColor="rgba(255, 255, 255, 0.3)"
                    hoverEffect="float"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Featured Banner */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <div className="bg-gradient-to-r from-[#FF8C00] to-[#2E8B57] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative">
                  <h2 className="text-3xl font-bold mb-4">GET REWARDS ON US</h2>
                  <p className="text-lg mb-6 max-w-2xl">For a limited time, get a reward when you bank with us! Additional terms apply.</p>
                  <Link href="/bank/rewards" className="inline-flex items-center bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                    Learn More
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-12 text-center">Our Banking Solutions</h2>
            </ScrollAnimation>
            <div className="grid md:grid-cols-2 gap-8 stagger-children">
              <ScrollAnimation animation="fadeInUp" delay={0.1}>
                <Link href="/bank/accounts" className="group">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover-lift">
                    <div className="h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <Icons.Bank className="w-24 h-24 text-[#1e3a5f] group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-8">
                      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#FF8C00] transition-colors">Oldspring Trust Accounts</h2>
                      <p className="text-gray-600 mb-4">Explore our range of checking and savings accounts designed for your lifestyle.</p>
                      <span className="text-[#FF8C00] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                        Learn more
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.2}>
                <Link href="/bank/online-banking" className="group">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover-lift">
                    <div className="h-64 overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <Icons.MobileBanking className="w-24 h-24 text-[#1e3a5f] group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-8">
                      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#2E8B57] transition-colors">Online & Mobile Banking</h2>
                      <p className="text-gray-600 mb-4">Bank anytime, anywhere with our secure mobile app and online banking platform.</p>
                      <span className="text-[#2E8B57] font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                        Learn more
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
