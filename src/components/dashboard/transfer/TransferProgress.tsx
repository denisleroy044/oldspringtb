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
