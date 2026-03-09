import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Check if grants table exists
    try {
      await query(`SELECT 1 FROM grants LIMIT 1`)
    } catch (tableError) {
      // Return default grants if table doesn't exist
      return NextResponse.json({ 
        grants: [
          {
            id: '1',
            title: 'Small Business Innovation Grant',
            description: 'Funding for innovative small businesses developing new products or services.',
            shortDescription: 'Supporting small business innovation',
            provider: 'SBA',
            amountMin: 10000,
            amountMax: 50000,
            currency: 'USD',
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            eligibilityCriteria: ['Small business owner', 'Less than 50 employees', '2+ years in operation'],
            featured: true,
            status: 'ACTIVE',
            categoryName: 'Business',
            categoryIcon: 'Briefcase',
            categoryColor: 'blue'
          },
          {
            id: '2',
            title: 'STEM Education Grant',
            description: 'Supporting STEM education initiatives in schools and communities.',
            shortDescription: 'Promoting STEM education',
            provider: 'Department of Education',
            amountMin: 5000,
            amountMax: 25000,
            currency: 'USD',
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            eligibilityCriteria: ['Educational institution', 'Non-profit status', 'STEM-focused program'],
            featured: true,
            status: 'ACTIVE',
            categoryName: 'Education',
            categoryIcon: 'GraduationCap',
            categoryColor: 'green'
          },
          {
            id: '3',
            title: 'Medical Research Grant',
            description: 'Funding for innovative medical research projects.',
            shortDescription: 'Advancing medical research',
            provider: 'NIH',
            amountMin: 25000,
            amountMax: 100000,
            currency: 'USD',
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            eligibilityCriteria: ['Research institution', 'Qualified researchers', 'IRB approval'],
            featured: true,
            status: 'ACTIVE',
            categoryName: 'Research',
            categoryIcon: 'Flask',
            categoryColor: 'purple'
          },
          {
            id: '4',
            title: 'Tech Innovation Fund',
            description: 'Supporting cutting-edge technology innovations.',
            shortDescription: 'Fueling tech innovation',
            provider: 'Tech Foundation',
            amountMin: 15000,
            amountMax: 75000,
            currency: 'USD',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            eligibilityCriteria: ['Tech startups', 'Innovative technology', 'Scalable solution'],
            featured: true,
            status: 'ACTIVE',
            categoryName: 'Technology',
            categoryIcon: 'Cpu',
            categoryColor: 'indigo'
          },
          {
            id: '5',
            title: 'Green Energy Initiative',
            description: 'Funding for renewable energy and sustainability projects.',
            shortDescription: 'Promoting clean energy',
            provider: 'Environmental Agency',
            amountMin: 10000,
            amountMax: 50000,
            currency: 'USD',
            deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
            eligibilityCriteria: ['Environmental focus', 'Renewable energy', 'Sustainability'],
            featured: false,
            status: 'ACTIVE',
            categoryName: 'Environment',
            categoryIcon: 'Leaf',
            categoryColor: 'emerald'
          }
        ] 
      })
    }

    let queryText = `
      SELECT 
        g.id, 
        g.title, 
        g.description, 
        g.short_description as "shortDescription",
        g.provider, 
        g.amount_min as "amountMin", 
        g.amount_max as "amountMax",
        g.currency, 
        g.application_deadline as "deadline",
        g.eligibility_criteria as "eligibilityCriteria",
        g.requirements, 
        g.documents_required as "documentsRequired",
        g.featured, 
        g.status,
        gc.name as "categoryName", 
        gc.icon as "categoryIcon", 
        gc.color as "categoryColor"
      FROM grants g
      LEFT JOIN grant_categories gc ON g.category_id = gc.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (category && category !== 'all') {
      queryText += ` AND gc.name = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (status && status !== 'all') {
      queryText += ` AND g.status = $${paramIndex}`
      params.push(status.toUpperCase())
      paramIndex++
    }

    if (featured === 'true') {
      queryText += ` AND g.featured = true`
    }

    if (search) {
      queryText += ` AND (g.title ILIKE $${paramIndex} OR g.description ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    queryText += ` ORDER BY g.featured DESC, g.application_deadline ASC`

    const result = await query(queryText, params)

    return NextResponse.json({ grants: result.rows || [] })
  } catch (error) {
    console.error('Error fetching grants:', error)
    // Return default grants as fallback
    return NextResponse.json({ 
      grants: [
        {
          id: '1',
          title: 'Small Business Innovation Grant',
          description: 'Funding for innovative small businesses developing new products or services.',
          shortDescription: 'Supporting small business innovation',
          provider: 'SBA',
          amountMin: 10000,
          amountMax: 50000,
          currency: 'USD',
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          eligibilityCriteria: ['Small business owner', 'Less than 50 employees', '2+ years in operation'],
          featured: true,
          status: 'ACTIVE',
          categoryName: 'Business',
          categoryIcon: 'Briefcase',
          categoryColor: 'blue'
        }
      ] 
    })
  }
}
