import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function SmallBusinessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Local Small Businesses"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Community</span>
                <span className="text-white/80">February 28, 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Supporting Local Small Businesses</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Community Relations Team</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We've partnered with 50 local businesses to provide special financing and mentorship programs. 
                This initiative reflects our commitment to strengthening the local economy and helping small 
                businesses thrive.
              </p>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Local business owners"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Local business owners at our partnership launch event</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">The Partnership Program</h2>
              <p className="text-gray-600 mb-6">
                Our Small Business Partnership Program offers qualified local businesses:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Reduced interest rates on business loans</li>
                <li className="mb-2">Free business banking for 12 months</li>
                <li className="mb-2">One-on-one mentorship from our business specialists</li>
                <li className="mb-2">Access to networking events with other local entrepreneurs</li>
                <li className="mb-2">Marketing support and featured spotlights in our branches</li>
                <li className="mb-2">Educational workshops on financial management</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Success Stories</h2>
              
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-deep-teal mb-2">The Corner Cafe</h3>
                  <p className="text-gray-600 text-sm mb-3">Emma Thompson, Owner</p>
                  <p className="text-gray-600">
                    "The mentorship program helped me develop a solid business plan and secure financing 
                    to expand my cafe. I've doubled my seating capacity and hired three new staff members."
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-deep-teal mb-2">Green Leaf Bookshop</h3>
                  <p className="text-gray-600 text-sm mb-3">James Wilson, Owner</p>
                  <p className="text-gray-600">
                    "With the partnership program, I was able to launch an online store and host community 
                    events. Business is up 40% from last year."
                  </p>
                </div>
              </div>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Join Our Partnership Program</h3>
                <p className="text-gray-600 mb-6">
                  If you're a local business owner interested in learning more about our partnership program, 
                  we'd love to hear from you.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-soft-gold text-deep-teal px-8 py-4 rounded-xl font-semibold hover:bg-deep-teal hover:text-white transition-all duration-300"
                >
                  Apply for Partnership
                </Link>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Looking Ahead</h2>
              <p className="text-gray-600 mb-6">
                We plan to expand the program to 100 businesses by the end of the year. Our goal is to 
                create a thriving ecosystem of local businesses that support each other and contribute 
                to our community's economic vitality.
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
