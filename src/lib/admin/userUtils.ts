// Utility to get users from client-side storage
// This runs on the server side but can access cookies/session

import { cookies } from 'next/headers'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  phone?: string
  role?: string
  kycStatus?: string
  isActive?: boolean
  createdAt?: string
  balance?: number
  accounts?: any[]
  transaction_count?: number
  total_deposits?: number
  pending_loans?: number
  pending_grants?: number
}

// Sample users for development/testing
export const sampleUsers: User[] = [
  {
    id: 'user_001',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    phone: '+1234567890',
    role: 'USER',
    kycStatus: 'verified',
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 15250.50,
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
    name: 'Jane Smith',
    phone: '+1234567891',
    role: 'USER',
    kycStatus: 'pending',
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 5000.00,
    accounts: [
      {
        id: 'acc_002',
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
  },
  {
    id: 'user_003',
    email: 'admin@oldspringtrust.com',
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    phone: '+1234567892',
    role: 'ADMIN',
    kycStatus: 'verified',
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 100000.00,
    accounts: [
      {
        id: 'acc_003',
        type: 'Business Account',
        number: '****7777',
        balance: 100000.00,
        status: 'ACTIVE'
      }
    ],
    transaction_count: 50,
    total_deposits: 100000,
    pending_loans: 0,
    pending_grants: 0
  }
]

// Get users from various sources
export async function getUsers(): Promise<User[]> {
  try {
    // In a real app, you would fetch from database
    // For now, return sample users
    return sampleUsers
  } catch (error) {
    console.error('Error getting users:', error)
    return sampleUsers
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers()
  return users.find(u => u.id === id) || null
}

// Update user
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  // In a real app, you would update in database
  // For now, just return success with updates applied
  const user = await getUserById(id)
  if (!user) return null
  return { ...user, ...updates }
}
