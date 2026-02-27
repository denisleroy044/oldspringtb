import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function HomeBuyingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="First time home buyer"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Personal Finance</span>
                <span className="text-white/80">February 20, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">8 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">First-Time Home Buyer's Guide</h1>
              <p className="text-xl text-white/90 max-w-2xl">By David Rodriguez, Mortgage Specialist</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Everything you need to know about buying your first home, from mortgages to closing costs. 
                This comprehensive guide will walk you through each step of the home-buying journey.
              </p>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Happy couple with their new home keys"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">The joy of getting your first home keys</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Step 1: Check Your Credit Score</h2>
              <p className="text-gray-600 mb-4">
                Your credit score significantly impacts your mortgage options and interest rates. Before house hunting:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Check your credit report for errors</li>
                <li className="mb-2">Pay down credit card balances</li>
                <li className="mb-2">Avoid opening new credit accounts</li>
                <li className="mb-2">Make all payments on time</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Step 2: Determine Your Budget</h2>
              <p className="text-gray-600 mb-4">
                A general rule is that your monthly housing costs shouldn't exceed 28-30% of your gross monthly income. 
                Consider all costs:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Mortgage principal and interest</li>
                <li className="mb-2">Property taxes</li>
                <li className="mb-2">Homeowners insurance</li>
                <li className="mb-2">Private mortgage insurance (if down payment &lt;20%)</li>
                <li className="mb-2">HOA fees</li>
                <li className="mb-2">Utilities and maintenance</li>
              </ul>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white my-8">
                <h3 className="text-xl font-bold mb-4">Affordability Quick Guide</h3>
                <p className="mb-2">Annual Income: $50,000 → Home Price: ~$150,000</p>
                <p className="mb-2">Annual Income: $75,000 → Home Price: ~$225,000</p>
                <p className="mb-2">Annual Income: $100,000 → Home Price: ~$300,000</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Step 3: Save for Down Payment</h2>
              <p className="text-gray-600 mb-4">
                While 20% down avoids PMI, many first-time buyers put down less:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Conventional loans:</strong> 3-5% minimum</li>
                <li className="mb-2"><strong className="text-deep-teal">FHA loans:</strong> 3.5% minimum</li>
                <li className="mb-2"><strong className="text-deep-teal">VA loans:</strong> 0% for eligible veterans</li>
                <li className="mb-2"><strong className="text-deep-teal">USDA loans:</strong> 0% in rural areas</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Step 4: Get Pre-Approved</h2>
              <p className="text-gray-600 mb-6">
                A pre-approval letter shows sellers you're serious and know your budget. You'll need:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Proof of income (pay stubs, tax returns)</li>
                <li className="mb-2">Bank statements</li>
                <li className="mb-2">Identification</li>
                <li className="mb-2">Employment verification</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Step 5: Find a Real Estate Agent</h2>
              <p className="text-gray-600 mb-6">
                A good buyer's agent represents your interests and helps you navigate the process. 
                They can provide valuable insights about neighborhoods, market conditions, and negotiation strategies.
              </p>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Step 6: Start House Hunting</h2>
              <p className="text-gray-600 mb-4">
                Make a wish list of must-haves vs. nice-to-haves:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Location and commute</li>
                <li className="mb-2">Number of bedrooms/bathrooms</li>
                <li className="mb-2">Yard size</li>
                <li className="mb-2">School district</li>
                <li className="mb-2">Home condition and age</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Step 7: Make an Offer</h2>
              <p className="text-gray-600 mb-6">
                Your agent will help you determine a fair offer price based on comparable homes and market conditions. 
                Be prepared for negotiations and possible counter-offers.
              </p>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Step 8: Home Inspection and Appraisal</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Home inspection:</strong> Identifies any issues with the property</li>
                <li className="mb-2"><strong className="text-deep-teal">Appraisal:</strong> Ensures the home's value matches the loan amount</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Step 9: Close the Deal</h2>
              <p className="text-gray-600 mb-4">
                At closing, you'll sign final paperwork and pay closing costs (typically 2-5% of the purchase price). 
                Then you'll get the keys to your new home!
              </p>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Ready to Start Your Home-Buying Journey?</h3>
                <p className="text-gray-600 mb-6">
                  Our mortgage specialists can help you understand your options and get pre-approved.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/borrow/mortgage"
                    className="bg-deep-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-soft-gold transition-all duration-300"
                  >
                    Explore Mortgages
                  </Link>
                  <Link
                    href="/contact"
                    className="border-2 border-deep-teal text-deep-teal px-6 py-3 rounded-lg font-medium hover:bg-deep-teal hover:text-white transition-all duration-300"
                  >
                    Talk to a Specialist
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
