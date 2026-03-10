import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Return empty notifications for now to avoid 401
  return NextResponse.json({ notifications: [] })
}
