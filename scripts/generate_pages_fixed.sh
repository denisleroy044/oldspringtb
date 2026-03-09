#!/bin/bash

# Fixed Page Generation Script for Online Banking Platform
# This script creates all pages based on Global Wealth Management Bank design

set -e

echo "🎨 Generating Online Banking Platform Pages (Fixed Version)"
echo "============================================================"

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

# Check if we're in the right directory
if [ ! -d "src" ]; then
    print_error "Please run this script from the project root directory"
    print_info "Make sure you have the project structure with src/ folder"
    exit 1
fi

# Create necessary directories if they don't exist
print_info "Creating directory structure..."

mkdir -p src/app/\(marketing\)
mkdir -p src/app/\(auth\)
mkdir -p src/app/\(dashboard\)
mkdir -p src/app/\(admin\)
mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/components/{ui,layout,marketing,dashboard,admin}
mkdir -p src/lib/{auth,db,utils}
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/providers

print_success "Directory structure created"

# ============================================
# LAYOUT COMPONENTS
# ============================================

print_header "Generating Layout Components..."

# Root Layout
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Global Wealth Management Bank",
    template: "%s | Global Wealth Management",
  },
  description: "Global Wealth Management - Building lasting relationships based on trust",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
EOF

# Global CSS
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
EOF

# Marketing Layout
cat > src/app/\(marketing\)/layout.tsx << 'EOF'
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
EOF

# Auth Layout
cat > src/app/\(auth\)/layout.tsx << 'EOF'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-blue-600 rounded-lg"></div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Global Wealth Management
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
EOF

# Dashboard Layout
cat > src/app/\(dashboard\)/layout.tsx << 'EOF'
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="lg:pl-72">
        <DashboardHeader />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
EOF

# Admin Layout
cat > src/app/\(admin\)/layout.tsx << 'EOF'
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-72">
        <AdminHeader />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
EOF

# ============================================
# LAYOUT COMPONENTS
# ============================================

print_header "Generating Layout Components..."

# Header Component
cat > src/components/layout/Header.tsx << 'EOF'
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Banking System", href: "/services" },
  { name: "Wealth Management", href: "/wealth-management" },
  { name: "Contact Us", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">GWM Bank</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-gray-700 hover:text-blue-600"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="outline" asChild>
              <Link href="/login">Internet Banking</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Open an Account</Link>
            </Button>
          </div>
          
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-3">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Internet Banking</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup">Open an Account</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
EOF

# Footer Component
cat > src/components/layout/Footer.tsx << 'EOF'
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-blue-500 rounded-lg"></div>
              <span className="text-xl font-bold">GWM Bank</span>
            </div>
            <p className="text-gray-400 text-sm">
              Global Wealth Management - Building lasting relationships based on trust.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white">Our Banking System</Link></li>
              <li><Link href="/wealth-management" className="hover:text-white">Wealth Management</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +44-800-BANKING</li>
              <li>📍 12 Haslar Road, Gosport</li>
              <li>📧 ibanking@globalwealthbm.com</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>Global Wealth Management © Copyright 2025. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
EOF

# Dashboard Sidebar
cat > src/components/layout/DashboardSidebar.tsx << 'EOF'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Send, 
  Repeat, 
  Landmark, 
  FileText,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: History },
  { name: "Cards", href: "/cards", icon: Wallet },
  { name: "Local Transfer", href: "/transfers/local", icon: Send },
  { name: "International", href: "/transfers/international", icon: Send },
  { name: "Deposit", href: "/deposit", icon: Landmark },
  { name: "Currency Swap", href: "/currency-swap", icon: Repeat },
  { name: "Loans", href: "/loans", icon: FileText },
  { name: "Grants", href: "/grants", icon: FileText },
  { name: "Tax Refund", href: "/tax-refund", icon: FileText },
  { name: "Settings", href: "/profile", icon: Settings },
  { name: "Support", href: "/support", icon: HelpCircle },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">GWM Bank</span>
            </Link>
          </div>
          
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-600"
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Dont Delete</p>
              <p className="text-xs text-gray-500">aoneloyal24@gmail.com</p>
            </div>
            <button
              onClick={() => signOut()}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# Dashboard Header
cat > src/components/layout/DashboardHeader.tsx << 'EOF'
"use client";

import { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";

export function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="lg:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Bell className="h-6 w-6" />
          </button>
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <span className="text-sm font-medium">DD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
EOF

# ============================================
# MARKETING PAGES
# ============================================

print_header "Generating Marketing Pages..."

# Homepage
cat > src/app/\(marketing\)/page.tsx << 'EOF'
import { Hero } from "@/components/marketing/Hero";
import { Stats } from "@/components/marketing/Stats";
import { Welcome } from "@/components/marketing/Welcome";
import { PersonalBanking } from "@/components/marketing/PersonalBanking";
import { BusinessBanking } from "@/components/marketing/BusinessBanking";
import { AboutPreview } from "@/components/marketing/AboutPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Welcome />
      <PersonalBanking />
      <BusinessBanking />
      <AboutPreview />
    </>
  );
}
EOF

# About Page
cat > src/app/\(marketing\)/about/page.tsx << 'EOF'
import { AboutHero } from "@/components/marketing/AboutHero";
import { AboutMission } from "@/components/marketing/AboutMission";
import { AboutValues } from "@/components/marketing/AboutValues";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMission />
      <AboutValues />
    </>
  );
}
EOF

# Services Page
cat > src/app/\(marketing\)/services/page.tsx << 'EOF'
import { ServicesHero } from "@/components/marketing/ServicesHero";
import { BankingServices } from "@/components/marketing/BankingServices";
import { PaymentMethods } from "@/components/marketing/PaymentMethods";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <BankingServices />
      <PaymentMethods />
    </>
  );
}
EOF

# Wealth Management Page
cat > src/app/\(marketing\)/wealth-management/page.tsx << 'EOF'
import { WealthHero } from "@/components/marketing/WealthHero";
import { WealthServices } from "@/components/marketing/WealthServices";
import { WealthApproach } from "@/components/marketing/WealthApproach";

export default function WealthManagementPage() {
  return (
    <>
      <WealthHero />
      <WealthServices />
      <WealthApproach />
    </>
  );
}
EOF

# Contact Page
cat > src/app/\(marketing\)/contact/page.tsx << 'EOF'
import { ContactHero } from "@/components/marketing/ContactHero";
import { ContactInfo } from "@/components/marketing/ContactInfo";
import { ContactForm } from "@/components/marketing/ContactForm";

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
    </>
  );
}
EOF

# ============================================
# MARKETING COMPONENTS
# ============================================

print_header "Generating Marketing Components..."

# Hero Component
cat > src/components/marketing/Hero.tsx << 'EOF'
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Global Wealth Management
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Welcome to Global Wealth Management
          </p>
          <p className="text-lg md:text-xl mb-12 text-blue-50">
            We build lasting relationships based on trust.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">
                Internet Banking
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link href="/signup">
                Open an Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# Stats Component
cat > src/components/marketing/Stats.tsx << 'EOF'
import { Users, TrendingUp, DollarSign, Briefcase } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10065000+",
    label: "Customer Accounts",
  },
  {
    icon: DollarSign,
    value: "$83.7bn",
    label: "Assets under management",
  },
  {
    icon: TrendingUp,
    value: "£71.2bn",
    label: "Assets under management",
  },
  {
    icon: Briefcase,
    value: "11300+",
    label: "Staff members",
  },
];

export function Stats() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
EOF

# Welcome Component
cat > src/components/marketing/Welcome.tsx << 'EOF'
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Welcome() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
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
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/about">
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# Personal Banking Component
cat > src/components/marketing/PersonalBanking.tsx << 'EOF'
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function PersonalBanking() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Personal Banking
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you want a current account, a loan, to save, invest or simply convenient payment solutions 
            via cards, your mobile phone or the internet, our Personal Banking products and services are designed 
            to suit your financial needs. With all you have to squeeze in your schedule, you can fit banking in 
            your pocket. We're excited to release a fresh design with the same great features and functionality. 
            Our Mobile Banking App lets you deposit checks in the carpool line or transfer funds at the checkout 
            counter.
          </p>
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/services">
              Learn more
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
EOF

# Business Banking Component
cat > src/components/marketing/BusinessBanking.tsx << 'EOF'
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function BusinessBanking() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
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
            to meet the financial services needs of your business. The Business Banking focuses on companies 
            and small and medium enterprises ("SMEs") with annual turnover.
          </p>
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/services#business">
                Learn more
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# About Preview Component
cat > src/components/marketing/AboutPreview.tsx << 'EOF'
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Award, Shield, Heart, Users } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "Striving to create the best outcomes for our clients",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "Doing business with integrity is simple",
  },
  {
    icon: Heart,
    title: "Community",
    description: "Locally owned and managed, we are your neighbors",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "Building lasting relationships based on trust",
  },
];

export function AboutPreview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            About Global Wealth Management
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Global Wealth Management works tirelessly to provide consumers, corporations, governments and institutions 
            with a broad range of financial services and products. We strive to create the best outcomes for our 
            clients and customers with financial ingenuity that leads to solutions that are simple, creative and responsible.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/about">
              Learn More About Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
EOF

# About Hero Component
cat > src/components/marketing/AboutHero.tsx << 'EOF'
export function AboutHero() {
  return (
    <section className="bg-blue-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Global Wealth Management</h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Global Wealth Management works tirelessly to provide consumers, corporations, governments and institutions 
          with a broad range of financial services and products.
        </p>
      </div>
    </section>
  );
}
EOF

# About Mission Component
cat > src/components/marketing/AboutMission.tsx << 'EOF'
export function AboutMission() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
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
          <p className="text-gray-600">
            Global Wealth Management Bank, recognize the significant accountability and inherent risks that an 
            entrepreneur takes to make his ideas and dreams a reality. It is for this reason that our mission is 
            to empower entrepreneurs to create wealth through provision of transformational financial solutions 
            that meet entrepreneurs needs and facilitate growth through convenience and choice.
          </p>
        </div>
      </div>
    </section>
  );
}
EOF

# About Values Component
cat > src/components/marketing/AboutValues.tsx << 'EOF'
const attributes = [
  "Best-in-class customer experience",
  "Creativity",
  "Excellent financial performance",
  "Good asset quality",
  "Stable management",
  "Dedicated and highly skilled work-force",
  "Cutting-edge Information and Communication Technology",
  "Efficient and effective distribution channels",
];

export function AboutValues() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Attributes</h2>
          <p className="text-gray-600 mb-8">
            Global Wealth Management Bank has clearly distinguished itself in the bank industry through superior 
            service quality, unique customer experience, and sound financial indices. These have become part of 
            our corporate culture to the extent the bank is easily associated with the following attributes:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributes.map((attribute, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">{attribute}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
EOF

# Services Hero Component
cat > src/components/marketing/ServicesHero.tsx << 'EOF'
export function ServicesHero() {
  return (
    <section className="bg-blue-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Banking System</h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Comprehensive banking services and asset management across our eight-state footprint and national presence
        </p>
      </div>
    </section>
  );
}
EOF

# Banking Services Component
cat > src/components/marketing/BankingServices.tsx << 'EOF'
export function BankingServices() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Banking Services</h2>
          <p className="text-gray-600 mb-4">
            For over the years now, Global Wealth Management Bank has delivered comprehensive banking services 
            and asset management across its eight-state footprint and national presence. The foundation of our 
            business is building and maintaining full-service relationships based on our long-standing commitment 
            to integrity and quality.
          </p>
          <p className="text-gray-600 mb-4">
            There's something special about working with others who are true experts in their field and who 
            genuinely want to see you succeed. We're focused on creating experiences for our customers they 
            can't find elsewhere.
          </p>
          <p className="text-gray-600">
            How we approach doing business with integrity is simple. We tell Global Wealth Management Bank 
            users to do the right thing, no matter what. Even if the right path is a harder one, we'll support you.
          </p>
        </div>
      </div>
    </section>
  );
}
EOF

# Payment Methods Component
cat > src/components/marketing/PaymentMethods.tsx << 'EOF'
const paymentMethods = [
  "PayPal",
  "AMERICAN EXPRESS",
  "MasterCard",
  "Visa",
  "Cirrus",
  "DISCOVER",
  "Maestro",
  "2CC",
  "amazon",
];

export function PaymentMethods() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Payment Methods</h2>
          <p className="text-gray-600 mb-8">
            One of the most popular payment forms online are credit and debit cards. Besides them, there are also 
            alternative payment methods, such as bank transfers, electronic wallets, smart cards or bitcoin wallet 
            (bitcoin is the most popular cryptocurrency). Payment methods could be classified into two areas, credit 
            payment systems and cash payment systems.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                <span className="text-gray-700 font-medium">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# Wealth Hero Component
cat > src/components/marketing/WealthHero.tsx << 'EOF'
export function WealthHero() {
  return (
    <section className="bg-blue-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Wealth Management</h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Expert leadership that includes experienced and local executive officers, private bankers, branch managers, 
          and commercial relationship officers
        </p>
      </div>
    </section>
  );
}
EOF

# Wealth Services Component
cat > src/components/marketing/WealthServices.tsx << 'EOF'
export function WealthServices() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Wealth Management Services</h2>
          <p className="text-gray-600 mb-4">
            Global Wealth Management is flourishing with expert leadership that includes experienced and local 
            executive officers, private bankers, branch managers, and commercial relationship officers. This group 
            works closely with our board of local Baltimore business leaders to provide big-bank services in a 
            community bank atmosphere.
          </p>
          <p className="text-gray-600 mb-4">
            We have the resources and technology to offer big bank like products and services, but are small enough 
            to know you by name. We take the time to learn about our customers' needs. Our rates are competitive 
            and you will always deal with your local banker.
          </p>
          <p className="text-gray-600">
            We service all our loans – you don't have to deal with far away 3rd party loan servicing. Whether your 
            business needs to refinance its building or buy equipment, or your daughter needs her first home mortgage, 
            we can get it done. We're never too busy to sit down with you and talk over a cup of coffee, at your place 
            or ours.
          </p>
        </div>
      </div>
    </section>
  );
}
EOF

# Wealth Approach Component
cat > src/components/marketing/WealthApproach.tsx << 'EOF'
export function WealthApproach() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Approach</h2>
          <p className="text-gray-600 mb-4">
            The strategic objective of Global Wealth Management Bank also includes a continuous improvement of our 
            capacity to meet the customers' increasing and dynamic financial needs as well as sustain high quality 
            growth through investments that impact the quality of service to our existing and potential customers, 
            constant upgrade of our ICT infrastructure, unwavering investment in training and re-training of our 
            people and regular reinforcing of our Customer Services delivery charter with regards to continually 
            changing customer needs.
          </p>
          <p className="text-gray-600 mb-4">
            Global Wealth Management Bank places high premium on the pivotal role of Exceptional Service Delivery 
            in our drive to consistently exceed expectations. The bank has in place a well-articulated strategy to 
            not only meet and surpass customer expectations but also ensure that plans are fine-tuned to address 
            the changing taste and sophistication of the customer.
          </p>
          <p className="text-gray-600">
            The underlying philosophy is for the bank to remain at all times, a Customer-centric institution with 
            a clear understanding of its market and environment.
          </p>
        </div>
      </div>
    </section>
  );
}
EOF

# Contact Hero Component
cat > src/components/marketing/ContactHero.tsx << 'EOF'
export function ContactHero() {
  return (
    <section className="bg-blue-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Get in touch with our team for personalized assistance with your banking needs
        </p>
      </div>
    </section>
  );
}
EOF

# Contact Info Component
cat > src/components/marketing/ContactInfo.tsx << 'EOF'
import { Phone, MapPin, Mail, Clock } from "lucide-react";

export function ContactInfo() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600">+44-800-BANKING</p>
            <p className="text-sm text-gray-500">24/7 Customer Support</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Visit Us</h3>
            <p className="text-gray-600">12 Haslar Road, Gosport</p>
            <p className="text-sm text-gray-500">Hampshire PO12, UK</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Email Us</h3>
            <p className="text-gray-600">ibanking@globalwealthbm.com</p>
            <p className="text-sm text-gray-500">support@globalwealthbm.com</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Working Hours</h3>
            <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM</p>
            <p className="text-sm text-gray-500">Sat: 10:00 AM - 2:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# Contact Form Component
cat > src/components/marketing/ContactForm.tsx << 'EOF'
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert("Thank you for your message. We'll get back to you soon!");
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} placeholder="Your message..." required />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
EOF

# ============================================
# UI COMPONENTS
# ============================================

print_header "Generating UI Components..."

# Button Component
cat > src/components/ui/Button.tsx << 'EOF'
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-100",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
EOF

# Input Component
cat > src/components/ui/Input.tsx << 'EOF'
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

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

# Label Component
cat > src/components/ui/Label.tsx << 'EOF'
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
EOF

# Textarea Component
cat > src/components/ui/Textarea.tsx << 'EOF'
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
EOF

# ============================================
# UTILITY FUNCTIONS
# ============================================

print_header "Generating Utility Functions..."

# Utils file
mkdir -p src/lib
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# ============================================
# PROVIDERS
# ============================================

print_header "Generating Providers..."

# Auth Provider
mkdir -p src/providers
cat > src/providers/index.tsx << 'EOF'
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
EOF

# ============================================
# AUTH PAGES
# ============================================

print_header "Generating Auth Pages..."

# Login Page
cat > src/app/\(auth\)/login/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="text-sm text-gray-600 mt-2">
          Or{" "}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
EOF

# Signup Page
cat > src/app/\(auth\)/signup/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const error = await res.json();
        setError(error.message || "Something went wrong");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="text-sm text-gray-600 mt-2">
          Or{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to existing account
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters long
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
EOF

# ============================================
# DASHBOARD PAGES
# ============================================

print_header "Generating Dashboard Pages..."

# Dashboard Home
cat > src/app/\(dashboard\)/dashboard/page.tsx << 'EOF'
"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome back, {session?.user?.firstName || "User"}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-2xl font-bold text-gray-900">$500,000.00</p>
          <p className="text-xs text-gray-500">Account Limit</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
          <p className="text-xs text-gray-500">Monthly Deposits</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">All Time</p>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
          <p className="text-xs text-gray-500">Total Volume</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Global Wealth Management Bank</h2>
          <p className="text-sm text-gray-600">Primary Account</p>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Account Holder:</p>
            <p className="font-medium">Dont Delete Account</p>
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

# Transactions Page
cat > src/app/\(dashboard\)/transactions/page.tsx << 'EOF'
"use client";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-center py-12">No transactions yet</p>
      </div>
    </div>
  );
}
EOF

# Cards Page
cat > src/app/\(dashboard\)/cards/page.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Plus, CreditCard } from "lucide-react";

export default function CardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Virtual Cards</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Card
        </Button>
      </div>
      
      <p className="text-gray-600">
        Secure virtual cards for online payments and subscriptions
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">ACTIVE CARDS</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">PENDING APPLICATIONS</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <CreditCard className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">No Cards Yet</h3>
        <p className="text-gray-600 mb-4">
          Get started by applying for your first virtual card. It only takes a few minutes!
        </p>
        <Button>Apply for Your First Card</Button>
      </div>
    </div>
  );
}
EOF

# Local Transfer Page
cat > src/app/\(dashboard\)/transfers/local/page.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function LocalTransferPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Local Transfer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Transfer</h2>
            
            <div className="space-y-4">
              <div>
                <Label>Select Beneficiary</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Add New</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  No saved beneficiaries. Add one to get started.
                </p>
              </div>
              
              <div>
                <Label>Amount</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2">$</span>
                  <Input className="pl-7" placeholder="0.00" />
                </div>
              </div>
              
              <Button className="w-full">Continue Transfer</Button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Need Assistance?</h2>
            <p className="text-gray-600 mb-2">Our expert support team is available</p>
            <p className="text-blue-600 font-medium">24/7 Live Support</p>
            <Button variant="outline" className="w-full mt-4">
              Start Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# International Transfer Page
cat > src/app/\(dashboard\)/transfers/international/page.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function InternationalTransferPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">International Transfer</h1>
      <p className="text-gray-600">Send money worldwide with multiple payment methods</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 cursor-pointer hover:border-blue-600 border-2">
          <h3 className="font-medium">Wire Transfer</h3>
          <p className="text-sm text-gray-600">Transfer funds directly to international bank accounts.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 cursor-pointer hover:border-blue-600 border-2">
          <h3 className="font-medium">PayPal</h3>
          <p className="text-sm text-gray-600">Transfer funds to your PayPal account.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 cursor-pointer hover:border-blue-600 border-2">
          <h3 className="font-medium">Cash App</h3>
          <p className="text-sm text-gray-600">Quick transfers to your Cash App account.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Cash App Withdrawal</h2>
        <p className="text-sm text-gray-600 mb-4">
          Withdrawals to Cash App are typically processed within 24 hours.
        </p>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-2">Select Balance to Use</p>
            <p>Fiat Balance: $755,300.00</p>
            <p>Bitcoin Balance: 0.00000000 BTC ≈ $0.00</p>
          </div>
          
          <div>
            <Label>Amount to Transfer</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2">$</span>
              <Input className="pl-7" placeholder="0.00" />
            </div>
          </div>
          
          <div>
            <Label>$Cashtag</Label>
            <Input className="mt-1" placeholder="Enter your $Cashtag" />
          </div>
          
          <div>
            <Label>Full Name</Label>
            <Input className="mt-1" placeholder="Enter your full name" />
          </div>
          
          <div>
            <Label>Transaction PIN</Label>
            <Input type="password" className="mt-1" placeholder="••••••" />
            <p className="text-xs text-gray-500 mt-1">
              This is your transaction PIN, not your login password
            </p>
          </div>
          
          <Button className="w-full">Continue to Transfer</Button>
        </div>
      </div>
    </div>
  );
}
EOF

# Deposit Page
cat > src/app/\(dashboard\)/deposit/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function DepositPage() {
  const [method, setMethod] = useState<"bank" | "bitcoin" | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Deposit Funds</h1>
      <p className="text-gray-600">Add money to your account securely</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setMethod("bank")}
          className={`bg-white rounded-lg shadow p-6 text-center ${
            method === "bank" ? "border-2 border-blue-600" : ""
          }`}
        >
          <h3 className="font-medium">Bank Transfer</h3>
        </button>
        <button
          onClick={() => setMethod("bitcoin")}
          className={`bg-white rounded-lg shadow p-6 text-center ${
            method === "bitcoin" ? "border-2 border-blue-600" : ""
          }`}
        >
          <h3 className="font-medium">Bitcoin</h3>
        </button>
      </div>
      
      {method && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Deposit Amount</h2>
          <div className="relative">
            <span className="absolute left-3 top-2">$</span>
            <Input className="pl-7" placeholder="0.00" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">$100</Button>
            <Button variant="outline" size="sm">$500</Button>
            <Button variant="outline" size="sm">$1000</Button>
            <Button variant="outline" size="sm">$5000</Button>
            <Button variant="outline" size="sm">$10000</Button>
          </div>
          <Button className="w-full mt-6">Continue to Deposit</Button>
        </div>
      )}
    </div>
  );
}
EOF

# Currency Swap Page
cat > src/app/\(dashboard\)/currency-swap/page.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CurrencySwapPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Currency Swap</h1>
      <p className="text-gray-600">Convert between USD and Bitcoin</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">USD Balance</p>
                <p className="text-xl font-bold">$755,300.00</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Bitcoin Balance</p>
                <p className="text-xl font-bold">0.00000000 BTC</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">From Currency</label>
                <select className="w-full p-2 border rounded-md">
                  <option>USD ($755,300.00)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">To Currency</label>
                <select className="w-full p-2 border rounded-md">
                  <option>BTC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2">$</span>
                  <Input className="pl-7" placeholder="0.00" />
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Current Exchange Rate: 1 BTC = $43,000.00 USD
              </p>
              
              <Button className="w-full">Swap Currencies</Button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-2">Exchange Rate</h3>
            <p className="text-2xl font-bold text-gray-900">$43,000.00</p>
            <p className="text-sm text-gray-600">1 BTC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# Loans Page
cat > src/app/\(dashboard\)/loans/page.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";

export default function LoansPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Loans</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-center py-12">Loan products coming soon</p>
      </div>
    </div>
  );
}
EOF

# Grants Page
cat > src/app/\(dashboard\)/grants/page.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";

export default function GrantsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Grant Applications</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6 text-center cursor-pointer hover:border-blue-600 border-2">
          <h3 className="font-medium">Apply as Individual</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center cursor-pointer hover:border-blue-600 border-2">
          <h3 className="font-medium">Apply as Company</h3>
        </div>
      </div>
    </div>
  );
}
EOF

# Tax Refund Page
cat > src/app/\(dashboard\)/tax-refund/page.tsx << 'EOF'
"use client";

export default function TaxRefundPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Tax Refund</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-center py-12">Tax refund services coming soon</p>
      </div>
    </div>
  );
}
EOF

# Profile Page
cat > src/app/\(dashboard\)/profile/page.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input value="Dont" readOnly className="mt-1" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value="Delete" readOnly className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input value="aoneloyal24@gmail.com" readOnly className="mt-1" />
          </div>
          <Button>Update Profile</Button>
        </div>
      </div>
    </div>
  );
}
EOF

# Support Page
cat > src/app/\(dashboard\)/support/page.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Support</h1>
      
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-lg font-semibold mb-4">Need Assistance?</h2>
        <p className="text-gray-600 mb-2">Our expert support team is available</p>
        <p className="text-blue-600 font-medium text-lg mb-4">24/7 Live Support</p>
        <Button size="lg">Start Live Chat</Button>
      </div>
    </div>
  );
}
EOF

# ============================================
# NEXT CONFIG
# ============================================

print_header "Generating Next.js Config..."

cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
EOF

# ============================================
# TAILWIND CONFIG
# ============================================

print_header "Generating Tailwind Config..."

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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

# ============================================
# POSTCSS CONFIG
# ============================================

cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# ============================================
# TYPESCRIPT CONFIG
# ============================================

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

# ============================================
# PACKAGE.JSON UPDATE
# ============================================

print_header "Updating package.json scripts..."

# Check if package.json exists, if not create it
if [ ! -f "package.json" ]; then
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
    "next": "14.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next-auth": "^4.24.5",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.292.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-label": "^2.0.2"
  },
  "devDependencies": {
    "@types/node": "^20.9.4",
    "@types/react": "^18.2.39",
    "@types/react-dom": "^18.2.17",
    "typescript": "^5.3.2",
    "tailwindcss": "^3.3.5",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
EOF
fi

# ============================================
# FINAL STEPS
# ============================================

print_success "All pages and components generated successfully!"

print_info "Generated files summary:"
echo "  📁 Layout Components: 5 files"
echo "  📁 Marketing Pages: 5 pages"
echo "  📁 Marketing Components: 15 components"
echo "  📁 Dashboard Pages: 10 pages"
echo "  📁 UI Components: 4 components"
echo "  📁 Auth Pages: 2 pages"
echo "  📁 Config Files: 4 files"
echo ""
echo "🎉 ==============================================="
echo "🎉 Page Generation Complete!"
echo "🎉 ==============================================="
echo ""
echo "Next steps:"
echo "  1. Install dependencies: npm install"
echo "  2. Run the development server: npm run dev"
echo "  3. Visit http://localhost:3000 to see the homepage"
echo "  4. Visit http://localhost:3000/login for the login page"
echo "  5. Visit http://localhost:3000/dashboard for the dashboard"
echo ""
echo "The design now matches the Global Wealth Management Bank website"
echo "with all the pages and components from your reference images!"
echo ""

exit 0
EOF

# Make the script executable
chmod +x scripts/generate_pages_fixed.sh

echo "✅ Fixed page generation script created at scripts/generate_pages_fixed.sh"
echo ""
echo "To run the script:"
echo "  cd online-banking-platform"
echo "  ./scripts/generate_pages_fixed.sh"
echo ""
echo "After generation:"
echo "  npm install"
echo "  npm run dev"