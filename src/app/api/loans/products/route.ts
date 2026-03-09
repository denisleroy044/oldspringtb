import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Check if table exists
    try {
      await query(`SELECT 1 FROM loan_products LIMIT 1`)
    } catch (tableError) {
      // Return default products if table doesn't exist
      return NextResponse.json({ 
        products: [
          {
            id: '1',
            name: 'Personal Loan',
            description: 'Flexible personal loans for any purpose',
            category: 'personal',
            minAmount: 1000,
            maxAmount: 50000,
            minTerm: 6,
            maxTerm: 60,
            interestRate: 8.5,
            processingFee: 1.0,
            creditScoreMin: 640,
            incomeMultiplier: 3.0,
            features: ['No collateral', 'Fixed payments', 'Quick funding']
          },
          {
            id: '2',
            name: 'Business Loan',
            description: 'Loans to grow your business',
            category: 'business',
            minAmount: 5000,
            maxAmount: 250000,
            minTerm: 12,
            maxTerm: 84,
            interestRate: 7.5,
            processingFee: 1.5,
            creditScoreMin: 680,
            incomeMultiplier: 4.0,
            features: ['Fast approval', 'Flexible terms', 'Dedicated manager']
          },
          {
            id: '3',
            name: 'Mortgage',
            description: 'Home purchase or refinance',
            category: 'mortgage',
            minAmount: 50000,
            maxAmount: 1000000,
            minTerm: 60,
            maxTerm: 360,
            interestRate: 4.5,
            processingFee: 2.0,
            creditScoreMin: 700,
            incomeMultiplier: 4.5,
            features: ['30-year fixed', 'Rate lock', 'First-time buyer']
          },
          {
            id: '4',
            name: 'Auto Loan',
            description: 'Finance your vehicle purchase',
            category: 'auto',
            minAmount: 5000,
            maxAmount: 100000,
            minTerm: 12,
            maxTerm: 72,
            interestRate: 6.5,
            processingFee: 1.0,
            creditScoreMin: 620,
            incomeMultiplier: 3.5,
            features: ['New & used', 'Refinance', 'Quick approval']
          },
          {
            id: '5',
            name: 'Education Loan',
            description: 'Fund your education',
            category: 'education',
            minAmount: 2000,
            maxAmount: 100000,
            minTerm: 6,
            maxTerm: 120,
            interestRate: 5.5,
            processingFee: 0.5,
            creditScoreMin: 600,
            incomeMultiplier: 2.5,
            features: ['Deferred payment', 'Grace period', 'Co-signer release']
          }
        ] 
      })
    }

    const result = await query(
      `SELECT 
        id, name, description, category,
        min_amount as "minAmount", max_amount as "maxAmount",
        min_term as "minTerm", max_term as "maxTerm",
        interest_rate as "interestRate", processing_fee as "processingFee",
        credit_score_min as "creditScoreMin", income_multiplier as "incomeMultiplier",
        features
       FROM loan_products
       WHERE is_active = true
       ORDER BY min_amount ASC`
    )
    return NextResponse.json({ products: result.rows || [] })
  } catch (error) {
    console.error('Error fetching loan products:', error)
    // Return default products as fallback
    return NextResponse.json({ 
      products: [
        {
          id: '1',
          name: 'Personal Loan',
          description: 'Flexible personal loans for any purpose',
          category: 'personal',
          minAmount: 1000,
          maxAmount: 50000,
          minTerm: 6,
          maxTerm: 60,
          interestRate: 8.5,
          processingFee: 1.0,
          creditScoreMin: 640,
          incomeMultiplier: 3.0,
          features: ['No collateral', 'Fixed payments', 'Quick funding']
        },
        {
          id: '2',
          name: 'Business Loan',
          description: 'Loans to grow your business',
          category: 'business',
          minAmount: 5000,
          maxAmount: 250000,
          minTerm: 12,
          maxTerm: 84,
          interestRate: 7.5,
          processingFee: 1.5,
          creditScoreMin: 680,
          incomeMultiplier: 4.0,
          features: ['Fast approval', 'Flexible terms', 'Dedicated manager']
        }
      ] 
    })
  }
}
