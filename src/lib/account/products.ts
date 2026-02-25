import { AccountProduct } from '@/types/account'

export const accountProducts: AccountProduct[] = [
  {
    id: 'savings_basic',
    type: 'savings',
    name: 'Basic Savings',
    description: 'Start saving with competitive interest rates',
    interestRate: 1.25,
    minimumDeposit: 100,
    monthlyFee: 0,
    features: [
      '1.25% APY',
      'No monthly fees',
      'Free transfers',
      'Online banking',
      'Mobile check deposit'
    ],
    icon: '🏦',
    color: 'green',
    gradient: 'from-green-500 to-green-700'
  },
  {
    id: 'savings_high_yield',
    type: 'savings',
    name: 'High-Yield Savings',
    description: 'Maximum growth with premium interest rates',
    interestRate: 2.50,
    minimumDeposit: 1000,
    monthlyFee: 0,
    features: [
      '2.50% APY',
      'No monthly fees',
      'Online only account',
      'FDIC insured',
      'Free transfers'
    ],
    icon: '📈',
    color: 'teal',
    gradient: 'from-teal-500 to-teal-700'
  },
  {
    id: 'checking_interest',
    type: 'checking',
    name: 'Interest Checking',
    description: 'Earn interest on your checking balance',
    interestRate: 0.50,
    minimumDeposit: 500,
    monthlyFee: 10,
    features: [
      '0.50% APY',
      'Free checks',
      'Debit card included',
      'Online bill pay',
      'Overdraft protection'
    ],
    icon: '💳',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-700'
  },
  {
    id: 'money_market',
    type: 'money_market',
    name: 'Money Market Account',
    description: 'Higher interest with check writing privileges',
    interestRate: 1.85,
    minimumDeposit: 2500,
    monthlyFee: 15,
    features: [
      '1.85% APY',
      'Check writing',
      'Debit card access',
      'Tiered interest rates',
      'Up to 6 transfers/month'
    ],
    icon: '📊',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-700'
  },
  {
    id: 'cd_12month',
    type: 'cd',
    name: '12-Month CD',
    description: 'Fixed rate certificate of deposit',
    interestRate: 3.25,
    minimumDeposit: 500,
    monthlyFee: 0,
    features: [
      '3.25% APY guaranteed',
      '12-month term',
      'FDIC insured',
      'Interest compounded daily',
      'Early withdrawal penalty applies'
    ],
    icon: '⏰',
    color: 'orange',
    gradient: 'from-orange-500 to-orange-700'
  },
  {
    id: 'cd_24month',
    type: 'cd',
    name: '24-Month CD',
    description: 'Long-term savings with higher rates',
    interestRate: 3.75,
    minimumDeposit: 500,
    monthlyFee: 0,
    features: [
      '3.75% APY',
      '24-month term',
      'Higher rate for longer commitment',
      'Renewal options',
      'Grace period at maturity'
    ],
    icon: '📅',
    color: 'red',
    gradient: 'from-red-500 to-red-700'
  }
]
