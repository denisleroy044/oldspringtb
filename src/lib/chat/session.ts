import { Pool } from 'pg'
import { randomBytes } from 'crypto'
import { notifyAdmin } from '@/lib/email/notifications'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function createChatSession(userId: string, userAgent?: string, ipAddress?: string) {
  const sessionId = randomBytes(16).toString('hex');
  
  const result = await pool.query(
    `INSERT INTO public.chat_sessions 
     ("userId", "sessionId", "userAgent", "ipAddress", status) 
     VALUES ($1, $2, $3, $4, 'active')
     RETURNING *`,
    [userId, sessionId, userAgent, ipAddress]
  );

  // Notify admin of new chat request
  const userResult = await pool.query(
    'SELECT email, "firstName", "lastName" FROM public.users WHERE id = $1',
    [userId]
  );
  
  const user = userResult.rows[0];
  
  await notifyAdmin({
    type: 'chat_request',
    subject: '🔔 New Chat Request',
    message: `
      <h2>New Chat Request</h2>
      <p><strong>User:</strong> ${user.firstName} ${user.lastName}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p><a href="${process.env.APP_URL}/admin/live-chat?session=${sessionId}">Click here to join the chat</a></p>
    `,
    metadata: { userId, sessionId }
  });

  return result.rows[0];
}

export async function sendChatMessage(sessionId: string, userId: string, message: string, isAdmin: boolean = false) {
  const result = await pool.query(
    `INSERT INTO public.chat_messages 
     ("sessionId", "userId", message, "isAdmin") 
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [sessionId, userId, message, isAdmin]
  );

  // Update session last activity
  await pool.query(
    'UPDATE public.chat_sessions SET "lastActivity" = NOW() WHERE id = $1',
    [sessionId]
  );

  return result.rows[0];
}

export async function getChatMessages(sessionId: string, limit: number = 50) {
  const result = await pool.query(
    `SELECT cm.*, u.email, u."firstName", u."lastName"
     FROM public.chat_messages cm
     JOIN public.users u ON u.id = cm."userId"
     WHERE cm."sessionId" = $1
     ORDER BY cm."createdAt" ASC
     LIMIT $2`,
    [sessionId, limit]
  );
  return result.rows;
}

export async function markMessagesAsRead(sessionId: string, userId: string) {
  await pool.query(
    `UPDATE public.chat_messages 
     SET "isRead" = true, "readAt" = NOW() 
     WHERE "sessionId" = $1 AND "userId" != $2 AND "isRead" = false`,
    [sessionId, userId]
  );
}

export async function endChatSession(sessionId: string) {
  await pool.query(
    `UPDATE public.chat_sessions 
     SET status = 'ended', "endedAt" = NOW() 
     WHERE id = $1`,
    [sessionId]
  );
}

export async function getActiveSessions() {
  const result = await pool.query(
    `SELECT cs.*, u.email, u."firstName", u."lastName",
            (SELECT COUNT(*) FROM public.chat_messages WHERE "sessionId" = cs.id AND "isRead" = false AND "isAdmin" = false) as unread_count
     FROM public.chat_sessions cs
     JOIN public.users u ON u.id = cs."userId"
     WHERE cs.status = 'active'
     ORDER BY cs."lastActivity" DESC`
  );
  return result.rows;
}
