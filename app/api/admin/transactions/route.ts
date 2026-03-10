import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/neon-adapter'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/admin/transactions - Starting')
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    console.log(`📊 Params: userId=${userId}, limit=${limit}`)
    const transactions = await db.getTransactions(limit, userId || undefined)
    console.log(`📊 Found ${transactions.length} transactions`)
    
    return NextResponse.json({ transactions })
  } catch (error: any) {
    console.error('❌ Error in transactions API GET:', error.message)
    console.error('Full error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/admin/transactions - Starting')
    
    const body = await request.json()
    console.log('📝 Request body:', body)
    
    const { userId, type, amount, description, accountId } = body

    if (!userId || !type || !amount || !description) {
      console.log('📝 Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log(`📝 Creating transaction for user ${userId}: ${type} $${amount} - ${description}`)
    
    const transaction = await db.createTransaction({
      userId,
      type,
      amount: parseFloat(amount),
      description,
      accountId
    })

    console.log('📝 Transaction created successfully:', transaction)
    return NextResponse.json({ 
      success: true,
      transaction 
    })
  } catch (error: any) {
    console.error('❌ Error in transactions API POST:', error.message)
    console.error('Full error:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction', details: error.message },
      { status: 500 }
    )
  }
}
