import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function WellnessWorkshopPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Community Workshop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Events</span>
                <span className="text-white/80">March 5, 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Community Financial Wellness Workshop</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Events Team</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join us for a free workshop on budgeting, saving, and building credit. Open to all community members. 
                Learn practical financial skills from our experienced advisors in a friendly, supportive environment.
              </p>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white mb-12">
                <h2 className="text-2xl font-bold mb-4">Workshop Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold mb-1">📅 Date:</p>
                    <p className="text-white/90">Saturday, March 25, 2026</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">⏰ Time:</p>
                    <p className="text-white/90">10:00 AM - 2:00 PM</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">📍 Location:</p>
                    <p className="text-white/90">Oldspring Trust Community Room<br />100 Bishopsgate, London</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">💰 Cost:</p>
                    <p className="text-white/90">Free (includes lunch)</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">What You'll Learn</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Creating a realistic budget that works for you</li>
                <li className="mb-2">Strategies for building an emergency fund</li>
                <li className="mb-2">Understanding and improving your credit score</li>
                <li className="mb-2">Tips for paying down debt faster</li>
                <li className="mb-2">Introduction to investing for beginners</li>
                <li className="mb-2">Planning for major life events</li>
              </ul>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Previous workshop attendees"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Attendees at our previous financial workshop</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Meet Your Instructors</h2>
              <p className="text-gray-600 mb-6">
                Our workshop will be led by experienced financial advisors who are passionate about 
                helping community members achieve their financial goals. They'll be available throughout 
                the day for one-on-one questions.
              </p>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Reserve Your Spot</h3>
                <p className="text-gray-600 mb-6">
                  Spaces are limited to ensure a quality experience for all attendees. Reserve your spot today!
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-soft-gold text-deep-teal px-8 py-4 rounded-xl font-semibold hover:bg-deep-teal hover:text-white transition-all duration-300"
                >
                  Register for Free
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-12 pt-8">
              <Link
                href="/news"
                className="inline-flex items-center text-deep-teal hover:text-soft-gold font-medium transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to News
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
