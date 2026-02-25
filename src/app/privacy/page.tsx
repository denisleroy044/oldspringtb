'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-deep-teal to-sage py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Privacy Policy</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                We are committed to protecting your privacy and maintaining the confidentiality of your personal information.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Last Updated */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-500">Last Updated: March 1, 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <ScrollAnimation animation="fadeInUp">
                <h2 className="text-2xl font-bold text-deep-teal mb-4">Our Commitment to Privacy</h2>
                <p className="text-gray-600 mb-6">
                  At Oldspring Trust, we understand that privacy is important to our customers. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our banking services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.1}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">Information We Collect</h2>
                <p className="text-gray-600 mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
                  <li>Register for an account or open a new account</li>
                  <li>Apply for a loan, credit card, or other financial product</li>
                  <li>Use our online banking or mobile app services</li>
                  <li>Contact customer support or request information</li>
                  <li>Participate in surveys, promotions, or events</li>
                  <li>Visit our website or interact with our digital platforms</li>
                </ul>
                <p className="text-gray-600 mb-6">
                  The personal information we may collect includes your name, address, email address, phone number, date of birth, social security number, financial information, and account details.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.2}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
                  <li>Process transactions and provide banking services</li>
                  <li>Verify your identity and protect against fraud</li>
                  <li>Communicate with you about your accounts and services</li>
                  <li>Improve our website, products, and customer service</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Send you important updates and promotional offers (with your consent)</li>
                </ul>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.3}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">Information Sharing and Disclosure</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
                  <li>Service providers who assist in operating our business and serving you</li>
                  <li>Financial institutions and credit bureaus as necessary for transactions</li>
                  <li>Regulatory authorities and law enforcement as required by law</li>
                  <li>With your consent or at your direction</li>
                </ul>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.4}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">Data Security</h2>
                <p className="text-gray-600 mb-6">
                  We implement a variety of security measures to maintain the safety of your personal information. We use encryption, firewalls, secure servers, and access controls to protect against unauthorized access, alteration, disclosure, or destruction of your information.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.5}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">Cookies and Tracking Technologies</h2>
                <p className="text-gray-600 mb-6">
                  We use cookies and similar tracking technologies to enhance your experience on our website, analyze trends, and gather demographic information. You can control cookies through your browser settings and other tools. For more information, please see our <Link href="/cookies" className="text-soft-gold hover:underline">Cookie Policy</Link>.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.6}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">Your Rights and Choices</h2>
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request deletion of your information, subject to legal requirements</li>
                  <li>Close your accounts and terminate your relationship with us</li>
                </ul>
                <p className="text-gray-600 mb-6">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.7}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">Changes to This Policy</h2>
                <p className="text-gray-600 mb-6">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date. We encourage you to review this policy periodically for any changes.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.8}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">Contact Us</h2>
                <p className="text-gray-600 mb-6">
                  If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-soft-gold">
                  <p className="text-gray-600">
                    <strong className="text-deep-teal">Oldspring Trust</strong><br />
                    100 Bishopsgate, London<br />
                    Email: <a href="mailto:privacy@oldspring.com" className="text-soft-gold hover:underline">privacy@oldspring.com</a><br />
                    Phone: <a href="tel:+442012345678" className="text-soft-gold hover:underline">+44 (0)20 1234 5678</a>
                  </p>
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
