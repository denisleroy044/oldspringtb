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
