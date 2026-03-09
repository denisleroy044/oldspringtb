'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-deep-teal to-sage py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">About Oldspring Trust</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Building lasting relationships based on trust since 1945. We're committed to providing exceptional financial services with a personal touch.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollAnimation animation="fadeInLeft">
                <h2 className="text-4xl font-black text-deep-teal mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Founded in 1945, Oldspring Trust began with a simple mission: to provide personalized banking services with integrity and care. What started as a single branch in London has grown into a trusted financial institution serving thousands of customers across the country.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Throughout our history, we've remained committed to our core values of trust, transparency, and community. We believe in building relationships, not just transactions, and we take pride in getting to know our customers and their unique financial needs.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Today, we continue to honor our heritage while embracing innovation, offering modern banking solutions that make managing your finances easier and more convenient than ever.
                </p>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeInRight">
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Oldspring Trust Building"
                    fill
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 bg-soft-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <h2 className="text-4xl font-black text-deep-teal mb-12 text-center">Our Mission & Values</h2>
            </ScrollAnimation>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Trust",
                  description: "We build lasting relationships through honesty, transparency, and integrity in everything we do.",
                  icon: "🤝"
                },
                {
                  title: "Community",
                  description: "We're committed to the communities we serve, supporting local initiatives and economic growth.",
                  icon: "🏘️"
                },
                {
                  title: "Innovation",
                  description: "We embrace technology to provide modern, convenient banking solutions for our customers.",
                  icon: "💡"
                }
              ].map((item, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={0.1 * (index + 1)}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-2xl font-bold text-deep-teal mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <h2 className="text-4xl font-black text-deep-teal mb-4 text-center">Our Leadership Team</h2>
              <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                Meet the experienced professionals dedicated to guiding Oldspring Trust and serving our customers.
              </p>
            </ScrollAnimation>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "James Mitchell",
                  title: "Chief Executive Officer",
                  bio: "30+ years of banking experience, committed to community-focused financial services."
                },
                {
                  name: "Sarah Thompson",
                  title: "Chief Financial Officer",
                  bio: "Expert in financial strategy and risk management with a passion for innovation."
                },
                {
                  name: "Michael Chen",
                  title: "Chief Operating Officer",
                  bio: "Dedicated to operational excellence and delivering exceptional customer experiences."
                }
              ].map((leader, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={0.1 * (index + 1)}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-deep-teal to-sage rounded-full flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-deep-teal mb-1">{leader.name}</h3>
                    <p className="text-soft-gold font-medium mb-3">{leader.title}</p>
                    <p className="text-gray-600 text-sm">{leader.bio}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
