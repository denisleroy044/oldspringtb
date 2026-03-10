import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Check if table exists
    try {
      await query(`SELECT 1 FROM grant_categories LIMIT 1`)
    } catch (tableError) {
      // Return default categories if table doesn't exist
      return NextResponse.json({ 
        categories: [
          { id: '1', name: 'Business', description: 'Grants for startups and small businesses', icon: 'Briefcase', color: 'blue', featured: true },
          { id: '2', name: 'Education', description: 'Scholarships and grants for students and educators', icon: 'GraduationCap', color: 'green', featured: true },
          { id: '3', name: 'Research', description: 'Funding for scientific and academic research', icon: 'Flask', color: 'purple', featured: true },
          { id: '4', name: 'Arts & Culture', description: 'Grants for artists and cultural projects', icon: 'Palette', color: 'pink', featured: true },
          { id: '5', name: 'Non-Profit', description: 'Funding for non-profit organizations', icon: 'Heart', color: 'red', featured: true },
          { id: '6', name: 'Technology', description: 'Tech innovation and development grants', icon: 'Cpu', color: 'indigo', featured: true },
          { id: '7', name: 'Healthcare', description: 'Medical and healthcare research grants', icon: 'Activity', color: 'teal', featured: true },
          { id: '8', name: 'Environment', description: 'Environmental conservation grants', icon: 'Leaf', color: 'emerald', featured: true },
          { id: '9', name: 'Community', description: 'Community development grants', icon: 'Users', color: 'orange', featured: true },
          { id: '10', name: 'Women', description: 'Grants for women entrepreneurs', icon: 'Venus', color: 'rose', featured: true }
        ] 
      })
    }

    const result = await query(
      `SELECT 
        id, name, description, icon, color, featured
       FROM grant_categories
       WHERE is_active = true
       ORDER BY featured DESC, name ASC`
    )
    return NextResponse.json({ categories: result.rows || [] })
  } catch (error) {
    console.error('Error fetching grant categories:', error)
    // Return default categories as fallback
    return NextResponse.json({ 
      categories: [
        { id: '1', name: 'Business', description: 'Grants for startups and small businesses', icon: 'Briefcase', color: 'blue', featured: true },
        { id: '2', name: 'Education', description: 'Scholarships and grants for students and educators', icon: 'GraduationCap', color: 'green', featured: true }
      ] 
    })
  }
}
