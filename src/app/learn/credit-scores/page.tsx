import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function CreditScoresPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Credit score understanding"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Personal Finance</span>
                <span className="text-white/80">January 28, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">4 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Understanding Credit Scores</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Jennifer Adams, Financial Education Specialist</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                What affects your credit score and how to improve it for better loan terms. 
                Your credit score impacts everything from mortgage rates to credit card approvals.
              </p>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Person checking credit score on phone"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Monitoring your credit score regularly</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">What is a Credit Score?</h2>
              <p className="text-gray-600 mb-4">
                A credit score is a three-digit number (typically 300-850) that lenders use to assess your creditworthiness. 
                Higher scores indicate lower risk to lenders.
              </p>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white my-8">
                <h3 className="text-xl font-bold mb-4">Credit Score Ranges</h3>
                <p className="mb-2">Excellent: 750-850</p>
                <p className="mb-2">Good: 700-749</p>
                <p className="mb-2">Fair: 650-699</p>
                <p className="mb-2">Poor: 600-649</p>
                <p>Bad: Below 600</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">What Factors Affect Your Credit Score?</h2>
              
              <h3 className="text-xl font-bold text-deep-teal mb-3">1. Payment History (35%)</h3>
              <p className="text-gray-600 mb-4">
                Your track record of making on-time payments is the most important factor. Even one late payment can hurt your score.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">2. Credit Utilization (30%)</h3>
              <p className="text-gray-600 mb-4">
                This is the amount of credit you're using compared to your total available credit. Aim to keep utilization below 30%.
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">If you have $10,000 total credit limit, keep balances under $3,000</li>
                <li className="mb-2">Lower utilization is better for your score</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">3. Length of Credit History (15%)</h3>
              <p className="text-gray-600 mb-4">
                Longer credit histories generally result in higher scores. This includes the age of your oldest account and average age of all accounts.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">4. Credit Mix (10%)</h3>
              <p className="text-gray-600 mb-4">
                Having different types of credit (credit cards, auto loans, mortgages) can benefit your score.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">5. New Credit (10%)</h3>
              <p className="text-gray-600 mb-4">
                Opening several new accounts in a short period can lower your score temporarily. Each application creates a "hard inquiry."
              </p>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">How to Improve Your Credit Score</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Pay all bills on time:</strong> Set up automatic payments or reminders</li>
                <li className="mb-2"><strong className="text-deep-teal">Reduce credit card balances:</strong> Pay down high balances</li>
                <li className="mb-2"><strong className="text-deep-teal">Keep old accounts open:</strong> Longer history helps your score</li>
                <li className="mb-2"><strong className="text-deep-teal">Limit new applications:</strong> Only apply when necessary</li>
                <li className="mb-2"><strong className="text-deep-teal">Check your credit report:</strong> Dispute any errors</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Common Credit Myths</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Checking your score hurts it:</strong> Soft inquiries don't affect your score</li>
                <li className="mb-2"><strong className="text-deep-teal">Closing cards helps:</strong> Can actually hurt by reducing available credit</li>
                <li className="mb-2"><strong className="text-deep-teal">You need to carry a balance:</strong> Paying in full is better</li>
                <li className="mb-2"><strong className="text-deep-teal">Higher income means higher score:</strong> Income isn't a factor</li>
              </ul>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Ready to Build Your Credit?</h3>
                <p className="text-gray-600 mb-6">
                  Our credit cards and loans can help you establish and improve your credit history.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/borrow/credit-cards"
                    className="bg-deep-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-soft-gold transition-all duration-300"
                  >
                    Explore Credit Cards
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
