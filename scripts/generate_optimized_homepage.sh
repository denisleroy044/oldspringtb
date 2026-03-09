#!/bin/bash

# Generate Optimized Homepage with Mobile Menu

cat > src/app/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoursDropdownOpen, setHoursDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="l-header sticky top-0 z-50 bg-white shadow-sm">
        <div className="l-header__bottom border-b">
          <div className="l-header__bottom-inner l-contain u-cf px-4 py-3 lg:py-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a href="/" className="l-header__logo flex-shrink-0">
                <img 
                  src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
                  width="180" 
                  className="lg:w-[200px]" 
                  alt="Oldspring Trust Bank" 
                />
              </a>

              {/* Desktop Actions */}
              <div className="hidden lg:flex l-header__action">
                <ul className="l-header__action__l1 flex space-x-4">
                  <li className="is-active">
                    <Link 
                      href="/auth/login" 
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      LOGIN
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/auth/signup" 
                      className="border-2 border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      OPEN ACCOUNT
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between mt-4">
              <nav className="nav-primary">
                <ul className="flex space-x-8">
                  <li><Link href="/" className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition">Home</Link></li>
                  <li><Link href="/bank" className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition">Bank</Link></li>
                  <li><Link href="/save" className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition">Save</Link></li>
                  <li><Link href="/borrow" className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition">Borrow</Link></li>
                  <li><Link href="/invest" className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition">Wealth & Retire</Link></li>
                  <li><Link href="/insure" className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition">Insure</Link></li>
                  <li><Link href="/learn-and-plan" className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition">Learn & Plan</Link></li>
                  <li><Link href="/payments" className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b-2 border-transparent hover:border-blue-600 transition">Payments</Link></li>
                </ul>
              </nav>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-blue-600">Routing # 655205039</span>
                
                {/* Branch Hours Dropdown */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                    onClick={() => setHoursDropdownOpen(!hoursDropdownOpen)}
                  >
                    <img src="/templates/bank-pro/static-strip-icons/ico-clock-new.svg" width="20" height="20" alt="" />
                    <span>Branch Hours</span>
                  </button>
                  
                  {hoursDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border p-4 z-50">
                      <dl className="space-y-1">
                        <div className="flex justify-between">
                          <dt className="font-medium">Mon-Thurs</dt>
                          <dd className="text-gray-600">8:30-5:00</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Friday</dt>
                          <dd className="text-gray-600">8:30-6:00</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Saturday</dt>
                          <dd className="text-gray-600">9:00-1:00</dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </div>

                <a href="mailto:support@oldspringtrust.com" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <img src="/templates/bank-pro/prefooter-icons/ico-star-circle.svg" width="20" height="20" alt="" />
                  <span>support@oldspringtrust.com</span>
                </a>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-4 py-4 border-t">
                <div className="space-y-4">
                  {/* Mobile Actions */}
                  <div className="flex space-x-3">
                    <Link 
                      href="/auth/login" 
                      className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-center font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      LOGIN
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg text-center font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      OPEN ACCOUNT
                    </Link>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="nav-primary-mobile">
                    <ul className="space-y-2">
                      <li><Link href="/" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                      <li><Link href="/bank" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Bank</Link></li>
                      <li><Link href="/save" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Save</Link></li>
                      <li><Link href="/borrow" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Borrow</Link></li>
                      <li><Link href="/invest" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Wealth & Retire</Link></li>
                      <li><Link href="/insure" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Insure</Link></li>
                      <li><Link href="/learn-and-plan" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Learn & Plan</Link></li>
                      <li><Link href="/payments" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Payments</Link></li>
                    </ul>
                  </nav>

                  {/* Mobile Contact Info */}
                  <div className="pt-4 border-t">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <img src="/templates/bank-pro/static-strip-icons/ico-clock-new.svg" width="20" height="20" alt="" />
                        <span className="text-sm">Mon-Thurs 8:30-5:00 | Fri 8:30-6:00 | Sat 9:00-1:00</span>
                      </div>
                      <a href="mailto:support@oldspringtrust.com" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                        <img src="/templates/bank-pro/prefooter-icons/ico-star-circle.svg" width="20" height="20" alt="" />
                        <span className="text-sm">support@oldspringtrust.com</span>
                      </a>
                      <div className="text-sm font-semibold text-blue-600">
                        Routing # 655205039
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="l-content-wrap">
        <div className="l-1-col-master">
          <main className="l-content-primary">
            <div className="body-content">

              {/* Hero Section with Background Image */}
              <section className="main-hero relative min-h-[400px] lg:min-h-[500px] bg-cover bg-center" 
                style={{backgroundImage: "url('/templates/bank-pro/homepage-images/metro.jpg')"}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/80"></div>
                
                <div className="relative container mx-auto px-4 py-16 lg:py-24 max-w-7xl">
                  <div className="max-w-3xl text-white">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">Oldspring Trust Bank</h1>
                    <p className="text-xl lg:text-2xl text-blue-100 mb-6">
                      We do banking differently. We believe that people come first, and that everyone deserves a great experience every step of the way – whether it's face to face, over the phone, online or on our app.
                    </p>
                  </div>
                </div>
              </section>

              {/* Static Strip */}
              <section className="static-strip bg-gray-50 border-y">
                <div className="container mx-auto px-4 py-3 max-w-7xl">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    <div className="static-strip__routing-num text-lg font-semibold text-blue-600">
                      Routing # 655205039
                    </div>
                    <div className="relative">
                      <button 
                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setHoursDropdownOpen(!hoursDropdownOpen)}
                      >
                        <img src="/templates/bank-pro/static-strip-icons/ico-clock-new.svg" width="24" height="24" alt="" />
                        <span>Branch Hours</span>
                      </button>
                      {hoursDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border p-4 z-50">
                          <dl className="space-y-1">
                            <div className="flex justify-between">
                              <dt className="font-medium">Mon-Thurs</dt>
                              <dd className="text-gray-600">8:30 a.m.-5:00 p.m.</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="font-medium">Friday</dt>
                              <dd className="text-gray-600">8:30 a.m.-6:00 p.m.</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="font-medium">Saturday</dt>
                              <dd className="text-gray-600">9:00 a.m.-1:00 p.m.</dd>
                            </div>
                          </dl>
                          <a className="block mt-3 text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700" href="mailto:support@oldspringtrust.com">
                            Schedule an Appointment
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Rates Section */}
              <section className="rates-section py-12 lg:py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Rate Card 1 */}
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                      <div className="text-3xl font-bold text-blue-600 mb-2">3.75%</div>
                      <div className="text-sm text-gray-500 mb-3">APY</div>
                      <h3 className="font-semibold text-gray-900 mb-2">High Yield Savings Account</h3>
                      <a href="#" className="text-blue-600 text-sm hover:underline">Learn More →</a>
                    </div>

                    {/* Rate Card 2 */}
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                      <div className="text-3xl font-bold text-blue-600 mb-2">3.65%</div>
                      <div className="text-sm text-gray-500 mb-3">APY</div>
                      <h3 className="font-semibold text-gray-900 mb-2">18 Month Certificate</h3>
                      <a href="#" className="text-blue-600 text-sm hover:underline">Learn More →</a>
                    </div>

                    {/* Rate Card 3 */}
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                      <div className="text-3xl font-bold text-blue-600 mb-2">4.00%</div>
                      <div className="text-sm text-gray-500 mb-3">APY</div>
                      <h3 className="font-semibold text-gray-900 mb-2">36 Month Certificate</h3>
                      <a href="#" className="text-blue-600 text-sm hover:underline">Learn More →</a>
                    </div>

                    {/* Rate Card 4 */}
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                      <div className="text-sm text-gray-500 mb-1">AS LOW AS</div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">15.49%</div>
                      <div className="text-sm text-gray-500 mb-3">APR</div>
                      <h3 className="font-semibold text-gray-900 mb-2">Cash Rewards Mastercard</h3>
                      <a href="/credit-cards" className="text-blue-600 text-sm hover:underline">Learn More →</a>
                    </div>
                  </div>
                </div>
              </section>

              {/* How Can We Help Section */}
              <section className="help-section py-12 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                  <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
                    How Can We Help You Today?
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                    {/* Help Card 1 */}
                    <a href="#" className="group">
                      <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
                        <img src="/templates/bank-pro/section-links/ico-check-account.svg" width="60" height="60" className="mx-auto mb-3" alt="" />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Instant Accounts</span>
                      </div>
                    </a>

                    {/* Help Card 2 */}
                    <a href="/credit-cards" className="group">
                      <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
                        <img src="/templates/bank-pro/section-links/ico-credit-cards.svg" width="60" height="60" className="mx-auto mb-3" alt="" />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Credit Cards</span>
                      </div>
                    </a>

                    {/* Help Card 3 */}
                    <a href="/borrow" className="group">
                      <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
                        <img src="/templates/bank-pro/section-links/ico-loans.svg" width="60" height="60" className="mx-auto mb-3" alt="" />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Loans</span>
                      </div>
                    </a>

                    {/* Help Card 4 */}
                    <a href="/business-banking" className="group">
                      <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
                        <img src="/templates/bank-pro/section-links/ico-businessbanking.svg" width="60" height="60" className="mx-auto mb-3" alt="" />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Business Banking</span>
                      </div>
                    </a>

                    {/* Help Card 5 */}
                    <a href="/invest" className="group">
                      <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
                        <img src="/templates/bank-pro/section-links/ico-invest.svg" width="60" height="60" className="mx-auto mb-3" alt="" />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Wealth & Retire</span>
                      </div>
                    </a>

                    {/* Help Card 6 */}
                    <a href="/about" className="group">
                      <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
                        <img src="/templates/bank-pro/section-links/ico-about.svg" width="60" height="60" className="mx-auto mb-3" alt="" />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">About Us</span>
                      </div>
                    </a>
                  </div>
                </div>
              </section>

              {/* Campaign Feature */}
              <section className="campaign-feature py-12 lg:py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                      <div className="p-8 lg:p-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                          Get €300* With a Checking Account Built for You
                        </h2>
                        <p className="text-lg text-blue-100 mb-6">
                          For a limited time, get a €300 when you open any new checking account! Select "Learn More" to see important offer details.
                        </p>
                        <a href="#" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                          Learn More
                        </a>
                      </div>
                      <div className="hidden lg:block">
                        <img 
                          src="/templates/bank-pro/homepage-images/feature.jpg" 
                          alt="300 Cash Back Checking Bonus"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Educational Articles */}
              <section className="articles-section py-12 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                  <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
                    Start Building Your Financial Strength
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Article 1 */}
                    <a href="/tax-checklist-5-things-to-remember" className="group">
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                        <img 
                          src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/unsplash.jpg" 
                          alt="Tax Checklist"
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <span className="text-sm text-blue-600 font-medium">Starting Out</span>
                          <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3 group-hover:text-blue-600">
                            Tax Checklist: 5 Things to Remember
                          </h3>
                          <p className="text-gray-600">
                            Tax season is quickly approaching—do you know what you need to claim, and what forms you need to submit? This tax checklist makes filing simple.
                          </p>
                        </div>
                      </div>
                    </a>

                    {/* Article 2 */}
                    <a href="/simple-ways-to-manage-a-checking-account" className="group">
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                        <img 
                          src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/8554477.jpg" 
                          alt="Manage Checking Account"
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <span className="text-sm text-blue-600 font-medium">Starting Out</span>
                          <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3 group-hover:text-blue-600">
                            Simple Ways to Manage a Checking Account
                          </h3>
                          <p className="text-gray-600">
                            While you might not often find yourself writing out an actual paper check, you still need a checking account. Here's how to manage it.
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </section>

              {/* Testimonials */}
              <section className="testimonials-section py-12 lg:py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                  <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
                    Hear From Our Customers
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                      <p className="text-gray-600 text-lg mb-4">
                        "I am impressed with the customer service and speed of payout"
                      </p>
                      <p className="font-semibold text-blue-600">— Ralph Morris</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8">
                      <p className="text-gray-600 text-lg mb-4">
                        "All one has to do is to look at your investment to see how well it is being looked after."
                      </p>
                      <p className="font-semibold text-blue-600">— Ted Moralee</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Footer Top */}
      <div className="l-footer__top bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3">
              <img src="/templates/bank-pro/icons/footer-icons/citadel-credit-union-routing-number.svg" width="40" height="40" alt="" />
              <div>
                <h3 className="font-semibold mb-1">Routing #</h3>
                <p className="text-gray-300">655205039</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <img src="/templates/bank-pro/icons/prefooter-icons/icoclock.png" width="40" height="40" alt="" />
              <div>
                <h3 className="font-semibold mb-1">Branch Hours</h3>
                <p className="text-gray-300 text-sm">Mon-Thurs: 8:30-5:00</p>
                <p className="text-gray-300 text-sm">Fri: 8:30-6:00</p>
                <p className="text-gray-300 text-sm">Sat: 9:00-1:00</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <img src="/templates/bank-pro/icons/footer-icons/call-citadel-credit-union.svg" width="40" height="40" alt="" />
              <div>
                <h3 className="font-semibold mb-1">Customer Service</h3>
                <a href="mailto:support@oldspringtrust.com" className="text-gray-300 hover:text-white text-sm">
                  support@oldspringtrust.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <img src="/templates/bank-pro/footer-images/live-video-call.png" width="40" height="40" alt="" />
              <div>
                <h3 className="font-semibold mb-1">Video Connect</h3>
                <button 
                  onClick={() => alert('Temporarily unavailable, please contact us via Email')}
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Chat Virtually
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="l-footer bg-gray-900 text-white border-t border-gray-800">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* About */}
            <div>
              <h2 className="text-xl font-bold mb-4">Building Strength Together</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Oldspring Trust is a not-for-profit credit union bank built on the unshakeable promise to serve those who work every day to build a better future for us all. For over 80 years, we've delivered a breadth of financial services, expert guidance, and innovative tools to help strengthen and grow businesses, families, and our local communities. We are your Oldspring Trust, and we are Building Strength Together.
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">About</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/about" className="hover:text-white">About Us</a></li>
                  <li><a href="/about" className="hover:text-white">Who we are</a></li>
                  <li><a href="/customer-support" className="hover:text-white">Contact Us</a></li>
                  <li><a href="/news" className="hover:text-white">News & Events</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/careers" className="hover:text-white">Careers</a></li>
                  <li><a href="/giving-back" className="hover:text-white">Giving Back</a></li>
                  <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="/faqs" className="hover:text-white">FAQs</a></li>
                </ul>
              </div>
            </div>

            {/* Member Services */}
            <div>
              <h3 className="font-semibold mb-4">Member Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/payments" className="hover:text-white">Loan Payments</a></li>
                <li><a href="#" className="hover:text-white">Referral Service</a></li>
                <li><a href="#" className="hover:text-white">Oldspring Trust Security™</a></li>
                <li><a href="mailto:support@oldspringtrust.com" className="hover:text-white">Email Us</a></li>
              </ul>
              <div className="mt-6">
                <img src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" width="180" alt="Oldspring Trust" className="brightness-200" />
              </div>
              <p className="mt-4 text-sm text-gray-400">
                100 Bishopsgate, London EC2N 4AG<br />
                United Kingdom
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
                <a href="/faqs" className="hover:text-white">FAQs</a>
                <a href="#" className="hover:text-white">Sitemap</a>
              </div>

              <div className="flex items-center space-x-4">
                <img src="/templates/bank-pro/blue-seal-200-42-bbb-80015515.png" width="80" alt="BBB" />
                <img src="/templates/bank-pro/images/assets/ncua-lender.png" width="60" alt="NCUA Lender" />
                <img src="/templates/bank-pro/images/assets/ncua-cert.png" width="60" alt="NCUA Certified" />
                <span className="text-xs text-gray-400">Federally Insured by NCUA</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-6">
              © 2025 Oldspring Trust Bank. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
EOF

echo "✅ Optimized homepage with mobile menu created at src/app/page.tsx"
echo ""
echo "Key improvements:"
echo "  ✓ Mobile-responsive header with hamburger menu"
echo "  ✓ Proper image paths using /templates/bank-pro/"
echo "  ✓ Dropdown for branch hours on desktop"
echo "  ✓ Full mobile menu with navigation and contact info"
echo "  ✓ Responsive grid layouts for all sections"
echo "  ✓ All original images from your templates folder"
echo ""
echo "Run: npm run dev to see your optimized site!"