'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImageSlider } from '@/components/ui/ImageSlider'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

// TabbedRatesSection Component
const TabbedRatesSection = () => {
  const [rateTab, setRateTab] = useState(0) // 0 = Featured, 1 = Savings, 2 = Credit Cards, 3 = Loans, 4 = Mortgages

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-deep-teal to-sage p-6 text-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Oldspring Trust Rates</h2>
        <p className="text-white/80 text-center mt-2 text-sm">Current rates and offers available to you</p>
      </div>

      {/* Rate Category Tabs */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b border-gray-200">
        {['Featured', 'Savings', 'Credit Cards', 'Loans', 'Mortgages'].map((tab, index) => (
          <button
            key={tab}
            onClick={() => setRateTab(index)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              rateTab === index
                ? 'bg-deep-teal text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-600 hover:text-deep-teal hover:shadow-md border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Rate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* FEATURED Tab */}
          {rateTab === 0 && (
            <>
              {/* High Yield Savings */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">FEATURED</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">3.75%<span className="text-sm text-gray-400 ml-1">APY</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">High Yield Savings Account</h3>
                <p className="text-sm text-gray-500">High Yield Savings Rate</p>
                <Link href="/save/high-yield" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* 18 Month Certificate */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">FEATURED</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">3.65%<span className="text-sm text-gray-400 ml-1">APY</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">18 Month Certificate</h3>
                <p className="text-sm text-gray-500">Standard Certificate Rates</p>
                <Link href="/save/certificates" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* 36 Month Certificate */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">FEATURED</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">4.00%<span className="text-sm text-gray-400 ml-1">APY</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">36 Month Certificate</h3>
                <p className="text-sm text-gray-500">Standard Certificate Rates</p>
                <Link href="/save/certificates" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* Cash Rewards Mastercard */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">FEATURED</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">15.49%<span className="text-sm text-gray-400 ml-1">APR</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">Cash Rewards Mastercard</h3>
                <p className="text-sm text-gray-500">Mastercard</p>
                <p className="text-xs text-gray-400">variable APR</p>
                <Link href="/borrow/credit-cards" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>
            </>
          )}

          {/* SAVINGS Tab */}
          {rateTab === 1 && (
            <>
              {/* High Yield Savings */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">SAVINGS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">3.75%<span className="text-sm text-gray-400 ml-1">APY</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">High Yield Savings Account</h3>
                <p className="text-sm text-gray-500">High Yield Savings Rate</p>
                <Link href="/save/high-yield" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* 24 Month Certificate */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">SAVINGS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">3.75%<span className="text-sm text-gray-400 ml-1">APY</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">24 Month Certificate</h3>
                <p className="text-sm text-gray-500">Standard Certificate Rates</p>
                <Link href="/save/certificates" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* 36 Month Certificate */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">SAVINGS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">4.00%<span className="text-sm text-gray-400 ml-1">APY</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">36 Month Certificate</h3>
                <p className="text-sm text-gray-500">Standard Certificate Rates</p>
                <Link href="/save/certificates" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* 60 Month Certificate */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">SAVINGS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">4.20%<span className="text-sm text-gray-400 ml-1">APY</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">60 Month Certificate</h3>
                <p className="text-sm text-gray-500">Standard Certificate Rates</p>
                <Link href="/save/certificates" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>
            </>
          )}

          {/* CREDIT CARDS Tab */}
          {rateTab === 2 && (
            <>
              {/* Cash Rewards Mastercard */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">CREDIT CARDS</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">15.49%<span className="text-sm text-gray-400 ml-1">APR</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">Cash Rewards Mastercard</h3>
                <p className="text-sm text-gray-500">Mastercard</p>
                <p className="text-xs text-gray-400">variable APR</p>
                <Link href="/borrow/credit-cards" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* Rewards Mastercard */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">CREDIT CARDS</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">9.99%<span className="text-sm text-gray-400 ml-1">APR</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">Rewards Mastercard</h3>
                <p className="text-sm text-gray-500">Mastercard</p>
                <p className="text-xs text-gray-400">fixed APR</p>
                <Link href="/borrow/credit-cards" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* Choice Mastercard */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">CREDIT CARDS</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">11.49%<span className="text-sm text-gray-400 ml-1">APR</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">Choice Mastercard</h3>
                <p className="text-sm text-gray-500">Mastercard</p>
                <p className="text-xs text-gray-400">variable APR</p>
                <Link href="/borrow/credit-cards" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* World Mastercard */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">CREDIT CARDS</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">14.49%<span className="text-sm text-gray-400 ml-1">APR</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">World Mastercard</h3>
                <p className="text-sm text-gray-500">Mastercard</p>
                <p className="text-xs text-gray-400">variable APR</p>
                <Link href="/borrow/credit-cards" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>
            </>
          )}

          {/* LOANS Tab */}
          {rateTab === 3 && (
            <>
              {/* New Auto */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">LOANS</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">5.89%<span className="text-sm text-gray-400 ml-1">APR</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">New Auto - Up to 66 Months</h3>
                <p className="text-sm text-gray-500">Auto Loan Rates</p>
                <Link href="/borrow/auto" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* Used Auto */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">LOANS</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">6.19%<span className="text-sm text-gray-400 ml-1">APR</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">Used - Up to 66 Months</h3>
                <p className="text-sm text-gray-500">Auto Loan Rates</p>
                <Link href="/borrow/auto" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* Personal Loan */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">LOANS</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">11.99%<span className="text-sm text-gray-400 ml-1">APR</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">Personal Loan</h3>
                <p className="text-sm text-gray-500">Personal Loan Rates</p>
                <Link href="/borrow/personal" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* HELOC */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">LOANS</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">2.49%<span className="text-sm text-gray-400 ml-1">INTRO</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">Interest-Only HELOC</h3>
                <p className="text-sm text-gray-500">Home Equity Loan Rates</p>
                <p className="text-xs text-gray-400">variable</p>
                <Link href="/borrow/heloc" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>
            </>
          )}

          {/* MORTGAGES Tab */}
          {rateTab === 4 && (
            <>
              {/* 10 Year Refinance */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">MORTGAGES</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">6.375%<span className="text-sm text-gray-400 ml-1">REG</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">10 Year Refinance Rate</h3>
                <p className="text-sm text-gray-500">Conventional Mortgage</p>
                <p className="text-xs text-gray-400">fixed rate</p>
                <Link href="/borrow/mortgage" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* 30 Year Purchase */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">MORTGAGES</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">6.875%<span className="text-sm text-gray-400 ml-1">REG</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">30 Year Purchase Rate</h3>
                <p className="text-sm text-gray-500">Conventional Mortgage</p>
                <p className="text-xs text-gray-400">fixed rate</p>
                <Link href="/borrow/mortgage" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* 10/1 ARM */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-xs font-semibold text-deep-teal mb-3 tracking-wider">MORTGAGES</div>
                <div className="text-xs text-gray-500 mb-1">AS LOW AS</div>
                <div className="text-4xl font-bold text-soft-gold mb-2">6.625%<span className="text-sm text-gray-400 ml-1">REG</span></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-deep-teal transition-colors">10/1 Year ARM</h3>
                <p className="text-sm text-gray-500">Conventional Mortgage</p>
                <p className="text-xs text-gray-400">variable rate</p>
                <Link href="/borrow/mortgage" className="inline-block mt-4 text-xs font-medium text-deep-teal hover:text-soft-gold transition-colors">
                  Learn More →
                </Link>
              </div>

              {/* Placeholder for 4th card to maintain grid */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 opacity-0 md:block hidden"></div>
            </>
          )}
        </div>

        {/* View All Rates Link */}
        <div className="text-center pt-8 mt-4 border-t border-gray-100">
          <Link href="/rates" className="inline-flex items-center text-deep-teal hover:text-soft-gold font-medium transition-colors group">
            View All Rates
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Campaign Feature Card Component
const CampaignFeatureCard = () => {
  return (
    <section className="campaign-feature py-12" aria-labelledby="campaign-feature__title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeInUp">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-64 md:h-auto overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-deep-teal/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="$300 Cash Back Checking Bonus"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Decorative gold accent */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-soft-gold text-deep-teal text-xs font-bold px-3 py-1 rounded-full">
                    Limited Time Offer
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                <div className="max-w-xl">
                  {/* Title */}
                  <h2 id="campaign-feature__title" className="text-3xl md:text-4xl font-black text-deep-teal mb-4 leading-tight">
                    Get <span className="text-soft-gold text-5xl">$300*</span> With a Checking Account Built for You
                  </h2>
                  
                  {/* Description */}
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    For a limited time, get a <span className="font-bold text-deep-teal">$300 cash bonus</span> when you open any new checking account!
                  </p>
                  
                  {/* Offer Details */}
                  <p className="text-sm text-gray-500 mb-8 italic">
                    *Select "Learn More" to see important offer details and eligibility requirements.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/checking-offer"
                      className="inline-flex items-center bg-deep-teal text-white px-8 py-4 rounded-xl font-semibold hover:bg-soft-gold transition-all duration-300 group hover:scale-105 shadow-lg"
                    >
                      <span>Learn More</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center bg-white border-2 border-deep-teal text-deep-teal px-8 py-4 rounded-xl font-semibold hover:bg-deep-teal hover:text-white transition-all duration-300 group"
                    >
                      <span>Open Now</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Fine Print */}
                  <p className="text-xs text-gray-400 mt-6">
                    Offer subject to change without notice. Bonus will be deposited within 60 days of account opening. See full terms for details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}

// Financial Strength Image Grid Component
const FinancialStrengthGrid = () => {
  const articles = [
    {
      id: 1,
      title: "Tax Checklist: 5 Things to Remember",
      category: "Starting Out",
      categoryId: "starting-out",
      excerpt: "Tax season is quickly approaching—do you know what you need to claim, and what forms you need to submit? This tax checklist makes filing simple. Learn more today!",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/learn/tax-checklist",
      alt: "Tax documents and calculator"
    },
    {
      id: 2,
      title: "How to Manage Your Checking",
      category: "Starting Out",
      categoryId: "starting-out",
      excerpt: "",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/learn/manage-checking",
      alt: "Person managing checking account"
    },
    {
      id: 3,
      title: "How to Save for Summer Vacation",
      category: "Starting Out",
      categoryId: "starting-out",
      excerpt: "",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/learn/save-vacation",
      alt: "Summer vacation savings"
    },
    {
      id: 4,
      title: "How Rising Rates and Inflation Impact Businesses",
      category: "Running a Business",
      categoryId: "running-business",
      excerpt: "",
      image: "https://images.unsplash.com/photo-1565514020179-026b92b5e2a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/learn/inflation-business",
      alt: "Business and rising rates"
    }
  ]

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeInUp">
          <h2 className="text-3xl md:text-4xl font-black text-deep-teal mb-12 text-center tracking-tight">
            Start Building Your Financial Strength
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-children">
          {/* First Article - Full width on mobile, first column on desktop */}
          <ScrollAnimation animation="fadeInLeft" delay={0.1} className="md:col-span-1">
            <Link href={articles[0].link} className="group block h-full">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] h-full">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Image
                    src={articles[0].image}
                    alt={articles[0].alt}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-soft-gold text-deep-teal text-xs font-bold px-3 py-1 rounded-full">
                      {articles[0].category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-deep-teal mb-3 group-hover:text-soft-gold transition-colors">
                    {articles[0].title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {articles[0].excerpt}
                  </p>
                  <div className="inline-flex items-center text-sage font-medium group-hover:text-soft-gold transition-colors">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollAnimation>

          {/* Right Column Grid - 3 articles stacked */}
          <div className="md:col-span-1 space-y-8">
            {/* Second Article */}
            <ScrollAnimation animation="fadeInRight" delay={0.2}>
              <Link href={articles[1].link} className="group block">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-deep-teal/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Image
                        src={articles[1].image}
                        alt={articles[1].alt}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-soft-gold text-deep-teal text-xs font-bold px-3 py-1 rounded-full">
                          {articles[1].category}
                        </span>
                      </div>
                    </div>
                    <div className="sm:w-3/5 p-6">
                      <h3 className="text-lg font-bold text-deep-teal mb-2 group-hover:text-soft-gold transition-colors">
                        {articles[1].title}
                      </h3>
                      <div className="inline-flex items-center text-sage font-medium group-hover:text-soft-gold transition-colors">
                        <span>Learn more</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>

            {/* Third Article */}
            <ScrollAnimation animation="fadeInRight" delay={0.3}>
              <Link href={articles[2].link} className="group block">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-deep-teal/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Image
                        src={articles[2].image}
                        alt={articles[2].alt}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-soft-gold text-deep-teal text-xs font-bold px-3 py-1 rounded-full">
                          {articles[2].category}
                        </span>
                      </div>
                    </div>
                    <div className="sm:w-3/5 p-6">
                      <h3 className="text-lg font-bold text-deep-teal mb-2 group-hover:text-soft-gold transition-colors">
                        {articles[2].title}
                      </h3>
                      <div className="inline-flex items-center text-sage font-medium group-hover:text-soft-gold transition-colors">
                        <span>Learn more</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>

            {/* Fourth Article */}
            <ScrollAnimation animation="fadeInRight" delay={0.4}>
              <Link href={articles[3].link} className="group block">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-deep-teal/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Image
                        src={articles[3].image}
                        alt={articles[3].alt}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-soft-gold text-deep-teal text-xs font-bold px-3 py-1 rounded-full">
                          {articles[3].category}
                        </span>
                      </div>
                    </div>
                    <div className="sm:w-3/5 p-6">
                      <h3 className="text-lg font-bold text-deep-teal mb-2 group-hover:text-soft-gold transition-colors">
                        {articles[3].title}
                      </h3>
                      <div className="inline-flex items-center text-sage font-medium group-hover:text-soft-gold transition-colors">
                        <span>Learn more</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          </div>
        </div>

        {/* View All Articles Link */}
        <div className="text-center mt-12">
          <Link href="/learn" className="inline-flex items-center bg-deep-teal text-white px-8 py-4 rounded-xl font-semibold hover:bg-soft-gold transition-all duration-300 group hover:scale-105">
            <span>View All Articles</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Help Center Icon Grid Component with Glass Images
const HelpCenterGrid = () => {
  const helpLinks = [
    {
      id: 1,
      title: "Instant Accounts",
      href: "/auth/signup",
      image: "/images/3d/glassaccount.png",
      alt: "Instant Accounts"
    },
    {
      id: 2,
      title: "Credit Cards",
      href: "/borrow/credit-cards",
      image: "/images/3d/glasscreditcard.png",
      alt: "Credit Cards"
    },
    {
      id: 3,
      title: "Loans",
      href: "/borrow",
      image: "/images/3d/glasschecklist.png",
      alt: "Loans"
    },
    {
      id: 4,
      title: "Business Banking",
      href: "/business",
      image: "/images/3d/glassbusiness.png",
      alt: "Business Banking"
    },
    {
      id: 5,
      title: "Wealth & Retire",
      href: "/invest",
      image: "/images/3d/glassinvest.png",
      alt: "Wealth and Retirement"
    },
    {
      id: 6,
      title: "About Oldspring Trust",
      href: "/about",
      image: "/images/3d/glasshome.png",
      alt: "About Oldspring Trust"
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Beautiful animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-teal/5 via-soft-gold/10 to-sage/5"></div>
      
      {/* Animated orbs for depth */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-soft-gold/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-deep-teal/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sage/10 rounded-full blur-3xl"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeInUp">
          <h2 id="section-links--default__title" className="text-4xl md:text-5xl font-black text-deep-teal mb-4 text-center tracking-tight">
            How Can We Help You Today?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
            Explore our products and services designed to help you achieve your financial goals
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {helpLinks.map((link, index) => (
            <ScrollAnimation 
              key={link.id} 
              animation="fadeInUp" 
              delay={0.1 * (index + 1)}
              className="group"
            >
              <Link 
                href={link.href}
                className="block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50"
              >
                <div className="p-8 text-center">
                  {/* Glass Image Container with glow effect */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    {/* Glow effect behind image */}
                    <div className="absolute inset-0 bg-soft-gold/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 scale-75 group-hover:scale-110"></div>
                    
                    {/* Image */}
                    <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src={link.image}
                        alt={link.alt}
                        width={128}
                        height={128}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>

                    {/* Decorative rings */}
                    <div className="absolute inset-0 border-2 border-soft-gold/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute inset-2 border border-sage/20 rounded-full group-hover:scale-105 transition-transform duration-500"></div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-deep-teal mb-4 group-hover:text-soft-gold transition-colors duration-300">
                    {link.title}
                  </h3>
                  
                  {/* Learn More Link with Chevron */}
                  <div className="inline-flex items-center text-sage font-medium group-hover:text-soft-gold transition-colors duration-300">
                    <span className="text-sm">Learn more</span>
                    <svg 
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="w-0 h-0.5 bg-gradient-to-r from-soft-gold to-sage mx-auto mt-4 group-hover:w-16 transition-all duration-500"></div>
                </div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="relative mt-16">
          <div className="flex justify-center space-x-3">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 bg-soft-gold/40 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s`, animationDuration: '1.5s' }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream overflow-hidden">
        {/* Hero Section with Image Slider and Liquid Glass Card */}
        <section className="relative h-[600px]">
          <ImageSlider />
          
          {/* Liquid Glass Card */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="max-w-3xl mx-auto px-6">
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl
                            [background:linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))_border-box]
                            [backdrop-filter:blur(20px)_saturate(180%)]
                            hover:backdrop-blur-xl hover:bg-white/15 transition-all duration-500
                            hover:shadow-[0_30px_50px_rgba(0,0,0,0.3)]">
                
                {/* Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent 
                              rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-1000
                              -translate-x-full hover:translate-x-full 
                              [transition:transform_1.5s_ease,opacity_0.5s_ease]"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-white drop-shadow-lg 
                                 animate-fadeInUp [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]">
                    Oldspring Trust Bank
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto 
                                animate-fadeInUp font-light [text-shadow:1px_1px_2px_rgba(0,0,0,0.2)]"
                     style={{ animationDelay: '0.2s' }}>
                    Building lasting relationships based on trust since 1945
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp"
                       style={{ animationDelay: '0.4s' }}>
                    <Link
                      href="/auth/login"
                      className="relative px-8 py-4 text-lg font-semibold text-white bg-deep-teal/90 
                                 backdrop-blur-sm rounded-xl overflow-hidden group 
                                 transition-all duration-300 hover:shadow-2xl 
                                 hover:bg-deep-teal hover:scale-105 hover:-translate-y-1
                                 border border-white/20"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 
                                     -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                        Internet Banking
                      </span>
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="relative px-8 py-4 text-lg font-semibold text-white bg-soft-gold/90 
                                 backdrop-blur-sm rounded-xl overflow-hidden group 
                                 transition-all duration-300 hover:shadow-2xl 
                                 hover:bg-soft-gold hover:scale-105 hover:-translate-y-1
                                 border border-white/20"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-deep-teal/20 via-white/30 to-deep-teal/20 
                                     -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                        Open an Account
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section with 3D Glass Icons */}
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
              {/* Customer Accounts - glasscustomer.png */}
              <ScrollAnimation animation="fadeInUp" delay={0.1}>
                <div className="text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-all duration-500 hover:rotate-3">
                    <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Image
                      src="/images/3d/glasscustomer.png"
                      alt="Customer Accounts"
                      width={96}
                      height={96}
                      className="relative z-10 w-full h-full object-contain drop-shadow-2xl
                                 group-hover:translate-y-[-5px] transition-all duration-500"
                    />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-deep-teal mb-2">10M+</div>
                  <div className="text-text-soft font-medium">Customer Accounts</div>
                </div>
              </ScrollAnimation>

              {/* Assets Under Management - glasswallet.png */}
              <ScrollAnimation animation="fadeInUp" delay={0.2}>
                <div className="text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-all duration-500 hover:rotate-3">
                    <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Image
                      src="/images/3d/glasswallet.png"
                      alt="Assets Under Management"
                      width={96}
                      height={96}
                      className="relative z-10 w-full h-full object-contain drop-shadow-2xl
                                 group-hover:translate-y-[-5px] transition-all duration-500"
                    />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-deep-teal mb-2">$83.7B</div>
                  <div className="text-text-soft font-medium">Assets Under Management</div>
                </div>
              </ScrollAnimation>

              {/* Loans Originated - glasschecklist.png */}
              <ScrollAnimation animation="fadeInUp" delay={0.3}>
                <div className="text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-all duration-500 hover:rotate-3">
                    <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Image
                      src="/images/3d/glasschecklist.png"
                      alt="Loans Originated"
                      width={96}
                      height={96}
                      className="relative z-10 w-full h-full object-contain drop-shadow-2xl
                                 group-hover:translate-y-[-5px] transition-all duration-500"
                    />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-deep-teal mb-2">$71.2B</div>
                  <div className="text-text-soft font-medium">Loans Originated</div>
                </div>
              </ScrollAnimation>

              {/* Staff Members - glasssupport.png */}
              <ScrollAnimation animation="fadeInUp" delay={0.4}>
                <div className="text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-all duration-500 hover:rotate-3">
                    <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Image
                      src="/images/3d/glasssupport.png"
                      alt="Staff Members"
                      width={96}
                      height={96}
                      className="relative z-10 w-full h-full object-contain drop-shadow-2xl
                                 group-hover:translate-y-[-5px] transition-all duration-500"
                    />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-deep-teal mb-2">11K+</div>
                  <div className="text-text-soft font-medium">Staff Members</div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Tabbed Rates Section */}
        <section className="py-20 bg-soft-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TabbedRatesSection />
          </div>
        </section>

        {/* Campaign Feature Card */}
        <CampaignFeatureCard />

        {/* Financial Strength Image Grid */}
        <FinancialStrengthGrid />

        {/* Help Center Icon Grid with Glass Images */}
        <HelpCenterGrid />

        {/* Testimonials Section */}
        <section className="py-20 bg-soft-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <h2 className="text-3xl md:text-4xl font-black text-deep-teal mb-12 text-center tracking-tight">What Our Customers Say</h2>
            </ScrollAnimation>
            <div className="grid md:grid-cols-3 gap-8 stagger-children">
              <ScrollAnimation animation="fadeInUp" delay={0.1}>
                <div className="bg-cream rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                  <div className="flex items-center mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108777-2963ee3c5f1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Customer"
                      className="w-12 h-12 rounded-full object-cover mr-4 hover-grow"
                    />
                    <div>
                      <h4 className="font-semibold text-deep-teal">Sarah Johnson</h4>
                      <p className="text-xs text-text-soft font-light">Customer since 2018</p>
                    </div>
                  </div>
                  <p className="text-text-soft font-light">"The team at Oldspring Trust has been incredible. They helped me buy my first home and I couldn't be happier!"</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.2}>
                <div className="bg-cream rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                  <div className="flex items-center mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Customer"
                      className="w-12 h-12 rounded-full object-cover mr-4 hover-grow"
                    />
                    <div>
                      <h4 className="font-semibold text-deep-teal">Michael Chen</h4>
                      <p className="text-xs text-text-soft font-light">Small Business Owner</p>
                    </div>
                  </div>
                  <p className="text-text-soft font-light">"Their business banking solutions helped my company grow. Highly recommended!"</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.3}>
                <div className="bg-cream rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                  <div className="flex items-center mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Customer"
                      className="w-12 h-12 rounded-full object-cover mr-4 hover-grow"
                    />
                    <div>
                      <h4 className="font-semibold text-deep-teal">Patricia Williams</h4>
                      <p className="text-xs text-text-soft font-light">Retiree</p>
                    </div>
                  </div>
                  <p className="text-text-soft font-light">"I've been banking here for over 20 years. They treat me like family."</p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
