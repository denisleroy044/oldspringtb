import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function PersonalLoansPage() {
  const loanOptions = [
    {
      name: 'Debt Consolidation',
      rate: '11.99% APR',
      amount: '$5,000 - $35,000',
      terms: '24 - 60 months',
      features: ['Combine multiple debts', 'Lower monthly payment', 'Fixed interest rate'],
      color: 'from-[#1e3a5f] to-[#2E8B57]'
    },
    {
      name: 'Home Improvement',
      rate: '10.99% APR',
      amount: '$3,500 - $50,000',
      terms: '12 - 84 months',
      features: ['Fund renovations', 'Increase home value', 'Quick funding'],
      color: 'from-[#FF8C00] to-[#E67E00]'
    },
    {
      name: 'Major Purchase',
      rate: '12.99% APR',
      amount: '$2,000 - $25,000',
      terms: '12 - 48 months',
      features: ['Finance big purchases', 'No collateral needed', 'Flexible terms'],
      color: 'from-purple-500 to-purple-700'
    },
    {
      name: 'Emergency Expenses',
      rate: '9.99% APR',
      amount: '$1,000 - $15,000',
      terms: '6 - 36 months',
      features: ['Fast funding', 'Unexpected expenses', 'Same-day approval'],
      color: 'from-green-500 to-green-700'
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2E8B57] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/borrow" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors group">
              <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Borrowing
            </Link>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Personal Loans</h1>
                <p className="text-xl text-gray-200 mb-6">
                  Fund your next big purchase, consolidate debt, or cover unexpected expenses with our flexible personal loans.
                </p>
                <Link
                  href="/auth/signup"
                  className="group relative inline-block px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-[#E67E00] hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative">Check Your Rate</span>
                </Link>
              </div>
              <div className="flex justify-center relative group">
                <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-3xl scale-75 group-hover:scale-110 transition-all duration-700"></div>
                <div className="relative w-[300px] h-[300px] group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/3d/checklist.png"
                    alt="Personal Loans"
                    width={300}
                    height={300}
                    className="w-full h-full object-contain drop-shadow-2xl animate-float"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loan Options Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Choose Your Loan</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find the personal loan that matches your needs with competitive rates and flexible terms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {loanOptions.map((loan, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${loan.color} px-6 py-4`}>
                    <h3 className="text-xl font-bold text-white">{loan.name}</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">APR</p>
                        <p className="text-2xl font-bold text-[#1e3a5f]">{loan.rate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="text-lg font-semibold text-[#FF8C00]">{loan.amount}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Terms: {loan.terms}</p>
                    <ul className="space-y-2 mb-6">
                      {loan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 text-[#2E8B57] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/auth/signup"
                      className="group relative block w-full py-3 text-center bg-[#FF8C00] text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#E67E00]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      <span className="relative">Apply Now</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add animation styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
            }
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
          `
        }} />
      </main>
      <Footer />
    </>
  )
}
