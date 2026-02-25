#!/bin/bash

# Complete Online Banking Platform Setup Script - FIXED VERSION
# This script resolves the Tailwind CSS PostCSS plugin error

set -e

echo "🚀 Complete Online Banking Platform Setup (FIXED)"
echo "=================================================="
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
# PHASE 2: PACKAGE.JSON WITH CORRECT DEPENDENCIES
# ============================================
print_step "2" "Creating package.json with correct dependencies"

cat > package.json << 'EOF'
{
  "name": "online-banking-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next-auth": "^4.24.5",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.303.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
EOF
print_success "Created: package.json"

# ============================================
# PHASE 3: CORRECT TAILWIND CONFIGURATION
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
# PHASE 4: CORRECT POSTCSS CONFIGURATION
# ============================================
print_step "4" "Creating PostCSS configuration"

cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
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
    "target": "es5",
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
# PHASE 6: NEXT.JS CONFIGURATION
# ============================================
print_step "6" "Creating Next.js configuration"

cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
EOF
print_success "Created: next.config.js"

# ============================================
# PHASE 7: GLOBAL CSS
# ============================================
print_step "7" "Creating global CSS"

cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}
EOF
print_success "Created: src/app/globals.css"

# ============================================
# PHASE 8: UTILITY FUNCTIONS
# ============================================
print_step "8" "Creating utility functions"

cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF
print_success "Created: src/lib/utils.ts"

# ============================================
# PHASE 9: UI COMPONENTS
# ============================================
print_step "9" "Creating UI components"

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
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
      ghost: "hover:bg-gray-100",
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
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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

# ============================================
# PHASE 10: ROOT LAYOUT AND PROVIDERS
# ============================================
print_step "10" "Creating root layout"

cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Global Wealth Management Bank",
  description: "Global Wealth Management - Building lasting relationships based on trust",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
EOF
print_success "Created: src/app/layout.tsx"

# ============================================
# PHASE 11: MARKETING LAYOUT AND HEADER
# ============================================
print_step "11" "Creating marketing layout"

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
            <Link href="/" className="text-2xl font-bold text-blue-600">
              GWM Bank
            </Link>
            <div className="space-x-6">
              <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600">Services</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
              <Link href="/login" className="text-blue-600 font-medium">Login</Link>
            </div>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Global Wealth Management © 2025</p>
        </div>
      </footer>
    </>
  );
}
EOF
print_success "Created: src/app/(marketing)/layout.tsx"

# ============================================
# PHASE 12: HOMEPAGE
# ============================================
print_step "12" "Creating homepage"

cat > src/app/\(marketing\)/page.tsx << 'EOF'
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Global Wealth Management</h1>
          <p className="text-xl mb-8">Welcome to Global Wealth Management</p>
          <p className="text-lg mb-8">We build lasting relationships based on trust.</p>
          <div className="space-x-4">
            <Link href="/login" className="bg-white text-blue-900 px-6 py-3 rounded-lg font-medium inline-block">
              Internet Banking
            </Link>
            <Link href="/signup" className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium inline-block">
              Open an Account
            </Link>
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
          <h2 className="text-3xl font-bold mb-6 text-center">Welcome to Global Wealth Management</h2>
          <p className="text-gray-600 mb-4">
            First, we are locally owned and managed. Decisions are made by people who know you, 
            and care about your needs. We are your neighbors.
          </p>
          <p className="text-gray-600">
            If you want a bank where customers are known by name and made to feel welcome as soon 
            as they come in the door, we are the bank you're looking for.
          </p>
        </div>
      </section>
    </>
  );
}
EOF
print_success "Created: src/app/(marketing)/page.tsx"

# ============================================
# PHASE 13: ABOUT PAGE
# ============================================
print_step "13" "Creating about page"

cat > src/app/\(marketing\)/about/page.tsx << 'EOF'
export default function AboutPage() {
  return (
    <>
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Global Wealth Management</h1>
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
            segments.
          </p>
          <p className="text-gray-600">
            We deliver a comprehensive range of banking services along with highly personalized attention to our 
            clients, both individuals and businesses.
          </p>
        </div>
      </section>
    </>
  );
}
EOF
print_success "Created: src/app/(marketing)/about/page.tsx"

# ============================================
# PHASE 14: AUTH PAGES
# ============================================
print_step "14" "Creating auth pages"

# Auth layout
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
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Global Wealth Management
          </h2>
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
EOF
print_success "Created: src/app/(auth)/layout.tsx"

# Login page
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
        <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
        <p className="text-sm text-gray-600 mt-2">
          Or{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-500">
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
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600"
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
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
EOF
print_success "Created: src/app/(auth)/login/page.tsx"

# Signup page
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
        <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
        <p className="text-sm text-gray-600 mt-2">
          Or{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600"
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600"
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
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600"
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
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50"
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
# PHASE 15: DASHBOARD LAYOUT
# ============================================
print_step "15" "Creating dashboard layout"

# Dashboard layout
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
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              GWM Bank
            </Link>
            <div className="space-x-4">
              <Link href="/profile" className="text-gray-700">Profile</Link>
              <Link href="/login" className="text-blue-600">Logout</Link>
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

# Dashboard home
cat > src/app/\(dashboard\)/dashboard/page.tsx << 'EOF'
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
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Monthly Deposits</p>
          <p className="text-3xl font-bold text-gray-900">$0.00</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Account Limit</p>
          <p className="text-3xl font-bold text-gray-900">$500,000.00</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <p className="text-gray-600 text-center py-8">No recent transactions</p>
      </div>
    </div>
  );
}
EOF
print_success "Created: src/app/(dashboard)/dashboard/page.tsx"

# Profile page
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
# PHASE 16: ENVIRONMENT VARIABLES
# ============================================
print_step "16" "Creating environment variables"

cat > .env.local << 'EOF'
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
EOF
print_success "Created: .env.local"

# ============================================
# PHASE 17: README
# ============================================
print_step "17" "Creating README"

cat > README.md << 'EOF'
# Global Wealth Management Bank

A modern online banking platform built with Next.js and Tailwind CSS.

## Features

- 🏦 Marketing pages (Home, About, Services, Contact)
- 🔐 Authentication (Login, Signup)
- 📊 User Dashboard
- 💳 Account Management
- 💸 Transfers & Payments

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- TypeScript

## Getting Started

1. Install dependencies:
   ```bash
   npm install