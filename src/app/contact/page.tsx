'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert('Thank you for your message. We\'ll get back to you soon!')
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
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Contact Us</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                We're here to help! Reach out to us anytime with your questions or concerns.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  title: "Visit Us",
                  info: "100 Bishopsgate, London",
                  icon: "📍",
                  link: "https://maps.google.com"
                },
                {
                  title: "Call Us",
                  info: "+44 (0)20 1234 5678",
                  icon: "📞",
                  link: "tel:+442012345678"
                },
                {
                  title: "Email Us",
                  info: "support@oldspring.com",
                  icon: "✉️",
                  link: "mailto:support@oldspring.com"
                },
                {
                  title: "Branch Hours",
                  info: "Mon-Fri 8:30-6:00, Sat 9:00-1:00",
                  icon: "🕒",
                  link: "#"
                }
              ].map((item, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={0.1 * (index + 1)}>
                  <a href={item.link} className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="text-lg font-bold text-deep-teal mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.info}</p>
                  </a>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-20 bg-soft-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ScrollAnimation animation="fadeInLeft">
                <h2 className="text-3xl font-bold text-deep-teal mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all bg-white/50"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </ScrollAnimation>

              {/* Map */}
              <ScrollAnimation animation="fadeInRight">
                <h2 className="text-3xl font-bold text-deep-teal mb-6">Visit Our Branch</h2>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-96">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.546387406899!2d-0.081892684229678!3d51.51461747963585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876035a0a6a7b87%3A0x8f9b9a9a9a9a9a9a!2s100%20Bishopsgate%2C%20London%20EC2M%201GT!5e0!3m2!1sen!2suk!4v1620000000000!5m2!1sen!2suk"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-gray-600">
                    <span className="font-semibold text-deep-teal">📍 Directions:</span> Our branch is located in the heart of London's financial district, just a 5-minute walk from Liverpool Street Station.
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
