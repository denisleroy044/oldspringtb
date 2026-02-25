'use client'

import { useState, useEffect, useRef } from 'react'

interface OTPModalProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (code: string) => Promise<boolean>
  phoneNumber: string
  purpose: string
}

export function OTPModal({ isOpen, onClose, onVerify, phoneNumber, purpose }: OTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(300)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!isOpen) return

    inputRefs.current[0]?.focus()
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setOtp(['', '', '', '', '', ''])
      setTimer(300)
      setError('')
      setCanResend(false)
    }
  }, [isOpen])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('')
      const newOtp = [...otp]
      pastedCode.forEach((char, i) => {
        if (i < 6) newOtp[i] = char
      })
      setOtp(newOtp)
      
      const lastFilledIndex = Math.min(pastedCode.length, 5)
      inputRefs.current[lastFilledIndex]?.focus()
    } else {
      if (/^\d*$/.test(value)) {
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
          inputRefs.current[index + 1]?.focus()
        }
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsVerifying(true)
    setError('')

    const isValid = await onVerify(code)
    
    if (isValid) {
      onClose()
    } else {
      setError('Invalid OTP code')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
    
    setIsVerifying(false)
  }

  const handleResend = async () => {
    setTimer(300)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    setError('')
    await onVerify('RESEND')
  }

  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Required</h2>
          <p className="text-gray-600">
            Enter the 6-digit code sent to <span className="font-semibold">{phoneNumber}</span>
          </p>
        </div>

        <div className="flex justify-center space-x-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isVerifying}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        <div className="text-center mb-6">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Code expires in <span className="font-semibold text-[#1e3a5f]">{formatTime(timer)}</span>
            </p>
          ) : (
            <p className="text-sm text-red-500">Code expired</p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleVerify}
            disabled={isVerifying || otp.join('').length !== 6}
            className="w-full bg-[#1e3a5f] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#2b4c7a] disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </button>

          <button
            onClick={handleResend}
            disabled={!canResend}
            className="w-full text-[#1e3a5f] font-semibold py-2 hover:text-[#2b4c7a] disabled:opacity-50"
          >
            Resend Code
          </button>

          <button
            onClick={onClose}
            className="w-full text-gray-500 py-2 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
