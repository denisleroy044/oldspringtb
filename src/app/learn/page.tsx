'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'starting-out', name: 'Starting Out' },
    { id: 'running-business', name: 'Running a Business' },
    { id: 'personal-finance', name: 'Personal Finance' },
    { id: 'retirement', name: 'Retirement' },
    { id: 'investing', name: 'Investing' },
  ]

  const featuredArticles = [
    {
      id: 1,
      title: "Tax Checklist: 5 Things to Remember",
      category: "Starting Out",
      categoryId: "starting-out",
      excerpt: "Tax season is quickly approaching—do you know what you need to claim, and what forms you need to submit? This tax checklist makes filing simple. Learn more today!",
      image: "/images/learn/tax-checklist-hero.jpg",
      link: "/learn/tax-checklist",
      alt: "Tax documents and calculator",
      date: "March 15, 2026",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "How Rising Rates and Inflation Impact Businesses",
      category: "Running a Business",
      categoryId: "running-business",
      excerpt: "Understanding the effects of economic changes on your business is crucial for long-term success. Learn how to navigate rising rates and inflation.",
      image: "/images/learn/inflation-business-hero.jpg",
      link: "/learn/inflation-business",
      alt: "Business and rising rates",
      date: "March 10, 2026",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "How to Manage Your Checking Account",
      category: "Starting Out",
      categoryId: "starting-out",
      excerpt: "Simple ways to manage a checking account effectively and avoid common pitfalls.",
      image: "/images/learn/manage-checking-hero.jpg",
      link: "/learn/manage-checking",
      alt: "Person managing checking account",
      date: "March 5, 2026",
      readTime: "4 min read"
    }
  ]

  const allArticles = [
    {
      id: 4,
      title: "How to Save for Summer Vacation",
      category: "Starting Out",
      categoryId: "starting-out",
      excerpt: "Tips and strategies to save for your dream summer vacation without breaking the bank.",
      image: "/images/learn/summer-vacation-hero.jpg",
      link: "/learn/save-vacation",
      alt: "Summer vacation savings",
      date: "February 28, 2026",
      readTime: "3 min read"
    },
    {
      id: 5,
      title: "First-Time Home Buyer's Guide",
      category: "Personal Finance",
      categoryId: "personal-finance",
      excerpt: "Everything you need to know about buying your first home, from mortgages to closing costs.",
      image: "/images/learn/home-buying-hero.jpg",
      link: "/learn/home-buying",
      alt: "First time home buyer",
      date: "February 20, 2026",
      readTime: "8 min read"
    },
    {
      id: 6,
      title: "Retirement Planning in Your 30s",
      category: "Retirement",
      categoryId: "retirement",
      excerpt: "Start planning for retirement early to maximize your savings and secure your future.",
      image: "/images/learn/retirement-30s-hero.jpg",
      link: "/learn/retirement-30s",
      alt: "Retirement planning",
      date: "February 15, 2026",
      readTime: "6 min read"
    },
    {
      id: 7,
      title: "Small Business Tax Deductions",
      category: "Running a Business",
      categoryId: "running-business",
      excerpt: "Maximize your tax savings with these commonly overlooked small business deductions.",
      image: "/images/learn/business-tax-hero.jpg",
      link: "/learn/business-tax",
      alt: "Business tax deductions",
      date: "February 10, 2026",
      readTime: "5 min read"
    },
    {
      id: 8,
      title: "Investing 101: Getting Started",
      category: "Investing",
      categoryId: "investing",
      excerpt: "New to investing? Learn the basics of stocks, bonds, and building a diversified portfolio.",
      image: "/images/learn/investing-101-hero.jpg",
      link: "/learn/investing-101",
      alt: "Investing basics",
      date: "February 5, 2026",
      readTime: "6 min read"
    },
    {
      id: 9,
      title: "Understanding Credit Scores",
      category: "Personal Finance",
      categoryId: "personal-finance",
      excerpt: "What affects your credit score and how to improve it for better loan terms.",
      image: "/images/learn/credit-scores-hero.jpg",
      link: "/learn/credit-scores",
      alt: "Credit score understanding",
      date: "January 28, 2026",
      readTime: "4 min read"
    },
    {
      id: 10,
      title: "Business Planning for Entrepreneurs",
      category: "Running a Business",
      categoryId: "running-business",
      excerpt: "Essential steps to create a solid business plan that attracts investors and guides growth.",
      image: "/images/learn/business-planning-hero.jpg",
      link: "/learn/business-planning",
      alt: "Business planning",
      date: "January 20, 2026",
      readTime: "7 min read"
    },
    {
      id: 11,
      title: "Teaching Kids About Money",
      category: "Starting Out",
      categoryId: "starting-out",
      excerpt: "Age-appropriate ways to teach children financial literacy and good money habits.",
      image: "/images/learn/kids-money-hero.jpg",
      link: "/learn/kids-money",
      alt: "Teaching kids about money",
      date: "January 15, 2026",
      readTime: "5 min read"
    },
    {
      id: 12,
      title: "Estate Planning Basics",
      category: "Retirement",
      categoryId: "retirement",
      excerpt: "Why everyone needs an estate plan and how to get started with wills and trusts.",
      image: "/images/learn/estate-planning-hero.jpg",
      link: "/learn/estate-planning",
      alt: "Estate planning",
      date: "January 8, 2026",
      readTime: "6 min read"
    }
  ]

  const filteredArticles = activeCategory === 'all' 
    ? allArticles 
    : allArticles.filter(article => article.categoryId === activeCategory)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-deep-teal to-sage py-20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Learn & Plan</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Educational resources to help you make informed financial decisions
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-16 bg-soft-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <h2 className="text-3xl font-bold text-deep-teal mb-12 text-center">Featured Articles</h2>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
              {featuredArticles.map((article, index) => (
                <ScrollAnimation key={article.id} animation="fadeInUp" delay={0.1 * (index + 1)}>
                  <Link href={article.link} className="group block h-full">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.03] h-full">
                      <div className="relative h-56 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Image
                          src={article.image}
                          alt={article.alt}
                          width={800}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-soft-gold text-deep-teal text-xs font-bold px-3 py-1 rounded-full">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <span>{article.date}</span>
                          <span className="mx-2">•</span>
                          <span>{article.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-deep-teal mb-3 group-hover:text-soft-gold transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="inline-flex items-center text-sage font-medium group-hover:text-soft-gold transition-colors">
                          <span>Read more</span>
                          <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* All Articles Section */}
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <h2 className="text-3xl font-bold text-deep-teal mb-8 text-center">All Articles</h2>
            </ScrollAnimation>

            {/* Category Filter */}
            <ScrollAnimation animation="fadeInUp" delay={0.1}>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-deep-teal text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 hover:text-deep-teal hover:shadow-md border border-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </ScrollAnimation>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              {filteredArticles.map((article, index) => (
                <ScrollAnimation key={article.id} animation="fadeInUp" delay={0.1 * (index % 3 + 1)}>
                  <Link href={article.link} className="group block h-full">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.alt}
                          width={600}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-soft-gold text-deep-teal text-xs font-bold px-2 py-1 rounded-full">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <span>{article.date}</span>
                          <span className="mx-2">•</span>
                          <span>{article.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold text-deep-teal mb-2 group-hover:text-soft-gold transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="inline-flex items-center text-sage text-sm font-medium group-hover:text-soft-gold transition-colors">
                          <span>Read more</span>
                          <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>

            {/* No Results */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found in this category.</p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="mt-4 text-deep-teal hover:text-soft-gold font-medium transition-colors"
                >
                  View all articles
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredArticles.length > 0 && (
              <div className="text-center mt-12">
                <button className="inline-flex items-center bg-white border-2 border-deep-teal text-deep-teal px-8 py-3 rounded-xl font-semibold hover:bg-deep-teal hover:text-white transition-all duration-300 group">
                  <span>Load More Articles</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-gradient-to-r from-deep-teal to-sage">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="zoomIn">
              <h2 className="text-3xl font-bold text-white mb-4">Stay Informed</h2>
              <p className="text-white/90 mb-8 text-lg">
                Subscribe to our newsletter for the latest financial tips and articles
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-soft-gold transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-soft-gold text-deep-teal font-semibold rounded-xl hover:bg-white hover:text-deep-teal transition-all duration-300 transform hover:scale-105"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-white/70 text-sm mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Topics Section */}
        <section className="py-16 bg-soft-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <h2 className="text-3xl font-bold text-deep-teal mb-12 text-center">Popular Topics</h2>
            </ScrollAnimation>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.filter(c => c.id !== 'all').map((category, index) => (
                <ScrollAnimation key={category.id} animation="fadeInUp" delay={0.1 * index}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className="w-full bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-deep-teal/10 to-sage/10 rounded-full flex items-center justify-center group-hover:from-deep-teal/20 group-hover:to-sage/20 transition-colors">
                      <span className="text-2xl">
                        {category.id === 'starting-out' && '🌱'}
                        {category.id === 'running-business' && '💼'}
                        {category.id === 'personal-finance' && '💰'}
                        {category.id === 'retirement' && '🏖️'}
                        {category.id === 'investing' && '📈'}
                      </span>
                    </div>
                    <h3 className="font-medium text-deep-teal text-sm">{category.name}</h3>
                  </button>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Need Help Section */}
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-deep-teal mb-4">Need Personalized Help?</h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    Our financial specialists are here to help you create a personalized plan for your goals.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-soft-gold text-xl">✓</span>
                      </div>
                      <span className="text-gray-700">Free consultation with a financial advisor</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-soft-gold text-xl">✓</span>
                      </div>
                      <span className="text-gray-700">Personalized financial planning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-soft-gold text-xl">✓</span>
                      </div>
                      <span className="text-gray-700">Retirement and investment strategies</span>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href="/contact"
                      className="bg-deep-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-soft-gold transition-all duration-300"
                    >
                      Schedule a Consultation
                    </Link>
                    <Link
                      href="/appointments"
                      className="border-2 border-deep-teal text-deep-teal px-6 py-3 rounded-lg font-semibold hover:bg-deep-teal hover:text-white transition-all duration-300"
                    >
                      Find a Branch
                    </Link>
                  </div>
                </div>
                <div className="relative h-64 md:h-96">
                  <Image
                    src="/images/learn/financial-advisor-client.jpg"
                    alt="Financial advisor helping client"
                    width={600}
                    height={400}
                    className="rounded-xl object-cover w-full h-full shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
