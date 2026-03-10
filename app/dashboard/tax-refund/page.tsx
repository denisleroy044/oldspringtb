'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calculator,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Loader2,
  Plus,
  FileText,
  Download,
  Eye,
  DollarSign,
  Percent,
  Home,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Shield,
  Info,
  ArrowRight,
  ArrowLeft,
  Receipt,
  Banknote,
  PiggyBank,
  Building,
  CreditCard,
  Landmark,
  Wallet,
  RefreshCw,
  Search,
  Filter,
  Star,
  Sparkles,
  Award,
  Gift,
  Bell
} from 'lucide-react'

interface TaxApplication {
  id: string
  applicationNumber: string
  taxYear: number
  filingStatus: string
  totalIncome: number
  refundAmount: number
  amountDue: number
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  createdAt: string
  completedAt?: string
  expectedDepositDate?: string
}

interface TaxCalculation {
  totalIncome: number
  totalDeductions: number
  taxableIncome: number
  taxLiability: number
  totalCredits: number
  totalPayments: number
  refundAmount: number
  amountDue: number
  effectiveTaxRate: number
}

export default function TaxRefundPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [applications, setApplications] = useState<TaxApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [showApplication, setShowApplication] = useState(false)
  const [applicationStep, setApplicationStep] = useState(1)
  const [calculating, setCalculating] = useState(false)
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    // Tax Year
    taxYear: new Date().getFullYear(),
    
    // Personal Info
    filingStatus: '',
    dependents: 0,
    
    // Income
    income: {
      employment: '',
      business: '',
      investment: '',
      other: ''
    },
    
    // Deductions
    deductions: {
      useStandard: true,
      itemized: '',
      retirement: '',
      hsa: '',
      charitable: '',
      studentLoan: '',
      mortgage: '',
      propertyTax: '',
      stateLocalTax: ''
    },
    
    // Credits
    credits: {
      childTaxCredit: false,
      childCount: 0,
      educationCredit: false,
      earnedIncomeCredit: false,
      retirementSavingsCredit: false,
      energyCredit: false,
      foreignTaxCredit: false,
      foreignTaxPaid: ''
    },
    
    // Withholding
    withholding: {
      federal: '',
      state: '',
      estimated: '',
      priorYearCredit: ''
    },
    
    // Bank Account
    bankAccountId: '',
    accountNumberMasked: '',
    routingNumber: '',
    
    // Address
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: ''
    },
    
    // Documents
    documents: [] as any[]
  })

  const [accounts, setAccounts] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch applications
      const appsRes = await fetch('/api/tax-refund/applications')
      const appsData = await appsRes.json()
      setApplications(appsData.applications || [])

      // Fetch accounts for direct deposit
      const accountsRes = await fetch('/api/accounts')
      const accountsData = await accountsRes.json()
      setAccounts(accountsData.accounts || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTax = async () => {
    setCalculating(true)
    try {
      const response = await fetch('/api/tax-refund/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taxYear: formData.taxYear,
          filingStatus: formData.filingStatus,
          income: {
            total: parseFloat(formData.income.employment || '0') +
                   parseFloat(formData.income.business || '0') +
                   parseFloat(formData.income.investment || '0') +
                   parseFloat(formData.income.other || '0')
          },
          deductions: {
            useStandard: formData.deductions.useStandard,
            itemized: parseFloat(formData.deductions.itemized || '0')
          },
          credits: {
            childTaxCredit: formData.credits.childTaxCredit,
            childCount: formData.credits.childCount,
            educationCredit: formData.credits.educationCredit,
            earnedIncomeCredit: formData.credits.earnedIncomeCredit,
            retirementSavingsCredit: formData.credits.retirementSavingsCredit,
            energyCredit: formData.credits.energyCredit,
            foreignTaxCredit: formData.credits.foreignTaxCredit,
            foreignTaxPaid: parseFloat(formData.credits.foreignTaxPaid || '0')
          },
          withholding: {
            federal: parseFloat(formData.withholding.federal || '0'),
            state: parseFloat(formData.withholding.state || '0'),
            estimated: parseFloat(formData.withholding.estimated || '0'),
            priorYearCredit: parseFloat(formData.withholding.priorYearCredit || '0')
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setCalculation(data.calculation)
      }
    } catch (error) {
      console.error('Error calculating tax:', error)
    } finally {
      setCalculating(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/tax-refund/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setShowApplication(false)
        setApplicationStep(1)
        setCalculation(null)
        fetchData()
        alert('Tax refund application submitted successfully!')
      } else {
        alert(data.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'UNDER_REVIEW':
        return <Clock className="w-5 h-5 text-soft-gold animate-pulse" />
      case 'SUBMITTED':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-700'
      case 'REJECTED':
        return 'bg-red-100 text-red-700'
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-700'
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const pendingApplications = applications.filter(a => 
    a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW'
  )

  const totalRefunds = applications
    .filter(a => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + a.refundAmount, 0)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading tax information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Tax Refund</h1>
          <p className="text-gray-500 text-sm mt-1">File your taxes and track your refund</p>
        </div>
        <div className="flex items-center gap-4">
          {pendingApplications.length > 0 && (
            <div className="relative">
              <Bell className="w-5 h-5 text-soft-gold" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingApplications.length}
              </span>
            </div>
          )}
          <button
            onClick={() => setShowApplication(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-xl transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            File New Return
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Refunds Received</p>
          <p className="text-2xl font-bold text-deep-teal">{formatCurrency(totalRefunds)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Pending Returns</p>
          <p className="text-2xl font-bold text-soft-gold">{pendingApplications.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Completed Returns</p>
          <p className="text-2xl font-bold text-sage">
            {applications.filter(a => a.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Current Tax Year</p>
          <p className="text-2xl font-bold text-deep-teal">{new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Applications Table */}
      {applications.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Application</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Refund Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filed Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-deep-teal">{app.applicationNumber}</p>
                        <p className="text-xs text-gray-500">{app.filingStatus}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-deep-teal">
                      {app.taxYear}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {app.refundAmount > 0 ? (
                        <span className="font-bold text-green-600">
                          {formatCurrency(app.refundAmount)}
                        </span>
                      ) : app.amountDue > 0 ? (
                        <span className="font-bold text-red-600">
                          {formatCurrency(app.amountDue)} due
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {app.expectedDepositDate ? new Date(app.expectedDepositDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/tax-refund/${app.id}`}
                        className="inline-flex items-center gap-1 text-soft-gold hover:text-deep-teal"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-deep-teal mb-2">No Tax Returns Found</h3>
          <p className="text-gray-500 mb-6">Start by filing your first tax return</p>
          <button
            onClick={() => setShowApplication(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            File Your Taxes
          </button>
        </div>
      )}

      {/* Tax Application Modal */}
      {showApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-deep-teal">File Tax Return</h2>
                  <p className="text-sm text-gray-500 mt-1">Tax Year {formData.taxYear}</p>
                </div>
                <button
                  onClick={() => {
                    setShowApplication(false)
                    setApplicationStep(1)
                    setCalculation(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-6">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                      step <= applicationStep 
                        ? 'bg-gradient-to-r from-deep-teal to-sage text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step < applicationStep ? <CheckCircle className="w-4 h-4" /> : step}
                    </div>
                    {step < 5 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        step < applicationStep ? 'bg-gradient-to-r from-deep-teal to-sage' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 px-1 text-xs text-gray-500">
                <span>Personal</span>
                <span>Income</span>
                <span>Deductions</span>
                <span>Credits</span>
                <span>Review</span>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Step 1: Personal Information */}
              {applicationStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filing Status</label>
                    <select
                      value={formData.filingStatus}
                      onChange={(e) => setFormData({...formData, filingStatus: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    >
                      <option value="">Select filing status</option>
                      <option value="SINGLE">Single</option>
                      <option value="MARRIED_JOINT">Married Filing Jointly</option>
                      <option value="MARRIED_SEPARATE">Married Filing Separately</option>
                      <option value="HEAD_HOUSEHOLD">Head of Household</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Dependents</label>
                    <input
                      type="number"
                      value={formData.dependents}
                      onChange={(e) => setFormData({...formData, dependents: parseInt(e.target.value) || 0})}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-800">
                        Your filing status determines your tax rates and standard deduction amount.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Income */}
              {applicationStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Income (W-2)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.income.employment}
                        onChange={(e) => setFormData({
                          ...formData,
                          income: {...formData.income, employment: e.target.value}
                        })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Income (1099)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.income.business}
                        onChange={(e) => setFormData({
                          ...formData,
                          income: {...formData.income, business: e.target.value}
                        })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Income</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.income.investment}
                        onChange={(e) => setFormData({
                          ...formData,
                          income: {...formData.income, investment: e.target.value}
                        })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Other Income</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.income.other}
                        onChange={(e) => setFormData({
                          ...formData,
                          income: {...formData.income, other: e.target.value}
                        })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Deductions */}
              {applicationStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="useStandard"
                      checked={formData.deductions.useStandard}
                      onChange={(e) => setFormData({
                        ...formData,
                        deductions: {...formData.deductions, useStandard: e.target.checked}
                      })}
                      className="w-4 h-4 text-soft-gold focus:ring-soft-gold rounded"
                    />
                    <label htmlFor="useStandard" className="text-sm font-medium text-gray-700">
                      Use Standard Deduction
                    </label>
                  </div>

                  {!formData.deductions.useStandard && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Itemized Deductions</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={formData.deductions.itemized}
                            onChange={(e) => setFormData({
                              ...formData,
                              deductions: {...formData.deductions, itemized: e.target.value}
                            })}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Contributions</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={formData.deductions.retirement}
                            onChange={(e) => setFormData({
                              ...formData,
                              deductions: {...formData.deductions, retirement: e.target.value}
                            })}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Charitable Contributions</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={formData.deductions.charitable}
                            onChange={(e) => setFormData({
                              ...formData,
                              deductions: {...formData.deductions, charitable: e.target.value}
                            })}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mortgage Interest</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={formData.deductions.mortgage}
                            onChange={(e) => setFormData({
                              ...formData,
                              deductions: {...formData.deductions, mortgage: e.target.value}
                            })}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 4: Credits & Withholding */}
              {applicationStep === 4 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-deep-teal">Tax Credits</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.credits.childTaxCredit}
                        onChange={(e) => setFormData({
                          ...formData,
                          credits: {...formData.credits, childTaxCredit: e.target.checked}
                        })}
                        className="w-4 h-4 text-soft-gold focus:ring-soft-gold rounded"
                      />
                      <span className="text-sm text-gray-700">Child Tax Credit</span>
                    </label>

                    {formData.credits.childTaxCredit && (
                      <div>
                        <input
                          type="number"
                          placeholder="Number of children"
                          value={formData.credits.childCount}
                          onChange={(e) => setFormData({
                            ...formData,
                            credits: {...formData.credits, childCount: parseInt(e.target.value) || 0}
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.credits.educationCredit}
                        onChange={(e) => setFormData({
                          ...formData,
                          credits: {...formData.credits, educationCredit: e.target.checked}
                        })}
                        className="w-4 h-4 text-soft-gold focus:ring-soft-gold rounded"
                      />
                      <span className="text-sm text-gray-700">Education Credit</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.credits.earnedIncomeCredit}
                        onChange={(e) => setFormData({
                          ...formData,
                          credits: {...formData.credits, earnedIncomeCredit: e.target.checked}
                        })}
                        className="w-4 h-4 text-soft-gold focus:ring-soft-gold rounded"
                      />
                      <span className="text-sm text-gray-700">Earned Income Credit</span>
                    </label>
                  </div>

                  <h3 className="font-semibold text-deep-teal mt-6">Tax Withholding</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Federal Tax Withheld</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={formData.withholding.federal}
                          onChange={(e) => setFormData({
                            ...formData,
                            withholding: {...formData.withholding, federal: e.target.value}
                          })}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Tax Payments</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={formData.withholding.estimated}
                          onChange={(e) => setFormData({
                            ...formData,
                            withholding: {...formData.withholding, estimated: e.target.value}
                          })}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Calculate */}
              {applicationStep === 5 && (
                <div className="space-y-6">
                  <button
                    onClick={calculateTax}
                    disabled={calculating}
                    className="w-full bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white py-4 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {calculating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5" />
                        Calculate My Refund
                      </>
                    )}
                  </button>

                  {calculation && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4">Your Tax Summary</h3>
                        
                        {calculation.refundAmount > 0 ? (
                          <div className="text-center">
                            <p className="text-sm opacity-80">Your Estimated Refund</p>
                            <p className="text-4xl font-bold mt-2">{formatCurrency(calculation.refundAmount)}</p>
                          </div>
                        ) : calculation.amountDue > 0 ? (
                          <div className="text-center">
                            <p className="text-sm opacity-80">Amount You Owe</p>
                            <p className="text-4xl font-bold mt-2">{formatCurrency(calculation.amountDue)}</p>
                          </div>
                        ) : null}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Income</span>
                          <span className="font-medium text-deep-teal">{formatCurrency(calculation.totalIncome)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Deductions</span>
                          <span className="font-medium text-deep-teal">{formatCurrency(calculation.totalDeductions)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Taxable Income</span>
                          <span className="font-medium text-deep-teal">{formatCurrency(calculation.taxableIncome)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax Liability</span>
                          <span className="font-medium text-deep-teal">{formatCurrency(calculation.taxLiability)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax Credits</span>
                          <span className="font-medium text-green-600">{formatCurrency(calculation.totalCredits)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Payments</span>
                          <span className="font-medium text-deep-teal">{formatCurrency(calculation.totalPayments)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Effective Tax Rate</span>
                            <span className="text-deep-teal">{calculation.effectiveTaxRate.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Bank Account Selection */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deposit To</label>
                        <select
                          value={formData.bankAccountId}
                          onChange={(e) => setFormData({...formData, bankAccountId: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        >
                          <option value="">Select account for direct deposit</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                              {acc.displayName} ({acc.maskedNumber})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  if (applicationStep > 1) {
                    setApplicationStep(applicationStep - 1)
                  } else {
                    setShowApplication(false)
                  }
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {applicationStep > 1 ? 'Previous' : 'Cancel'}
              </button>
              
              {applicationStep < 5 ? (
                <button
                  onClick={() => setApplicationStep(applicationStep + 1)}
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!calculation || submitting}
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Tax Return'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
