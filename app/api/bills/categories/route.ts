import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Check if bill_categories table exists
    try {
      await query(`SELECT 1 FROM bill_categories LIMIT 1`)
    } catch (tableError) {
      // Table doesn't exist yet, return default categories
      return NextResponse.json({ 
        categories: [
          { id: '1', name: 'Utilities', icon: 'zap', description: 'Electricity, water, gas bills' },
          { id: '2', name: 'Telecom', icon: 'phone', description: 'Phone, internet, cable TV' },
          { id: '3', name: 'Rent', icon: 'home', description: 'Rent payments' },
          { id: '4', name: 'Insurance', icon: 'shield', description: 'Insurance premiums' },
          { id: '5', name: 'Subscription', icon: 'repeat', description: 'Monthly subscriptions' },
          { id: '6', name: 'Credit Card', icon: 'credit-card', description: 'Credit card payments' },
          { id: '7', name: 'Loan', icon: 'landmark', description: 'Loan repayments' },
          { id: '8', name: 'Other', icon: 'more-horizontal', description: 'Other bills' }
        ] 
      })
    }

    const result = await query(
      `SELECT id, name, icon, description 
       FROM bill_categories 
       WHERE is_active = true 
       ORDER BY name`
    )
    return NextResponse.json({ categories: result.rows || [] })
  } catch (error) {
    console.error('Error fetching bill categories:', error)
    // Return default categories as fallback
    return NextResponse.json({ 
      categories: [
        { id: '1', name: 'Utilities', icon: 'zap', description: 'Electricity, water, gas bills' },
        { id: '2', name: 'Telecom', icon: 'phone', description: 'Phone, internet, cable TV' },
        { id: '3', name: 'Rent', icon: 'home', description: 'Rent payments' },
        { id: '4', name: 'Insurance', icon: 'shield', description: 'Insurance premiums' },
        { id: '5', name: 'Subscription', icon: 'repeat', description: 'Monthly subscriptions' },
        { id: '6', name: 'Credit Card', icon: 'credit-card', description: 'Credit card payments' },
        { id: '7', name: 'Loan', icon: 'landmark', description: 'Loan repayments' },
        { id: '8', name: 'Other', icon: 'more-horizontal', description: 'Other bills' }
      ] 
    })
  }
}
