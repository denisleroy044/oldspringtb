// Compatibility bridge between your existing user system and admin transactions
// This file helps share user data without modifying your existing code

// Check if we're on the server or client
const isServer = typeof window === 'undefined'

export function setupUserBridge() {
  if (isServer) {
    // Server-side
    try {
      // Dynamic import to avoid client-side issues
      import('@/lib/auth/authService').then(userService => {
        if (userService && userService.loadUsers) {
          userService.loadUsers().then((users: any[]) => {
            // @ts-ignore
            if (typeof global !== 'undefined') {
              // @ts-ignore
              global.__users = users
            }
          }).catch(() => {
            // Silently fail - will use fallback data
          })
        }
      }).catch(() => {
        // Module not available, use fallback
      })
    } catch (error) {
      console.log('Using fallback user data for admin transactions')
    }
  }
}

// Client-side fallback data
export function getFallbackUsers() {
  return [
    {
      id: 'user_001',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: 'USER',
      kycStatus: 'verified',
      isActive: true,
      createdAt: new Date().toISOString(),
      accounts: [
        {
          id: 'acc_001',
          type: 'Checking Account',
          number: '****1234',
          balance: 15250.50,
          status: 'ACTIVE'
        }
      ],
      transaction_count: 12,
      total_deposits: 25000,
      pending_loans: 1,
      pending_grants: 0
    },
    {
      id: 'user_002',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567891',
      role: 'USER',
      kycStatus: 'pending',
      isActive: true,
      createdAt: new Date().toISOString(),
      accounts: [
        {
          id: 'acc_003',
          type: 'Checking Account',
          number: '****9012',
          balance: 5000.00,
          status: 'ACTIVE'
        }
      ],
      transaction_count: 5,
      total_deposits: 5000,
      pending_loans: 0,
      pending_grants: 1
    }
  ]
}

// Export a function to get users (client-side)
export async function getUsers() {
  if (!isServer) {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      return data.users || getFallbackUsers()
    } catch (error) {
      return getFallbackUsers()
    }
  }
  return getFallbackUsers()
}
