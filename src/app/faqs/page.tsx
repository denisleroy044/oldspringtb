'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'
import { useState } from 'react'

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const categories = [
    { id: 'general', name: 'General Banking' },
    { id: 'accounts', name: 'Accounts' },
    { id: 'cards', name: 'Credit Cards' },
    { id: 'loans', name: 'Loans & Mortgages' },
    { id: 'online', name: 'Online Banking' },
    { id: 'security', name: 'Security' }
  ]

  const faqs = {
    general: [
      {
        question: "What are your branch hours?",
        answer: "Our branches are open Monday through Friday from 8:30 AM to 6:00 PM, and Saturdays from 9:00 AM to 1:00 PM. We are closed on Sundays and major holidays."
      },
      {
        question: "How do I find a branch near me?",
        answer: "You can use our branch locator tool on our website or mobile app to find the nearest Oldspring Trust branch. We have locations throughout the UK."
      },
      {
        question: "What is your routing number?",
        answer: "Our routing number is 655205039. You'll need this for direct deposits, wire transfers, and other electronic transactions."
      },
      {
        question: "How do I contact customer support?",
        answer: "You can reach our customer support team by phone at +44 (0)20 1234 5678, email at support@oldspring.com, or through the secure messaging feature in our mobile app."
      }
    ],
    accounts: [
      {
        question: "How do I open an account?",
        answer: "You can open an account online in just a few minutes, or visit any of our branches. You'll need to provide identification and basic personal information."
      },
      {
        question: "What is the minimum deposit to open an account?",
        answer: "Most of our accounts have no minimum deposit requirement. Some specialized accounts may require a minimum deposit of £50 or £100."
      },
      {
        question: "Are there monthly maintenance fees?",
        answer: "Many of our accounts have no monthly maintenance fees. Some premium accounts may have fees that can be waived with qualifying activities."
      },
      {
        question: "How do I close my account?",
        answer: "To close an account, you can visit any branch, call customer service, or send a secure message through online banking. Please ensure all transactions have cleared."
      }
    ],
    cards: [
      {
        question: "How do I apply for a credit card?",
        answer: "You can apply for a credit card online, through our mobile app, or at any branch. The application takes just a few minutes and you'll receive a decision quickly."
      },
      {
        question: "What should I do if my card is lost or stolen?",
        answer: "Immediately report lost or stolen cards by calling our 24/7 customer service line at +44 (0)20 1234 5678. You can also temporarily freeze your card through the mobile app."
      },
      {
        question: "How do I activate my new card?",
        answer: "You can activate your new card through our mobile app, online banking, or by calling the activation number provided with your card."
      },
      {
        question: "What are the benefits of your rewards cards?",
        answer: "Our rewards cards offer cash back, travel points, and other perks. Benefits vary by card and may include purchase protection, travel insurance, and extended warranties."
      }
    ],
    loans: [
      {
        question: "What types of loans do you offer?",
        answer: "We offer personal loans, auto loans, mortgages, home equity lines of credit (HELOC), and business loans. Each has competitive rates and flexible terms."
      },
      {
        question: "How do I apply for a loan?",
        answer: "You can apply for a loan online, through our mobile app, by phone, or at any branch. The application process is simple and you'll get a decision quickly."
      },
      {
        question: "What credit score do I need to qualify?",
        answer: "Credit requirements vary by loan type. We work with customers across various credit profiles and offer options for those building credit."
      },
      {
        question: "Can I pay off my loan early?",
        answer: "Yes, you can pay off most loans early without prepayment penalties. Check your loan agreement for specific terms."
      }
    ],
    online: [
      {
        question: "How do I enroll in online banking?",
        answer: "Visit our website and click 'Enroll' on the login page. You'll need your account number and some personal information to verify your identity."
      },
      {
        question: "What can I do through online banking?",
        answer: "You can check balances, view transactions, transfer funds, pay bills, deposit checks, manage cards, and send secure messages to customer support."
      },
      {
        question: "Is the mobile app free?",
        answer: "Yes, our mobile app is free to download and use. Standard data rates from your mobile provider may apply."
      },
      {
        question: "How do I reset my password?",
        answer: "On the login page, click 'Forgot Password' and follow the instructions. You'll receive an email with a link to reset your password securely."
      }
    ],
    security: [
      {
        question: "How do you protect my information?",
        answer: "We use 256-bit encryption, multi-factor authentication, and continuous monitoring to protect your accounts. We never share your information without consent."
      },
      {
        question: "What should I do if I see unauthorized transactions?",
        answer: "Contact us immediately at +44 (0)20 1234 5678. We'll investigate and help protect your account. You can also dispute transactions through online banking."
      },
      {
        question: "How do I set up two-factor authentication?",
        answer: "In online banking, go to Security Settings and enable two-factor authentication. You can choose to receive codes via text message or authenticator app."
      },
      {
        question: "What are common phishing scams to watch for?",
        answer: "Be wary of emails or texts asking for personal information, urgent requests, or links to unfamiliar websites. We'll never ask for your password via email."
      }
    ]
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-deep-teal to-sage py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Frequently Asked Questions</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Find answers to common questions about our services, accounts, and banking solutions.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-deep-teal text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 hover:text-soft-gold hover:shadow-md'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs[activeCategory as keyof typeof faqs].map((faq, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={0.1 * (index + 1)}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-deep-teal">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-soft-gold transform transition-transform duration-300 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-20 bg-soft-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="zoomIn">
              <h2 className="text-3xl font-bold text-deep-teal mb-4">Still Have Questions?</h2>
              <p className="text-gray-600 mb-8">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-gradient-to-r from-deep-teal to-sage text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  Contact Us
                </Link>
                <Link
                  href="tel:+442012345678"
                  className="inline-flex items-center bg-white border-2 border-deep-teal text-deep-teal px-6 py-3 rounded-xl font-semibold hover:bg-deep-teal hover:text-white transition-all duration-300"
                >
                  Call Support
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
