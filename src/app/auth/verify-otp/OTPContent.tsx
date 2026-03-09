'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, RefreshCw, Loader2 } from 'lucide-react'

export default function OTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const purpose = searchParams.get('purpose') || 'ACCOUNT_OPENING'
  
  const [userId, setUserId] = useState('')
  const [requestId, setRequestId] = useState('')
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const id = sessionStorage.getItem('otp_user_id') || ''
    const rid = sessionStorage.getItem('otp_request_id') || ''
    
    if (!id) { 
      router.push('/auth/login'); 
      return 
    }
    
    setUserId(id)
    setRequestId(rid)
  }, [router])

  useEffect(() => {
    if (countdown <= 0) { 
      setCanResend(true); 
      return 
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      inputRefs.current[5]?.focus()
      handleVerify(text)
    }
  }

  const handleVerify = async (code: string) => {
    if (code.length !== 6) { 
      setError('Please enter all 6 digits.'); 
      return 
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code, purpose, requestId }),
        credentials: 'include',
      })
      
      const data = await res.json()
      
      if (!res.ok) { 
        setError(data.error || 'Invalid code.')
        setOtp(Array(6).fill(''))
        inputRefs.current[0]?.focus()
        return 
      }
      
      sessionStorage.removeItem('otp_user_id')
      sessionStorage.removeItem('otp_purpose')
      sessionStorage.removeItem('otp_request_id')
      
      router.push(data.role === 'admin' ? '/admin' : '/dashboard')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    
    setResending(true)
    setError('')
    setSuccess('')
    
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, purpose, requestId }),
      })
      
      const data = await res.json()
      
      if (!res.ok) { 
        setError(data.error || 'Failed to resend.')
        return 
      }
      
      setSuccess('A new code has been sent to your email.')
      setOtp(Array(6).fill(''))
      inputRefs.current[0]?.focus()
      setCountdown(60)
      setCanResend(false)
      
      if (data.requestId) {
        sessionStorage.setItem('otp_request_id', data.requestId)
        setRequestId(data.requestId)
      }
    } catch {
      setError('Failed to resend. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const titleMap: Record<string, string> = {
    ACCOUNT_OPENING: 'Verify your email',
    '2FA': 'Two-factor authentication',
    PASSWORD_RESET: 'Reset your password',
  }

  return (
    <div className="flex justify-center items-center min-h-[500px]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-deep-teal to-sage rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-deep-teal mb-2">{titleMap[purpose] || 'Verify your email'}</h2>
          <p className="text-gray-600">We've sent a 6-digit code to your email address.</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-start gap-2">
            <span className="text-lg">✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* OTP Input */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50">
          <div className="flex gap-2 justify-center mb-8" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleInput(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all ${
                  digit
                    ? 'border-soft-gold bg-soft-gold/5 text-deep-teal'
                    : 'border-gray-200 focus:border-soft-gold'
                }`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify(otp.join(''))}
            disabled={loading || otp.join('').length !== 6}
            className="w-full h-12 bg-gradient-to-r from-deep-teal to-sage text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center mb-4"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Verify Code'}
          </button>

          {/* Resend */}
          <div className="text-center">
            {canResend ? (
              <button 
                onClick={handleResend} 
                disabled={resending} 
                className="flex items-center gap-2 mx-auto text-sm text-deep-teal font-semibold hover:text-soft-gold transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Sending...' : 'Resend code'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend code in <span className="font-bold text-deep-teal">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link href="/auth/login" className="text-deep-teal font-medium hover:text-soft-gold transition-colors">
              ← Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
