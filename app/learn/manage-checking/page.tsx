import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function ManageCheckingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="/images/learn/manage-checking-hero.jpg"
            alt="Person managing checking account"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Starting Out</span>
                <span className="text-white/80">March 5, 2026</span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">4 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">How to Manage Your Checking Account</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Sarah Johnson, Personal Banking Specialist</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Simple ways to manage a checking account effectively and avoid common pitfalls. 
                Whether you're opening your first account or looking to improve your banking habits, 
                these tips will help you stay on top of your finances.
              </p>

              <div className="my-12">
                <Image
                  src="/images/learn/mobile-banking-app.jpg"
                  alt="Mobile banking app"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Using mobile banking to track your account</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">1. Monitor Your Account Regularly</h2>
              <p className="text-gray-600 mb-4">
                Check your account at least weekly to track spending, spot errors, and avoid overdrafts. 
                Most banks offer mobile apps that make this quick and easy.
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Set up alerts for low balances and large transactions</li>
                <li className="mb-2">Review transactions for unauthorized charges</li>
                <li className="mb-2">Reconcile your account monthly with your statements</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">2. Avoid Overdraft Fees</h2>
              <p className="text-gray-600 mb-4">
                Overdraft fees can add up quickly. Here's how to avoid them:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Keep a buffer of at least $100 in your account</li>
                <li className="mb-2">Sign up for low-balance alerts</li>
                <li className="mb-2">Consider linking a savings account for overdraft protection</li>
                <li className="mb-2">Track automatic payments and subscriptions</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">3. Understand Fees</h2>
              <p className="text-gray-600 mb-4">
                Know what fees your account may charge and how to avoid them:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2"><strong className="text-deep-teal">Monthly maintenance fees:</strong> Often waived with direct deposit or minimum balance</li>
                <li className="mb-2"><strong className="text-deep-teal">ATM fees:</strong> Use in-network ATMs to avoid charges</li>
                <li className="mb-2"><strong className="text-deep-teal">Overdraft fees:</strong> Can be $35 or more per transaction</li>
                <li className="mb-2"><strong className="text-deep-teal">Foreign transaction fees:</strong> Typically 1-3% of purchase amount</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">4. Use Digital Tools</h2>
              <p className="text-gray-600 mb-4">
                Modern banking tools can help you manage money more effectively:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Mobile check deposit saves trips to the branch</li>
                <li className="mb-2">Bill pay helps you schedule and track payments</li>
                <li className="mb-2">Spending categorization shows where your money goes</li>
                <li className="mb-2">Budgeting tools help you set and track goals</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">5. Protect Your Account</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Use strong, unique passwords for online banking</li>
                <li className="mb-2">Enable two-factor authentication when available</li>
                <li className="mb-2">Never share account details or verification codes</li>
                <li className="mb-2">Be cautious of phishing attempts</li>
                <li className="mb-2">Report lost or stolen cards immediately</li>
              </ul>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Ready to Open a Checking Account?</h3>
                <p className="text-gray-600 mb-6">
                  Our checking accounts offer no monthly fees, free mobile banking, and 24/7 customer support.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/bank/accounts"
                    className="bg-deep-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-soft-gold transition-all duration-300"
                  >
                    View Checking Accounts
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
