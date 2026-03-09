import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { cookies } from 'next/headers'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    // Get user ID from session/cookie
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ totalBalance: 0 })
    }

    // Get total balance from accounts
    const result = await pool.query(
      'SELECT COALESCE(SUM(balance), 0) as total FROM public.accounts WHERE "userId" = $1',
      [userId]
    )

    return NextResponse.json({ 
      totalBalance: parseFloat(result.rows[0].total) || 0 
    })
  } catch (error) {
    console.error('Error fetching total balance:', error)
    return NextResponse.json({ totalBalance: 0 })
  }
}
