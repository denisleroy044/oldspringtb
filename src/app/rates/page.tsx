'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'
import { useState } from 'react'

export default function RatesPage() {
  const [activeTab, setActiveTab] = useState('featured')

  const tabs = [
    { id: 'featured', name: 'Featured' },
    { id: 'savings', name: 'Savings' },
    { id: 'credit-cards', name: 'Credit Cards' },
    { id: 'loans', name: 'Loans' },
    { id: 'mortgages', name: 'Mortgages' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-deep-teal to-sage py-20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Rates & Fees</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Competitive rates designed to help you save more and borrow smarter
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Last Updated */}
            <div className="text-right mb-8">
              <p className="text-sm text-gray-500">Last Updated: February 22, 2026</p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-deep-teal text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-deep-teal hover:bg-white/50'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Featured Tab */}
            {activeTab === 'featured' && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold text-deep-teal mb-6">Featured Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* High Yield Savings */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-soft-gold to-sage p-4">
                        <h3 className="text-white font-bold text-lg">High Yield Savings</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-4xl font-bold text-soft-gold mb-2">3.75%</div>
                        <p className="text-sm text-gray-500 mb-4">APY</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Minimum Balance</span>
                            <span className="font-semibold text-deep-teal">$0</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Monthly Fee</span>
                            <span className="font-semibold text-deep-teal">$0</span>
                          </div>
                        </div>
                        <Link href="/save/high-yield" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Learn More
                        </Link>
                      </div>
                    </div>

                    {/* 18 Month Certificate */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-soft-gold to-sage p-4">
                        <h3 className="text-white font-bold text-lg">18 Month Certificate</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-4xl font-bold text-soft-gold mb-2">3.65%</div>
                        <p className="text-sm text-gray-500 mb-4">APY</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Minimum Deposit</span>
                            <span className="font-semibold text-deep-teal">$500</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Early Withdrawal</span>
                            <span className="font-semibold text-deep-teal">90 days interest</span>
                          </div>
                        </div>
                        <Link href="/save/certificates" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Learn More
                        </Link>
                      </div>
                    </div>

                    {/* 36 Month Certificate */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-soft-gold to-sage p-4">
                        <h3 className="text-white font-bold text-lg">36 Month Certificate</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-4xl font-bold text-soft-gold mb-2">4.00%</div>
                        <p className="text-sm text-gray-500 mb-4">APY</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Minimum Deposit</span>
                            <span className="font-semibold text-deep-teal">$500</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Early Withdrawal</span>
                            <span className="font-semibold text-deep-teal">180 days interest</span>
                          </div>
                        </div>
                        <Link href="/save/certificates" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Learn More
                        </Link>
                      </div>
                    </div>

                    {/* Cash Rewards Mastercard */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-soft-gold to-sage p-4">
                        <h3 className="text-white font-bold text-lg">Cash Rewards MC</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">15.49%</div>
                        <p className="text-sm text-gray-500 mb-4">Variable APR</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Annual Fee</span>
                            <span className="font-semibold text-deep-teal">$0</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Rewards Rate</span>
                            <span className="font-semibold text-deep-teal">1.5% cash back</span>
                          </div>
                        </div>
                        <Link href="/borrow/credit-cards" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Savings Tab */}
            {activeTab === 'savings' && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold text-deep-teal mb-6">Savings Accounts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* High Yield Savings */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">High Yield Savings</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-4xl font-bold text-soft-gold mb-2">3.75%</div>
                        <p className="text-sm text-gray-500 mb-4">APY</p>
                        <ul className="space-y-2 mb-6 text-sm">
                          <li className="flex items-center text-gray-600">✓ No monthly fees</li>
                          <li className="flex items-center text-gray-600">✓ No minimum balance</li>
                          <li className="flex items-center text-gray-600">✓ FDIC insured</li>
                        </ul>
                        <Link href="/save/high-yield" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Open Account
                        </Link>
                      </div>
                    </div>

                    {/* Money Market */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">Money Market</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-4xl font-bold text-soft-gold mb-2">3.85%</div>
                        <p className="text-sm text-gray-500 mb-4">APY</p>
                        <ul className="space-y-2 mb-6 text-sm">
                          <li className="flex items-center text-gray-600">✓ $2,500 minimum</li>
                          <li className="flex items-center text-gray-600">✓ Check writing</li>
                          <li className="flex items-center text-gray-600">✓ Tiered rates</li>
                        </ul>
                        <Link href="/save/money-market" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Open Account
                        </Link>
                      </div>
                    </div>

                    {/* 24 Month Certificate */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">24 Month Certificate</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-4xl font-bold text-soft-gold mb-2">3.75%</div>
                        <p className="text-sm text-gray-500 mb-4">APY</p>
                        <ul className="space-y-2 mb-6 text-sm">
                          <li className="flex items-center text-gray-600">✓ $500 minimum</li>
                          <li className="flex items-center text-gray-600">✓ Fixed rate</li>
                          <li className="flex items-center text-gray-600">✓ Guaranteed returns</li>
                        </ul>
                        <Link href="/save/certificates" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Open Account
                        </Link>
                      </div>
                    </div>

                    {/* 60 Month Certificate */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">60 Month Certificate</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-4xl font-bold text-soft-gold mb-2">4.20%</div>
                        <p className="text-sm text-gray-500 mb-4">APY</p>
                        <ul className="space-y-2 mb-6 text-sm">
                          <li className="flex items-center text-gray-600">✓ $500 minimum</li>
                          <li className="flex items-center text-gray-600">✓ Best long-term rate</li>
                          <li className="flex items-center text-gray-600">✓ Lock in your rate</li>
                        </ul>
                        <Link href="/save/certificates" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Open Account
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Credit Cards Tab */}
            {activeTab === 'credit-cards' && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold text-deep-teal mb-6">Credit Cards</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Cash Rewards */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">Cash Rewards</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">15.49%</div>
                        <p className="text-sm text-gray-500 mb-4">Variable APR</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Intro APR</span>
                            <span className="font-semibold text-deep-teal">0% for 15 months</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Annual Fee</span>
                            <span className="font-semibold text-deep-teal">$0</span>
                          </div>
                        </div>
                        <Link href="/borrow/credit-cards/cash-rewards" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Apply Now
                        </Link>
                      </div>
                    </div>

                    {/* Rewards Mastercard */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">Rewards Mastercard</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">9.99%</div>
                        <p className="text-sm text-gray-500 mb-4">Fixed APR</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Rewards Rate</span>
                            <span className="font-semibold text-deep-teal">2x points</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Annual Fee</span>
                            <span className="font-semibold text-deep-teal">$0</span>
                          </div>
                        </div>
                        <Link href="/borrow/credit-cards/rewards" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Apply Now
                        </Link>
                      </div>
                    </div>

                    {/* Choice Mastercard */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">Choice Mastercard</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">11.49%</div>
                        <p className="text-sm text-gray-500 mb-4">Variable APR</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Balance Transfer</span>
                            <span className="font-semibold text-deep-teal">0% for 12 months</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Annual Fee</span>
                            <span className="font-semibold text-deep-teal">$0</span>
                          </div>
                        </div>
                        <Link href="/borrow/credit-cards/choice" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Apply Now
                        </Link>
                      </div>
                    </div>

                    {/* World Mastercard */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">World Mastercard</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">14.49%</div>
                        <p className="text-sm text-gray-500 mb-4">Variable APR</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Travel Rewards</span>
                            <span className="font-semibold text-deep-teal">3x points</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Annual Fee</span>
                            <span className="font-semibold text-deep-teal">$95</span>
                          </div>
                        </div>
                        <Link href="/borrow/credit-cards/world" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loans Tab */}
            {activeTab === 'loans' && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold text-deep-teal mb-6">Loan Rates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* New Auto */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">New Auto Loan</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">5.89%</div>
                        <p className="text-sm text-gray-500 mb-4">APR</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Terms</span>
                            <span className="font-semibold text-deep-teal">Up to 66 months</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Minimum Amount</span>
                            <span className="font-semibold text-deep-teal">$5,000</span>
                          </div>
                        </div>
                        <Link href="/borrow/auto/new" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Apply Now
                        </Link>
                      </div>
                    </div>

                    {/* Used Auto */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">Used Auto Loan</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">6.19%</div>
                        <p className="text-sm text-gray-500 mb-4">APR</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Terms</span>
                            <span className="font-semibold text-deep-teal">Up to 66 months</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Minimum Amount</span>
                            <span className="font-semibold text-deep-teal">$5,000</span>
                          </div>
                        </div>
                        <Link href="/borrow/auto/used" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Apply Now
                        </Link>
                      </div>
                    </div>

                    {/* Personal Loan */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">Personal Loan</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">11.99%</div>
                        <p className="text-sm text-gray-500 mb-4">APR</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Terms</span>
                            <span className="font-semibold text-deep-teal">12-60 months</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Minimum Amount</span>
                            <span className="font-semibold text-deep-teal">$1,000</span>
                          </div>
                        </div>
                        <Link href="/borrow/personal" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Apply Now
                        </Link>
                      </div>
                    </div>

                    {/* HELOC */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">Interest-Only HELOC</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">2.49%</div>
                        <p className="text-sm text-gray-500 mb-4">Intro Rate</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Draw Period</span>
                            <span className="font-semibold text-deep-teal">10 years</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Max LTV</span>
                            <span className="font-semibold text-deep-teal">80%</span>
                          </div>
                        </div>
                        <Link href="/borrow/heloc" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mortgages Tab */}
            {activeTab === 'mortgages' && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold text-deep-teal mb-6">Mortgage Rates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 10 Year Refinance */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">10 Year Fixed</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">6.375%</div>
                        <p className="text-sm text-gray-500 mb-4">Fixed Rate</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Loan Term</span>
                            <span className="font-semibold text-deep-teal">10 years</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Points</span>
                            <span className="font-semibold text-deep-teal">0.5 points</span>
                          </div>
                        </div>
                        <Link href="/borrow/mortgage/10-year" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Get Quote
                        </Link>
                      </div>
                    </div>

                    {/* 30 Year Purchase */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">30 Year Fixed</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">6.875%</div>
                        <p className="text-sm text-gray-500 mb-4">Fixed Rate</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Loan Term</span>
                            <span className="font-semibold text-deep-teal">30 years</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Points</span>
                            <span className="font-semibold text-deep-teal">0.5 points</span>
                          </div>
                        </div>
                        <Link href="/borrow/mortgage/30-year" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Get Quote
                        </Link>
                      </div>
                    </div>

                    {/* 10/1 ARM */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="bg-gradient-to-r from-deep-teal to-sage p-4">
                        <h3 className="text-white font-bold text-lg">10/1 ARM</h3>
                      </div>
                      <div className="p-6">
                        <div className="text-3xl font-bold text-soft-gold mb-2">6.625%</div>
                        <p className="text-sm text-gray-500 mb-4">Variable Rate</p>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Fixed Period</span>
                            <span className="font-semibold text-deep-teal">10 years</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Points</span>
                            <span className="font-semibold text-deep-teal">0.5 points</span>
                          </div>
                        </div>
                        <Link href="/borrow/mortgage/arm" className="inline-block w-full text-center bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors">
                          Get Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-16 bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-deep-teal mb-4">Important Rate Information</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-deep-teal mb-2">APY (Annual Percentage Yield)</h3>
                  <p className="text-gray-600 text-sm mb-4">The APY is accurate as of the last update date and is subject to change without notice. Fees may reduce earnings.</p>
                  
                  <h3 className="font-semibold text-deep-teal mb-2">APR (Annual Percentage Rate)</h3>
                  <p className="text-gray-600 text-sm mb-4">The APR shown is based on credit approval and may vary based on your creditworthiness and other factors.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-deep-teal mb-2">Membership Requirements</h3>
                  <p className="text-gray-600 text-sm mb-4">To open any account or apply for any loan product, you must become a member of Oldspring Trust. Membership is available to anyone who lives, works, or worships in our service area.</p>
                  
                  <h3 className="font-semibold text-deep-teal mb-2">FDIC Insurance</h3>
                  <p className="text-gray-600 text-sm">All deposit accounts are FDIC insured up to $250,000 per depositor, per ownership category.</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-gradient-to-r from-deep-teal to-sage rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4 text-center">Need Help Choosing?</h2>
              <p className="text-center mb-6 text-white/90">Our member care specialists are here to help you find the right rates for your needs.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="bg-white text-deep-teal px-6 py-3 rounded-lg font-semibold hover:bg-soft-gold hover:text-white transition-colors">
                  Contact Us
                </Link>
                <Link href="/appointments" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-deep-teal transition-colors">
                  Schedule Appointment
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
