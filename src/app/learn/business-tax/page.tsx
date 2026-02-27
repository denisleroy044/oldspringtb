import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function BusinessTaxPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="/images/learn/business-tax-hero.jpg"
            alt="Business tax deductions"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Running a Business</span>
                <span className="text-white/80">February 10, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">5 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Small Business Tax Deductions</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Michael Chen, Business Banking Specialist</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Maximize your tax savings with these commonly overlooked small business deductions. 
                Every dollar you save in taxes is a dollar that can be reinvested in your business.
              </p>

              <div className="my-12">
                <Image
                  src="/images/learn/business-owners-discussing.jpg"
                  alt="Small business owner reviewing finances"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Smart tax planning saves money</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">1. Home Office Deduction</h2>
              <p className="text-gray-600 mb-4">
                If you use part of your home regularly and exclusively for business, you may deduct:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Percentage of rent/mortgage interest</li>
                <li className="mb-2">Utilities and internet</li>
                <li className="mb-2">Homeowners insurance</li>
                <li className="mb-2">Repairs and maintenance</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">2. Vehicle Expenses</h2>
              <p className="text-gray-600 mb-4">
                You can deduct business-related vehicle expenses using either:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Standard mileage rate:</strong> 65.5 cents per mile (2024)</li>
                <li className="mb-2"><strong className="text-deep-teal">Actual expenses:</strong> Gas, oil, repairs, insurance, depreciation</li>
                <li className="mb-2">Keep detailed logs of business vs. personal miles</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">3. Business Insurance</h2>
              <p className="text-gray-600 mb-6">
                Premiums for business insurance are fully deductible:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">General liability insurance</li>
                <li className="mb-2">Professional liability (errors and omissions)</li>
                <li className="mb-2">Business interruption insurance</li>
                <li className="mb-2">Workers' compensation</li>
                <li className="mb-2">Business-owned vehicle insurance</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">4. Equipment and Supplies</h2>
              <p className="text-gray-600 mb-4">
                Section 179 allows you to deduct the full cost of qualifying equipment:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Computers and office equipment</li>
                <li className="mb-2">Machinery and tools</li>
                <li className="mb-2">Furniture and fixtures</li>
                <li className="mb-2">Software and technology</li>
                <li className="mb-2">Office supplies (up to $2,500 per item)</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">5. Professional Services</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Legal fees</li>
                <li className="mb-2">Accounting and bookkeeping</li>
                <li className="mb-2">Consulting services</li>
                <li className="mb-2">Marketing and advertising agencies</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">6. Employee Benefits</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Health insurance premiums</li>
                <li className="mb-2">Retirement plan contributions</li>
                <li className="mb-2">Education and training</li>
                <li className="mb-2">Employee bonuses and compensation</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">7. Travel and Meals</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Business travel (flights, hotels, rental cars)</li>
                <li className="mb-2">50% of business meals</li>
                <li className="mb-2">Client entertainment (subject to rules)</li>
              </ul>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Need Help with Business Taxes?</h3>
                <p className="text-gray-600 mb-6">
                  Our business banking specialists can connect you with tax professionals who understand small business needs.
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
