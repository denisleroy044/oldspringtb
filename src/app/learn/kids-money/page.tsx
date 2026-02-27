import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function KidsMoneyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Teaching kids about money"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Starting Out</span>
                <span className="text-white/80">January 15, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">5 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Teaching Kids About Money</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Sarah Thompson, Financial Education Specialist</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Age-appropriate ways to teach children financial literacy and good money habits. 
                Starting early helps kids develop a healthy relationship with money that lasts a lifetime.
              </p>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Parent teaching child about money"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Teaching financial basics through everyday moments</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Ages 3-5: Building Basic Concepts</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Use clear jars:</strong> Label them "Save," "Spend," and "Share"</li>
                <li className="mb-2"><strong className="text-deep-teal">Play store:</strong> Practice exchanging money for items</li>
                <li className="mb-2"><strong className="text-deep-teal">Identify coins:</strong> Learn names and values of coins</li>
                <li className="mb-2"><strong className="text-deep-teal">Teach waiting:</strong> Explain that sometimes we wait to buy things</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Ages 6-10: Allowance and Choices</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Start an allowance:</strong> Connect money to chores or responsibilities</li>
                <li className="mb-2"><strong className="text-deep-teal">Three-jar system:</strong> Save, Spend, Give - let them decide allocations</li>
                <li className="mb-2"><strong className="text-deep-teal">Compare prices:</strong> Show how to look for deals</li>
                <li className="mb-2"><strong className="text-deep-teal">Set savings goals:</strong> Save for a specific toy or treat</li>
                <li className="mb-2"><strong className="text-deep-teal">Introduce charitable giving:</strong> Let them choose where to donate</li>
              </ul>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white my-8">
                <h3 className="text-xl font-bold mb-4">The 3-Jar Method</h3>
                <p className="mb-2"><strong>Save Jar (30%):</strong> For future goals</p>
                <p className="mb-2"><strong>Spend Jar (50%):</strong> For everyday wants</p>
                <p className="mb-2"><strong>Give Jar (20%):</strong> For charity or gifts</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Ages 11-13: Building Independence</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Open a savings account:</strong> Take them to the bank</li>
                <li className="mb-2"><strong className="text-deep-teal">Teach budgeting:</strong> Plan for bigger purchases</li>
                <li className="mb-2"><strong className="text-deep-teal">Introduce compound interest:</strong> Show how money grows</li>
                <li className="mb-2"><strong className="text-deep-teal">Discuss wants vs. needs:</strong> Make spending decisions</li>
                <li className="mb-2"><strong className="text-deep-teal">Earning opportunities:</strong> Babysitting, lawn mowing, etc.</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Ages 14-18: Preparing for Adulthood</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">First job:</strong> Discuss taxes and budgeting paycheck</li>
                <li className="mb-2"><strong className="text-deep-teal">Checking account:</strong> Learn to manage debit card</li>
                <li className="mb-2"><strong className="text-deep-teal">Credit basics:</strong> Explain how credit works</li>
                <li className="mb-2"><strong className="text-deep-teal">College savings:</strong> Contribute to education fund</li>
                <li className="mb-2"><strong className="text-deep-teal">Long-term goals:</strong> Save for car, travel, or college</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Age-Appropriate Money Lessons</h2>
              
              <h3 className="text-xl font-bold text-deep-teal mb-3">Elementary School</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">You need money to buy things</li>
                <li className="mb-2">You earn money by working</li>
                <li className="mb-2">You may have to wait to buy something you want</li>
                <li className="mb-2">There's a difference between things you want and things you need</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">Middle School</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Save at least 25% of money you receive</li>
                <li className="mb-2">Put money in a savings account to earn interest</li>
                <li className="mb-2">Create a budget for bigger purchases</li>
                <li className="mb-2">Compare prices before buying</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">High School</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Create a budget for your income and expenses</li>
                <li className="mb-2">Build credit history with responsible use</li>
                <li className="mb-2">Understand student loans and interest</li>
                <li className="mb-2">Start investing for long-term goals</li>
              </ul>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Start Your Child's Financial Journey</h3>
                <p className="text-gray-600 mb-6">
                  Open a Kids Club savings account today and help your child learn valuable money skills.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/save/kids-club"
                    className="bg-deep-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-soft-gold transition-all duration-300"
                  >
                    Learn About Kids Club
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
