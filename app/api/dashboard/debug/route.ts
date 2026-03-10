import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { cookies } from 'next/headers'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  const debug = {
    cookies: [],
    userId: null,
    userExists: false,
    tables: {},
    errors: [],
    env: process.env.NODE_ENV,
    dbConnected: false
  }

  try {
    // Test database connection
    try {
      const dbTest = await pool.query('SELECT NOW()')
      debug.dbConnected = true
      debug.dbTime = dbTest.rows[0].now
    } catch (err: any) {
      debug.errors.push(`DB Connection error: ${err.message}`)
    }

    // Get cookies
    try {
      const cookieStore = await cookies()
      debug.cookies = cookieStore.getAll().map(c => c.name)
      debug.userId = cookieStore.get('userId')?.value
    } catch (err: any) {
      debug.errors.push(`Cookie error: ${err.message}`)
    }

    if (!debug.userId) {
      debug.errors.push('No userId cookie found')
    } else {
      // Check if user exists
      try {
        const user = await pool.query('SELECT id FROM public.users WHERE id = $1', [debug.userId])
        debug.userExists = user.rows.length > 0
      } catch (err: any) {
        debug.errors.push(`User query error: ${err.message}`)
      }

      // Check accounts table
      try {
        const accounts = await pool.query(
          'SELECT COUNT(*) FROM public.accounts WHERE "userId" = $1', 
          [debug.userId]
        )
        debug.tables.accounts = accounts.rows[0].count
      } catch (err: any) {
        debug.errors.push(`Accounts query error: ${err.message}`)
        debug.tables.accounts = 'error'
      }

      // Check transactions table
      try {
        const transactions = await pool.query(
          'SELECT COUNT(*) FROM public.transactions WHERE "userId" = $1', 
          [debug.userId]
        )
        debug.tables.transactions = transactions.rows[0].count
      } catch (err: any) {
        debug.errors.push(`Transactions query error: ${err.message}`)
        debug.tables.transactions = 'error'
      }
    }

  } catch (err: any) {
    debug.errors.push(`General error: ${err.message}`)
  }

  return NextResponse.json(debug)
}
