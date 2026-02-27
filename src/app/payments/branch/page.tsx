import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function PayAtBranchPage() {
  const branches = [
    {
      city: 'Phoenix',
      address: '123 Main Street, Phoenix, AZ 85001',
      hours: 'Mon-Fri: 9am-6pm, Sat: 9am-1pm',
      phone: '(602) 555-0123',
    },
    {
      city: 'Scottsdale',
      address: '456 Scottsdale Rd, Scottsdale, AZ 85251',
      hours: 'Mon-Fri: 9am-6pm, Sat: 9am-1pm',
      phone: '(480) 555-0456',
    },
    {
      city: 'Tempe',
      address: '789 University Dr, Tempe, AZ 85281',
      hours: 'Mon-Fri: 8:30am-5:30pm, Sat: 10am-2pm',
      phone: '(480) 555-0789',
    },
    {
      city: 'Mesa',
      address: '321 Main St, Mesa, AZ 85201',
      hours: 'Mon-Fri: 9am-5pm, Sat: 9am-12pm',
      phone: '(480) 555-0321',
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2E8B57] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/payments" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors group">
              <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Payments
            </Link>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Pay at Branch</h1>
                <p className="text-xl text-gray-200 mb-6">
                  Visit us in person at any of our convenient branch locations. Our friendly staff is ready to assist you.
                </p>
                <Link
                  href="#branch-locations"
                  className="group relative inline-block px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Find a Branch</span>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="relative w-[400px] h-[300px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop"
                    alt="Bank teller helping customer"
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

        {/* Branch Locations */}
        <section id="branch-locations" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Our Branch Locations</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Visit any of our convenient locations to make payments or speak with a banking specialist.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {branches.map((branch, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{branch.city} Branch</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-start">
                      <svg className="w-5 h-5 text-[#2E8B57] mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {branch.address}
                    </p>
                    <p className="flex items-start">
                      <svg className="w-5 h-5 text-[#2E8B57] mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {branch.hours}
                    </p>
                    <p className="flex items-start">
                      <svg className="w-5 h-5 text-[#2E8B57] mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {branch.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="bg-[#1e3a5f]/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">What to Bring:</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-[#2E8B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Valid ID</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-[#2E8B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Account Number</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-[#2E8B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Payment Method</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
