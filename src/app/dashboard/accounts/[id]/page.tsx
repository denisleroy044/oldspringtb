import { notFound } from 'next/navigation'

// Generate all possible account IDs for static export
export function generateStaticParams() {
  // For static export, we need to define all possible account IDs
  // These should match the accounts in your database/mock data
  const accountIds = ['1', '2', '3'] // Add all your account IDs here
  
  return accountIds.map((id) => ({
    id: id,
  }))
}

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  // Mock account data (in real app, fetch from database)
  const accounts: Record<string, { name: string; type: string; balance: number }> = {
    '1': { name: 'Primary Checking', type: 'CHECKING', balance: 5280.42 },
    '2': { name: 'High-Yield Savings', type: 'SAVINGS', balance: 12750.89 },
    '3': { name: 'Rewards Credit Card', type: 'CREDIT', balance: -3249.25 },
  }
  
  const account = accounts[id]
  
  if (!account) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-deep-teal mb-4">{account.name}</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-2">Account Type: {account.type}</p>
          <p className="text-gray-600 mb-2">Balance: ${account.balance.toLocaleString()}</p>
          <p className="text-gray-600">Account ID: {id}</p>
        </div>
      </div>
    </div>
  )
}
