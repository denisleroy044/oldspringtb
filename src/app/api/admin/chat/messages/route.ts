import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }
    
    const result = await pool.query(`
      SELECT 
        cm.*, 
        u.email, 
        u."firstName", 
        u."lastName"
      FROM public.chat_messages cm
      JOIN public.users u ON u.id = cm."userId"
      WHERE cm."sessionId" = $1
      ORDER BY cm."createdAt" ASC
    `, [sessionId]);
    
    return NextResponse.json({ messages: result.rows });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, isAdmin } = await request.json();
    // In a real app, get admin ID from session
    const adminId = '00000000-0000-0000-0000-000000000000';
    
    const result = await pool.query(`
      INSERT INTO public.chat_messages ("sessionId", "userId", message, "isAdmin") 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `, [sessionId, adminId, message, isAdmin]);

    // Update session last activity
    await pool.query(
      'UPDATE public.chat_sessions SET "lastActivity" = NOW() WHERE id = $1',
      [sessionId]
    );
    
    return NextResponse.json({ message: result.rows[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
