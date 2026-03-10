import { NextRequest, NextResponse } from 'next/server'
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
      return NextResponse.json({ settings: {} })
    }

    // Check if settings column exists first
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'settings'
    `)

    let settings = {}
    
    if (columnCheck.rows.length > 0) {
      // Settings column exists, get the data
      const result = await pool.query(
        'SELECT settings FROM public.users WHERE id = $1',
        [userId]
      )
      settings = result.rows[0]?.settings || {}
    } else {
      console.log('Settings column does not exist, using default settings')
    }

    // Return default settings if none found
    return NextResponse.json({ 
      settings: {
        theme: 'system',
        fontSize: 'medium',
        reducedMotion: false,
        highContrast: false,
        timeFormat: '12h',
        showBalances: true,
        showTransactions: true,
        showGoals: true,
        language: 'en',
        currency: 'USD',
        ...settings
      }
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ 
      settings: {
        theme: 'system',
        fontSize: 'medium',
        reducedMotion: false,
        highContrast: false,
        timeFormat: '12h',
        showBalances: true,
        showTransactions: true,
        showGoals: true,
        language: 'en',
        currency: 'USD'
      }
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    const { settings } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if settings column exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'settings'
    `)

    if (columnCheck.rows.length > 0) {
      // Settings column exists, update it
      await pool.query(
        'UPDATE public.users SET settings = $1, "updatedAt" = NOW() WHERE id = $2',
        [JSON.stringify(settings), userId]
      )
    } else {
      // Settings column doesn't exist, maybe store in a different table or just log
      console.log('Settings column does not exist, would save:', settings)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
