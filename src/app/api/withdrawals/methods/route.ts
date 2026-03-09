import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(
      `SELECT 
        method as id,
        name,
        description,
        fee_type as "feeType",
        fee_value as "feeValue",
        min_amount as "minAmount",
        max_amount as "maxAmount",
        processing_time as "processingTime",
        is_active as "isActive"
       FROM withdrawal_methods
       WHERE is_active = true
       ORDER BY min_amount ASC`
    )

    return NextResponse.json({ methods: result.rows || [] })
  } catch (error) {
    console.error('Error fetching withdrawal methods:', error)
    return NextResponse.json({ methods: [] }, { status: 500 })
  }
}
