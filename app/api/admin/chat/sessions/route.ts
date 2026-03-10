import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        cs.*, 
        u.email, 
        u."firstName", 
        u."lastName",
        CONCAT(u."firstName", ' ', u."lastName") as "userName",
        (SELECT COUNT(*) FROM public.chat_messages WHERE "sessionId" = cs.id AND "isRead" = false AND "isAdmin" = false) as unread_count
      FROM public.chat_sessions cs
      JOIN public.users u ON u.id = cs."userId"
      WHERE cs.status = 'active'
      ORDER BY cs."lastActivity" DESC
    `);
    
    return NextResponse.json({ sessions: result.rows });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ sessions: [] });
  }
}
