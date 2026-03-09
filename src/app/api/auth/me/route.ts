import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { cookies } from 'next/headers'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const result = await pool.query(
      'SELECT id, email, "firstName", "lastName", role FROM public.users WHERE id = $1',
      [userId]
    )

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
