import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Check if table exists
    try {
      await query(`SELECT 1 FROM savings_templates LIMIT 1`)
    } catch (tableError) {
      // Return default templates if table doesn't exist
      return NextResponse.json({ 
        templates: [
          { id: '1', name: 'Emergency Fund', description: 'Save for unexpected expenses', defaultTargetAmount: 10000, icon: 'Shield', color: '#ef4444' },
          { id: '2', name: 'Vacation', description: 'Save for your dream vacation', defaultTargetAmount: 5000, icon: 'Plane', color: '#3b82f6' },
          { id: '3', name: 'New Car', description: 'Save for a vehicle purchase', defaultTargetAmount: 25000, icon: 'Car', color: '#10b981' },
          { id: '4', name: 'Home Down Payment', description: 'Save for your first home', defaultTargetAmount: 50000, icon: 'Home', color: '#8b5cf6' },
          { id: '5', name: 'Wedding', description: 'Save for your special day', defaultTargetAmount: 15000, icon: 'Heart', color: '#ec4899' }
        ] 
      })
    }

    const result = await query(
      `SELECT 
        id, name, description, default_target_amount as "defaultTargetAmount",
        icon, color
       FROM savings_templates
       WHERE is_active = true
       ORDER BY name`
    )
    return NextResponse.json({ templates: result.rows || [] })
  } catch (error) {
    console.error('Error fetching savings templates:', error)
    return NextResponse.json({ templates: [] })
  }
}
