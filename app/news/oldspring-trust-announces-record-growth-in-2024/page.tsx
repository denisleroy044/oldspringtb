import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function RecordGrowthPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Oldspring Trust Growth"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Press Releases</span>
                <span className="text-white/80">March 15, 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Oldspring Trust Announces Record Growth in 2024</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Sarah Thompson, CEO</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're proud to announce our strongest year yet, with significant growth across all business segments. 
                Oldspring Trust has achieved record-breaking results in 2024, demonstrating our commitment to excellence 
                and our customers' financial success.
              </p>

              <p className="text-gray-600 mb-6">
                The company reported a 15% increase in total assets, reaching $96.2 billion, while customer deposits grew 
                by 18% to $78.5 billion. This remarkable performance reflects the trust our customers place in us and the 
                dedication of our team members.
              </p>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Key Achievements</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">15% growth in total assets to $96.2 billion</li>
                <li className="mb-2">18% increase in customer deposits to $78.5 billion</li>
                <li className="mb-2">22% rise in digital banking adoption</li>
                <li className="mb-2">Expanded to 5 new locations across the UK</li>
                <li className="mb-2">Launched innovative mobile banking features</li>
              </ul>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Team celebrating success"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Our team celebrating our record-breaking year</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Looking Forward</h2>
              <p className="text-gray-600 mb-6">
                As we move into 2025, we remain focused on innovation, customer service, and community support. 
                We're investing in new technologies and expanding our team to better serve our growing customer base.
              </p>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">About Sarah Thompson</h3>
                <p className="text-gray-600">
                  Sarah Thompson has served as CEO of Oldspring Trust since 2020. Under her leadership, 
                  the company has achieved unprecedented growth while maintaining its commitment to 
                  personalized customer service and community engagement.
                </p>
              </div>
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
