'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-50 w-12 h-12 bg-soft-gold text-deep-teal rounded-full shadow-lg hover:bg-sage hover:text-white transition-all duration-300 hover:scale-110 animate-bounce flex items-center justify-center group"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* CTA Section - Sage Green with Floating Images */}
      <div className="bg-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Routing Number */}
            <div className="flex items-center gap-4 group">
              <div className="relative w-16 h-16 group-hover:scale-110 transition-all duration-300 animate-float">
                <Image
                  src="/images/3d/routing.png"
                  alt="Routing Number"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-white/80">Routing Number</p>
                <p className="text-xl font-bold text-soft-gold">655205039</p>
              </div>
            </div>

            {/* Branch Hours */}
            <div className="flex items-center gap-4 group">
              <div className="relative w-16 h-16 group-hover:scale-110 transition-all duration-300 animate-float" style={{ animationDelay: '0.2s' }}>
                <Image
                  src="/images/3d/time.png"
                  alt="Branch Hours"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-white/80">Branch Hours</p>
                <p className="text-lg font-bold text-soft-gold">Mon-Fri 8:30-6:00</p>
                <p className="text-lg font-bold text-soft-gold">Sat 9:00-1:00</p>
              </div>
            </div>

            {/* Email Support */}
            <div className="flex items-center gap-4 group">
              <div className="relative w-16 h-16 group-hover:scale-110 transition-all duration-300 animate-float" style={{ animationDelay: '0.4s' }}>
                <Image
                  src="/images/3d/email.png"
                  alt="Email Support"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-white/80">Email Support</p>
                <p className="text-lg font-bold text-soft-gold">support@oldspring.com</p>
              </div>
            </div>

            {/* Visit Us */}
            <div className="flex items-center gap-4 group">
              <div className="relative w-16 h-16 group-hover:scale-110 transition-all duration-300 animate-float" style={{ animationDelay: '0.6s' }}>
                <Image
                  src="/images/3d/location.png"
                  alt="Visit Us"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-white/80">Visit Us</p>
                <p className="text-lg font-bold text-soft-gold">100 Bishopsgate</p>
                <p className="text-lg font-bold text-soft-gold">London, UK</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer - Deep Teal */}
      <div className="bg-deep-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold text-soft-gold mb-4">Oldspring Trust</h3>
              <p className="text-white/80 mb-4 text-sm leading-relaxed">
                Building lasting relationships based on trust since 1945. We're committed to providing exceptional financial services with a personal touch.
              </p>
              <div className="space-y-2 text-sm text-white/70">
                <p>📍 100 Bishopsgate, London</p>
                <p>📞 +44 (0)20 1234 5678</p>
                <p>✉️ support@oldspring.com</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold text-soft-gold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-white/70 hover:text-soft-gold transition-colors">About Us</Link></li>
                <li><Link href="/services" className="text-white/70 hover:text-soft-gold transition-colors">Services</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-soft-gold transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-white/70 hover:text-soft-gold transition-colors">Careers</Link></li>
                <li><Link href="/news" className="text-white/70 hover:text-soft-gold transition-colors">News & Events</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xl font-bold text-soft-gold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/faqs" className="text-white/70 hover:text-soft-gold transition-colors">FAQs</Link></li>
                <li><Link href="/rates" className="text-white/70 hover:text-soft-gold transition-colors">Rates</Link></li>
                <li><Link href="/calculators" className="text-white/70 hover:text-soft-gold transition-colors">Calculators</Link></li>
                <li><Link href="/security" className="text-white/70 hover:text-soft-gold transition-colors">Security Center</Link></li>
                <li><Link href="/sitemap" className="text-white/70 hover:text-soft-gold transition-colors">Sitemap</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xl font-bold text-soft-gold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-white/70 hover:text-soft-gold transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/70 hover:text-soft-gold transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-white/70 hover:text-soft-gold transition-colors">Cookie Policy</Link></li>
                <li><Link href="/disclosures" className="text-white/70 hover:text-soft-gold transition-colors">Disclosures</Link></li>
                <li><Link href="/fraud" className="text-white/70 hover:text-soft-gold transition-colors">Fraud Prevention</Link></li>
              </ul>
            </div>
          </div>

          {/* Certification Logos */}
          <div className="border-t border-white/20 pt-8 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {/* FDIC Logo */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-2 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Image
                    src="/images/licenses/us-fdic.png"
                    alt="FDIC Insured"
                    width={120}
                    height={60}
                    className="w-auto h-12 object-contain"
                  />
                </div>
                <span className="text-xs text-white/60 mt-2">FDIC Insured</span>
              </div>

              {/* NCUA Certificate */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-2 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Image
                    src="/images/licenses/ncua-cert.png"
                    alt="NCUA Certified"
                    width={120}
                    height={60}
                    className="w-auto h-12 object-contain"
                  />
                </div>
                <span className="text-xs text-white/60 mt-2">NCUA Certified</span>
              </div>

              {/* Equal Housing Lender */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-2 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Image
                    src="/images/licenses/ncua-lender.png"
                    alt="Equal Housing Lender"
                    width={120}
                    height={60}
                    className="w-auto h-12 object-contain"
                  />
                </div>
                <span className="text-xs text-white/60 mt-2">Equal Housing Lender</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-white/60">
                © {new Date().getFullYear()} Oldspring Trust. All rights reserved.
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="text-xs text-white/60 hover:text-soft-gold transition-colors">
                  Privacy
                </Link>
                <span className="text-white/20">|</span>
                <Link href="/terms" className="text-xs text-white/60 hover:text-soft-gold transition-colors">
                  Terms
                </Link>
                <span className="text-white/20">|</span>
                <Link href="/sitemap" className="text-xs text-white/60 hover:text-soft-gold transition-colors">
                  Sitemap
                </Link>
                <span className="text-white/20">|</span>
                <Link href="/cookies" className="text-xs text-white/60 hover:text-soft-gold transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
