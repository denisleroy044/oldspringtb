import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function Retirement30sPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="/images/learn/retirement-30s-hero.jpg"
            alt="Retirement planning"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Retirement</span>
                <span className="text-white/80">February 15, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">6 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Retirement Planning in Your 30s</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Jennifer Adams, Retirement Specialist</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Start planning for retirement early to maximize your savings and secure your future. 
                Your 30s are a critical decade for building wealth and setting yourself up for a comfortable retirement.
              </p>

              <div className="my-12">
                <Image
                  src="/images/learn/retirement-planning-couple.jpg"
                  alt="Couple planning retirement"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Planning your financial future together</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Why Your 30s Matter</h2>
              <p className="text-gray-600 mb-4">
                The decisions you make in your 30s can have a massive impact on your retirement savings due to compound interest. 
                A dollar invested at age 30 could grow to several times more than a dollar invested at age 40.
              </p>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white my-8">
                <h3 className="text-xl font-bold mb-4">The Power of Starting Early</h3>
                <p className="mb-2">Start at 25: Invest $5,000/year → ~$1.2M at 65 (8% return)</p>
                <p className="mb-2">Start at 35: Invest $5,000/year → ~$540,000 at 65 (8% return)</p>
                <p className="mb-2">Start at 45: Invest $5,000/year → ~$220,000 at 65 (8% return)</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">1. Maximize Employer Retirement Plans</h2>
              <p className="text-gray-600 mb-4">
                If your employer offers a 401(k) with matching contributions:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Contribute at least enough to get the full match (free money!)</li>
                <li className="mb-2">Aim to contribute 10-15% of your income including match</li>
                <li className="mb-2">Consider Roth 401(k) options if available</li>
                <li className="mb-2">Review investment options and choose low-cost funds</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">2. Open and Fund an IRA</h2>
              <p className="text-gray-600 mb-4">
                Individual Retirement Accounts offer additional tax-advantaged savings:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Traditional IRA:</strong> Tax-deductible contributions, taxed on withdrawal</li>
                <li className="mb-2"><strong className="text-deep-teal">Roth IRA:</strong> After-tax contributions, tax-free withdrawals in retirement</li>
                <li className="mb-2">2024 contribution limit: $7,000 ($8,000 if age 50+)</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">3. Increase Savings with Raises</h2>
              <p className="text-gray-600 mb-6">
                Whenever you get a raise, increase your retirement contribution by half the raise amount. 
                You won't miss money you never had in your paycheck.
              </p>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">4. Diversify Investments</h2>
              <p className="text-gray-600 mb-4">
                In your 30s, you have time to weather market volatility. Consider:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">80-90% stocks for growth potential</li>
                <li className="mb-2">10-20% bonds for stability</li>
                <li className="mb-2">Low-cost index funds and ETFs</li>
                <li className="mb-2">International exposure for diversification</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">5. Don't Neglect Other Financial Goals</h2>
              <p className="text-gray-600 mb-4">
                Balance retirement savings with other priorities:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Build an emergency fund (3-6 months of expenses)</li>
                <li className="mb-2">Pay down high-interest debt</li>
                <li className="mb-2">Save for a home down payment</li>
                <li className="mb-2">Protect your income with disability insurance</li>
              </ul>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Ready to Plan for Retirement?</h3>
                <p className="text-gray-600 mb-6">
                  Our financial advisors can help you create a personalized retirement strategy.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/invest"
                    className="bg-deep-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-soft-gold transition-all duration-300"
                  >
                    Explore Retirement Accounts
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
