import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function InflationBusinessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="/images/learn/inflation-business-hero.jpg"
            alt="Business and rising rates"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Running a Business</span>
                <span className="text-white/80">March 10, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">7 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">How Rising Rates and Inflation Impact Businesses</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Michael Chen, Business Banking Specialist</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Understanding the effects of economic changes on your business is crucial for long-term success. 
                Learn how to navigate rising rates and inflation to protect and grow your business.
              </p>

              <p className="text-gray-600 mb-6">
                With central banks raising interest rates to combat inflation, businesses face new challenges 
                and opportunities. Here's what you need to know to adapt your strategy.
              </p>

              <div className="my-12">
                <Image
                  src="/images/learn/business-owners-discussing.jpg"
                  alt="Business owners discussing strategy"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Business owners adapting to economic changes</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">How Rising Rates Affect Your Business</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Higher borrowing costs:</strong> Loans and lines of credit become more expensive</li>
                <li className="mb-2"><strong className="text-deep-teal">Reduced consumer spending:</strong> Customers may cut back on purchases</li>
                <li className="mb-2"><strong className="text-deep-teal">Stronger dollar:</strong> Can impact export businesses</li>
                <li className="mb-2"><strong className="text-deep-teal">Investment shifts:</strong> Investors may favor bonds over stocks</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Inflation's Impact on Business Operations</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Higher input costs:</strong> Raw materials, supplies, and inventory cost more</li>
                <li className="mb-2"><strong className="text-deep-teal">Wage pressure:</strong> Employees seek higher pay to keep up with living costs</li>
                <li className="mb-2"><strong className="text-deep-teal">Pricing challenges:</strong> Balancing price increases with customer retention</li>
                <li className="mb-2"><strong className="text-deep-teal">Margin compression:</strong> Profits may shrink if costs rise faster than prices</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Strategies for Navigating Economic Changes</h2>
              
              <h3 className="text-xl font-bold text-deep-teal mb-3">1. Review Your Debt Structure</h3>
              <p className="text-gray-600 mb-4">
                Consider fixing variable-rate debt to lock in current rates before they rise further. 
                Explore refinancing options with your lender.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">2. Build Cash Reserves</h3>
              <p className="text-gray-600 mb-4">
                Strengthen your balance sheet with adequate cash reserves to weather economic uncertainty 
                and take advantage of opportunities.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">3. Optimize Pricing Strategy</h3>
              <p className="text-gray-600 mb-4">
                Review your pricing regularly and communicate value to customers. Small, gradual increases 
                are often better received than large jumps.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">4. Diversify Suppliers</h3>
              <p className="text-gray-600 mb-4">
                Reduce supply chain risk by developing relationships with multiple suppliers and considering 
                local options.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">5. Invest in Efficiency</h3>
              <p className="text-gray-600 mb-4">
                Use technology and process improvements to reduce costs and increase productivity, helping 
                to offset inflation pressures.
              </p>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Get Personalized Business Advice</h3>
                <p className="text-gray-600 mb-6">
                  Our business banking specialists can help you develop strategies to navigate changing economic conditions.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-soft-gold text-deep-teal px-6 py-3 rounded-lg font-medium hover:bg-deep-teal hover:text-white transition-all duration-300"
                >
                  Talk to a Specialist
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-12 pt-8 flex justify-between">
              <Link
                href="/learn"
                className="inline-flex items-center text-deep-teal hover:text-soft-gold font-medium transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Learn
              </Link>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-deep-teal transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-deep-teal transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
