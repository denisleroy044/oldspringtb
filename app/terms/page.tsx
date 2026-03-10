'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-deep-teal to-sage py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Terms of Service</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Please read these terms carefully before using our services or accessing our website.
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
                <h2 className="text-2xl font-bold text-deep-teal mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 mb-6">
                  By accessing or using the services provided by Oldspring Trust, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use our services. These terms apply to all visitors, users, and customers of Oldspring Trust.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.1}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">2. Eligibility</h2>
                <p className="text-gray-600 mb-6">
                  To use our services, you must be at least 18 years old and capable of forming a binding contract. By using our services, you represent and warrant that you meet these eligibility requirements. Additional eligibility requirements may apply for specific products and services.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.2}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">3. Account Registration</h2>
                <p className="text-gray-600 mb-4">
                  To access certain features of our services, you may need to register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information as needed</li>
                  <li>Keep your account credentials secure and confidential</li>
                  <li>Notify us immediately of any unauthorized access or use</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.3}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">4. Fees and Charges</h2>
                <p className="text-gray-600 mb-6">
                  Some of our services may be subject to fees and charges. You agree to pay all fees and charges associated with your use of our services. Fee schedules are provided in your account agreements and are subject to change with notice. You are responsible for any taxes applicable to your transactions.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.4}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">5. Electronic Communications</h2>
                <p className="text-gray-600 mb-6">
                  By using our services, you consent to receive electronic communications from us, including emails, text messages, and in-app notifications. These communications may include transaction confirmations, account updates, and promotional offers. You may opt out of marketing communications at any time.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.5}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">6. Prohibited Activities</h2>
                <p className="text-gray-600 mb-4">You may not use our services to:</p>
                <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Engage in fraudulent or deceptive activities</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit malware or harmful code</li>
                  <li>Interfere with the operation of our systems</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.6}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">7. Third-Party Links</h2>
                <p className="text-gray-600 mb-6">
                  Our website and services may contain links to third-party websites or services. We are not responsible for the content, privacy practices, or terms of third-party sites. Your use of third-party sites is at your own risk and subject to their terms.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.7}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">8. Limitation of Liability</h2>
                <p className="text-gray-600 mb-6">
                  To the fullest extent permitted by law, Oldspring Trust shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount you paid us during the twelve months preceding the claim.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.8}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">9. Termination</h2>
                <p className="text-gray-600 mb-6">
                  We may terminate or suspend your account and access to our services at our discretion, without prior notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties. You may close your account at any time by contacting us.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={0.9}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">10. Changes to Terms</h2>
                <p className="text-gray-600 mb-6">
                  We may modify these terms at any time. We will provide notice of material changes by posting the updated terms on this page with an updated effective date. Your continued use of our services after changes constitutes acceptance of the revised terms.
                </p>
              </ScrollAnimation>

              <ScrollAnimation animation="fadeInUp" delay={1.0}>
                <h2 className="text-2xl font-bold text-deep-teal mb-4 mt-8">11. Contact Information</h2>
                <p className="text-gray-600 mb-6">
                  If you have questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-soft-gold">
                  <p className="text-gray-600">
                    <strong className="text-deep-teal">Oldspring Trust</strong><br />
                    100 Bishopsgate, London<br />
                    Email: <a href="mailto:legal@oldspring.com" className="text-soft-gold hover:underline">legal@oldspring.com</a><br />
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
