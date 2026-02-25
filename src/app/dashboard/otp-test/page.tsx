'use client'

import { useState } from 'react'
import { useDashboardContext } from '@/context/DashboardContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { OTPModal } from '@/components/dashboard/otp/OTPModal'
import { requestOTP, verifyOTP } from '@/lib/otp/otpUtils'

export default function OTPTestPage() {
  const { user } = useDashboardContext()
  const [showOTP, setShowOTP] = useState(false)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [testResults, setTestResults] = useState<Array<{type: string, status: 'success' | 'error' | 'pending', message: string, timestamp: string}>>([])
  const [activeTest, setActiveTest] = useState<string | null>(null)

  const addResult = (type: string, status: 'success' | 'error' | 'pending', message: string) => {
    setTestResults(prev => [{
      type,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev])
  }

  const testOTPRequest = async () => {
    setActiveTest('request')
    addResult('OTP Request', 'pending', 'Requesting OTP...')
    
    try {
      const response = await requestOTP(user?.personalAccount.number || '1234567890', 'test')
      
      if (response.success && response.requestId) {
        setOtpRequestId(response.requestId)
        addResult('OTP Request', 'success', `OTP sent! Request ID: ${response.requestId}`)
        
        // Log the OTP to console for testing
        console.log('🔐 Test OTP - Check console for the 6-digit code')
      } else {
        addResult('OTP Request', 'error', 'Failed to send OTP')
      }
    } catch (error) {
      addResult('OTP Request', 'error', `Error: ${error}`)
    }
    
    setActiveTest(null)
  }

  const testOTPVerification = async (code: string) => {
    setActiveTest('verify')
    addResult('OTP Verify', 'pending', `Verifying code: ${code}...`)
    
    try {
      const isValid = await verifyOTP(otpRequestId, code)
      
      if (isValid) {
        addResult('OTP Verify', 'success', '✅ OTP verified successfully!')
      } else {
        addResult('OTP Verify', 'error', '❌ Invalid OTP code')
      }
    } catch (error) {
      addResult('OTP Verify', 'error', `Error: ${error}`)
    }
    
    setActiveTest(null)
    setShowOTP(false)
  }

  const simulateTransactionOTP = async () => {
    setActiveTest('transaction')
    addResult('Transaction OTP', 'pending', 'Requesting OTP for transaction...')
    
    try {
      const response = await requestOTP(user?.personalAccount.number || '1234567890', 'transaction')
      
      if (response.success && response.requestId) {
        setOtpRequestId(response.requestId)
        addResult('Transaction OTP', 'success', 'OTP sent for transaction verification')
        setShowOTP(true)
      }
    } catch (error) {
      addResult('Transaction OTP', 'error', `Error: ${error}`)
    }
    
    setActiveTest(null)
  }

  const simulateLoginOTP = async () => {
    setActiveTest('login')
    addResult('Login OTP', 'pending', 'Requesting OTP for login...')
    
    try {
      const response = await requestOTP(user?.personalAccount.number || '1234567890', 'login')
      
      if (response.success && response.requestId) {
        setOtpRequestId(response.requestId)
        addResult('Login OTP', 'success', 'OTP sent for login verification')
        setShowOTP(true)
      }
    } catch (error) {
      addResult('Login OTP', 'error', `Error: ${error}`)
    }
    
    setActiveTest(null)
  }

  const clearResults = () => {
    setTestResults([])
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Please log in to access this page</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <main className="flex-1 pt-24 px-6 pb-6">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">OTP Testing Dashboard</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Test OTP functionality for signups, transactions, and logins</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Controls */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Controls</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={testOTPRequest}
                    disabled={activeTest !== null}
                    className="w-full px-4 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2b4c7a] transition disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {activeTest === 'request' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Requesting...</span>
                      </>
                    ) : (
                      '📱 Test OTP Request'
                    )}
                  </button>

                  <button
                    onClick={simulateTransactionOTP}
                    disabled={activeTest !== null}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                  >
                    💳 Simulate Transaction OTP
                  </button>

                  <button
                    onClick={simulateLoginOTP}
                    disabled={activeTest !== null}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    🔐 Simulate Login OTP
                  </button>

                  <button
                    onClick={clearResults}
                    className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    🧹 Clear Results
                  </button>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">📋 Instructions</h3>
                  <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
                    <li>Click "Test OTP Request" to generate an OTP</li>
                    <li>Check the browser console for the 6-digit code</li>
                    <li>Use the OTP modal that appears to test verification</li>
                    <li>Transaction and Login simulations show different OTP contexts</li>
                    <li>All test results are logged below</li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    OTP codes are logged to the console for testing
                  </p>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
                
                {testResults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🧪</div>
                    <p className="text-gray-500">No tests run yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click a test button to begin</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.status === 'success' ? 'bg-green-50 border-green-200' :
                          result.status === 'error' ? 'bg-red-50 border-red-200' :
                          'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⏳'}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{result.type}</p>
                              <p className="text-xs text-gray-600 mt-0.5">{result.message}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">{result.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <DashboardFooter />
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerify={testOTPVerification}
        phoneNumber={user?.personalAccount.number || '****'}
        purpose="test verification"
      />
    </div>
  )
}
