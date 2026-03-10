import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { generateAccountNumber } from '@/lib/utils/accountNumber'
import { requestOTP } from '@/lib/otp/otpService'

function generateCardNumber(): string {
  // Generate a random 16-digit card number
  const prefixes = ['4', '5', '3']; // Visa, Mastercard, Amex
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const remaining = Math.floor(Math.random() * 100000000000000).toString().padStart(15, '0');
  return prefix + remaining;
}

function generateCVV(): string {
  return Math.floor(Math.random() * 900 + 100).toString();
}

function generateExpiry(): { month: number; year: number } {
  const now = new Date();
  const year = now.getFullYear() + 3; // Expires in 3 years
  const month = Math.floor(Math.random() * 12) + 1;
  return { month, year };
}

export async function POST(req: NextRequest) {
  try {
    console.log('📝 Signup attempt started')
    
    const body = await req.json()
    const { firstName, lastName, email, phone, password, accountType } = body
    
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    console.log('🔍 Checking for existing user...')
    
    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    )
    
    if (existingUser.rows.length > 0) {
      console.log('❌ User already exists:', email)
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 409 })
    }

    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    
    console.log('💾 Creating user in database...')
    
    const crypto = require('crypto')
    const userId = crypto.randomUUID()
    
    // Create user
    await query(
      `INSERT INTO users (id, email, "firstName", "lastName", password, phone, role, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [userId, email.toLowerCase(), firstName, lastName, hashedPassword, phone || null, 'USER']
    )

    // Determine if business or personal
    const isBusiness = accountType === 'business'
    
    // Generate primary checking account
    const checkingAccountNumber = generateAccountNumber('checking', isBusiness)
    const checkingAccountId = crypto.randomUUID()
    
    await query(
      `INSERT INTO accounts (id, "accountType", balance, currency, "accountNumber", status, "userId", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [checkingAccountId, 'CHECKING', 0, 'USD', checkingAccountNumber, 'ACTIVE', userId]
    )

    // Create savings account (optional)
    const savingsAccountNumber = generateAccountNumber('savings', isBusiness)
    const savingsAccountId = crypto.randomUUID()
    
    await query(
      `INSERT INTO accounts (id, "accountType", balance, currency, "accountNumber", status, "userId", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [savingsAccountId, 'SAVINGS', 0, 'USD', savingsAccountNumber, 'ACTIVE', userId]
    )

    // Create a debit card for the checking account
    const cardNumber = generateCardNumber()
    const lastFour = cardNumber.slice(-4)
    const cvv = generateCVV()
    const expiry = generateExpiry()
    const cardId = crypto.randomUUID()
    
    await query(
      `INSERT INTO cards (id, "userId", "accountId", "cardType", "cardBrand", "cardNumber", "lastFour", "cardholderName", "expiryMonth", "expiryYear", "cvv", "status", "isVirtual", "issuedAt", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW(), NOW())`,
      [cardId, userId, checkingAccountId, 'DEBIT', 'VISA', cardNumber, lastFour, `${firstName} ${lastName}`, expiry.month, expiry.year, cvv, 'ACTIVE', false]
    )

    console.log('✅ User created successfully:', userId)
    console.log('✅ Debit card created:', cardId)

    // Generate and send OTP
    console.log('📧 Generating OTP...')
    const otpResult = await requestOTP(email, 'ACCOUNT_OPENING', firstName)
    
    return NextResponse.json({ 
      success: true, 
      userId: userId,
      requestId: otpResult.requestId 
    }, { status: 201 })
  } catch (e) {
    console.error('❌ Signup error details:', e)
    return NextResponse.json({ 
      error: e instanceof Error ? e.message : 'Failed to create account. Please try again.' 
    }, { status: 500 })
  }
}
