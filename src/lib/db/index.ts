import { Pool } from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

// Parse timeout values from env with defaults
const CONNECTION_TIMEOUT = parseInt(process.env.PG_CONNECTION_TIMEOUT || '30000')
const IDLE_TIMEOUT = parseInt(process.env.PG_IDLE_TIMEOUT || '30000')
const MAX_RETRIES = parseInt(process.env.PG_MAX_RETRIES || '3')
const RETRY_DELAY = parseInt(process.env.PG_RETRY_DELAY || '1000')

// Log connection string (without password)
const sanitizedUrl = process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@')
console.log('📊 Connecting to database:', sanitizedUrl)

// Create connection pool with better timeout settings
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: IDLE_TIMEOUT,
  connectionTimeoutMillis: CONNECTION_TIMEOUT,
  ssl: {
    rejectUnauthorized: false
  }
})

// Helper function to execute queries with retry logic
export async function query(text: string, params?: any[], retries = MAX_RETRIES): Promise<any> {
  const start = Date.now()
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await pool.query(text, params)
      const duration = Date.now() - start
      
      if (duration > 1000) {
        console.log('⚠️ Slow query:', { text, duration, rows: res.rowCount })
      }
      
      return res
    } catch (error: any) {
      const isLastAttempt = attempt === retries
      
      console.error(`Database query error (attempt ${attempt}/${retries}):`, {
        text,
        error: error.message,
        code: error.code
      })

      // Don't retry on certain errors
      if (error.code === '42P01' || // undefined table
          error.code === '42703' || // undefined column
          error.code === '23505' || // unique violation
          error.code === '23503') { // foreign key violation
        throw error
      }

      if (isLastAttempt) {
        throw error
      }

      // Wait before retrying
      console.log(`⏱️  Retrying in ${RETRY_DELAY}ms...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
    }
  }
  
  throw new Error('Unexpected: Should have thrown or returned')
}

// Helper to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName]
    )
    return result.rows[0]?.exists || false
  } catch (error) {
    console.error('Error checking if table exists:', error)
    return false
  }
}

// Helper to get user by ID
export async function getUserById(userId: string) {
  try {
    const result = await query(
      `SELECT id, email, "firstName", "lastName", phone, role 
       FROM users WHERE id = $1`,
      [userId]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

// Helper to get user's accounts
export async function getUserAccounts(userId: string) {
  try {
    const result = await query(
      `SELECT id, "accountType", balance, currency, "accountNumber", status, "createdAt"
       FROM accounts 
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [userId]
    )
    return result.rows || []
  } catch (error) {
    console.error('Error getting user accounts:', error)
    return []
  }
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing database pool...')
  await pool.end()
  process.exit(0)
})
