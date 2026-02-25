import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'

// This would typically come from a CMS or database
const contentMap: Record<string, Record<string, any>> = {
  bank: {
    accounts: {
      title: 'Oldspring Trust Accounts',
      description: 'Discover the perfect checking account for your needs.',
      content: 'Our accounts come with no monthly fees, free online banking, and mobile check deposit.'
    },
    'credit-cards': {
      title: 'Credit Cards',
      description: 'Find the credit card that rewards your lifestyle.',
      content: 'From cash back to travel rewards, we have a card for you.'
    },
    'online-banking': {
      title: 'Online & Mobile Banking',
      description: 'Bank anywhere, anytime with our secure mobile app.',
      content: 'Check balances, transfer funds, deposit checks, and more from your phone.'
    }
  },
  save: {
    'high-yield': {
      title: 'High Yield Savings',
      description: 'Earn more with our high-yield savings account.',
      content: '3.75% APY with no monthly fees. Start saving today.'
    },
    star: {
      title: 'Star Savings',
      description: 'A savings account designed for growing families.',
      content: 'Special features for young savers and their parents.'
    },
    certificates: {
      title: 'Certificates of Deposit',
      description: 'Lock in guaranteed returns with our CDs.',
      content: 'Terms from 6 months to 5 years with competitive rates.'
    },
    'holiday-club': {
      title: 'Holiday Club',
      description: 'Save for the holidays all year long.',
      content: 'Automatic transfers help you save for seasonal expenses.'
    },
    'kids-club': {
      title: 'Kids Club',
      description: 'Teach children the value of saving.',
      content: 'Fun, educational tools to build financial literacy.'
    },
    'money-market': {
      title: 'Money Market Account',
      description: 'Higher rates with check-writing privileges.',
      content: 'Tiered interest rates on higher balances.'
    }
  },
  borrow: {
    'credit-cards': {
      title: 'Credit Cards',
      description: 'Choose from our selection of rewards cards.',
      content: '0% Intro APR available on select cards.'
    },
    mortgage: {
      title: 'Mortgage & Home Loans',
      description: 'Make your dream home a reality.',
      content: 'Fixed and adjustable-rate mortgages available.'
    },
    personal: {
      title: 'Personal Loans',
      description: 'Fund your next big purchase or consolidate debt.',
      content: 'Competitive rates and flexible terms.'
    },
    auto: {
      title: 'Auto & Motorcycle Loans',
      description: 'Get on the road with our competitive auto loans.',
      content: 'New and used vehicle financing available.'
    },
    refinance: {
      title: 'Auto Refinance',
      description: 'Lower your monthly payment by refinancing.',
      content: 'See if you qualify for a better rate.'
    },
    student: {
      title: 'Student Loans',
      description: 'Invest in your future with education financing.',
      content: 'Undergraduate and graduate loan options.'
    }
  },
  invest: {
    team: {
      title: 'Our Investment Team',
      description: 'Meet the experts who can help grow your wealth.',
      content: 'Certified financial planners and investment advisors.'
    },
    retirement: {
      title: 'Retirement Planning',
      description: 'Build the retirement you deserve.',
      content: 'IRA options, 401(k) rollovers, and pension planning.'
    },
    financial: {
      title: 'Financial Planning',
      description: 'Comprehensive planning for every life stage.',
      content: 'Budgeting, saving, and investing strategies.'
    },
    estate: {
      title: 'Estate Planning',
      description: 'Protect your legacy for future generations.',
      content: 'Will preparation, trusts, and wealth transfer.'
    },
    ira: {
      title: 'IRA Rollover',
      description: 'Simplify your retirement savings.',
      content: 'Expert assistance with 401(k) to IRA rollovers.'
    },
    online: {
      title: 'Online Investing',
      description: 'Take control of your investments.',
      content: 'Self-directed brokerage accounts and tools.'
    }
  },
  insure: {
    medicare: {
      title: 'Medicare Insurance',
      description: 'Navigate Medicare with confidence.',
      content: 'Medicare Advantage, Supplement, and Part D plans.'
    },
    auto: {
      title: 'Auto Insurance',
      description: 'Protect your vehicle and yourself.',
      content: 'Liability, collision, and comprehensive coverage.'
    },
    homeowners: {
      title: 'Homeowners Insurance',
      description: 'Safeguard your most valuable asset.',
      content: 'Dwelling, personal property, and liability coverage.'
    },
    life: {
      title: 'Life Insurance',
      description: 'Provide for your loved ones.',
      content: 'Term and whole life insurance options.'
    },
    accidental: {
      title: 'Accidental Death Insurance',
      description: 'Additional protection for unexpected events.',
      content: 'Supplemental coverage at affordable rates.'
    },
    hospital: {
      title: 'Hospital Insurance',
      description: 'Help cover hospital costs.',
      content: 'Fixed-benefit hospital indemnity plans.'
    }
  },
  learn: {
    'tax-checklist': {
      title: 'Tax Checklist',
      description: '5 things to remember this tax season.',
      content: 'Make filing simple with our comprehensive checklist.'
    },
    'save-for-vacation': {
      title: 'How to Save for Summer Vacation',
      description: 'Tips for funding your dream getaway.',
      content: 'Start saving now with automatic transfers.'
    },
    'manage-checking': {
      title: 'Simple Ways to Manage a Checking Account',
      description: 'Master your daily finances.',
      content: 'Tips for avoiding fees and tracking spending.'
    },
    'rising-rates': {
      title: 'The Impact of Rising Rates and Inflation on Your Business',
      description: 'Navigate economic changes successfully.',
      content: 'Strategies for business owners in a changing economy.'
    }
  },
  payments: {
    'auto-loan': {
      title: 'Auto Loan Customer Center',
      description: 'Manage your auto loan online.',
      content: 'Make payments, view statements, and update information.'
    },
    'one-time': {
      title: 'One Time Payments',
      description: 'Make a payment without logging in.',
      content: 'Quick and secure guest payment option.'
    },
    mail: {
      title: 'Pay by Mail',
      description: 'Traditional payment option.',
      content: 'Send your payment to our lockbox address.'
    },
    branch: {
      title: 'Pay at Branch',
      description: 'Visit us in person.',
      content: 'Find a branch near you to make a payment.'
    }
  },
  'about-us': {
    page: {
      title: 'About Oldspring Trust',
      description: 'Learn about our history and mission.',
      content: 'Serving communities for over 80 years.'
    }
  },
  news: {
    page: {
      title: 'News & Events',
      description: 'Stay updated with the latest news.',
      content: 'Community events, financial tips, and company updates.'
    }
  },
  careers: {
    page: {
      title: 'Careers at Oldspring Trust',
      description: 'Join our team and build your future.',
      content: 'Explore opportunities in banking and finance.'
    }
  },
  'giving-back': {
    page: {
      title: 'Giving Back',
      description: 'Our commitment to community.',
      content: 'Charitable initiatives and volunteer programs.'
    }
  },
  privacy: {
    page: {
      title: 'Privacy Policy',
      description: 'How we protect your information.',
      content: 'Our commitment to data security and privacy.'
    }
  },
  faqs: {
    page: {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions.',
      content: 'Get help with accounts, loans, and services.'
    }
  },
  sitemap: {
    page: {
      title: 'Sitemap',
      description: 'Navigate our website.',
      content: 'Complete index of all pages.'
    }
  },
  referral: {
    page: {
      title: 'Referral Service',
      description: 'Earn rewards by referring friends.',
      content: 'Share the benefits of banking with us.'
    }
  },
  security: {
    page: {
      title: 'Oldspring Trust Security™',
      description: 'Your security is our priority.',
      content: 'Learn about our fraud protection measures.'
    }
  }
}

export default function Page({ params }: { params: { category: string; page: string } }) {
  const { category, page } = params
  
  const pageContent = contentMap[category]?.[page] || contentMap[category]?.page
  
  if (!pageContent) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">{pageContent.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{pageContent.description}</p>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-700 leading-relaxed">{pageContent.content}</p>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Need help?</h2>
              <p className="text-gray-600 mb-4">Contact our customer service team for assistance.</p>
              <a
                href="mailto:support@oldspringtrust.com"
                className="inline-flex items-center text-[#1e3a5f] hover:text-[#2b4c7a]"
              >
                support@oldspringtrust.com
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
