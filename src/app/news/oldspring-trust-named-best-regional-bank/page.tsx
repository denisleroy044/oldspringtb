import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function BestBankAwardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Award Ceremony"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Press Releases</span>
                <span className="text-white/80">February 20, 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Oldspring Trust Named 'Best Regional Bank'</h1>
              <p className="text-xl text-white/90 max-w-2xl">By James Mitchell, CEO</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're honored to receive the Best Regional Bank award for our commitment to customer service. 
                This prestigious recognition comes from Financial Excellence Magazine's annual industry survey.
              </p>

              <p className="text-gray-600 mb-6">
                The award recognizes banks that demonstrate exceptional customer service, innovative products, 
                and strong community involvement. Oldspring Trust was selected from over 200 regional banks 
                across the UK.
              </p>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Team receiving award"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Our leadership team accepting the award</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">What Makes Us Different</h2>
              <p className="text-gray-600 mb-6">
                According to the award citation, Oldspring Trust stood out for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">95% customer satisfaction rating</li>
                <li className="mb-2">Innovative digital banking solutions</li>
                <li className="mb-2">Strong community investment programs</li>
                <li className="mb-2">Personalized financial advice and planning</li>
                <li className="mb-2">Commitment to financial education</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">A Word From Our CEO</h2>
              <div className="bg-soft-white rounded-2xl p-8 my-8">
                <p className="text-gray-600 italic mb-4">
                  "This award belongs to our incredible team and loyal customers. Every day, our employees 
                  go above and beyond to provide the personalized service that sets us apart. And our customers 
                  trust us with their financial dreams—that's the greatest honor of all."
                </p>
                <p className="font-bold text-deep-teal">— James Mitchell, CEO</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Looking Forward</h2>
              <p className="text-gray-600 mb-6">
                This recognition motivates us to continue raising the bar. We're already working on new 
                initiatives to better serve our customers and communities, including expanded digital services, 
                financial education programs, and enhanced customer support.
              </p>
            </div>

            <div className="border-t border-gray-200 mt-12 pt-8">
              <Link
                href="/news"
                className="inline-flex items-center text-deep-teal hover:text-soft-gold font-medium transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to News
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
