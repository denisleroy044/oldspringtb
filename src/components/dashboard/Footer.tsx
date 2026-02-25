'use client'

import Link from 'next/link'

export function DashboardFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-[#e68a2e] rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">O</span>
              </div>
              <span className="text-sm font-semibold text-[#1e3a5f]">Oldspring Trust</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Federally insured by the FDIC. Member since 1945.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-xs text-gray-500 hover:text-[#1e3a5f] transition">Dashboard</Link></li>
              <li><Link href="/dashboard/transfer" className="text-xs text-gray-500 hover:text-[#1e3a5f] transition">Transfer Funds</Link></li>
              <li><Link href="/dashboard/deposit" className="text-xs text-gray-500 hover:text-[#1e3a5f] transition">Make a Deposit</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="tel:+1800BANKING" className="text-xs text-gray-500 hover:text-[#1e3a5f] transition">1-800-BANKING</a></li>
              <li><a href="mailto:support@oldspring.com" className="text-xs text-gray-500 hover:text-[#1e3a5f] transition">support@oldspring.com</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Security</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-xs text-gray-500">
                <svg className="w-3 h-3 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                256-bit Encryption
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            © {currentYear} Oldspring Trust Bank. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
