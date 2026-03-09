import Link from 'next/link'
import { notFound } from 'next/navigation'

// This is a static page for blog/articles
export default async function DynamicPage({ params }: { params: Promise<{ category: string; page: string }> }) {
  // In Next.js 15+, params is a Promise that needs to be awaited
  const { category, page } = await params

  // Map to readable titles
  const categoryTitles: Record<string, string> = {
    'tax-checklist-5-things-to-remember': 'Tax Checklist: 5 Things to Remember',
    'how-to-save-for-summer-vacation': 'How to Save for Summer Vacation',
    'simple-ways-to-manage-a-checking-account': 'Simple Ways to Manage a Checking Account',
    'the-impact-of-rising-rates-and-inflation-on-your-business': 'The Impact of Rising Rates and Inflation on Your Business'
  }

  const title = categoryTitles[category] || category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  // If category doesn't exist, return 404
  if (!categoryTitles[category]) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/learn-and-plan" className="text-deep-teal hover:text-soft-gold mb-4 inline-flex items-center gap-2">
          ← Back to Learn & Plan
        </Link>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-sage/20">
          <h1 className="text-3xl font-bold text-deep-teal mb-6">{title}</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              This article is being updated. Please check back soon for the complete content.
            </p>
            <div className="bg-soft-gold/5 p-6 rounded-xl border border-soft-gold/20">
              <p className="text-sm text-gray-500">
                Published: March 2026 • Category: {category}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
