import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function CustomerAppreciationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Customer Appreciation Event"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Events</span>
                <span className="text-white/80">February 15, 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">Annual Customer Appreciation Day</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Events Team</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Save the date! Join us for food, fun, and exclusive offers as we thank our valued customers. 
                Our annual Customer Appreciation Day is coming up, and we're pulling out all the stops.
              </p>

              <div className="bg-gradient-to-r from-deep-teal to-sage rounded-2xl p-8 text-white mb-12">
                <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold mb-1">📅 Date:</p>
                    <p className="text-white/90">Saturday, June 15, 2026</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">⏰ Time:</p>
                    <p className="text-white/90">11:00 AM - 4:00 PM</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">📍 Location:</p>
                    <p className="text-white/90">All Oldspring Trust Branches</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">💰 Cost:</p>
                    <p className="text-white/90">Free for all customers</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">What to Expect</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Free food and refreshments at all branches</li>
                <li className="mb-2">Exclusive customer-only offers and rates</li>
                <li className="mb-2">Prize drawings every hour</li>
                <li className="mb-2">Kids' activities and face painting</li>
                <li className="mb-2">Meet our branch teams and leadership</li>
                <li className="mb-2">Financial wellness consultations</li>
              </ul>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Previous customer appreciation event"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Families enjoying last year's event</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Special Offers</h2>
              <p className="text-gray-600 mb-6">
                Attendees will have access to exclusive rates and offers available only on Customer Appreciation Day:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">0.25% bonus rate on all savings accounts</li>
                <li className="mb-2">$200 cash bonus for new checking accounts</li>
                <li className="mb-2">Reduced rates on personal loans and mortgages</li>
                <li className="mb-2">Free first year on select credit cards</li>
                <li className="mb-2">Waived fees on wire transfers and other services</li>
              </ul>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">RSVP Today</h3>
                <p className="text-gray-600 mb-6">
                  Let us know you're coming! RSVP to receive a special gift at the event and help us plan for refreshments.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-soft-gold text-deep-teal px-8 py-4 rounded-xl font-semibold hover:bg-deep-teal hover:text-white transition-all duration-300"
                >
                  RSVP Now
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
