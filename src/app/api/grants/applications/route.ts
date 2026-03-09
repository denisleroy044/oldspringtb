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

    // Check if table exists
    try {
      await query(`SELECT 1 FROM grant_applications LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ applications: [] })
    }

    const result = await query(
      `SELECT 
        ga.id, 
        ga.application_number as "applicationNumber",
        ga.project_title as "projectTitle", 
        ga.requested_amount as "requestedAmount",
        ga.status, 
        ga.created_at as "createdAt", 
        ga.reviewed_at as "reviewedAt",
        ga.approved_amount as "approvedAmount",
        g.title as "grantTitle", 
        g.provider as "grantProvider"
       FROM grant_applications ga
       LEFT JOIN grants g ON ga.grant_id = g.id
       WHERE ga.user_id = $1
       ORDER BY 
        CASE ga.status 
          WHEN 'PENDING' THEN 1
          WHEN 'UNDER_REVIEW' THEN 2
          WHEN 'APPROVED' THEN 3
          ELSE 4
        END,
        ga.created_at DESC`,
      [payload.userId]
    )

    return NextResponse.json({ applications: result.rows || [] })
  } catch (error) {
    console.error('Error fetching grant applications:', error)
    return NextResponse.json({ applications: [] })
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

    // Check if tables exist
    try {
      await query(`SELECT 1 FROM grant_applications LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ 
        error: 'Grants system is being set up. Please try again in a few minutes.',
        code: 'TABLE_NOT_READY'
      }, { status: 503 })
    }

    const data = await req.json()
    const applicationNumber = `GRANT-${Date.now().toString(36).toUpperCase()}`
    const reference = `REF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const result = await query(
      `INSERT INTO grant_applications (
        id, user_id, grant_id, application_number,
        organization_name, organization_type,
        contact_first_name, contact_last_name, contact_email, contact_phone,
        project_title, project_description,
        requested_amount, total_project_cost,
        documents, status, reference, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
      RETURNING id, application_number`,
      [
        `grant_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        payload.userId,
        data.grantId,
        applicationNumber,
        data.organizationName || null,
        data.organizationType || null,
        data.contactFirstName,
        data.contactLastName,
        data.contactEmail,
        data.contactPhone || null,
        data.projectTitle,
        data.projectDescription,
        data.requestedAmount,
        data.totalProjectCost || null,
        data.documents ? JSON.stringify(data.documents) : null,
        'PENDING',
        reference
      ]
    )

    // Create notification for admin
    try {
      await query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, data, is_read, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          'admin',
          'grant',
          'New Grant Application',
          `A new grant application for $${data.requestedAmount} has been submitted`,
          JSON.stringify({ 
            applicationId: result.rows[0].id,
            userId: payload.userId,
            amount: data.requestedAmount,
            reference: result.rows[0].application_number
          }),
          false
        ]
      )
    } catch (notifError) {
      console.error('Failed to create admin notification:', notifError)
    }

    // Create notification for user
    try {
      await query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, data, action_url, is_read, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          payload.userId,
          'grant',
          'Grant Application Submitted',
          `Your grant application for $${data.requestedAmount} has been submitted and is pending review.`,
          JSON.stringify({ 
            applicationId: result.rows[0].id,
            amount: data.requestedAmount,
            reference: result.rows[0].application_number
          }),
          '/dashboard/grants',
          false
        ]
      )
    } catch (notifError) {
      console.error('Failed to create user notification:', notifError)
    }

    return NextResponse.json({ 
      success: true, 
      applicationId: result.rows[0].id,
      reference: result.rows[0].application_number
    })

  } catch (error) {
    console.error('Error submitting grant application:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
