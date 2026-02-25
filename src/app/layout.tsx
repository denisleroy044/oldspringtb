import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import './globals.css'

// Properly configure Poppins with all weights
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Oldspring Trust Bank - Mobile Banking, Credit Cards, Mortgages',
  description: 'Mobile Banking, Credit Cards, Mortgages, Auto Loan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth`}>
      <body className="font-poppins antialiased bg-cream">
        <AuthProvider>
          {children}
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  )
}
