import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/settings';

export async function GET() {
  try {
    const settings = await getSettings(true);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ settings: {} });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { settings } = await request.json();
    const adminId = '00000000-0000-0000-0000-000000000000';
    
    await updateSettings(settings, adminId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
