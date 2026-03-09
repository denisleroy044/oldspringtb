import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT t.*, u.email as "userEmail", CONCAT(u."firstName", \' \', u."lastName") as "userName", (SELECT COUNT(*) FROM public.ticket_replies WHERE "ticketId" = t.id) as "replyCount" FROM public.tickets t JOIN public.users u ON u.id = t."userId" ORDER BY t."createdAt" DESC'
    );
    
    return NextResponse.json({ tickets: result.rows });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ tickets: [] });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { ticketId, status } = await request.json();
    
    await pool.query(
      'UPDATE public.tickets SET status = , "updatedAt" = NOW() WHERE id = ',
      [status, ticketId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
