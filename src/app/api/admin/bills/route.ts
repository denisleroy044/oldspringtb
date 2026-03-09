import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        b.*,
        u.email as "userEmail",
        CONCAT(u."firstName", ' ', u."lastName") as "userName"
      FROM public.bills b
      JOIN public.users u ON u.id = b."userId"
      ORDER BY b."createdAt" DESC
    `);
    
    return NextResponse.json({ bills: result.rows });
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json({ bills: [] });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { billId, action } = await request.json();
    
    if (action === 'mark-paid') {
      await pool.query(
        'UPDATE public.bills SET status = $1, "paymentDate" = NOW(), "updatedAt" = NOW() WHERE id = $2',
        ['paid', billId]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 });
  }
}
