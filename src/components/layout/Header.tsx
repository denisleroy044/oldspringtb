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
                      className="relative nav-item"
                      onMouseEnter={() => {
                        if (item.hasDropdown && item.dropdownId) {
                          handleMouseEnter(item.dropdownId, item.name)
                        }
                      }}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={item.href}
                        className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ease-out rounded-md overflow-hidden group ${
                          active 
                            ? 'text-soft-gold' 
                            : 'text-gray-700 hover:text-soft-gold'
                        }`}
                        onClick={(e) => {
                          if (item.hasDropdown) {
                            e.preventDefault()
                            if (activeDropdown === item.dropdownId) {
                              setActiveDropdown(null)
                              setHoveredItem(null)
                            } else if (item.dropdownId) {
                              setActiveDropdown(item.dropdownId)
                              setHoveredItem(item.name)
                            }
                          }
                        }}
                      >
                        <span className={`absolute inset-0 bg-soft-gold/10 transform transition-transform duration-300 ease-out ${
                          hoveredItem === item.name ? 'scale-100' : 'scale-0'
                        } rounded-md`}></span>
                        
                        <span className={`relative inline-block transition-transform duration-300 ${
                          hoveredItem === item.name ? 'scale-105 translate-y-[-1px]' : ''
                        }`}>
                          {item.name}
                        </span>

                        {active && !item.hasDropdown && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-soft-gold"></span>
                        )}
                        
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-soft-gold transform transition-transform duration-300 ease-out ${
                          activeDropdown === item.dropdownId ? 'scale-x-100' : 'scale-x-0'
                        }`}></span>
                      </Link>
                    </div>
                  )
                })}
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-0">
                <Link
                  href="/auth/login"
                  className="relative px-6 py-3 text-sm font-semibold text-white bg-deep-teal 
                             overflow-hidden group transition-all duration-300
                             border-0 rounded-none inline-block"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 
                                 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                    LOGIN
                  </span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="relative px-6 py-3 text-sm font-semibold text-white bg-sage 
                             overflow-hidden group transition-all duration-200
                             border-0 rounded-none inline-block"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 
                                 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
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
                  className="relative block w-full py-3 text-center font-semibold text-white bg-deep-teal 
                             overflow-hidden group rounded-none hover:bg-deep-teal/90 transition-all duration-200"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 
                                 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                    LOGIN
                  </span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="relative block w-full py-3 text-center font-semibold text-white bg-sage 
                             overflow-hidden group rounded-none hover:bg-sage/90 transition-all duration-200"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 
                                 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
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
          className="relative flex-1 py-5 text-center font-bold text-white bg-deep-teal 
                     overflow-hidden group transition-all duration-200
                     text-base tracking-wider rounded-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 
                         -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
            LOGIN
          </span>
        </Link>
        <Link
          href="/auth/signup"
          className="relative flex-1 py-5 text-center font-bold text-white bg-sage 
                     overflow-hidden group transition-all duration-200
                     text-base tracking-wider rounded-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 via-white/30 to-soft-gold/20 
                         -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
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
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  )
}
