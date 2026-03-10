import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    // In a real app, get admin ID from session
    const adminId = '00000000-0000-0000-0000-000000000000';
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }
    
    await pool.query(`
      UPDATE public.chat_messages 
      SET "isRead" = true, "readAt" = NOW() 
      WHERE "sessionId" = $1 AND "userId" != $2 AND "isRead" = false
    `, [sessionId, adminId]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}
