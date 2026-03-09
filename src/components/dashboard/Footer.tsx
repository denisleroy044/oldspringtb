'use client'

import Link from 'next/link'

export function DashboardFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>© {currentYear} Oldspring Trust. All rights reserved.</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-xs">FSCS Protected</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-deep-teal transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-deep-teal transition-colors">
            Terms
          </Link>
          <Link href="/security" className="hover:text-deep-teal transition-colors">
            Security
          </Link>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-soft-gold rounded-full"></span>
            <span className="text-xs text-soft-gold">v2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
