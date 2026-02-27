import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function TaxChecklistPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Tax documents and calculator"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Starting Out</span>
                <span className="text-white/80">March 15, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">5 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Tax Checklist: 5 Things to Remember</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Oldspring Trust Financial Team</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Tax season is quickly approaching—do you know what you need to claim, and what forms you need to submit? 
                This tax checklist makes filing simple and helps you avoid common mistakes.
              </p>

              <p className="text-gray-600 mb-6">
                Whether you're filing as an individual, freelancer, or small business owner, having all your documents 
                organized before you start can save time, reduce stress, and help you maximize your deductions.
              </p>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">1. Gather Your Income Documents</h2>
              <p className="text-gray-600 mb-4">
                Before you begin, collect all forms that report your income:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">W-2 forms from employers</li>
                <li className="mb-2">1099 forms for freelance or contract work</li>
                <li className="mb-2">1099-INT for interest income from banks</li>
                <li className="mb-2">1099-DIV for dividends from investments</li>
                <li className="mb-2">Records of any other income (rental, side gigs, etc.)</li>
              </ul>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Organizing tax documents"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Organizing your tax documents early makes filing easier</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">2. Track Deductible Expenses</h2>
              <p className="text-gray-600 mb-4">
                If you itemize deductions, gather receipts and records for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Mortgage interest (Form 1098)</li>
                <li className="mb-2">Charitable donations</li>
                <li className="mb-2">Medical and dental expenses</li>
                <li className="mb-2">State and local taxes paid</li>
                <li className="mb-2">Business expenses if self-employed</li>
                <li className="mb-2">Education expenses and student loan interest</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">3. Review Retirement Contributions</h2>
              <p className="text-gray-600 mb-6">
                Contributions to traditional IRAs, 401(k)s, and other retirement accounts may be tax-deductible. 
                Check your contribution statements and ensure you've maximized your retirement savings.
              </p>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">4. Check for Life Changes</h2>
              <p className="text-gray-600 mb-4">
                Major life events can affect your tax situation. Make note of:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Marriage or divorce</li>
                <li className="mb-2">Birth or adoption of a child</li>
                <li className="mb-2">Purchase or sale of a home</li>
                <li className="mb-2">Change in employment status</li>
                <li className="mb-2">Starting a business</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">5. Know Important Deadlines</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Tax Day: April 15, 2026</li>
                <li className="mb-2">Extension deadline: October 15, 2026</li>
                <li className="mb-2">Quarterly estimated tax deadlines for self-employed</li>
              </ul>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Need Help with Your Taxes?</h3>
                <p className="text-gray-600 mb-6">
                  Our financial specialists can help you understand your tax situation and connect you with trusted 
                  tax professionals who can assist with filing.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-soft-gold text-deep-teal px-6 py-3 rounded-lg font-medium hover:bg-deep-teal hover:text-white transition-all duration-300"
                >
                  Schedule a Consultation
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
