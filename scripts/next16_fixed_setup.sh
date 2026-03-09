#!/bin/bash

# Complete Online Banking Platform Setup Script - Next.js 16 Compatible
# This script resolves the Tailwind CSS PostCSS plugin error for Next.js 16

set -e

echo "🚀 Complete Online Banking Platform Setup (Next.js 16 Compatible)"
echo "================================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️ $1${NC}"; }
print_header() { echo -e "${BLUE}📁 $1${NC}"; }
print_step() { echo -e "${BLUE}🔹 Step $1: $2${NC}"; }

# Check if we're in the right directory
if [ ! -d "src" ]; then
    print_info "Creating project structure..."
    mkdir -p src
fi

# ============================================
# PHASE 1: CREATE DIRECTORY STRUCTURE
# ============================================
print_step "1" "Creating directory structure"

# Function to create directory if it doesn't exist
create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        print_success "Created: $1"
    else
        print_info "Exists: $1"
    fi
}

# Create all necessary directories
create_dir "src/app"
create_dir "src/app/(marketing)"
create_dir "src/app/(auth)"
create_dir "src/app/(dashboard)"
create_dir "src/app/(admin)"
create_dir "src/components/ui"
create_dir "src/components/layout"
create_dir "src/components/marketing"
create_dir "src/components/dashboard"
create_dir "src/lib"
create_dir "src/providers"
create_dir "public/images"

print_success "Phase 1 complete: Directory structure created"
echo ""

# ============================================
# PHASE 2: PACKAGE.JSON WITH CORRECT DEPENDENCIES FOR NEXT.JS 16
# ============================================
print_step "2" "Creating package.json with Next.js 16 compatible dependencies"

cat > package.json << 'EOF'
{
  "name": "online-banking-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.477.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.2"
  },
  "devDependencies": {
    "@types/node": "^22.13.5",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "typescript": "^5.7.3",
    "@tailwindcss/postcss": "^4.0.9",
    "postcss": "^8.5.3"
  }
}
EOF
print_success "Created: package.json"

# ============================================
# PHASE 3: CORRECT TAILWIND CONFIGURATION FOR NEXT.JS 16
# ============================================
print_step "3" "Creating Tailwind CSS configuration"

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
EOF
print_success "Created: tailwind.config.js"

# ============================================
# PHASE 4: CORRECT POSTCSS CONFIGURATION FOR NEXT.JS 16
# ============================================
print_step "4" "Creating PostCSS configuration"

cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
EOF
print_success "Created: postcss.config.js"

# ============================================
# PHASE 5: TYPESCRIPT CONFIGURATION
# ============================================
print_step "5" "Creating TypeScript configuration"

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
print_success "Created: tsconfig.json"

# ============================================
# PHASE 5: NEXT.JS CONFIGURATION
# ============================================
print_step "5" "Creating Next.js configuration"

cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
}

module.exports = nextConfig
EOF
print_success "Created: next.config.js"

# ============================================
# PHASE 6: GLOBAL CSS
# ============================================
print_step "6" "Creating global CSS"

cat > src/app/globals.css << 'EOF'
@import 'tailwindcss';

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}
EOF
print_success "Created: src/app/globals.css"

# ============================================
# PHASE 7: UTILITY FUNCTIONS
# ============================================
print_step "7" "Creating utility functions"

cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF
print_success "Created: src/lib/utils.ts"

# ============================================
# PHASE 8: UI COMPONENTS
# ============================================
print_step "8" "Creating UI components"

# Button component
cat > src/components/ui/Button.tsx << 'EOF'
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-600",
      ghost: "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-600",
    }
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6 text-lg",
    }
    
    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
EOF
print_success "Created: src/components/ui/Button.tsx"

# Input component
cat > src/components/ui/Input.tsx << 'EOF'
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
EOF
print_success "Created: src/components/ui/Input.tsx"

# Card component
cat > src/components/ui/Card.tsx << 'EOF'
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
EOF
print_success "Created: src/components/ui/Card.tsx"

# ============================================
# PHASE 9: ROOT LAYOUT
# ============================================
print_step "9" "Creating root layout"

cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Wealth Management Bank",
  description: "Global Wealth Management - Building lasting relationships based on trust",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
EOF
print_success "Created: src/app/layout.tsx"

# ============================================
# PHASE 10: MARKETING LAYOUT
# ============================================
print_step "10" "Creating marketing layout"

# Marketing layout
cat > src/app/\(marketing\)/layout.tsx << 'EOF'
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              GWM Bank
            </Link>
            <div className="space-x-6">
              <Link href="/about" className="text-gray-700 hover:text-primary-600">About</Link>
              <Link href="/services" className="text-gray-700 hover:text-primary-600">Services</Link>
              <Link href="/wealth-management" className="text-gray-700 hover:text-primary-600">Wealth</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600">Contact</Link>
              <Link href="/login" className="text-primary-600 font-medium">Login</Link>
            </div>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Global Wealth Management © 2025. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
EOF
print_success "Created: src/app/(marketing)/layout.tsx"

# ============================================
# PHASE 11: HOMEPAGE
# ============================================
print_step "11" "Creating homepage"

cat > src/app/\(marketing\)/page.tsx << 'EOF'
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Global Wealth Management
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Welcome to Global Wealth Management
            </p>
            <p className="text-lg md:text-xl mb-12">
              We build lasting relationships based on trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="bg-white text-primary-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
                Internet Banking
              </Link>
              <Link href="/signup" className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10">
                Open an Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">10065000+</div>
              <div className="text-gray-600">Customer Accounts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">$83.7bn</div>
              <div className="text-gray-600">Assets under management</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">£71.2bn</div>
              <div className="text-gray-600">Assets under management</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">11300+</div>
              <div className="text-gray-600">Staff members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900">
            Welcome to Global Wealth Management
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              First, we are locally owned and managed. Decisions are made by people who know you, 
              and care about your needs. We are your neighbors. As a result, you gain from our 
              knowledgeable and responsive service and true understanding of what this community needs.
            </p>
            <p>
              If you want a bank where customers are known by name and made to feel welcome as soon 
              as they come in the door, we are the bank you're looking for. When one of our staff says, 
              "May I help you?" they really want to help you.
            </p>
            <p>
              Second, our mission is to help you attain financial success. At Global Wealth Management, 
              it begins with the customer, his or her wants and needs. All of a family's financial events, 
              from the household checking account to a home loan to retirement funds, will be as important 
              to the bank as they are to the family.
            </p>
          </div>
        </div>
      </section>

      {/* Personal Banking */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Personal Banking
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you want a current account, a loan, to save, invest or simply convenient payment solutions 
            via cards, your mobile phone or the internet, our Personal Banking products and services are designed 
            to suit your financial needs.
          </p>
          <Link href="/services" className="inline-block border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50">
            Learn more
          </Link>
        </div>
      </section>

      {/* Business Banking */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900">
            Business Banking
          </h2>
          <p className="text-lg text-gray-600 mb-6 text-center">
            Most of our managers and associates are ready to assist you with all of your business banking needs. 
            Each business is unique.
          </p>
          <p className="text-gray-600 mb-6 text-center">
            Whether you are a sole proprietor or a multi-million dollar company, all businesses have certain 
            financial challenges in common. Global Wealth Management offers a comprehensive range of products 
            to meet the financial services needs of your business.
          </p>
          <div className="text-center">
            <Link href="/services#business" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            About Global Wealth Management
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Global Wealth Management works tirelessly to provide consumers, corporations, governments and institutions 
            with a broad range of financial services and products. We strive to create the best outcomes for our 
            clients and customers with financial ingenuity that leads to solutions that are simple, creative and responsible.
          </p>
          <Link href="/about" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700">
            Learn More About Us
          </Link>
        </div>
      </section>
    </>
  );
}
EOF
print_success "Created: src/app/(marketing)/page.tsx"

# ============================================
# PHASE 12: ABOUT PAGE
# ============================================
print_step "12" "Creating about page"

cat > src/app/\(marketing\)/about/page.tsx << 'EOF'
export default function AboutPage() {
  return (
    <>
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Global Wealth Management</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Global Wealth Management works tirelessly to provide consumers, corporations, governments and institutions 
            with a broad range of financial services and products.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            Global Wealth Management Bank, which is one of the leading financial services institutions not only in 
            United States but it is known globally with subsidiaries that are market leaders in their respective 
            segments. Having successfully transformed to a retail and commercial banking-led group, Global Wealth 
            Management Bank expects to continue to distinguish itself by delivering exceptional services, while 
            enhancing the growth and achievement of the personal and business aspirations of our customers.
          </p>
          <p className="text-gray-600 mb-4">
            We deliver a comprehensive range of banking services along with highly personalized attention to our 
            clients, both individuals and businesses. Our mission is to help our clients achieve security, build 
            wealth and realize their dreams.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Attributes</h2>
          <p className="text-gray-600 mb-8">
            Global Wealth Management Bank has clearly distinguished itself in the bank industry through superior 
            service quality, unique customer experience, and sound financial indices. These have become part of 
            our corporate culture to the extent the bank is easily associated with the following attributes:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Best-in-class customer experience",
              "Creativity",
              "Excellent financial performance",
              "Good asset quality",
              "Stable management",
              "Dedicated and highly skilled work-force",
              "Cutting-edge Information and Communication Technology",
              "Efficient and effective distribution channels",
            ].map((attribute, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">{attribute}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
EOF
print_success "Created: src/app/(marketing)/about/page.tsx"

# ============================================
# PHASE 13: SERVICES PAGE
# ============================================
print_step "13" "Creating services page"

cat > src/app/\(marketing\)/services/page.tsx << 'EOF'
export default function ServicesPage() {
  const paymentMethods = [
    "PayPal", "AMERICAN EXPRESS", "MasterCard", "Visa", "Cirrus", "DISCOVER", "Maestro", "2CC", "amazon"
  ];

  return (
    <>
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Banking System</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive banking services and asset management across our eight-state footprint and national presence
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Banking Services</h2>
          <p className="text-gray-600 mb-4">
            For over the years now, Global Wealth Management Bank has delivered comprehensive banking services 
            and asset management across its eight-state footprint and national presence. The foundation of our 
            business is building and maintaining full-service relationships based on our long-standing commitment 
            to integrity and quality.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Payment Methods</h2>
          <p className="text-gray-600 mb-8">
            One of the most popular payment forms online are credit and debit cards. Besides them, there are also 
            alternative payment methods, such as bank transfers, electronic wallets, smart cards or bitcoin wallet.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                <span className="text-gray-700 font-medium">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
EOF
print_success "Created: src/app/(marketing)/services/page.tsx"

# ============================================
# PHASE 14: WEALTH MANAGEMENT PAGE
# ============================================
print_step "14" "Creating wealth management page"

cat > src/app/\(marketing\)/wealth-management/page.tsx << 'EOF'
export default function WealthManagementPage() {
  return (
    <>
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wealth Management</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Expert leadership that includes experienced and local executive officers, private bankers, branch managers, 
            and commercial relationship officers
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Wealth Management Services</h2>
          <p className="text-gray-600 mb-4">
            Global Wealth Management is flourishing with expert leadership that includes experienced and local 
            executive officers, private bankers, branch managers, and commercial relationship officers. This group 
            works closely with our board of local Baltimore business leaders to provide big-bank services in a 
            community bank atmosphere.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Approach</h2>
          <p className="text-gray-600 mb-4">
            The strategic objective of Global Wealth Management Bank also includes a continuous improvement of our 
            capacity to meet the customers' increasing and dynamic financial needs as well as sustain high quality 
            growth through investments that impact the quality of service to our existing and potential customers.
          </p>
        </div>
      </section>
    </>
  );
}
EOF
print_success "Created: src/app/(marketing)/wealth-management/page.tsx"

# ============================================
# PHASE 15: CONTACT PAGE
# ============================================
print_step "15" "Creating contact page"

cat > src/app/\(marketing\)/contact/page.tsx << 'EOF'
"use client";

import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you for your message. We'll get back to you soon!");
    }, 1000);
  };

  return (
    <>
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with our team for personalized assistance with your banking needs
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">+44-800-BANKING</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">ibanking@globalwealthbm.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-gray-600">12 Haslar Road, Gosport, Hampshire PO12, UK</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Hours</h3>
                  <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Sat: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
EOF
print_success "Created: src/app/(marketing)/contact/page.tsx"

# ============================================
# PHASE 16: AUTH LAYOUT
# ============================================
print_step "16" "Creating auth layout"

cat > src/app/\(auth\)/layout.tsx << 'EOF'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary-900">
            Global Wealth Management
          </h2>
        </div>
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
EOF
print_success "Created: src/app/(auth)/layout.tsx"

# ============================================
# PHASE 17: LOGIN PAGE
# ============================================
print_step "17" "Creating login page"

cat > src/app/\(auth\)/login/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="text-sm text-gray-600 mt-2">
          Or{" "}
          <Link href="/signup" className="text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue="demo@globalwealthbm.com"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            defaultValue="password123"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
EOF
print_success "Created: src/app/(auth)/login/page.tsx"

# ============================================
# PHASE 18: SIGNUP PAGE
# ============================================
print_step "18" "Creating signup page"

cat > src/app/\(auth\)/signup/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="text-sm text-gray-600 mt-2">
          Or{" "}
          <Link href="/login" className="text-primary-600 hover:text-primary-500">
            sign in to existing account
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
EOF
print_success "Created: src/app/(auth)/signup/page.tsx"

# ============================================
# PHASE 19: DASHBOARD LAYOUT
# ============================================
print_step "19" "Creating dashboard layout"

cat > src/app/\(dashboard\)/layout.tsx << 'EOF'
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-xl font-bold text-primary-600">
              GWM Bank
            </Link>
            <div className="space-x-4">
              <Link href="/profile" className="text-gray-700 hover:text-primary-600">Profile</Link>
              <Link href="/login" className="text-primary-600">Logout</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
EOF
print_success "Created: src/app/(dashboard)/layout.tsx"

# ============================================
# PHASE 20: DASHBOARD HOME
# ============================================
print_step "20" "Creating dashboard home"

cat > src/app/\(dashboard\)/dashboard/page.tsx << 'EOF'
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome back, Demo User
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-3xl font-bold text-gray-900">$755,300.00</p>
          <p className="text-xs text-gray-500 mt-1">Account Limit</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-3xl font-bold text-gray-900">$0.00</p>
          <p className="text-xs text-gray-500 mt-1">Monthly Deposits</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">All Time</p>
          <p className="text-3xl font-bold text-gray-900">$0.00</p>
          <p className="text-xs text-gray-500 mt-1">Total Volume</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Global Wealth Management Bank</h2>
          <p className="text-sm text-gray-600">Primary Account</p>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Account Holder:</p>
            <p className="font-medium">Demo User</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">USD Balance:</p>
            <p className="text-2xl font-bold">$755,300.00</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <p className="text-gray-600 text-center py-8">No recent transactions</p>
        </div>
      </div>
    </div>
  );
}
EOF
print_success "Created: src/app/(dashboard)/dashboard/page.tsx"

# ============================================
# PHASE 21: PROFILE PAGE
# ============================================
print_step "21" "Creating profile page"

cat > src/app/\(dashboard\)/profile/page.tsx << 'EOF'
export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Profile settings coming soon</p>
      </div>
    </div>
  );
}
EOF
print_success "Created: src/app/(dashboard)/profile/page.tsx"

# ============================================
# PHASE 22: ENVIRONMENT VARIABLES
# ============================================
print_step "22" "Creating environment variables"

cat > .env.local << 'EOF'
# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
print_success "Created: .env.local"

# ============================================
# PHASE 23: README
# ============================================
print_step "23" "Creating README"

cat > README.md << 'EOF'
# Global Wealth Management Bank

A modern online banking platform built with Next.js 16 and Tailwind CSS.

## Features

- 🏦 Marketing pages (Home, About, Services, Wealth Management, Contact)
- 🔐 Authentication (Login, Signup)
- 📊 User Dashboard
- 💳 Account Management

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript

## Getting Started

1. Install dependencies:
   ```bash
   npm install