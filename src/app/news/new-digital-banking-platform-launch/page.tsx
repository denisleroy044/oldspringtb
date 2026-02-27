import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function DigitalBankingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Digital Banking App"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-soft-gold text-deep-teal text-sm font-bold px-4 py-1 rounded-full">Company News</span>
                <span className="text-white/80">March 10, 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">New Digital Banking Platform Launch</h1>
              <p className="text-xl text-white/90 max-w-2xl">By Michael Chen, Chief Technology Officer</p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience banking reimagined with our new mobile app featuring enhanced security and intuitive design. 
                Today, Oldspring Trust is proud to announce the launch of our completely redesigned digital banking platform.
              </p>

              <p className="text-gray-600 mb-6">
                After months of development and customer feedback, we're excited to introduce a banking experience 
                that puts you in control. Our new platform combines cutting-edge security with an intuitive interface 
                that makes managing your finances easier than ever.
              </p>

              <div className="my-12">
                <Image
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Person using mobile banking app"
                  width={1200}
                  height={600}
                  className="rounded-2xl shadow-xl"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Customer testing our new mobile app</p>
              </div>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">New Features Include:</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li className="mb-2">Biometric login (fingerprint and facial recognition)</li>
                <li className="mb-2">Real-time spending insights and categorization</li>
                <li className="mb-2">Instant peer-to-peer payments</li>
                <li className="mb-2">Customizable alerts and notifications</li>
                <li className="mb-2">Digital card management (freeze, unfreeze, replace)</li>
                <li className="mb-2">Budgeting tools and savings goals</li>
              </ul>

              <h2 className="text-2xl font-bold text-deep-teal mb-4">Enhanced Security</h2>
              <p className="text-gray-600 mb-6">
                Security remains our top priority. The new platform includes multi-factor authentication, 
                end-to-end encryption, and real-time fraud monitoring to keep your information and money safe.
              </p>

              <div className="bg-soft-white rounded-2xl p-8 my-12">
                <h3 className="text-xl font-bold text-deep-teal mb-4">Customer Early Access</h3>
                <p className="text-gray-600 mb-4">
                  The new platform is rolling out to customers gradually. You'll receive a notification 
                  when your account is upgraded. In the meantime, you can still access all your accounts 
                  through our current app and online banking.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-soft-gold text-deep-teal px-6 py-3 rounded-lg font-medium hover:bg-deep-teal hover:text-white transition-all duration-300"
                >
                  Learn More About the Upgrade
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
