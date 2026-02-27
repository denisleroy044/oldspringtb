import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function InvestmentTeamPage() {
  const advisors = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Financial Advisor',
      bio: '15+ years helping families build wealth',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'Investment Strategist',
      bio: 'Specializes in retirement planning',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop',
    },
    {
      name: 'Patricia Williams',
      role: 'Wealth Manager',
      bio: 'Expert in estate planning',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop',
    },
    {
      name: 'David Rodriguez',
      role: 'Financial Planner',
      bio: 'Helping young professionals invest',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop',
    },
  ]

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
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Investment Team</h1>
                <p className="text-xl text-gray-200 mb-6">
                  Meet our experienced financial advisors dedicated to helping you achieve your financial goals.
                </p>
                <Link
                  href="/invest/consultation"
                  className="group relative inline-block px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Schedule Consultation</span>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="relative w-[400px] h-[300px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/invest/team-meeting.jpg"
                    alt="Financial advisors meeting with clients"
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

        {/* Advisors Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Meet Our Advisors</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our team of experienced professionals is here to provide personalized guidance for your financial journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advisors.map((advisor, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="h-64 overflow-hidden">
                    <Image
                      src={advisor.image}
                      alt={advisor.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">{advisor.name}</h3>
                    <p className="text-[#2E8B57] font-semibold mb-2">{advisor.role}</p>
                    <p className="text-gray-600 text-sm">{advisor.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Banner */}
            <div className="mt-16 bg-gradient-to-r from-[#1e3a5f] to-[#2E8B57] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Schedule a complimentary consultation with one of our advisors today.
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
