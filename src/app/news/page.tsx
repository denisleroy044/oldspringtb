'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = ['all', 'Press Releases', 'Company News', 'Events', 'Community']

  const news = [
    {
      title: "Oldspring Trust Announces Record Growth in 2024",
      category: "Press Releases",
      date: "March 15, 2026",
      excerpt: "We're proud to announce our strongest year yet, with significant growth across all business segments.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Sarah Thompson"
    },
    {
      title: "New Digital Banking Platform Launch",
      category: "Company News",
      date: "March 10, 2026",
      excerpt: "Experience banking reimagined with our new mobile app featuring enhanced security and intuitive design.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Michael Chen"
    },
    {
      title: "Community Financial Wellness Workshop",
      category: "Events",
      date: "March 5, 2026",
      excerpt: "Join us for a free workshop on budgeting, saving, and building credit. Open to all community members.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Events Team"
    },
    {
      title: "Supporting Local Small Businesses",
      category: "Community",
      date: "February 28, 2026",
      excerpt: "We've partnered with 50 local businesses to provide special financing and mentorship programs.",
      image: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Community Relations"
    },
    {
      title: "Oldspring Trust Named 'Best Regional Bank'",
      category: "Press Releases",
      date: "February 20, 2026",
      excerpt: "We're honored to receive the Best Regional Bank award for our commitment to customer service.",
      image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "James Mitchell"
    },
    {
      title: "Annual Customer Appreciation Day",
      category: "Events",
      date: "February 15, 2026",
      excerpt: "Save the date! Join us for food, fun, and exclusive offers as we thank our valued customers.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Events Team"
    }
  ]

  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.category === activeCategory)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-deep-teal to-sage py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">News & Events</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Stay up to date with the latest news, announcements, and events from Oldspring Trust.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-deep-teal text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 hover:text-soft-gold hover:shadow-md'
                    }`}
                  >
                    {category === 'all' ? 'All News' : category}
                  </button>
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={0.1 * (index + 1)}>
                  <Link href={`/news/${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-soft-gold text-deep-teal text-xs font-bold px-3 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.author}</span>
                        </div>
                        <h3 className="text-xl font-bold text-deep-teal mb-3 hover:text-soft-gold transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {item.excerpt}
                        </p>
                        <span className="text-soft-gold font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <p className="text-center text-gray-500 py-12">No news in this category at the moment.</p>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-soft-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="zoomIn">
              <h2 className="text-3xl font-bold text-deep-teal mb-4">Stay Updated</h2>
              <p className="text-gray-600 mb-8">
                Subscribe to our newsletter for the latest news, events, and financial tips.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-deep-teal to-sage text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
