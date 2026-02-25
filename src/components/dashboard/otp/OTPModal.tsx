'use client'

import { useState } from 'react'

interface OTPModalProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (code: string) => Promise<boolean>
  email?: string  // Add email prop
}

export function OTPModal({ isOpen, onClose, onVerify, email }: OTPModalProps) {
  const [otpCode, setOtpCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length !== 6) return

    setIsLoading(true)
    setError(null)

    try {
      const isValid = await onVerify(otpCode)
      if (!isValid) {
        setError('Invalid verification code')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-deep-teal mb-2">Verify Your Identity</h3>
        <p className="text-gray-600 mb-4">
          Enter the 6-digit verification code sent to {email || 'your email'}.
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent mb-4 text-center text-2xl tracking-widest"
            maxLength={6}
            disabled={isLoading}
            autoFocus
          />
          
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="flex-1 bg-deep-teal text-white py-3 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
