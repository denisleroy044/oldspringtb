'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  
  const pathname = usePathname()
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navItemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isHoveringDropdown = useRef(false)
  const isHoveringNavItem = useRef(false)

  const clearHoverTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleMouseEnter = (dropdownId: string, itemName: string) => {
    clearHoverTimeout()
    isHoveringNavItem.current = true
    setActiveDropdown(dropdownId)
    setHoveredItem(itemName)
  }

  const handleMouseLeave = () => {
    isHoveringNavItem.current = false
    if (!isHoveringDropdown.current) {
      clearHoverTimeout()
      timeoutRef.current = setTimeout(() => {
        if (!isHoveringDropdown.current && !isHoveringNavItem.current) {
          setActiveDropdown(null)
          setHoveredItem(null)
        }
      }, 200)
    }
  }

  const handleDropdownMouseEnter = () => {
    isHoveringDropdown.current = true
    clearHoverTimeout()
  }

  const handleDropdownMouseLeave = () => {
    isHoveringDropdown.current = false
    if (!isHoveringNavItem.current) {
      clearHoverTimeout()
      timeoutRef.current = setTimeout(() => {
        if (!isHoveringDropdown.current && !isHoveringNavItem.current) {
          setActiveDropdown(null)
          setHoveredItem(null)
        }
      }, 200)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      let isOutside = true
    
      navItemRefs.current.forEach((ref) => {
        if (ref && ref.contains(e.target as Node)) {
          isOutside = false
        }
      })
      
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        isOutside = false
      }
      
      if (isOutside) {
        setActiveDropdown(null)
        setHoveredItem(null)
        isHoveringDropdown.current = false
        isHoveringNavItem.current = false
        clearHoverTimeout()
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const navItems = [
    { name: 'HOME', href: '/', hasDropdown: false },
    { name: 'BANK', href: '/bank', hasDropdown: true, dropdownId: 'bank' },
    { name: 'SAVE', href: '/save', hasDropdown: true, dropdownId: 'save' },
    { name: 'BORROW', href: '/borrow', hasDropdown: true, dropdownId: 'borrow' },
    { name: 'WEALTH & RETIRE', href: '/invest', hasDropdown: true, dropdownId: 'invest' },
    { name: 'INSURANCE', href: '/insurance', hasDropdown: true, dropdownId: 'insurance' },
    { name: 'LEARN & PLAN', href: '/learn', hasDropdown: true, dropdownId: 'learn' },
    { name: 'PAYMENTS', href: '/payments', hasDropdown: true, dropdownId: 'payments' },
  ]

  // Dropdown content with 3D glass icons
  const dropdownContent = {
    bank: {
      title: 'Banking Solutions',
      description: 'Explore our comprehensive banking products',
      icon: '/images/3d/glassbank.png',
      sections: [
        {
          title: 'Personal Banking',
          links: [
            { name: 'Checking Accounts', href: '/bank/accounts', description: 'Everyday banking with no monthly fees', icon: '/images/3d/glassaccount.png' },
            { name: 'Savings Accounts', href: '/bank/savings', description: 'Grow your money with competitive rates', icon: '/images/3d/glasswallet.png' },
            { name: 'CDs & IRAs', href: '/bank/cds', description: 'Secure your retirement with fixed rates', icon: '/images/3d/glasssecure.png' },
          ]
        },
        {
          title: 'Digital Banking',
          links: [
            { name: 'Online Banking', href: '/bank/online-banking', description: 'Bank from anywhere, anytime', icon: '/images/3d/glassmobile.png' },
            { name: 'Mobile Banking', href: '/bank/mobile', description: 'Powerful banking in your pocket', icon: '/images/3d/glassmobilephone.png' },
            { name: 'Bill Pay', href: '/payments/bill-pay', description: 'Easy bill management', icon: '/images/3d/glasschecklist.png' },
          ]
        }
      ]
    },
    save: {
      title: 'Save for Your Future',
      description: 'Choose the right savings account',
      icon: '/images/3d/glasssecure.png',
      sections: [
        {
          title: 'Savings Accounts',
          links: [
            { name: 'High Yield Savings', href: '/save/high-yield', description: '3.75% APY - Maximize your returns', icon: '/images/3d/glassinvestment.png' },
            { name: 'Money Market', href: '/save/money-market', description: '2.75% APY - Flexible access', icon: '/images/3d/glassmoney.png' },
            { name: 'Certificates', href: '/save/certificates', description: '3.25% APY - Fixed term savings', icon: '/images/3d/glasscertificate.png' },
          ]
        },
        {
          title: 'Special Purpose',
          links: [
            { name: 'Holiday Club', href: '/save/holiday-club', description: 'Save for the holidays', icon: '/images/3d/glasschristmastree.png' },
            { name: 'Star Savings', href: '/save/star', description: '2.50% APY - For young savers', icon: '/images/3d/glassstar.png' },
            { name: 'Kids Club', href: '/save/kids-club', description: '2.00% APY - Teach kids to save', icon: '/images/3d/piggybank.png' },
          ]
        }
      ]
    },
    borrow: {
      title: 'Borrow with Confidence',
      description: 'Competitive rates and flexible terms',
      icon: '/images/3d/glasshandshake.png',
      sections: [
        {
          title: 'Personal Loans',
          links: [
            { name: 'Personal Loans', href: '/borrow/personal', description: 'Rates as low as 11.99% APR', icon: '/images/3d/glassmoney.png' },
            { name: 'Credit Cards', href: '/borrow/credit-cards', description: 'Rewards and low rates', icon: '/images/3d/glasscreditcard.png' },
            { name: 'Debt Consolidation', href: '/borrow/consolidation', description: 'Simplify your payments', icon: '/images/3d/glasschecklist.png' },
          ]
        },
        {
          title: 'Home & Auto',
          links: [
            { name: 'Auto Loans', href: '/borrow/auto', description: 'New & used - 5.89% APR', icon: '/images/3d/glasscar.png' },
            { name: 'Mortgages', href: '/borrow/mortgage', description: 'Purchase or refinance', icon: '/images/3d/glasshome.png' },
            { name: 'Home Equity', href: '/borrow/home-equity', description: 'Access your home value', icon: '/images/3d/glasskeys.png' },
          ]
        }
      ]
    },
    invest: {
      title: 'Wealth & Retirement',
      description: 'Plan for a secure financial future',
      icon: '/images/3d/glassinvestment.png',
      sections: [
        {
          title: 'Investment Services',
          links: [
            { name: 'Wealth Management', href: '/invest/wealth', description: 'Personalized investment strategies', icon: '/images/3d/glassadvisor.png' },
            { name: 'Investment Accounts', href: '/invest/accounts', description: 'Stocks, bonds & more', icon: '/images/3d/glassinvestment.png' },
            { name: 'Financial Advisors', href: '/invest/advisors', description: 'Expert guidance', icon: '/images/3d/glasshandshake.png' },
          ]
        },
        {
          title: 'Retirement Planning',
          links: [
            { name: 'Retirement Planning', href: '/invest/retirement', description: 'Plan your golden years', icon: '/images/3d/glassretire.png' },
            { name: 'IRAs', href: '/invest/iras', description: 'Traditional & Roth options', icon: '/images/3d/glasssecure.png' },
            { name: '401(k) Rollovers', href: '/invest/rollovers', description: 'Consolidate retirement funds', icon: '/images/3d/glassrollover.png' },
          ]
        }
      ]
    },
    insurance: {
      title: 'Protect What Matters',
      description: 'Comprehensive insurance solutions',
      icon: '/images/3d/glassshield.png',
      sections: [
        {
          title: 'Personal Insurance',
          links: [
            { name: 'Life Insurance', href: '/insurance/life', description: 'Protect your family', icon: '/images/3d/glassheart.png' },
            { name: 'Home Insurance', href: '/insurance/home', description: 'Safeguard your home', icon: '/images/3d/glasshome.png' },
            { name: 'Auto Insurance', href: '/insurance/auto', description: 'Coverage for your vehicle', icon: '/images/3d/glasscar.png' },
          ]
        },
        {
          title: 'Business Insurance',
          links: [
            { name: 'Business Insurance', href: '/insurance/business', description: 'Protect your company', icon: '/images/3d/glassbuilding.png' },
            { name: 'Liability Coverage', href: '/insurance/liability', description: 'General liability', icon: '/images/3d/glassshield.png' },
            { name: 'Workers Comp', href: '/insurance/workers-comp', description: 'Employee protection', icon: '/images/3d/glasspeople.png' },
          ]
        }
      ]
    },
    learn: {
      title: 'Learn & Plan',
      description: 'Financial education and tools',
      icon: '/images/3d/glassbook.png',
      sections: [
        {
          title: 'Education',
          links: [
            { name: 'Financial Education', href: '/learn/education', description: 'Articles & guides', icon: '/images/3d/glassbook.png' },
            { name: 'Blog', href: '/learn/blog', description: 'Latest insights', icon: '/images/3d/glassblog.png' },
            { name: 'Videos', href: '/learn/videos', description: 'Watch and learn', icon: '/images/3d/glassvideo.png' },
          ]
        },
        {
          title: 'Tools',
          links: [
            { name: 'Calculators', href: '/learn/calculators', description: 'Plan your finances', icon: '/images/3d/glasscalculator.png' },
            { name: 'Budget Planner', href: '/learn/budget', description: 'Create a budget', icon: '/images/3d/glasschecklist.png' },
            { name: 'Resources', href: '/learn/resources', description: 'Helpful tools', icon: '/images/3d/glassresources.png' },
          ]
        }
      ]
    },
    payments: {
      title: 'Payments & Transfers',
      description: 'Fast, secure ways to send money',
      icon: '/images/3d/glasspayment.png',
      sections: [
        {
          title: 'Send Money',
          links: [
            { name: 'Wire Transfers', href: '/payments/wire', description: 'Domestic & international', icon: '/images/3d/glasswire.png' },
            { name: 'Send Money', href: '/payments/send', description: 'Quick transfers', icon: '/images/3d/glasssend.png' },
            { name: 'International Payments', href: '/payments/international', description: 'Global transfers', icon: '/images/3d/glassglobal.png' },
          ]
        },
        {
          title: 'Manage Payments',
          links: [
            { name: 'Bill Pay', href: '/payments/bill-pay', description: 'Pay bills online', icon: '/images/3d/glassbill.png' },
            { name: 'Scheduled Payments', href: '/payments/scheduled', description: 'Set up recurring', icon: '/images/3d/glasscalendar.png' },
            { name: 'Payment History', href: '/payments/history', description: 'View transactions', icon: '/images/3d/glasshistory.png' },
          ]
        }
      ]
    },
  }

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="bg-soft-white shadow-sm sticky top-0 z-50">
        {/* Branch Hours Strip - Deep Teal */}
        <div className="bg-deep-teal text-white py-2 text-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <span className="font-semibold animate-pulse">Routing # 655205039</span>
              <span className="text-white/70 hidden sm:inline animate-pulse">|</span>
              <span className="text-white/90 hidden sm:inline animate-pulse">24/7 Customer Support</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/90">Mon-Fri: 8:30-6:00 | Sat: 9:00-1:00</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="border-b border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 lg:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <div className="relative w-32 h-10 lg:w-40 lg:h-12">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Oldspring Trust"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const active = isActiveLink(item.href)
                  
                  return (
                    <div
                      key={item.name}
                      ref={(el) => {
                        if (el) navItemRefs.current.set(item.name, el)
                        else navItemRefs.current.delete(item.name)
                      }}
                      className="relative"
                      onMouseEnter={() => {
                        if (item.hasDropdown && item.dropdownId) {
                          handleMouseEnter(item.dropdownId, item.name)
                        }
                      }}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={item.href}
                        className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-md inline-flex items-center ${
                          active 
                            ? 'text-soft-gold' 
                            : 'text-gray-700 hover:text-soft-gold'
                        }`}
                      >
                        <span className={`absolute inset-0 bg-soft-gold/10 transform transition-transform duration-300 rounded-md ${
                          hoveredItem === item.name ? 'scale-100' : 'scale-0'
                        }`}></span>
                        
                        <span className={`relative inline-block transition-transform duration-300 ${
                          hoveredItem === item.name ? 'scale-105' : ''
                        }`}>
                          {item.name}
                        </span>

                        {item.hasDropdown && (
                          <span className="ml-1 inline-block">
                            <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.dropdownId ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        )}
                      </Link>

                      {/* Beautiful Dropdown with Brand Colors */}
                      {item.hasDropdown && activeDropdown === item.dropdownId && (
                        <div
                          ref={dropdownRef}
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleDropdownMouseLeave}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-[750px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-[fadeInDropdown_0.3s_ease-out]"
                        >
                          {/* Header with Deep Teal gradient and burnt orange accent */}
                          <div className="bg-gradient-to-r from-deep-teal to-deep-teal/90 px-8 py-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-soft-gold/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-burnt-orange/10 rounded-full -ml-12 -mb-12"></div>
                            <div className="flex items-center space-x-4 relative z-10">
                              <div className="relative w-14 h-14">
                                <Image
                                  src={dropdownContent[item.dropdownId as keyof typeof dropdownContent].icon}
                                  alt={item.name}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-contain drop-shadow-xl"
                                />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                  {dropdownContent[item.dropdownId as keyof typeof dropdownContent].title}
                                </h3>
                                <p className="text-white/80 text-sm">
                                  {dropdownContent[item.dropdownId as keyof typeof dropdownContent].description}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Two-column Content Grid */}
                          <div className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                              {dropdownContent[item.dropdownId as keyof typeof dropdownContent].sections.map((section, idx) => (
                                <div key={idx}>
                                  <h4 className="text-xs font-semibold text-deep-teal uppercase tracking-wider mb-3">
                                    {section.title}
                                  </h4>
                                  <div className="space-y-2">
                                    {section.links.map((link) => (
                                      <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                                        onClick={() => {
                                          setActiveDropdown(null)
                                          setHoveredItem(null)
                                        }}
                                      >
                                        <div className="relative w-8 h-8 flex-shrink-0">
                                          <Image
                                            src={link.icon}
                                            alt={link.name}
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 group-hover:text-soft-gold transition-colors">
                                            {link.name}
                                          </p>
                                          <p className="text-xs text-gray-500 truncate">
                                            {link.description}
                                          </p>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-soft-gold group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Footer with Sage Green */}
                          <div className="bg-sage/5 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-gray-500">24/7 customer support</span>
                            <Link
                              href={item.href}
                              className="text-sm text-deep-teal hover:text-soft-gold font-medium inline-flex items-center group"
                              onClick={() => {
                                setActiveDropdown(null)
                                setHoveredItem(null)
                              }}
                            >
                              View all {item.name.toLowerCase()} options
                              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-0">
                <Link
                  href="/auth/login"
                  className="relative px-6 py-3 text-sm font-semibold text-white bg-deep-teal overflow-hidden group transition-all duration-300 inline-block"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                    LOGIN
                  </span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="relative px-6 py-3 text-sm font-semibold text-white bg-sage overflow-hidden group transition-all duration-200 inline-block"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                    OPEN ACCOUNT
                  </span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-soft-gold transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-soft-white border-t border-gray-200 animate-[slideDown_0.3s_ease-out]">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              {navItems.map((item, index) => {
                const active = isActiveLink(item.href)
                
                return (
                  <div
                    key={item.name}
                    className="animate-[fadeIn_0.3s_ease-out]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Link
                      href={item.href}
                      className={`block py-2 font-medium transition-all duration-300 hover:translate-x-2 ${
                        active ? 'text-soft-gold' : 'text-gray-700 hover:text-soft-gold'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </div>
                )
              })}
              <div className="pt-4 space-y-3">
                <Link
                  href="/auth/login"
                  className="relative block w-full py-3 text-center font-semibold text-white bg-deep-teal overflow-hidden group rounded-md hover:bg-deep-teal/90 transition-all duration-200"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                    LOGIN
                  </span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="relative block w-full py-3 text-center font-semibold text-white bg-sage overflow-hidden group rounded-md hover:bg-sage/90 transition-all duration-200"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                    OPEN ACCOUNT
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex w-full">
        <Link
          href="/auth/login"
          className="relative flex-1 py-5 text-center font-bold text-white bg-deep-teal overflow-hidden group transition-all duration-200 text-base tracking-wider rounded-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
            LOGIN
          </span>
        </Link>
        <Link
          href="/auth/signup"
          className="relative flex-1 py-5 text-center font-bold text-white bg-sage overflow-hidden group transition-all duration-200 text-base tracking-wider rounded-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
            OPEN ACCOUNT
          </span>
        </Link>
      </div>

      {/* Spacer for bottom bar on mobile */}
      <div className="lg:hidden h-14"></div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInDropdown {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  )
}
