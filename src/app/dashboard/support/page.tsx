'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'


export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('faq')

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. Follow the instructions sent to your email."
    },
    {
      question: "What should I do if I see unauthorized transactions?",
      answer: "Contact us immediately at +44 (0)20 1234 5678. We'll investigate and help protect your account."
    },
    {
      question: "How do I enable two-factor authentication?",
      answer: "Go to Account Settings → Security → Two-Factor Authentication and follow the setup process."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-8">
          <ScrollAnimation animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-deep-teal mb-2">Customer Support</h1>
              <p className="text-gray-600">We're here to help 24/7</p>
            </div>

            {/* Support Options */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-soft-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="font-semibold text-deep-teal mb-2">Call Us</h3>
                <p className="text-sm text-gray-600">+44 (0)20 1234 5678</p>
                <p className="text-xs text-gray-500 mt-1">24/7 available</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-soft-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✉️</span>
                </div>
                <h3 className="font-semibold text-deep-teal mb-2">Email Us</h3>
                <p className="text-sm text-gray-600">support@oldspring.com</p>
                <p className="text-xs text-gray-500 mt-1">Response within 2h</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-soft-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold text-deep-teal mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600">Chat with an agent</p>
                <p className="text-xs text-gray-500 mt-1">Available now</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {[
                { id: 'faq', label: 'FAQ' },
                { id: 'contact', label: 'Contact Us' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-soft-gold text-deep-teal'
                      : 'border-transparent text-gray-500 hover:text-deep-teal'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* FAQ Section */}
            {activeTab === 'faq' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-deep-teal mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium text-deep-teal mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Form */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-deep-teal mb-4">Send us a message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-deep-teal text-white px-6 py-2 rounded-lg hover:bg-soft-gold transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            )}
          </ScrollAnimation>
        </main>
        <DashboardFooter />
      </div>
    </div>
  )
}
