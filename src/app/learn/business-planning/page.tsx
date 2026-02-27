import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function BusinessPlanningPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Business planning"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Running a Business</span>
                <span className="text-white/80">January 20, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">7 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Business Planning for Entrepreneurs</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Michael Chen, Business Banking Specialist</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Essential steps to create a solid business plan that attracts investors and guides growth. 
                A well-crafted business plan is your roadmap to success.
              </p>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Entrepreneurs planning"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Collaborating on business strategy</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Why You Need a Business Plan</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Secures funding from investors and lenders</li>
                <li className="mb-2">Provides clear direction and goals</li>
                <li className="mb-2">Helps identify potential challenges</li>
                <li className="mb-2">Measures progress and success</li>
                <li className="mb-2">Attracts key employees and partners</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Essential Components of a Business Plan</h2>
              
              <h3 className="text-xl font-bold text-deep-teal mb-3">1. Executive Summary</h3>
              <p className="text-gray-600 mb-4">
                A concise overview of your business, including mission, products/services, and key highlights. 
                Though it appears first, write it last.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">2. Company Description</h3>
              <p className="text-gray-600 mb-4">
                Detail what your business does, the problems it solves, and your target market. Include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Business structure (LLC, corporation, etc.)</li>
                <li className="mb-2">Mission and vision statements</li>
                <li className="mb-2">Brief history and milestones</li>
                <li className="mb-2">Location and facilities</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">3. Market Analysis</h3>
              <p className="text-gray-600 mb-4">
                Research your industry, target market, and competitors:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Industry size and growth trends</li>
                <li className="mb-2">Target customer demographics</li>
                <li className="mb-2">Competitor analysis (strengths/weaknesses)</li>
                <li className="mb-2">Market needs and opportunities</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">4. Organization & Management</h3>
              <p className="text-gray-600 mb-4">
                Describe your business structure and team:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Ownership structure</li>
                <li className="mb-2">Management team bios</li>
                <li className="mb-2">Board of directors or advisors</li>
                <li className="mb-2">Organizational chart</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">5. Products or Services</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Detailed description of offerings</li>
                <li className="mb-2">Pricing strategy</li>
                <li className="mb-2">Intellectual property (patents, trademarks)</li>
                <li className="mb-2">Research and development plans</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">6. Marketing & Sales Strategy</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Customer acquisition channels</li>
                <li className="mb-2">Marketing tactics (digital, traditional)</li>
                <li className="mb-2">Sales process and team structure</li>
                <li className="mb-2">Customer retention strategies</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">7. Financial Projections</h3>
              <p className="text-gray-600 mb-4">
                Create realistic financial forecasts:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Income statements (3-5 years)</li>
                <li className="mb-2">Cash flow statements</li>
                <li className="mb-2">Balance sheets</li>
                <li className="mb-2">Break-even analysis</li>
                <li className="mb-2">Funding requirements</li>
              </ul>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white my-8">
                <h3 className="text-xl font-bold mb-4">Quick Tips for Success</h3>
                <ul className="list-disc pl-6">
                  <li className="mb-2">Be realistic in your projections</li>
                  <li className="mb-2">Keep it concise and readable</li>
                  <li className="mb-2">Update regularly as your business evolves</li>
                  <li className="mb-2">Get feedback from mentors and advisors</li>
                </ul>
              </div>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Ready to Start Your Business?</h3>
                <p className="text-gray-600 mb-6">
                  Our business banking specialists can help you with financing and financial planning.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/business"
                    className="bg-deep-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-soft-gold transition-all duration-300"
                  >
                    Explore Business Banking
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
