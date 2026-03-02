import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getAccounts } from '@/lib/server/accountData'
import AccountCards from '@/components/dashboard/AccountCards'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJWT } from '@/lib/auth'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    redirect('/auth/login')
  }
  
  try {
    const user = await verifyJWT(token)
    const accounts = await getAccounts(user.userId)
    
    return (
      <>
        <Header />
        <main className="min-h-screen bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-deep-teal mb-8">Dashboard</h1>
            <AccountCards accounts={accounts} />
          </div>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    redirect('/auth/login')
  }
}
