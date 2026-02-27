import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function Investing101Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="/images/learn/investing-101-hero.jpg"
            alt="Investing basics"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Investing</span>
                <span className="text-white/80">February 5, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">6 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Investing 101: Getting Started</h1>
              <p className="text-xl text-white/90 max-w-2xl">By David Chen, Investment Advisor</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                New to investing? Learn the basics of stocks, bonds, and building a diversified portfolio. 
                This guide will help you understand the fundamentals and start your investment journey with confidence.
              </p>

              <div className="my-12">
                <Image
                  src="/images/learn/investing-research.jpg"
                  alt="Person researching investments"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Researching investment options</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Why Invest?</h2>
              <p className="text-gray-600 mb-4">
                Investing allows your money to grow faster than inflation and build wealth over time through compound returns. 
                While savings accounts are safe, they typically earn less than the rate of inflation.
              </p>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white my-8">
                <h3 className="text-xl font-bold mb-4">The Power of Compound Interest</h3>
                <p className="mb-2">$10,000 invested at 8% for 30 years = $100,627</p>
                <p className="mb-2">$10,000 in savings at 1% for 30 years = $13,478</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Investment Basics</h2>
              
              <h3 className="text-xl font-bold text-deep-teal mb-3">Stocks</h3>
              <p className="text-gray-600 mb-4">
                When you buy a stock, you own a small piece of a company. Stocks offer growth potential but come with higher volatility.
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Growth stocks:</strong> Companies expected to grow faster than average</li>
                <li className="mb-2"><strong className="text-deep-teal">Value stocks:</strong> Companies that appear undervalued</li>
                <li className="mb-2"><strong className="text-deep-teal">Dividend stocks:</strong> Companies that pay regular income</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">Bonds</h3>
              <p className="text-gray-600 mb-4">
                Bonds are loans to governments or companies that pay regular interest. They're generally safer than stocks but offer lower returns.
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Government bonds:</strong> Backed by government, very safe</li>
                <li className="mb-2"><strong className="text-deep-teal">Corporate bonds:</strong> Higher yields, more risk</li>
                <li className="mb-2"><strong className="text-deep-teal">Municipal bonds:</strong> Tax-free interest</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">Mutual Funds & ETFs</h3>
              <p className="text-gray-600 mb-4">
                These let you buy many investments in one package, providing instant diversification.
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Index funds:</strong> Track market indexes like S&P 500</li>
                <li className="mb-2"><strong className="text-deep-teal">ETFs:</strong> Trade like stocks, often low fees</li>
                <li className="mb-2"><strong className="text-deep-teal">Target-date funds:</strong> Automatically adjust risk over time</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Key Investment Principles</h2>
              
              <h3 className="text-xl font-bold text-deep-teal mb-3">1. Start Early</h3>
              <p className="text-gray-600 mb-4">
                Time is your greatest asset. Starting early allows compound interest to work its magic.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">2. Diversify</h3>
              <p className="text-gray-600 mb-4">
                Don't put all your eggs in one basket. Spread investments across different asset classes, industries, and geographic regions.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">3. Keep Costs Low</h3>
              <p className="text-gray-600 mb-4">
                High fees can eat into your returns over time. Look for low-cost index funds and ETFs.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">4. Stay Invested</h3>
              <p className="text-gray-600 mb-4">
                Trying to time the market rarely works. Stay invested through ups and downs for long-term growth.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">5. Match Risk to Timeline</h3>
              <p className="text-gray-600 mb-4">
                Longer time horizons can handle more risk. As you near your goal, shift to safer investments.
              </p>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Ready to Start Investing?</h3>
                <p className="text-gray-600 mb-6">
                  Our investment advisors can help you create a strategy aligned with your goals.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/invest"
                    className="bg-deep-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-soft-gold transition-all duration-300"
                  >
                    Explore Investment Options
                  </Link>
                  <Link
                    href="/contact"
                    className="border-2 border-deep-teal text-deep-teal px-6 py-3 rounded-lg font-medium hover:bg-deep-teal hover:text-white transition-all duration-300"
                  >
                    Talk to an Advisor
                  </Link>
                </div>
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
