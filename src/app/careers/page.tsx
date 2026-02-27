'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const departments = ['all', 'Banking', 'Technology', 'Customer Service', 'Management', 'Finance']

  const jobs = [
    {
      title: "Personal Banker",
      department: "Banking",
      location: "London",
      type: "Full-time",
      description: "Provide exceptional customer service and financial solutions to our clients."
    },
    {
      title: "Software Engineer",
      department: "Technology",
      location: "London",
      type: "Full-time",
      description: "Build and maintain our digital banking platforms and mobile applications."
    },
    {
      title: "Customer Service Representative",
      department: "Customer Service",
      location: "Manchester",
      type: "Full-time",
      description: "Assist customers with their banking needs and resolve inquiries."
    },
    {
      title: "Branch Manager",
      department: "Management",
      location: "Birmingham",
      type: "Full-time",
      description: "Lead and manage branch operations while driving business growth."
    },
    {
      title: "Financial Analyst",
      department: "Finance",
      location: "London",
      type: "Full-time",
      description: "Analyze financial data and support strategic decision-making."
    },
    {
      title: "Teller",
      department: "Banking",
      location: "Liverpool",
      type: "Part-time",
      description: "Process transactions and provide excellent customer service."
    },
    {
      title: "UX/UI Designer",
      department: "Technology",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive and beautiful digital banking experiences."
    },
    {
      title: "Risk Manager",
      department: "Management",
      location: "London",
      type: "Full-time",
      description: "Identify and mitigate financial and operational risks."
    }
  ]

  const filteredJobs = selectedDepartment === 'all' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-deep-teal to-sage py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollAnimation animation="fadeInUp">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Join Our Team</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Build a rewarding career with Oldspring Trust and help us make a difference in people's financial lives.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <h2 className="text-4xl font-black text-deep-teal mb-12 text-center">Why Work With Us?</h2>
            </ScrollAnimation>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  title: "Growth Opportunities",
                  description: "Continuous learning and career advancement programs.",
                  icon: "/images/3d/glassbarchart.png",
                  alt: "Growth Opportunities"
                },
                {
                  title: "Great Benefits",
                  description: "Competitive salary, health insurance, and retirement plans.",
                  icon: "/images/3d/glassgreatbenefits.png",
                  alt: "Great Benefits"
                },
                {
                  title: "Work-Life Balance",
                  description: "Flexible schedules and remote work options.",
                  icon: "/images/3d/glassbalanced.png",
                  alt: "Work-Life Balance"
                },
                {
                  title: "Inclusive Culture",
                  description: "Diverse and welcoming environment for all.",
                  icon: "/images/3d/glasstrust.png",
                  alt: "Inclusive Culture"
                }
              ].map((item, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={0.1 * (index + 1)}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group">
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-soft-gold/20 rounded-full blur-2xl scale-75 group-hover:scale-110 transition-all duration-500"></div>
                      {/* 3D Glass Icon */}
                      <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                        <Image
                          src={item.icon}
                          alt={item.alt}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-deep-teal mb-2 group-hover:text-soft-gold transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Current Openings */}
        <section className="py-20 bg-soft-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation animation="fadeInUp">
              <h2 className="text-4xl font-black text-deep-teal mb-4 text-center">Current Openings</h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Join our team and help us deliver exceptional financial services to our customers.
              </p>
            </ScrollAnimation>

            {/* Department Filter */}
            <ScrollAnimation animation="fadeInUp" delay={0.1}>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedDepartment === dept
                        ? 'bg-deep-teal text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 hover:text-soft-gold hover:shadow-md'
                    }`}
                  >
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </button>
                ))}
              </div>
            </ScrollAnimation>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <ScrollAnimation key={index} animation="fadeInUp" delay={0.1 * (index + 1)}>
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-deep-teal mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="relative w-5 h-5 inline-block">
                              <Image
                                src="/images/3d/glasssecure.png"
                                alt="Department"
                                width={20}
                                height={20}
                                className="w-full h-full object-contain"
                              />
                            </span>
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="relative w-5 h-5 inline-block">
                              <Image
                                src="/images/3d/solidgoldlocation.png"
                                alt="Location"
                                width={20}
                                height={20}
                                className="w-full h-full object-contain"
                              />
                            </span>
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="relative w-5 h-5 inline-block">
                              <Image
                                src="/images/3d/solidgoldclock.png"
                                alt="Type"
                                width={20}
                                height={20}
                                className="w-full h-full object-contain"
                              />
                            </span>
                            {job.type}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">{job.description}</p>
                      </div>
                      <Link
                        href={`/careers/${job.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-soft-gold text-deep-teal px-6 py-2 rounded-lg font-medium hover:bg-deep-teal hover:text-white transition-all duration-300 whitespace-nowrap"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <p className="text-center text-gray-500 py-12">No openings in this department at the moment.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
