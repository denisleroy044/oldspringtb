import { NextResponse } from 'next/server'

export async function GET() {
  const mockData = {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      accountName: 'Johnathan M. Doe',
      accountStatus: 'Premium Member',
      lastLogin: '2024-02-16 09:30 AM',
      avatar: '/assets/img/avatars/default-avatar.png',
      personalAccount: {
        number: '**** 4582 9632 7410',
        balance: 54750.80
      },
      checkingAccount: {
        number: '**** 1122 3344 5566',
        balance: 12350.25
      }
    },
    transactions: [
      {
        id: 1,
        accountName: 'Amazon Prime',
        accountNumber: '**** 7890',
        bankName: 'Amazon Payments',
        amount: 14.99,
        status: 'completed',
        date: '2024-02-16',
        type: 'debit'
      },
      {
        id: 2,
        accountName: 'Salary Deposit',
        accountNumber: '**** 1234',
        bankName: 'Employer Corp',
        amount: 3500.00,
        status: 'completed',
        date: '2024-02-15',
        type: 'credit'
      }
    ]
  }

  return NextResponse.json(mockData)
}
