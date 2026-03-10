import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    console.log('📝 Account request received');
    
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      console.log('❌ No token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      console.log('❌ Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    console.log('✅ User authenticated:', payload.userId);

    const body = await req.json()
    console.log('📦 Request body:', body);
    
    const { accountType } = body
    
    if (!accountType) {
      console.log('❌ No account type provided');
      return NextResponse.json({ error: 'Account type is required' }, { status: 400 })
    }

    // Map account type to database values
    let dbAccountType = 'CHECKING'
    switch(accountType.toLowerCase()) {
      case 'checking':
        dbAccountType = 'CHECKING'
        break
      case 'savings':
        dbAccountType = 'SAVINGS'
        break
      case 'business':
        dbAccountType = 'CHECKING'
        break
    }

    console.log('📋 Using account type:', dbAccountType);

    // First, check if account_requests table exists
    try {
      const tableCheck = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'account_requests'
        )`
      )
      
      if (!tableCheck.rows[0].exists) {
        console.log('❌ account_requests table does not exist');
        
        // Create the table if it doesn't exist
        await query(`
          CREATE TABLE IF NOT EXISTS account_requests (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
            "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            "accountType" TEXT NOT NULL,
            status TEXT DEFAULT 'PENDING',
            "adminNotes" TEXT,
            "reviewedBy" TEXT,
            "reviewedAt" TIMESTAMP,
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
          )
        `)
        console.log('✅ Created account_requests table');
      }
    } catch (tableError) {
      console.error('❌ Table check error:', tableError);
    }

    // Check if there's already a pending request of this type
    const existingRes = await query(
      `SELECT id FROM account_requests 
       WHERE "userId" = $1 AND "accountType" = $2 AND status = 'PENDING'`,
      [payload.userId, dbAccountType]
    )

    if (existingRes.rows.length > 0) {
      console.log('❌ Pending request already exists');
      return NextResponse.json(
        { error: 'You already have a pending request for this account type' },
        { status: 400 }
      )
    }

    // Create the request
    const crypto = require('crypto')
    const requestId = crypto.randomUUID()
    console.log('🆔 Generated request ID:', requestId);

    await query(
      `INSERT INTO account_requests (id, "userId", "accountType", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [requestId, payload.userId, dbAccountType, 'PENDING']
    )

    console.log('✅ Request inserted successfully');

    return NextResponse.json({ 
      success: true, 
      requestId,
      message: 'Account request submitted successfully. An admin will review your request.'
    })

  } catch (error) {
    console.error('❌ Account request error:', error)
    return NextResponse.json(
      { error: 'Failed to submit request: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
