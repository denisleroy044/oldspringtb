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
        c.*,
        u.email as "userEmail",
        CONCAT(u."firstName", ' ', u."lastName") as "userName"
      FROM public.cards c
      JOIN public.users u ON u.id = c."userId"
      ORDER BY c."createdAt" DESC
    `);
    
    return NextResponse.json({ cards: result.rows });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ cards: [] });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { cardId, action } = await request.json();
    
    let status = '';
    if (action === 'approve') status = 'approved';
    if (action === 'reject') status = 'rejected';
    
    if (status) {
      await pool.query(
        'UPDATE public.cards SET status = $1, "updatedAt" = NOW() WHERE id = $2',
        [status, cardId]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}
