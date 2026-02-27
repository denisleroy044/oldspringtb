import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function EstatePlanningPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Estate planning"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Retirement</span>
                <span className="text-white/80">January 8, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">6 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Estate Planning Basics</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Jennifer Adams, Wealth Management Specialist</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Why everyone needs an estate plan and how to get started with wills and trusts. 
                Estate planning isn't just for the wealthy—it's for anyone who wants to protect their loved ones.
              </p>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Family discussing future plans"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Planning for your family's future</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">What is Estate Planning?</h2>
              <p className="text-gray-600 mb-6">
                Estate planning is the process of arranging for the management and distribution of your assets 
                after your death or incapacity. It ensures your wishes are followed and your loved ones are protected.
              </p>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Key Documents You Need</h2>
              
              <h3 className="text-xl font-bold text-deep-teal mb-3">1. Last Will and Testament</h3>
              <p className="text-gray-600 mb-4">
                A will specifies:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Who receives your property</li>
                <li className="mb-2">Guardian for minor children</li>
                <li className="mb-2">Executor to manage your estate</li>
                <li className="mb-2">Funeral arrangements (optional)</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">2. Living Trust</h3>
              <p className="text-gray-600 mb-4">
                A trust helps avoid probate and provides more control over asset distribution:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Revocable living trust:</strong> Can be changed during your lifetime</li>
                <li className="mb-2"><strong className="text-deep-teal">Irrevocable trust:</strong> Cannot be changed, offers tax benefits</li>
                <li className="mb-2"><strong className="text-deep-teal">Testamentary trust:</strong> Created through your will</li>
              </ul>

              <h3 className="text-xl font-bold text-deep-teal mb-3">3. Durable Power of Attorney</h3>
              <p className="text-gray-600 mb-4">
                Names someone to handle your financial affairs if you become incapacitated.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">4. Healthcare Power of Attorney</h3>
              <p className="text-gray-600 mb-4">
                Appoints someone to make medical decisions on your behalf.
              </p>

              <h3 className="text-xl font-bold text-deep-teal mb-3">5. Living Will (Advance Directive)</h3>
              <p className="text-gray-600 mb-4">
                Specifies your wishes for end-of-life medical treatment.
              </p>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Beneficiary Designations</h2>
              <p className="text-gray-600 mb-4">
                Many assets pass outside of your will through beneficiary designations:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Retirement accounts (401(k)s, IRAs)</li>
                <li className="mb-2">Life insurance policies</li>
                <li className="mb-2">Payable-on-death bank accounts</li>
                <li className="mb-2">Transfer-on-death investment accounts</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Common Estate Planning Mistakes</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">No plan at all:</strong> State laws will decide who gets your assets</li>
                <li className="mb-2"><strong className="text-deep-teal">Outdated documents:</strong> Review after major life changes</li>
                <li className="mb-2"><strong className="text-deep-teal">Forgetting digital assets:</strong> Include passwords and online accounts</li>
                <li className="mb-2"><strong className="text-deep-teal">Not funding your trust:</strong> Assets must be transferred to the trust</li>
                <li className="mb-2"><strong className="text-deep-teal">DIY documents:</strong> Complex situations need professional help</li>
              </ul>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white my-8">
                <h3 className="text-xl font-bold mb-4">When to Review Your Estate Plan</h3>
                <ul className="list-disc pl-6">
                  <li className="mb-2">Marriage or divorce</li>
                  <li className="mb-2">Birth or adoption of children</li>
                  <li className="mb-2">Major changes in assets</li>
                  <li className="mb-2">Moving to another state</li>
                  <li className="mb-2">Every 3-5 years for routine review</li>
                </ul>
              </div>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Ready to Create Your Estate Plan?</h3>
                <p className="text-gray-600 mb-6">
                  Our wealth management specialists can help you develop a comprehensive estate plan.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/invest"
                    className="bg-deep-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-soft-gold transition-all duration-300"
                  >
                    Explore Wealth Management
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
