'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-deep-teal to-sage py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Our Services</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Comprehensive financial solutions tailored to meet your needs at every stage of life.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Personal Banking",
                  description: "Checking accounts, savings, and everyday banking solutions designed for individuals.",
                  icon: "🏦",
                  link: "/bank",
                  features: ["Interest-bearing checking", "High-yield savings", "Mobile banking", "Debit cards"]
                },
                {
                  title: "Business Banking",
                  description: "Commercial accounts, merchant services, and financing for businesses of all sizes.",
                  icon: "💼",
                  link: "/business",
                  features: ["Business checking", "Merchant services", "Payroll solutions", "Business credit cards"]
                },
                {
                  title: "Loans & Mortgages",
                  description: "Competitive rates on personal loans, auto loans, and home mortgages.",
                  icon: "💰",
                  link: "/borrow",
                  features: ["Personal loans", "Auto loans", "Home mortgages", "Debt consolidation"]
                },
                {
                  title: "Credit Cards",
                  description: "Rewards cards, low APR options, and cards designed to build credit.",
                  icon: "💳",
                  link: "/borrow/credit-cards",
                  features: ["Cash back rewards", "Travel rewards", "Low intro APR", "No annual fee"]
                },
                {
                  title: "Wealth Management",
                  description: "Investment advice, retirement planning, and wealth preservation strategies.",
                  icon: "📈",
                  link: "/invest",
                  features: ["Investment management", "Retirement planning", "Estate planning", "Financial advisory"]
                },
                {
                  title: "Insurance",
                  description: "Protection for what matters most with comprehensive insurance options.",
                  icon: "🛡️",
                  link: "/insurance",
                  features: ["Life insurance", "Home insurance", "Auto insurance", "Business insurance"]
                }
              ].map((service, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={0.1 * (index + 1)}>
                  <Link href={service.link}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                      <div className="text-5xl mb-4">{service.icon}</div>
                      <h3 className="text-2xl font-bold text-deep-teal mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-soft-gold">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <span className="text-soft-gold font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Learn more →
                      </span>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-soft-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="zoomIn">
              <h2 className="text-4xl font-black text-deep-teal mb-4">Not Sure Which Service You Need?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Our friendly team is here to help you find the right solutions for your financial goals.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center bg-gradient-to-r from-deep-teal to-sage text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                Contact Us
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
