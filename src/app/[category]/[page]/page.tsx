import { notFound } from 'next/navigation'

// Define all possible paths for static generation
export function generateStaticParams() {
  const categories = ['bank', 'save', 'borrow', 'invest', 'insurance', 'learn']
  const pages = ['index', 'details', 'faq']
  
  const params = []
  
  for (const category of categories) {
    for (const page of pages) {
      params.push({
        category,
        page,
      })
    }
  }
  
  return params
}

export default function DynamicPage({ params }: { params: { category: string; page: string } }) {
  const { category, page } = params
  
  // Map to readable titles
  const categoryTitles: Record<string, string> = {
    bank: 'Banking',
    save: 'Savings',
    borrow: 'Borrowing',
    invest: 'Investing',
    insurance: 'Insurance',
    learn: 'Learning',
  }
  
  const pageTitles: Record<string, string> = {
    index: 'Overview',
    details: 'Details',
    faq: 'FAQ',
  }
  
  // If category or page doesn't exist, return 404
  if (!categoryTitles[category] || !pageTitles[page]) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-deep-teal mb-4 capitalize">
          {categoryTitles[category]} - {pageTitles[page]}
        </h1>
        <p className="text-gray-600 mb-8">
          This is the {pageTitles[page].toLowerCase()} page for our {categoryTitles[category].toLowerCase()} services.
        </p>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600">
            Content for {categoryTitles[category]} - {pageTitles[page]} will be displayed here.
          </p>
        </div>
      </div>
    </div>
  )
}
