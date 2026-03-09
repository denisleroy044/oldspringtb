#!/bin/bash

# Transfer Page Setup for Next.js
# Save this as scripts/setup_transfer.sh and run it

echo "🏦 Setting up Transfer Page for Oldspring Trust Bank"
echo "===================================================="

# Create transfer page directory and components
mkdir -p src/app/dashboard/transfer
mkdir -p src/components/dashboard/transfer
mkdir -p src/lib/transfer

# ============================================
# Transfer Types
# ============================================
cat > src/types/transfer.ts << 'EOF'
export interface TransferDetails {
  id?: string;
  recipientAccountNumber: string;
  recipientAccountName: string;
  amount: number;
  bankName: string;
  swiftCode: string;
  routingNumber: string;
  description?: string;
}

export interface TransferStatus {
  id: string;
  owner: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  securityCodes?: {
    level1: boolean;
    level2: boolean;
    level3: boolean;
    level4: boolean;
  };
}

export interface TransferProgress {
  percentage: number;
  currentStep: number;
  totalSteps: number;
  message: string;
  securityCodeRequired?: boolean;
  securityCodeLevel?: number;
}
EOF

# ============================================
# Transfer Utilities
# ============================================
cat > src/lib/transfer/transferUtils.ts << 'EOF'
import { TransferDetails, TransferStatus } from '@/types/transfer';

// Mock database - In production, this would be your actual database
interface TransferStore {
  [key: string]: TransferStatus;
}

const transferStore: TransferStore = {};

// Security codes for different levels (in production, these would be generated dynamically)
const SECURITY_CODES = {
  1: '4356',
  2: '3624',
  3: '7534',
  4: '7658'
};

export function createTransfer(owner: string, details: TransferDetails): string {
  const transferId = `TR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  transferStore[transferId] = {
    id: transferId,
    owner,
    amount: details.amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    securityCodes: {
      level1: false,
      level2: false,
      level3: false,
      level4: false
    }
  };

  return transferId;
}

export function getPendingTransfer(owner: string): TransferStatus | null {
  const transfers = Object.values(transferStore);
  return transfers.find(t => t.owner === owner && t.status === 'pending') || null;
}

export function getTransferById(id: string): TransferStatus | null {
  return transferStore[id] || null;
}

export function updateTransferStatus(id: string, status: TransferStatus['status']): void {
  if (transferStore[id]) {
    transferStore[id].status = status;
    transferStore[id].updatedAt = new Date().toISOString();
  }
}

export function verifySecurityCode(level: number, code: string): boolean {
  return SECURITY_CODES[level as keyof typeof SECURITY_CODES] === code;
}

export function markSecurityCodeComplete(id: string, level: number): void {
  if (transferStore[id] && transferStore[id].securityCodes) {
    transferStore[id].securityCodes[`level${level}` as keyof typeof transferStore[id].securityCodes] = true;
  }
}

export function areAllSecurityCodesComplete(id: string): boolean {
  const transfer = transferStore[id];
  if (!transfer || !transfer.securityCodes) return false;
  
  return Object.values(transfer.securityCodes).every(completed => completed === true);
}

export function completeTransfer(id: string, userBalance: number): { success: boolean; newBalance: number } {
  const transfer = transferStore[id];
  
  if (!transfer || transfer.status !== 'pending') {
    return { success: false, newBalance: userBalance };
  }

  const newBalance = userBalance - transfer.amount;
  
  if (newBalance < 0) {
    return { success: false, newBalance: userBalance };
  }

  transferStore[id].status = 'completed';
  transferStore[id].updatedAt = new Date().toISOString();
  
  return { success: true, newBalance };
}
EOF

# ============================================
# Transfer Context
# ============================================
cat > src/context/TransferContext.tsx << 'EOF'
'use client'

import React, { createContext, useContext, useState } from 'react'
import { TransferDetails, TransferStatus, TransferProgress } from '@/types/transfer'
import { createTransfer, getPendingTransfer, verifySecurityCode, markSecurityCodeComplete, areAllSecurityCodesComplete } from '@/lib/transfer/transferUtils'

interface TransferContextType {
  currentTransfer: TransferStatus | null
  transferProgress: TransferProgress
  createNewTransfer: (owner: string, details: TransferDetails) => string
  checkPendingTransfer: (owner: string) => TransferStatus | null
  verifyCode: (level: number, code: string) => boolean
  markCodeComplete: (level: number) => void
  updateProgress: (progress: Partial<TransferProgress>) => void
  resetTransfer: () => void
}

const TransferContext = createContext<TransferContextType | undefined>(undefined)

export function TransferProvider({ children }: { children: React.ReactNode }) {
  const [currentTransfer, setCurrentTransfer] = useState<TransferStatus | null>(null)
  const [transferProgress, setTransferProgress] = useState<TransferProgress>({
    percentage: 0,
    currentStep: 0,
    totalSteps: 5,
    message: 'Ready to start transfer'
  })

  const createNewTransfer = (owner: string, details: TransferDetails): string => {
    const transferId = createTransfer(owner, details)
    const transfer = { ...getPendingTransfer(owner)!, id: transferId }
    setCurrentTransfer(transfer)
    return transferId
  }

  const checkPendingTransfer = (owner: string): TransferStatus | null => {
    const transfer = getPendingTransfer(owner)
    setCurrentTransfer(transfer)
    return transfer
  }

  const verifyCode = (level: number, code: string): boolean => {
    return verifySecurityCode(level, code)
  }

  const markCodeComplete = (level: number) => {
    if (currentTransfer) {
      markSecurityCodeComplete(currentTransfer.id, level)
      setCurrentTransfer({ ...currentTransfer })
    }
  }

  const updateProgress = (progress: Partial<TransferProgress>) => {
    setTransferProgress(prev => ({ ...prev, ...progress }))
  }

  const resetTransfer = () => {
    setCurrentTransfer(null)
    setTransferProgress({
      percentage: 0,
      currentStep: 0,
      totalSteps: 5,
      message: 'Ready to start transfer'
    })
  }

  return (
    <TransferContext.Provider value={{
      currentTransfer,
      transferProgress,
      createNewTransfer,
      checkPendingTransfer,
      verifyCode,
      markCodeComplete,
      updateProgress,
      resetTransfer
    }}>
      {children}
    </TransferContext.Provider>
  )
}

export function useTransferContext() {
  const context = useContext(TransferContext)
  if (context === undefined) {
    throw new Error('useTransferContext must be used within a TransferProvider')
  }
  return context
}
EOF

# ============================================
# Transfer Form Component
# ============================================
cat > src/components/dashboard/transfer/TransferForm.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useDashboardContext } from '@/context/DashboardContext'
import { useTransferContext } from '@/context/TransferContext'
import { useRouter } from 'next/navigation'

export function TransferForm() {
  const router = useRouter()
  const { user } = useDashboardContext()
  const { createNewTransfer, checkPendingTransfer } = useTransferContext()
  
  const [formData, setFormData] = useState({
    recipientAccountNumber: '',
    recipientAccountName: '',
    amount: '',
    bankName: '',
    swiftCode: '',
    routingNumber: '',
    description: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Check for pending transfer
    const pendingTransfer = checkPendingTransfer(user.personalAccount.number)
    
    if (pendingTransfer) {
      router.push(`/dashboard/transfer?continue=${pendingTransfer.id}`)
      return
    }

    // Validate amount
    const amount = parseFloat(formData.amount)
    if (amount > user.personalAccount.balance) {
      setError('Insufficient funds')
      setIsSubmitting(false)
      return
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0')
      setIsSubmitting(false)
      return
    }

    // Create new transfer
    const transferId = createNewTransfer(user.personalAccount.number, {
      ...formData,
      amount: amount
    })

    // Redirect to transfer progress page
    router.push(`/dashboard/transfer/progress?id=${transferId}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Transfer Funds</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Available Balance</p>
        <p className="text-2xl font-bold text-[#1e3a5f]">
          ${user.personalAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Account Number *
            </label>
            <input
              type="text"
              name="recipientAccountNumber"
              value={formData.recipientAccountNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Account Name *
            </label>
            <input
              type="text"
              name="recipientAccountName"
              value={formData.recipientAccountName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter account name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0.01"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name *
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter bank name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Swift Code *
            </label>
            <input
              type="text"
              name="swiftCode"
              value={formData.swiftCode}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter SWIFT code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Routing Number *
            </label>
            <input
              type="text"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
              placeholder="Enter routing number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="Enter transfer description"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1e3a5f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2b4c7a] transition disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Continue Transfer'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our terms and conditions
        </p>
      </form>
    </div>
  )
}
EOF

# ============================================
# Transfer Progress Component
# ============================================
cat > src/components/dashboard/transfer/TransferProgress.tsx << 'EOF'
'use client'

import { useState, useEffect, useRef } from 'react'
import { useDashboardContext } from '@/context/DashboardContext'
import { useTransferContext } from '@/context/TransferContext'
import { useRouter } from 'next/navigation'

interface TransferProgressProps {
  transferId: string
}

export function TransferProgress({ transferId }: TransferProgressProps) {
  const router = useRouter()
  const { user, updateUserBalance } = useDashboardContext()
  const { 
    currentTransfer, 
    verifyCode, 
    markCodeComplete, 
    updateProgress,
    transferProgress 
  } = useTransferContext()
  
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [currentCodeLevel, setCurrentCodeLevel] = useState(1)
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [transferComplete, setTransferComplete] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!currentTransfer || currentTransfer.id !== transferId) {
      // Redirect to transfer form if no pending transfer
      router.push('/dashboard/transfer')
    }
  }, [currentTransfer, transferId, router])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTransfer = () => {
    updateProgress({
      message: 'Initializing transfer...',
      currentStep: 1
    })

    // Start the progress animation
    setTimeout(() => {
      updateProgress({
        message: 'Transfer in progress...',
        currentStep: 2
      })
      startProgressAnimation()
    }, 5000)
  }

  const startProgressAnimation = () => {
    let progress = 0
    const limits = [40, 70, 80, 90]
    let currentLimitIndex = 0

    intervalRef.current = setInterval(() => {
      progress += 1
      updateProgress({ percentage: progress })

      // Check if we need to show security code
      if (progress >= limits[currentLimitIndex] && currentLimitIndex < limits.length) {
        clearInterval(intervalRef.current)
        setShowCodeInput(true)
        setCurrentCodeLevel(currentLimitIndex + 1)
        updateProgress({ 
          message: `Security verification level ${currentLimitIndex + 1} required`,
          securityCodeRequired: true,
          securityCodeLevel: currentLimitIndex + 1
        })
      }

      // Complete the transfer
      if (progress >= 100) {
        clearInterval(intervalRef.current)
        completeTransfer()
      }
    }, 90)
  }

  const handleCodeSubmit = () => {
    const isValid = verifyCode(currentCodeLevel, codeInput)

    if (isValid) {
      setCodeError(false)
      setShowCodeInput(false)
      setCodeInput('')
      markCodeComplete(currentCodeLevel)
      updateProgress({ securityCodeRequired: false })
      
      // Resume progress animation
      startProgressAnimation()
    } else {
      setCodeError(true)
      setCodeInput('')
    }
  }

  const completeTransfer = async () => {
    updateProgress({ message: 'Finishing transfer...' })

    // In production, this would call your API to update the balance
    setTimeout(() => {
      updateProgress({ message: 'Transfer completed successfully!', percentage: 100 })
      setTransferComplete(true)
      
      // Update user balance (in production, this would come from API)
      if (user && currentTransfer) {
        const newBalance = user.personalAccount.balance - currentTransfer.amount
        updateUserBalance(newBalance)
      }
    }, 2000)
  }

  const handleFinish = () => {
    router.push('/dashboard/transfer?complete=true')
  }

  if (!currentTransfer) return null

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Transfer Progress</h2>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-gray-600">Transfer Amount</p>
        <p className="text-2xl font-bold text-[#1e3a5f]">
          ${currentTransfer.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{transferProgress.message}</span>
            <span className="text-sm font-medium text-[#1e3a5f]">{transferProgress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#1e3a5f] to-[#e68a2e] h-4 transition-all duration-300 relative"
              style={{ width: `${transferProgress.percentage}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-25 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Security Code Input */}
        {showCodeInput && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-[#e68a2e] animate-pulse">
            <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">
              Security Verification Level {currentCodeLevel}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter the {currentCodeLevel === 1 ? 'first' : 
                currentCodeLevel === 2 ? 'second' : 
                currentCodeLevel === 3 ? 'third' : 'fourth'} security code
            </p>
            
            <div className="space-y-4">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter 4-digit code"
                maxLength={4}
                className={`w-full px-4 py-3 text-center text-2xl tracking-widest border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent ${
                  codeError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                autoFocus
              />
              
              {codeError && (
                <p className="text-sm text-red-600">Invalid code. Please try again.</p>
              )}

              <button
                onClick={handleCodeSubmit}
                className="w-full bg-[#e68a2e] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#f5a344] transition"
              >
                Validate Code
              </button>
            </div>
          </div>
        )}

        {/* Start Button */}
        {transferProgress.percentage === 0 && !transferComplete && (
          <button
            onClick={startTransfer}
            className="w-full bg-[#1e3a5f] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#2b4c7a] transition text-lg"
          >
            Start Transfer
          </button>
        )}

        {/* Complete Message */}
        {transferComplete && (
          <div className="mt-6 text-center">
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 font-semibold">Transfer completed successfully!</p>
            </div>
            <button
              onClick={handleFinish}
              className="bg-[#1e3a5f] text-white py-3 px-8 rounded-lg font-semibold hover:bg-[#2b4c7a] transition"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Security Note:</span> For demonstration purposes, 
          the security codes are: Level 1: 4356, Level 2: 3624, Level 3: 7534, Level 4: 7658
        </p>
      </div>
    </div>
  )
}
EOF

# ============================================
# Main Transfer Page
# ============================================
cat > src/app/dashboard/transfer/page.tsx << 'EOF'
'use client'

import { Suspense } from 'react'
import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { TransferProvider, useTransferContext } from '@/context/TransferContext'
import { TransferForm } from '@/components/dashboard/transfer/TransferForm'
import { TransferProgress } from '@/components/dashboard/transfer/TransferProgress'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { useSearchParams } from 'next/navigation'

function TransferContent() {
  const searchParams = useSearchParams()
  const continueId = searchParams?.get('continue')
  const complete = searchParams?.get('complete')
  const { user, loading } = useDashboardContext()
  const { checkPendingTransfer } = useTransferContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load user data</p>
      </div>
    )
  }

  // Check for pending transfer
  const pendingTransfer = checkPendingTransfer(user.personalAccount.number)

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="lg:ml-64">
        <Header />
        <main className="pt-24 px-6 pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Transfer Funds</h1>
            <p className="text-gray-600">Securely transfer money to other accounts</p>
          </div>

          {complete ? (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="mb-4 text-green-500">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Transfer Complete!</h2>
              <p className="text-gray-600 mb-6">Your transfer has been processed successfully.</p>
              <a 
                href="/dashboard"
                className="inline-block bg-[#1e3a5f] text-white py-3 px-8 rounded-lg font-semibold hover:bg-[#2b4c7a] transition"
              >
                Return to Dashboard
              </a>
            </div>
          ) : continueId ? (
            <TransferProgress transferId={continueId} />
          ) : (
            <TransferForm />
          )}
        </main>
      </div>
    </div>
  )
}

export default function TransferPage() {
  return (
    <DashboardProvider>
      <TransferProvider>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
          </div>
        }>
          <TransferContent />
        </Suspense>
      </TransferProvider>
    </DashboardProvider>
  )
}
EOF

# ============================================
# Update Dashboard Context with balance update function
# ============================================
cat >> src/context/DashboardContext.tsx << 'EOF'

export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider')
  }
  return context
}

// Add this function to the DashboardContextType interface
export interface DashboardContextType {
  user: User | null
  transactions: Transaction[]
  loading: boolean
  error: string | null
  updateUserBalance: (newBalance: number) => void
}

// Update the DashboardProvider to include the update function
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user: initialUser, transactions, loading, error } = useDashboard()
  const [user, setUser] = useState<User | null>(initialUser)

  useEffect(() => {
    setUser(initialUser)
  }, [initialUser])

  const updateUserBalance = (newBalance: number) => {
    if (user) {
      setUser({
        ...user,
        personalAccount: {
          ...user.personalAccount,
          balance: newBalance
        }
      })
    }
  }

  return (
    <DashboardContext.Provider value={{
      user,
      transactions,
      loading,
      error,
      updateUserBalance
    }}>
      {children}
    </DashboardContext.Provider>
  )
}
EOF

# ============================================
# Create API route for completing transfer
# ============================================
mkdir -p src/app/api/transfer

cat > src/app/api/transfer/complete/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import { completeTransfer, getTransferById } from '@/lib/transfer/transferUtils'

export async function POST(request: Request) {
  try {
    const { transferId, userId, currentBalance } = await request.json()

    // Validate transfer exists
    const transfer = getTransferById(transferId)
    if (!transfer) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 }
      )
    }

    // Complete the transfer
    const result = completeTransfer(transferId, currentBalance)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to complete transfer' },
        { status: 400 }
      )
    }

    // In production, you would:
    // 1. Update the database with the new balance
    // 2. Create a transaction record
    // 3. Send notifications

    return NextResponse.json({
      success: true,
      newBalance: result.newBalance,
      message: 'Transfer completed successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
EOF

echo "✅ Transfer page setup complete!"
echo ""
echo "Features implemented:"
echo "1. Multi-step transfer form with validation"
echo "2. Progress bar with security code verification"
echo "3. Balance check before transfer"
echo "4. Pending transfer detection"
echo "5. Security code simulation (4 levels)"
echo "6. Balance update after successful transfer"
echo "7. Responsive design"
echo "8. TypeScript support"
echo ""
echo "To test the transfer page:"
echo "1. Make sure your dev server is running"
echo "2. Visit: http://localhost:3000/dashboard/transfer"
echo "3. Fill in the transfer form"
echo "4. Use security codes: 4356, 3624, 7534, 7658"
echo ""
echo "The transfer will update the user's balance when completed!"
EOF

chmod +x scripts/setup_transfer.sh