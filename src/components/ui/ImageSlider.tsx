'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const images = [
  {
    url: '/images/slider/happy-family.jpg',
    alt: 'Happy family with financial advisor planning their future',
    caption: 'Building family wealth together'
  },
  {
    url: '/images/slider/business-professionals.jpg',
    alt: 'Business professionals discussing investment strategies',
    caption: 'Growing your business with confidence'
  },
  {
    url: '/images/slider/retired-couple.jpg',
    alt: 'Retired couple enjoying their golden years',
    caption: 'Retirement planning made simple'
  },
  {
    url: '/images/slider/investor.jpg',
    alt: 'Investor analyzing market trends',
    caption: 'Smart investments for lasting returns'
  },
  {
    url: '/images/slider/young-professional.jpg',
    alt: 'Young professional starting their financial journey',
    caption: 'Start your journey with us'
  },
  {
    url: '/images/slider/senior-couple.jpg',
    alt: 'Senior couple reviewing their savings',
    caption: 'Secure your future today'
  }
]

export function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/80 via-transparent to-transparent"></div>
          
          {/* Caption */}
          <div className="absolute bottom-20 left-0 right-0 text-center text-white z-20">
            <p className="text-2xl md:text-3xl font-light animate-fadeInUp">{image.caption}</p>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-soft-gold/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-soft-gold/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-10 bg-soft-gold' 
                : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
