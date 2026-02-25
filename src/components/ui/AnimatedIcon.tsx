'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface AnimatedIconProps {
  src: string
  alt: string
  size?: number
  className?: string
  glowColor?: string
  hoverEffect?: 'float' | 'scale' | 'tilt' | 'glow'
}

export function AnimatedIcon({ 
  src, 
  alt, 
  size = 320, 
  className = '',
  glowColor = 'rgba(59, 130, 246, 0.25)',
  hoverEffect = 'float'
}: AnimatedIconProps) {
  
  const getHoverAnimation = () => {
    switch(hoverEffect) {
      case 'float':
        return {
          scale: 1.1,
          y: -15,
          rotate: 2,
          filter: `drop-shadow(0 20px 25px ${glowColor})`
        }
      case 'scale':
        return {
          scale: 1.15,
          filter: `drop-shadow(0 20px 25px ${glowColor})`
        }
      case 'tilt':
        return {
          scale: 1.1,
          rotate: 5,
          filter: `drop-shadow(0 20px 25px ${glowColor})`
        }
      case 'glow':
        return {
          scale: 1.05,
          filter: `drop-shadow(0 0 30px ${glowColor})`
        }
      default:
        return {
          scale: 1.1,
          y: -15,
          filter: `drop-shadow(0 20px 25px ${glowColor})`
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={getHoverAnimation()}
      className={`cursor-pointer group ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="transition-all duration-500 ease-out w-full h-auto"
        priority
      />
    </motion.div>
  )
}
