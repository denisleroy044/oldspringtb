export type AccountType = 'savings' | 'checking' | 'money_market' | 'cd'
export type AccountRequestStatus = 'pending' | 'approved' | 'rejected'

export interface AccountRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: AccountType
  accountName: string
  initialDeposit: number
  status: AccountRequestStatus
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  documents?: {
    id: string
    type: string
    url: string
  }[]
  notes?: AdminNote[]
}

export interface AdminNote {
  id: string
  adminId: string
  adminName: string
  content: string
  createdAt: string
}

export interface AccountProduct {
  id: string
  type: AccountType
  name: string
  description: string
  interestRate: number
  minimumDeposit: number
  monthlyFee: number
  features: string[]
  icon: string
  color: string
  gradient: string
}
