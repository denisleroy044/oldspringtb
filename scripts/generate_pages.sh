#!/bin/bash

# Online Banking Platform Page Generator
# This script generates all pages based on Global Wealth Management Bank design

set -e

echo "🎨 Generating Online Banking Platform Pages"
echo "============================================"

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
    exit 1
fi

print_info "Starting page generation..."

# ============================================
# MARKETING PAGES
# ============================================

print_header "Generating Marketing Pages..."

# Homepage
cat > src/app/(marketing)/page.tsx << 'EOF'
import { Hero } from "@/components/marketing/Hero";
import { Stats } from "@/components/marketing/Stats";
import { Welcome } from "@/components/marketing/Welcome";
import { PersonalBanking } from "@/components/marketing/PersonalBanking";
import { BusinessBanking } from "@/components/marketing/BusinessBanking";
import { AboutPreview } from "@/components/marketing/AboutPreview";
import { ContactSection } from "@/components/marketing/ContactSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Welcome />
      <PersonalBanking />
      <BusinessBanking />
      <AboutPreview />
      <ContactSection />
    </>
  );
}
EOF

# About Us Page
cat > src/app/(marketing)/about/page.tsx << 'EOF'
import { AboutHero } from "@/components/marketing/AboutHero";
import { AboutMission } from "@/components/marketing/AboutMission";
import { AboutValues } from "@/components/marketing/AboutValues";
import { AboutLeadership } from "@/components/marketing/AboutLeadership";
import { AboutStats } from "@/components/marketing/AboutStats";
import { ContactSection } from "@/components/marketing/ContactSection";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutStats />
      <AboutLeadership />
      <ContactSection />
    </>
  );
}
EOF

# Services Page
cat > src/app/(marketing)/services/page.tsx << 'EOF'
import { ServicesHero } from "@/components/marketing/ServicesHero";
import { PersonalBankingServices } from "@/components/marketing/PersonalBankingServices";
import { BusinessBankingServices } from "@/components/marketing/BusinessBankingServices";
import { WealthManagement } from "@/components/marketing/WealthManagement";
import { PaymentServices } from "@/components/marketing/PaymentServices";
import { ContactSection } from "@/components/marketing/ContactSection";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <PersonalBankingServices />
      <BusinessBankingServices />
      <WealthManagement />
      <PaymentServices />
      <ContactSection />
    </>
  );
}
EOF

# Wealth Management Page
cat > src/app/(marketing)/wealth-management/page.tsx << 'EOF'
import { WealthHero } from "@/components/marketing/WealthHero";
import { WealthServices } from "@/components/marketing/WealthServices";
import { WealthApproach } from "@/components/marketing/WealthApproach";
import { WealthTeam } from "@/components/marketing/WealthTeam";
import { WealthContact } from "@/components/marketing/WealthContact";

export default function WealthManagementPage() {
  return (
    <>
      <WealthHero />
      <WealthServices />
      <WealthApproach />
      <WealthTeam />
      <WealthContact />
    </>
  );
}
EOF

# Contact Page
cat > src/app/(marketing)/contact/page.tsx << 'EOF'
import { ContactHero } from "@/components/marketing/ContactHero";
import { ContactInfo } from "@/components/marketing/ContactInfo";
import { ContactForm } from "@/components/marketing/ContactForm";
import { ContactMap } from "@/components/marketing/ContactMap";
import { ContactBranches } from "@/components/marketing/ContactBranches";

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
      <ContactBranches />
    </>
  );
}
EOF

# Privacy Policy
cat > src/app/(marketing)/privacy/page.tsx << 'EOF'
import { PrivacyHero } from "@/components/marketing/PrivacyHero";
import { PrivacyContent } from "@/components/marketing/PrivacyContent";

export default function PrivacyPage() {
  return (
    <>
      <PrivacyHero />
      <PrivacyContent />
    </>
  );
}
EOF

# Terms of Service
cat > src/app/(marketing)/terms/page.tsx << 'EOF'
import { TermsHero } from "@/components/marketing/TermsHero";
import { TermsContent } from "@/components/marketing/TermsContent";

export default function TermsPage() {
  return (
    <>
      <TermsHero />
      <TermsContent />
    </>
  );
}
EOF

# Careers Page
cat > src/app/(marketing)/careers/page.tsx << 'EOF'
import { CareersHero } from "@/components/marketing/CareersHero";
import { CareersWhyJoin } from "@/components/marketing/CareersWhyJoin";
import { CareersBenefits } from "@/components/marketing/CareersBenefits";
import { CareersPositions } from "@/components/marketing/CareersPositions";
import { CareersCulture } from "@/components/marketing/CareersCulture";

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <CareersWhyJoin />
      <CareersBenefits />
      <CareersPositions />
      <CareersCulture />
    </>
  );
}
EOF

# Blog Page
cat > src/app/(marketing)/blog/page.tsx << 'EOF'
import { BlogHero } from "@/components/marketing/BlogHero";
import { BlogFeatured } from "@/components/marketing/BlogFeatured";
import { BlogList } from "@/components/marketing/BlogList";
import { BlogCategories } from "@/components/marketing/BlogCategories";
import { BlogNewsletter } from "@/components/marketing/BlogNewsletter";

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogFeatured />
      <BlogList />
      <BlogCategories />
      <BlogNewsletter />
    </>
  );
}
EOF

# Blog Post
cat > src/app/(marketing)/blog/[slug]/page.tsx << 'EOF'
import { BlogPostHero } from "@/components/marketing/BlogPostHero";
import { BlogPostContent } from "@/components/marketing/BlogPostContent";
import { BlogPostAuthor } from "@/components/marketing/BlogPostAuthor";
import { BlogPostRelated } from "@/components/marketing/BlogPostRelated";
import { BlogPostComments } from "@/components/marketing/BlogPostComments";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <BlogPostHero slug={params.slug} />
      <BlogPostContent slug={params.slug} />
      <BlogPostAuthor slug={params.slug} />
      <BlogPostRelated slug={params.slug} />
      <BlogPostComments slug={params.slug} />
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
    label: "staff members",
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
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function Welcome() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
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
            <div className="mt-8">
              <Button asChild>
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/bank-building.jpg"
              alt="Global Wealth Management Bank Building"
              fill
              className="object-cover"
            />
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
import { CreditCard, Smartphone, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Current Accounts",
    description: "Whether you want a current account, a loan, to save, invest or simply convenient payment solutions",
  },
  {
    icon: Smartphone,
    title: "Mobile Banking",
    description: "With all you have to squeeze in your schedule, you can fit banking in your pocket",
  },
  {
    icon: TrendingUp,
    title: "Savings & Investments",
    description: "Our Personal Banking products and services are designed to suit your financial needs",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "via cards, your mobile phone or the internet",
  },
];

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
            to suit your financial needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/services">
              Learn more about Personal Banking
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
import { Building2, Briefcase, Users, TrendingUp } from "lucide-react";

export function BusinessBanking() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="/images/business-banking.jpg"
              alt="Business Banking"
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Business Banking
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Most of our managers and associates are ready to assist you with all of your business banking needs. 
              Each business is unique.
            </p>
            <p className="text-gray-600 mb-6">
              Whether you are a sole proprietor or a multi-million dollar company, all businesses have certain 
              financial challenges in common. Global Wealth Management offers a comprehensive range of products 
              to meet the financial services needs of your business.
            </p>
            <p className="text-gray-600 mb-8">
              The Business Banking focuses on companies and small and medium enterprises ("SMEs") with annual turnover.
            </p>
            <Button size="lg" asChild>
              <Link href="/services#business">
                Explore Business Banking
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
    description: "Striving to create the best outcomes for our clients with financial ingenuity",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "Doing business with integrity is simple. We tell users to do the right thing",
  },
  {
    icon: Heart,
    title: "Community",
    description: "Locally owned and managed, we are your neighbors who care about your needs",
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

# Contact Section Component
cat > src/components/marketing/ContactSection.tsx << 'EOF'
import Link from "next/link";
import { Phone, MapPin, Mail, Clock } from "lucide-react";

export function ContactSection() {
  return (
    <section className="py-16 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-blue-200">+44-800-BANKING</p>
              <p className="text-blue-200">24/7 Customer Support</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-blue-200">12 Haslar Road, Gosport</p>
              <p className="text-blue-200">Hampshire PO12, UK</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-blue-200">ibanking@globalwealthbm.com</p>
              <p className="text-blue-200">support@globalwealthbm.com</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <Clock className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Working Hours</h3>
              <p className="text-blue-200">Mon-Fri: 9:00 AM - 6:00 PM</p>
              <p className="text-blue-200">Sat: 10:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# ============================================
# DASHBOARD PAGES
# ============================================

print_header "Generating Dashboard Pages..."

# Dashboard Home
cat > src/app/(dashboard)/dashboard/page.tsx << 'EOF'
"use client";

import { useSession } from "next-auth/react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AccountOverview } from "@/components/dashboard/AccountOverview";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { ActiveCards } from "@/components/dashboard/ActiveCards";
import { TransactionLimit } from "@/components/dashboard/TransactionLimit";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {session?.user?.firstName || "User"}
        </h1>
      </div>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AccountOverview />
          <RecentTransactions />
        </div>
        <div className="space-y-6">
          <PortfolioSummary />
          <TransactionLimit />
          <QuickActions />
          <ActiveCards />
        </div>
      </div>
    </div>
  );
}
EOF

# Transactions Page
cat > src/app/(dashboard)/transactions/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { TransactionFilters } from "@/components/dashboard/TransactionFilters";
import { TransactionStats } from "@/components/dashboard/TransactionStats";
import { ExportTransactions } from "@/components/dashboard/ExportTransactions";

export default function TransactionsPage() {
  const [filters, setFilters] = useState({});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <ExportTransactions />
      </div>
      
      <TransactionStats />
      <TransactionFilters onFilterChange={setFilters} />
      <TransactionList filters={filters} />
    </div>
  );
}
EOF

# Cards Page
cat > src/app/(dashboard)/cards/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { CardStats } from "@/components/dashboard/CardStats";
import { VirtualCardList } from "@/components/dashboard/VirtualCardList";
import { ApplyForCard } from "@/components/dashboard/ApplyForCard";
import { CardFeatures } from "@/components/dashboard/CardFeatures";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function CardsPage() {
  const [showApplyForm, setShowApplyForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Virtual Cards</h1>
        <Button onClick={() => setShowApplyForm(true)}>
          <Plus className="mr-2 h-5 w-5" />
          New Card
        </Button>
      </div>
      
      <p className="text-gray-600">
        Secure virtual cards for online payments and subscriptions
      </p>
      
      <CardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VirtualCardList />
        </div>
        <div>
          <CardFeatures />
        </div>
      </div>
      
      {showApplyForm && (
        <ApplyForCard onClose={() => setShowApplyForm(false)} />
      )}
    </div>
  );
}
EOF

# Local Transfer Page
cat > src/app/(dashboard)/transfers/local/page.tsx << 'EOF'
"use client";

import { LocalTransferForm } from "@/components/dashboard/LocalTransferForm";
import { SavedBeneficiaries } from "@/components/dashboard/SavedBeneficiaries";
import { TransferLimits } from "@/components/dashboard/TransferLimits";

export default function LocalTransferPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Local Transfer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LocalTransferForm />
        </div>
        <div className="space-y-6">
          <SavedBeneficiaries />
          <TransferLimits />
        </div>
      </div>
    </div>
  );
}
EOF

# International Transfer Page
cat > src/app/(dashboard)/transfers/international/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { InternationalTransferForm } from "@/components/dashboard/InternationalTransferForm";
import { TransferMethods } from "@/components/dashboard/TransferMethods";
import { ExchangeRate } from "@/components/dashboard/ExchangeRate";

export default function InternationalTransferPage() {
  const [selectedMethod, setSelectedMethod] = useState("wire");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">International Transfer</h1>
      <p className="text-gray-600">Send money worldwide with multiple payment methods</p>
      
      <TransferMethods onSelect={setSelectedMethod} selected={selectedMethod} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InternationalTransferForm method={selectedMethod} />
        </div>
        <div>
          <ExchangeRate />
        </div>
      </div>
    </div>
  );
}
EOF

# Deposit Page
cat > src/app/(dashboard)/deposit/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { DepositMethod } from "@/components/dashboard/DepositMethod";
import { DepositAmount } from "@/components/dashboard/DepositAmount";
import { DepositInstructions } from "@/components/dashboard/DepositInstructions";
import { DepositHistory } from "@/components/dashboard/DepositHistory";

export default function DepositPage() {
  const [method, setMethod] = useState<"bank" | "bitcoin" | null>(null);
  const [amount, setAmount] = useState<number>(0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Deposit Funds</h1>
      <p className="text-gray-600">Add money to your account securely</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DepositMethod onSelect={setMethod} selected={method} />
          {method && (
            <DepositAmount 
              method={method} 
              onAmountChange={setAmount}
              amount={amount}
            />
          )}
          {method && amount > 0 && (
            <DepositInstructions method={method} amount={amount} />
          )}
        </div>
        <div>
          <DepositHistory />
        </div>
      </div>
    </div>
  );
}
EOF

# Currency Swap Page
cat > src/app/(dashboard)/currency-swap/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { CurrencySwapForm } from "@/components/dashboard/CurrencySwapForm";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExchangeRateCard } from "@/components/dashboard/ExchangeRateCard";
import { SwapHistory } from "@/components/dashboard/SwapHistory";

export default function CurrencySwapPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Currency Swap</h1>
      <p className="text-gray-600">Convert between USD and Bitcoin</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <BalanceCard currency="USD" balance={755300} />
            <BalanceCard currency="BTC" balance={0} />
          </div>
          <CurrencySwapForm />
        </div>
        <div className="space-y-6">
          <ExchangeRateCard from="USD" to="BTC" rate={43000} />
          <SwapHistory />
        </div>
      </div>
    </div>
  );
}
EOF

# Loans Page
cat > src/app/(dashboard)/loans/page.tsx << 'EOF'
"use client";

import { LoanApplication } from "@/components/dashboard/LoanApplication";
import { LoanList } from "@/components/dashboard/LoanList";
import { LoanEligibility } from "@/components/dashboard/LoanEligibility";
import { LoanCalculator } from "@/components/dashboard/LoanCalculator";

export default function LoansPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Loans</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LoanApplication />
          <LoanList />
        </div>
        <div className="space-y-6">
          <LoanEligibility />
          <LoanCalculator />
        </div>
      </div>
    </div>
  );
}
EOF

# Grants Page
cat > src/app/(dashboard)/grants/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { GrantApplicationType } from "@/components/dashboard/GrantApplicationType";
import { IndividualGrantForm } from "@/components/dashboard/IndividualGrantForm";
import { CompanyGrantForm } from "@/components/dashboard/CompanyGrantForm";
import { GrantGuidelines } from "@/components/dashboard/GrantGuidelines";

export default function GrantsPage() {
  const [applicationType, setApplicationType] = useState<"individual" | "company" | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Grant Applications</h1>
      
      <GrantApplicationType onSelect={setApplicationType} selected={applicationType} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {applicationType === "individual" && <IndividualGrantForm />}
          {applicationType === "company" && <CompanyGrantForm />}
          {!applicationType && (
            <div className="bg-gray-50 p-12 text-center rounded-lg">
              <p className="text-gray-600">Please select an application type to continue</p>
            </div>
          )}
        </div>
        <div>
          <GrantGuidelines />
        </div>
      </div>
    </div>
  );
}
EOF

# Tax Refund Page
cat > src/app/(dashboard)/tax-refund/page.tsx << 'EOF'
"use client";

import { TaxRefundApplication } from "@/components/dashboard/TaxRefundApplication";
import { TaxRefundStatus } from "@/components/dashboard/TaxRefundStatus";
import { TaxDocuments } from "@/components/dashboard/TaxDocuments";
import { TaxCalculator } from "@/components/dashboard/TaxCalculator";

export default function TaxRefundPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Tax Refund</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TaxRefundApplication />
          <TaxRefundStatus />
        </div>
        <div className="space-y-6">
          <TaxDocuments />
          <TaxCalculator />
        </div>
      </div>
    </div>
  );
}
EOF

# Settings Page
cat > src/app/(dashboard)/profile/page.tsx << 'EOF'
"use client";

import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { SecuritySettings } from "@/components/dashboard/SecuritySettings";
import { NotificationSettings } from "@/components/dashboard/NotificationSettings";
import { PrivacySettings } from "@/components/dashboard/PrivacySettings";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
      
      <div className="space-y-6">
        <ProfileSettings />
        <SecuritySettings />
        <NotificationSettings />
        <PrivacySettings />
      </div>
    </div>
  );
}
EOF

# Support Page
cat > src/app/(dashboard)/support/page.tsx << 'EOF'
"use client";

import { LiveChat } from "@/components/dashboard/LiveChat";
import { SupportTickets } from "@/components/dashboard/SupportTickets";
import { FAQ } from "@/components/dashboard/FAQ";
import { ContactSupport } from "@/components/dashboard/ContactSupport";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Support</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LiveChat />
          <SupportTickets />
        </div>
        <div className="space-y-6">
          <FAQ />
          <ContactSupport />
        </div>
      </div>
    </div>
  );
}
EOF

# ============================================
# DASHBOARD COMPONENTS
# ============================================

print_header "Generating Dashboard Components..."

# Dashboard Stats Component
cat > src/components/dashboard/DashboardStats.tsx << 'EOF'
"use client";

import { Wallet, TrendingUp, Clock, DollarSign } from "lucide-react";

const stats = [
  {
    label: "Available",
    value: "$500,000.00",
    subtext: "Account Limit",
    icon: Wallet,
    color: "blue",
  },
  {
    label: "This Month",
    value: "$0.00",
    subtext: "Monthly Deposits",
    icon: TrendingUp,
    color: "green",
  },
  {
    label: "All Time",
    value: "$0.00",
    subtext: "Total Volume",
    icon: Clock,
    color: "purple",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = {
          blue: "bg-blue-100 text-blue-600",
          green: "bg-green-100 text-green-600",
          purple: "bg-purple-100 text-purple-600",
        };
        
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${colors[stat.color as keyof typeof colors]}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
EOF

# Account Overview Component
cat > src/components/dashboard/AccountOverview.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Send, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";

export function AccountOverview() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Global Wealth Management Bank</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Primary Account
        </span>
      </div>
      
      <div className="border-t border-b py-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Account Holder:</span>
          <span className="font-medium">Dont Delete</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Flat Balance Account:</span>
          <span className="text-xl font-bold text-gray-900">$755,300.00</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Account Active</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <span className="text-yellow-600">Verification Required</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-600">USD Balance</p>
          <p className="text-lg font-semibold">$755,300.00</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-600">1 BTC = $70,412</p>
          <p className="text-lg font-semibold">0.000000 BTC</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button className="flex-1">
          <Send className="mr-2 h-4 w-4" />
          Send Money
        </Button>
        <Button variant="outline" className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Money
        </Button>
      </div>
    </div>
  );
}
EOF

# Recent Transactions Component
cat > src/components/dashboard/RecentTransactions.tsx << 'EOF'
"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, ChevronRight } from "lucide-react";

const transactions = [
  {
    id: 1,
    type: "deposit",
    description: "Deposit from Bank Transfer",
    amount: "+$5,000.00",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    type: "transfer",
    description: "Transfer to John Smith",
    amount: "-$250.00",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: 3,
    type: "payment",
    description: "Netflix Subscription",
    amount: "-$15.99",
    date: "2024-01-13",
    status: "completed",
  },
];

export function RecentTransactions() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <Link href="/transactions" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
      
      <div className="divide-y">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'deposit' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {transaction.type === 'deposit' ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {transaction.amount}
                </p>
                <p className="text-xs text-green-600">Completed</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

# Portfolio Summary Component
cat > src/components/dashboard/PortfolioSummary.tsx << 'EOF'
"use client";

import { TrendingUp, DollarSign, Bitcoin } from "lucide-react";

export function PortfolioSummary() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Portfolio</h2>
      
      <div className="text-center mb-4">
        <p className="text-3xl font-bold text-gray-900">$755,300.00</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Bitcoin className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-gray-600">0.000000 BTC = $0.00</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">1 BTC = $70,412</p>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">USD Balance</span>
          <span className="font-medium">$755,300.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Bitcoin Balance</span>
          <span className="font-medium">0.000000 BTC</span>
        </div>
      </div>
    </div>
  );
}
EOF

# Quick Actions Component
cat > src/components/dashboard/QuickActions.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Send, CreditCard, FileText, HelpCircle } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto" asChild>
          <Link href="/transfers/local">
            <Send className="h-5 w-5 mb-2" />
            <span>Transfer</span>
          </Link>
        </Button>
        
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto" asChild>
          <Link href="/pay-bills">
            <CreditCard className="h-5 w-5 mb-2" />
            <span>Pay Bills</span>
          </Link>
        </Button>
        
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto" asChild>
          <Link href="/request">
            <FileText className="h-5 w-5 mb-2" />
            <span>Request</span>
          </Link>
        </Button>
        
        <Button variant="outline" className="flex flex-col items-center p-4 h-auto" asChild>
          <Link href="/profile">
            <HelpCircle className="h-5 w-5 mb-2" />
            <span>Bank Details</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
EOF

# Active Cards Component
cat > src/components/dashboard/ActiveCards.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { CreditCard, Plus } from "lucide-react";
import Link from "next/link";

export function ActiveCards() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Active Cards</h2>
      
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <p className="text-gray-600 mb-2">No active cards</p>
        <p className="text-sm text-gray-500 mb-4">
          Apply for a virtual card to get started with secure online payments.
        </p>
        <Button asChild>
          <Link href="/cards">
            <Plus className="mr-2 h-4 w-4" />
            Apply for Card
          </Link>
        </Button>
      </div>
    </div>
  );
}
EOF

# Transaction Limit Component
cat > src/components/dashboard/TransactionLimit.tsx << 'EOF'
"use client";

import { Progress } from "@/components/ui/Progress";

export function TransactionLimit() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">TRANSACTION LIMIT</span>
            <span className="font-medium">$500,000.00</span>
          </div>
          <Progress value={65} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">Daily limit available</p>
        </div>
      </div>
    </div>
  );
}
EOF

# Card Features Component
cat > src/components/dashboard/CardFeatures.tsx << 'EOF'
"use client";

import { Shield, Globe, Settings, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure",
    description: "Protected payments",
  },
  {
    icon: Globe,
    title: "Global",
    description: "Worldwide acceptance",
  },
  {
    icon: Settings,
    title: "Control",
    description: "Spending limits",
  },
  {
    icon: Zap,
    title: "Instant",
    description: "Quick issuance",
  },
];

export function CardFeatures() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Virtual Cards Made Easy</h2>
      <p className="text-sm text-gray-600 mb-4">
        Create virtual cards for secure online payments, subscription management, and more. Enhanced security and spending control.
      </p>
      
      <div className="space-y-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{feature.title}</p>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
EOF

# Card Stats Component
cat > src/components/dashboard/CardStats.tsx << 'EOF'
"use client";

import { CreditCard, Clock } from "lucide-react";

export function CardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">ACTIVE CARDS</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">PENDING APPLICATIONS</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# Virtual Card List Component
cat > src/components/dashboard/VirtualCardList.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function VirtualCardList() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Cards</h2>
      
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <CreditCard className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Cards Yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Get started by applying for your first virtual card. It only takes a few minutes!
        </p>
        <Button size="lg" asChild>
          <Link href="/cards/apply">
            <Plus className="mr-2 h-5 w-5" />
            Apply for Your First Card
          </Link>
        </Button>
      </div>
    </div>
  );
}
EOF

# Local Transfer Form Component
cat > src/components/dashboard/LocalTransferForm.tsx << 'EOF'
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { AlertCircle } from "lucide-react";

export function LocalTransferForm() {
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Transfer</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="beneficiary">Select Beneficiary</Label>
          <Select
            id="beneficiary"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          >
            <option value="">Add New</option>
            <option value="john">John Smith</option>
            <option value="jane">Jane Doe</option>
          </Select>
          {!beneficiary && (
            <p className="text-sm text-gray-500 mt-2">No saved beneficiaries. Add one to get started.</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="amount"
              type="number"
              className="pl-7"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment description"
          />
        </div>
        
        <Button className="w-full" disabled={!beneficiary || !amount}>
          Continue Transfer
        </Button>
      </div>
    </div>
  );
}
EOF

# International Transfer Form Component
cat > src/components/dashboard/InternationalTransferForm.tsx << 'EOF'
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AlertCircle } from "lucide-react";

interface InternationalTransferFormProps {
  method: string;
}

export function InternationalTransferForm({ method }: InternationalTransferFormProps) {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [pin, setPin] = useState("");
  const [note, setNote] = useState("");

  const renderMethodFields = () => {
    switch (method) {
      case "paypal":
        return (
          <>
            <div>
              <Label htmlFor="email">PayPal Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter PayPal email address"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please ensure this is the email address associated with your PayPal account
              </p>
            </div>
          </>
        );
      
      case "cashapp":
        return (
          <>
            <div>
              <Label htmlFor="cashtag">$Cashtag</Label>
              <Input
                id="cashtag"
                placeholder="Enter your $Cashtag"
              />
            </div>
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                placeholder="Enter your full name"
              />
            </div>
          </>
        );
      
      case "crypto":
        return (
          <>
            <div>
              <Label htmlFor="crypto">Cryptocurrency</Label>
              <Select id="crypto" defaultValue="btc">
                <option value="btc">Bitcoin (BTC)</option>
                <option value="eth">Ethereum (ETH)</option>
                <option value="usdt">USDT</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="network">Network</Label>
              <Select id="network" defaultValue="native">
                <option value="native">Native</option>
                <option value="erc20">ERC-20</option>
                <option value="bep20">BEP-20</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="Enter wallet address"
              />
              <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Double-check your wallet address. Transactions to incorrect addresses cannot be reversed.
              </p>
            </div>
          </>
        );
      
      default:
        return (
          <>
            <div>
              <Label htmlFor="bank">Bank Name</Label>
              <Input id="bank" placeholder="Enter bank name" />
            </div>
            <div>
              <Label htmlFor="account">Account Number</Label>
              <Input id="account" placeholder="Enter account number" />
            </div>
            <div>
              <Label htmlFor="swift">SWIFT Code</Label>
              <Input id="swift" placeholder="Enter SWIFT code" />
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        {method === "paypal" && "PayPal Withdrawal"}
        {method === "cashapp" && "Cash App Withdrawal"}
        {method === "crypto" && "Cryptocurrency Withdrawal"}
        {method === "wire" && "Wire Transfer"}
        {method === "wise" && "Wise Transfer"}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {method === "paypal" && "Funds will be sent to your PayPal account within 24 hours."}
        {method === "cashapp" && "Withdrawals to Cash App are typically processed within 24 hours."}
        {method === "crypto" && "Withdrawals are typically processed within 1-3 hours."}
        {(method === "wire" || method === "wise") && "Transfer funds directly to international bank accounts."}
      </p>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Select Balance to Use</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Fiat Balance:</span>
              <span className="font-medium">$755,300.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Bitcoin Balance:</span>
              <span className="font-medium">0.00000000 BTC ≈ $0.00</span>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="amount">Amount to Transfer</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="amount"
              type="number"
              className="pl-7"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setAmount("100")}>$100</Button>
            <Button variant="outline" size="sm" onClick={() => setAmount("500")}>$500</Button>
            <Button variant="outline" size="sm" onClick={() => setAmount("1000")}>$1000</Button>
            <Button variant="outline" size="sm" onClick={() => setAmount("5000")}>Max</Button>
          </div>
        </div>
        
        {renderMethodFields()}
        
        <div>
          <Label htmlFor="pin">Transaction PIN</Label>
          <Input
            id="pin"
            type="password"
            placeholder="••••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            This is your transaction PIN, not your login password
          </p>
        </div>
        
        <div>
          <Label htmlFor="note">Note (Optional)</Label>
          <Input
            id="note"
            placeholder="Optional payment description or note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Button className="flex-1">Continue to Transfer</Button>
          <Button variant="outline" className="flex-1">Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
EOF

# Transfer Methods Component
cat > src/components/dashboard/TransferMethods.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { CreditCard, Bitcoin, Wallet, Landmark } from "lucide-react";

interface TransferMethodsProps {
  onSelect: (method: string) => void;
  selected: string;
}

const methods = [
  { id: "wire", label: "Wire Transfer", icon: Landmark, description: "Transfer funds directly to international bank accounts." },
  { id: "paypal", label: "PayPal", icon: Wallet, description: "Transfer funds to your PayPal account." },
  { id: "cashapp", label: "Cash App", icon: CreditCard, description: "Quick transfers to your Cash App account." },
  { id: "crypto", label: "Cryptocurrency", icon: Bitcoin, description: "Send funds to your cryptocurrency wallet." },
  { id: "wise", label: "Wise", icon: Landmark, description: "Transfer with lower fees using Wise." },
  { id: "zelle", label: "Zelle", icon: CreditCard, description: "Quick transfers to your Zelle account." },
  { id: "venmo", label: "Venmo", icon: Wallet, description: "Send funds to your Venmo account." },
  { id: "revolut", label: "Revolut", icon: Landmark, description: "Transfer to your Revolut account with low fees." },
  { id: "skrill", label: "Skrill", icon: Wallet, description: "Transfer funds to your Skrill account." },
  { id: "alipay", label: "Alipay", icon: CreditCard, description: "Send funds to your Alipay account." },
  { id: "wechat", label: "WeChat Pay", icon: Wallet, description: "Transfer to your WeChat Pay wallet." },
];

export function TransferMethods({ onSelect, selected }: TransferMethodsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Transfer Method</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`p-4 rounded-lg border text-left transition-colors ${
                selected === method.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selected === method.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className={`font-medium ${
                    selected === method.id ? "text-blue-600" : "text-gray-900"
                  }`}>
                    {method.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
EOF

# Deposit Method Component
cat > src/components/dashboard/DepositMethod.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Landmark, Bitcoin } from "lucide-react";

interface DepositMethodProps {
  onSelect: (method: "bank" | "bitcoin") => void;
  selected: "bank" | "bitcoin" | null;
}

export function DepositMethod({ onSelect, selected }: DepositMethodProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Deposit Method</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelect("bank")}
          className={`p-6 rounded-lg border text-center transition-colors ${
            selected === "bank"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <div className={`p-4 rounded-full mx-auto w-fit mb-3 ${
            selected === "bank" ? "bg-blue-600" : "bg-gray-100"
          }`}>
            <Landmark className={`h-8 w-8 ${
              selected === "bank" ? "text-white" : "text-gray-600"
            }`} />
          </div>
          <p className={`font-medium ${
            selected === "bank" ? "text-blue-600" : "text-gray-900"
          }`}>
            Bank Transfer
          </p>
        </button>
        
        <button
          onClick={() => onSelect("bitcoin")}
          className={`p-6 rounded-lg border text-center transition-colors ${
            selected === "bitcoin"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <div className={`p-4 rounded-full mx-auto w-fit mb-3 ${
            selected === "bitcoin" ? "bg-blue-600" : "bg-gray-100"
          }`}>
            <Bitcoin className={`h-8 w-8 ${
              selected === "bitcoin" ? "text-white" : "text-gray-600"
            }`} />
          </div>
          <p className={`font-medium ${
            selected === "bitcoin" ? "text-blue-600" : "text-gray-900"
          }`}>
            Bitcoin
          </p>
        </button>
      </div>
    </div>
  );
}
EOF

# Deposit Amount Component
cat > src/components/dashboard/DepositAmount.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface DepositAmountProps {
  method: "bank" | "bitcoin";
  amount: number;
  onAmountChange: (amount: number) => void;
}

const presetAmounts = [100, 500, 1000, 5000, 10000];

export function DepositAmount({ method, amount, onAmountChange }: DepositAmountProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit Amount</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="amount"
              type="number"
              className="pl-7"
              value={amount}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => onAmountChange(preset)}
              className={amount === preset ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
            >
              ${preset}
            </Button>
          ))}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Secure Deposit:</span> All deposits are processed through secure 
            payment channels. Your financial information is never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
EOF

# Deposit Instructions Component
cat > src/components/dashboard/DepositInstructions.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { Copy, Download, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface DepositInstructionsProps {
  method: "bank" | "bitcoin";
  amount: number;
}

export function DepositInstructions({ method, amount }: DepositInstructionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (method === "bank") {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Transfer Details</h2>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Payment Instructions</p>
              <p className="text-sm text-yellow-700">
                You are to make payment of ${amount.toLocaleString()} using your selected payment method. 
                Screenshot and upload the proof of payment.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="text-xs text-gray-500">Bank Name</p>
              <p className="font-medium">Mining Bank</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard("Mining Bank", "bankName")}
            >
              {copied === "bankName" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="text-xs text-gray-500">Account Number</p>
              <p className="font-medium">99388383</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard("99388383", "accountNumber")}
            >
              {copied === "accountNumber" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="text-xs text-gray-500">Account Name</p>
              <p className="font-medium">Miller lauren</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard("Miller lauren", "accountName")}
            >
              {copied === "accountName" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="text-xs text-gray-500">Swift Code</p>
              <p className="font-medium">3222ASD</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard("3222ASD", "swift")}
            >
              {copied === "swift" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-3">Upload Payment Proof</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Download className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG or PDF (max. 5MB)
            </p>
          </div>
        </div>
        
        <Button className="w-full mt-6">
          Submit Payment
        </Button>
      </div>
    );
  }

  if (method === "bitcoin") {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bitcoin Payment</h2>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Payment Instructions</p>
              <p className="text-sm text-yellow-700">
                You are to make payment of ${amount.toLocaleString()} using your selected payment method. 
                Screenshot and upload the proof of payment.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-gray-100 rounded-lg mb-4">
            {/* QR Code placeholder */}
            <div className="w-48 h-48 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600">QR Code</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Scan QR Code or use address below</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Bitcoin Address</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-gray-50 rounded text-sm">
                bc1q5akv4esqsk0rdf9kq2f67u84npggusgxdq6eup
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard("bc1q5akv4esqsk0rdf9kq2f67u84npggusgxdq6eup", "btc")}
              >
                {copied === "btc" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Network Type</p>
            <p className="font-medium">Bitcoin</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-3">Upload Payment Proof</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Download className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG or PDF (max. 5MB)
            </p>
          </div>
        </div>
        
        <Button className="w-full mt-6">
          Submit Payment
        </Button>
      </div>
    );
  }

  return null;
}
EOF

# Grant Application Type Component
cat > src/components/dashboard/GrantApplicationType.tsx << 'EOF'
"use client";

import { User, Building2 } from "lucide-react";

interface GrantApplicationTypeProps {
  onSelect: (type: "individual" | "company") => void;
  selected: "individual" | "company" | null;
}

export function GrantApplicationType({ onSelect, selected }: GrantApplicationTypeProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Application Type</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelect("individual")}
          className={`p-6 rounded-lg border text-center transition-colors ${
            selected === "individual"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <div className={`p-4 rounded-full mx-auto w-fit mb-3 ${
            selected === "individual" ? "bg-blue-600" : "bg-gray-100"
          }`}>
            <User className={`h-8 w-8 ${
              selected === "individual" ? "text-white" : "text-gray-600"
            }`} />
          </div>
          <p className={`font-medium ${
            selected === "individual" ? "text-blue-600" : "text-gray-900"
          }`}>
            Apply as Individual
          </p>
        </button>
        
        <button
          onClick={() => onSelect("company")}
          className={`p-6 rounded-lg border text-center transition-colors ${
            selected === "company"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <div className={`p-4 rounded-full mx-auto w-fit mb-3 ${
            selected === "company" ? "bg-blue-600" : "bg-gray-100"
          }`}>
            <Building2 className={`h-8 w-8 ${
              selected === "company" ? "text-white" : "text-gray-600"
            }`} />
          </div>
          <p className={`font-medium ${
            selected === "company" ? "text-blue-600" : "text-gray-900"
          }`}>
            Apply as Company
          </p>
        </button>
      </div>
    </div>
  );
}
EOF

# Individual Grant Form Component
cat > src/components/dashboard/IndividualGrantForm.tsx << 'EOF'
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";

export function IndividualGrantForm() {
  const [amount, setAmount] = useState("5000");
  const [fundingPurposes, setFundingPurposes] = useState<string[]>([]);

  const togglePurpose = (purpose: string) => {
    setFundingPurposes(prev =>
      prev.includes(purpose)
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Individual Grant Application</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="amount">Requested Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="amount"
              type="number"
              className="pl-7"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the amount you would like to request for your grant
          </p>
        </div>
        
        <div>
          <Label>Please select all funding purposes that apply to your application:</Label>
          <div className="space-y-3 mt-2">
            <label className="flex items-start gap-3">
              <Checkbox
                checked={fundingPurposes.includes("program")}
                onChange={() => togglePurpose("program")}
              />
              <div>
                <p className="font-medium">Program Funding</p>
                <p className="text-sm text-gray-500">
                  Support for developing or expanding educational, cultural, or social programs.
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <Checkbox
                checked={fundingPurposes.includes("equipment")}
                onChange={() => togglePurpose("equipment")}
              />
              <div>
                <p className="font-medium">Equipment Funding</p>
                <p className="text-sm text-gray-500">
                  Support for purchasing necessary equipment or technology.
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <Checkbox
                checked={fundingPurposes.includes("research")}
                onChange={() => togglePurpose("research")}
              />
              <div>
                <p className="font-medium">Research Funding</p>
                <p className="text-sm text-gray-500">
                  Support for conducting research or studies in your field.
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <Checkbox
                checked={fundingPurposes.includes("community")}
                onChange={() => togglePurpose("community")}
              />
              <div>
                <p className="font-medium">Community Outreach</p>
                <p className="text-sm text-gray-500">
                  Support for activities that benefit local communities or underserved populations.
                </p>
              </div>
            </label>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Important Information:</span> By submitting this application, 
            you acknowledge that the final approved amount will be determined during our review process 
            based on your eligibility and requested amount. You'll receive notification once your 
            application has been processed.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button className="flex-1">Submit Application</Button>
          <Button variant="outline" className="flex-1">Back</Button>
        </div>
      </div>
    </div>
  );
}
EOF

# Company Grant Form Component
cat > src/components/dashboard/CompanyGrantForm.tsx << 'EOF'
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

export function CompanyGrantForm() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Grant Application</h2>
      
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Please provide the following information about your organization:
        </p>
        
        <div>
          <Label htmlFor="legalName">Legal Name of Organization *</Label>
          <Input id="legalName" placeholder="Enter legal name" />
        </div>
        
        <div>
          <Label htmlFor="taxId">Tax ID / EIN *</Label>
          <Input id="taxId" placeholder="XX-XXXXXXX" />
          <p className="text-xs text-gray-500 mt-1">Format: XX-XXXXXXX</p>
        </div>
        
        <div>
          <Label htmlFor="orgType">Organization Type *</Label>
          <Select id="orgType">
            <option value="">Select an option</option>
            <option value="nonprofit">Non-Profit</option>
            <option value="llc">LLC</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
            <option value="sole">Sole Proprietorship</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="foundingYear">Founding Year *</Label>
          <Input id="foundingYear" type="number" placeholder="YYYY" />
        </div>
        
        <div>
          <Label htmlFor="phone">Contact Phone Number</Label>
          <Input id="phone" placeholder="(555) 123-4567" />
        </div>
        
        <div>
          <Label htmlFor="mission">Mission Statement *</Label>
          <Textarea
            id="mission"
            rows={4}
            placeholder="Describe your organization's core mission and purpose"
          />
        </div>
        
        <div>
          <Label htmlFor="incorporation">Date of Incorporation *</Label>
          <Input id="incorporation" type="date" />
        </div>
        
        <div>
          <Label htmlFor="projectTitle">Project Title *</Label>
          <Input
            id="projectTitle"
            placeholder="A concise title for your grant-funded project"
          />
        </div>
        
        <div>
          <Label htmlFor="projectDescription">Project Description *</Label>
          <Textarea
            id="projectDescription"
            rows={6}
            placeholder="Detailed description of the project for which funding is requested"
          />
        </div>
        
        <div>
          <Label htmlFor="expectedOutcomes">Expected Outcomes *</Label>
          <Textarea
            id="expectedOutcomes"
            rows={4}
            placeholder="Describe the specific goals and measurable outcomes you expect to achieve"
          />
        </div>
        
        <div>
          <Label htmlFor="requestedAmount">Requested Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="requestedAmount"
              type="number"
              className="pl-7"
              placeholder="5000"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the amount you would like to request for your project.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Important Information:</span> By submitting this application, 
            you acknowledge that the final approved amount will be determined during our review process 
            based on your eligibility and requested amount. You'll receive notification once your 
            application has been processed.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button className="flex-1">Submit Application</Button>
          <Button variant="outline" className="flex-1">Back</Button>
        </div>
      </div>
    </div>
  );
}
EOF

# Live Chat Component
cat > src/components/dashboard/LiveChat.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/Button";
import { MessageCircle, Clock, Shield } from "lucide-react";

export function LiveChat() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Assistance?</h2>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <p className="text-blue-800 font-medium mb-2">Our expert support team is available</p>
        <p className="text-blue-700 text-sm">24/7 Live Support</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded">
          <Clock className="h-5 w-5 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Quick Response</p>
          <p className="text-xs text-gray-500">&lt; 5 minutes</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded">
          <Shield className="h-5 w-5 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Secure Chat</p>
          <p className="text-xs text-gray-500">Encrypted</p>
        </div>
      </div>
      
      <Button className="w-full">
        <MessageCircle className="mr-2 h-4 w-4" />
        Start Live Chat
      </Button>
    </div>
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
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
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
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
EOF

# Select Component
cat > src/components/ui/Select.tsx << 'EOF'
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
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

# Checkbox Component
cat > src/components/ui/Checkbox.tsx << 'EOF'
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
EOF

# Progress Component
cat > src/components/ui/Progress.tsx << 'EOF'
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-gray-100",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-blue-600 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
EOF

# ============================================
# UTILITY FUNCTIONS
# ============================================

print_header "Generating Utility Functions..."

# Utils file
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function generateAccountNumber(): string {
  return `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`
}

export function generateTransactionId(): string {
  return `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`
}
EOF

# ============================================
# FINAL STEPS
# ============================================

print_success "All pages and components generated successfully!"

print_info "Generated files:"
echo "  📄 Marketing Pages: 10 pages"
echo "  📄 Dashboard Pages: 12 pages"
echo "  📄 Dashboard Components: 15 components"
echo "  📄 UI Components: 6 components"
echo "  📄 Marketing Components: 8 components"
echo "  📄 Utility Files: 1 file"

echo ""
echo "🎉 ==============================================="
echo "🎉 Page Generation Complete!"
echo "🎉 ==============================================="
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Visit http://localhost:3000 to see the homepage"
echo "  3. Login with demo credentials: demo@globalwealthbank.com / Demo123!"
echo "  4. Explore all the pages and components"
echo ""
echo "The design is now fully inspired by Global Wealth Management Bank"
echo "with all the pages and components from your reference images!"
echo ""

exit 0
EOF

# Make the script executable
chmod +x scripts/generate_pages.sh

echo "✅ Page generation script created at scripts/generate_pages.sh"
echo "Run './scripts/generate_pages.sh' to generate all pages and components"