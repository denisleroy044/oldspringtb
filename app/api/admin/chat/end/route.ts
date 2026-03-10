import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }
    
    await pool.query(`
      UPDATE public.chat_sessions 
      SET status = 'ended', "endedAt" = NOW() 
      WHERE id = $1
    `, [sessionId]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error ending chat session:', error);
    return NextResponse.json({ error: 'Failed to end chat' }, { status: 500 });
  }
}
