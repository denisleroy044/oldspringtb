import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function SaveVacationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Summer vacation destination"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Starting Out</span>
                <span className="text-white/80">February 28, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">3 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">How to Save for Summer Vacation</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Emma Wilson, Personal Finance Expert</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Tips and strategies to save for your dream summer vacation without breaking the bank. 
                With a little planning and discipline, you can enjoy that getaway you've been dreaming about.
              </p>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Family planning vacation"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Planning your vacation budget together</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">1. Set a Realistic Goal</h2>
              <p className="text-gray-600 mb-4">
                Start by estimating your total vacation costs:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Transportation (flights, gas, rental car)</li>
                <li className="mb-2">Accommodations</li>
                <li className="mb-2">Food and dining</li>
                <li className="mb-2">Activities and entertainment</li>
                <li className="mb-2">Souvenirs and shopping</li>
                <li className="mb-2">Travel insurance and incidentals</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">2. Create a Vacation Savings Fund</h2>
              <p className="text-gray-600 mb-4">
                Open a separate savings account specifically for your vacation fund. This helps you:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Track progress easily</li>
                <li className="mb-2">Avoid spending the money on other things</li>
                <li className="mb-2">Earn interest on your savings</li>
                <li className="mb-2">Set up automatic transfers</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">3. Set Up Automatic Savings</h2>
              <p className="text-gray-600 mb-6">
                Automate your savings by setting up recurring transfers from your checking to your vacation fund. 
                Even small amounts add up over time. For example, saving $50 per week gives you $2,600 in a year.
              </p>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white my-8">
                <h3 className="text-xl font-bold mb-4">Savings Calculator</h3>
                <p className="mb-4">Save $50 per week for 6 months = $1,300</p>
                <p className="mb-4">Save $100 per week for 6 months = $2,600</p>
                <p>Save $200 per week for 6 months = $5,200</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">4. Cut Back on Non-Essentials</h2>
              <p className="text-gray-600 mb-4">
                Identify areas where you can temporarily reduce spending:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Make coffee at home instead of buying</li>
                <li className="mb-2">Pack lunch for work a few days a week</li>
                <li className="mb-2">Cancel unused subscriptions</li>
                <li className="mb-2">Limit dining out and entertainment</li>
                <li className="mb-2">Shop sales and use coupons</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">5. Look for Extra Income</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Freelance or side gig work</li>
                <li className="mb-2">Sell unused items online</li>
                <li className="mb-2">Use cashback apps and credit card rewards</li>
                <li className="mb-2">Put tax refunds or bonuses directly into savings</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">6. Book Smart</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Travel during off-peak times for better rates</li>
                <li className="mb-2">Book flights and hotels in advance</li>
                <li className="mb-2">Look for package deals</li>
                <li className="mb-2">Consider alternative accommodations like vacation rentals</li>
                <li className="mb-2">Use travel rewards points if available</li>
              </ul>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Ready to Start Saving?</h3>
                <p className="text-gray-600 mb-6">
                  Open a high-yield savings account today and watch your vacation fund grow.
                </p>
                <Link
                  href="/save"
                  className="inline-flex items-center bg-soft-gold text-deep-teal px-6 py-3 rounded-lg font-medium hover:bg-deep-teal hover:text-white transition-all duration-300"
                >
                  Explore Savings Accounts
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
