'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-deep-teal text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
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
              <div className="w-32 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-2 hover:bg-white/20 transition-all duration-300">
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
              <div className="w-32 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-2 hover:bg-white/20 transition-all duration-300">
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
              <div className="w-32 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-2 hover:bg-white/20 transition-all duration-300">
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
    </footer>
  )
}
