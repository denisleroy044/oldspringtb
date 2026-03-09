import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      'SELECT r.*, u.email, CONCAT(u."firstName", \' \', u."lastName") as "userName" FROM public.ticket_replies r JOIN public.users u ON u.id = r."userId" WHERE r."ticketId" =  ORDER BY r."createdAt" ASC',
      [params.id]
    );
    
    return NextResponse.json({ replies: result.rows });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({ replies: [] });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { message, isAdmin } = await request.json();
    const adminId = '00000000-0000-0000-0000-000000000000';
    
    const result = await pool.query(
      'INSERT INTO public.ticket_replies ("ticketId", "userId", message, "isAdmin") VALUES (, , , ) RETURNING *',
      [params.id, adminId, message, isAdmin]
    );
    
    if (isAdmin) {
      await pool.query(
        'UPDATE public.tickets SET status = , "updatedAt" = NOW() WHERE id = ',
        ['in-progress', params.id]
      );
    }
    
    return NextResponse.json({ reply: result.rows[0] });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}
