import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    // This query joins transactions with users to get all pending/processed requests
    const result = await pool.query(`
      SELECT 
        t.id,
        t."userId",
        u.email as "userEmail",
        CONCAT(u."firstName", ' ', u."lastName") as "userName",
        t.type,
        t.amount,
        t.description,
        t.status,
        t."createdAt",
        t."updatedAt",
        t."metadata"
      FROM public.transactions t
      JOIN public.users u ON u.id = t."userId"
      WHERE t.status IN ('pending', 'approved', 'rejected', 'completed')
      ORDER BY t."createdAt" DESC
    `);
    
    return NextResponse.json({ requests: result.rows });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ requests: [] });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { requestId, action } = await request.json();
    
    const validActions = ['approve', 'reject', 'complete'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    const newStatus = action === 'approve' ? 'approved' : 
                      action === 'reject' ? 'rejected' : 'completed';
    
    // Update transaction status
    await pool.query(
      `UPDATE public.transactions 
       SET status = $1, "updatedAt" = NOW() 
       WHERE id = $2`,
      [newStatus, requestId]
    );
    
    // If approved and it's a credit transaction, update account balance
    if (action === 'approve') {
      const transaction = await pool.query(
        'SELECT "userId", type, amount FROM public.transactions WHERE id = $1',
        [requestId]
      );
      
      if (transaction.rows.length > 0 && transaction.rows[0].type === 'credit') {
        await pool.query(
          `UPDATE public.accounts 
           SET balance = balance + $1, "updatedAt" = NOW() 
           WHERE "userId" = $2`,
          [transaction.rows[0].amount, transaction.rows[0].userId]
        );
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
