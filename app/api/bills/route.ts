import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if bills table exists
    try {
      await query(`SELECT 1 FROM bills LIMIT 1`)
    } catch (tableError) {
      // Table doesn't exist yet, return empty array
      return NextResponse.json({ bills: [] })
    }

    const result = await query(
      `SELECT 
        b.id, 
        b.bill_name as "billName", 
        b.bill_number as "billNumber",
        b.amount, 
        b.currency, 
        b.due_date as "dueDate", 
        b.recurring,
        b.recurring_frequency as "recurringFrequency", 
        b.auto_pay as "autoPay",
        b.status, 
        b.payment_reference as "paymentReference", 
        b.paid_at as "paidAt",
        b.created_at as "createdAt",
        bc.name as "category", 
        bc.icon as "categoryIcon"
       FROM bills b
       LEFT JOIN bill_categories bc ON b.category_id = bc.id
       WHERE b.user_id = $1
       ORDER BY 
        CASE b.status 
          WHEN 'OVERDUE' THEN 1 
          WHEN 'PENDING' THEN 2 
          ELSE 3 
        END,
        b.due_date ASC`,
      [payload.userId]
    )

    return NextResponse.json({ bills: result.rows || [] })
  } catch (error) {
    console.error('Error fetching bills:', error)
    return NextResponse.json({ bills: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if bills table exists
    try {
      await query(`SELECT 1 FROM bills LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ 
        error: 'Bills system is being set up. Please try again in a few minutes.',
        code: 'TABLE_NOT_READY'
      }, { status: 503 })
    }

    const {
      billName, billNumber, categoryId, amount, dueDate,
      recurring, recurringFrequency, autoPay, notes
    } = await req.json()

    const billId = `bill_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

    await query(
      `INSERT INTO bills (
        id, user_id, category_id, bill_name, bill_number, amount,
        due_date, recurring, recurring_frequency, auto_pay, notes, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
      [
        billId, 
        payload.userId, 
        categoryId, 
        billName, 
        billNumber, 
        amount,
        dueDate, 
        recurring, 
        recurringFrequency, 
        autoPay, 
        notes, 
        'PENDING'
      ]
    )

    return NextResponse.json({ success: true, id: billId })
  } catch (error) {
    console.error('Error creating bill:', error)
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 })
  }
}
