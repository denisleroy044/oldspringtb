'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  DollarSign,
  Percent,
  Landmark,
  Briefcase,
  Home,
  Car,
  GraduationCap,
  TrendingUp,
  ChevronRight,
  Loader2,
  FileText,
  Calculator,
  Shield,
  Info,
  ArrowRight,
  Gift,
  Star,
  Sparkles,
  Heart,
  Users,
  Zap,
  CreditCard,
  Wallet,
  Building,
  ChevronDown,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Award,
  Bell,
  User
} from 'lucide-react'

interface LoanProduct {
  id: string
  name: string
  description: string
  category: string
  minAmount: number
  maxAmount: number
  minTerm: number
  maxTerm: number
  interestRate: number
  processingFee: number
  creditScoreMin: number
  incomeMultiplier: number
  requirements?: string[]
  documentsRequired?: string[]
  features?: string[]
}

interface LoanOffer {
  id: string
  offerName: string
  productName: string
  productCategory: string
  amount: number
  term: number
  interestRate: number
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
  processingFee: number
  expiryDate: string
  message: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
  createdAt: string
}

interface LoanApplication {
  id: string
  applicationNumber: string
  productName: string
  productCategory: string
  amount: number
  term: number
  purpose?: string
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'CANCELLED'
  monthlyPayment?: number
  interestRate?: number
  createdAt: string
  approvedAt?: string
  disbursedAt?: string
}

export default function LoansPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [products, setProducts] = useState<LoanProduct[]>([])
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [offers, setOffers] = useState<LoanOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [showApplication, setShowApplication] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null)
  const [applicationStep, setApplicationStep] = useState(1)
  const [applicationForm, setApplicationForm] = useState({
    // Loan details
    amount: '',
    term: '',
    purpose: '',
    
    // Personal info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    
    // Employment
    employmentStatus: '',
    employerName: '',
    jobTitle: '',
    yearsEmployed: '',
    
    // Financial
    annualIncome: '',
    otherIncome: '',
    existingLoans: '0',
    monthlyExpenses: '',
    
    // Property (for mortgage)
    propertyType: '',
    propertyValue: '',
    propertyAddress: '',
    
    // Vehicle (for auto)
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePrice: '',
    
    // Documents
    documents: [] as any[]
  })
  
  const [calculations, setCalculations] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch loan products
      const productsRes = await fetch('/api/loans/products')
      const productsData = await productsRes.json()
      setProducts(productsData.products || [])

      // Fetch applications
      const appsRes = await fetch('/api/loans/applications')
      const appsData = await appsRes.json()
      setApplications(appsData.applications || [])

      // Fetch offers
      const offersRes = await fetch('/api/loans/offers')
      const offersData = await offersRes.json()
      setOffers(offersData.offers || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyNow = () => {
    // If there are products, select the first one by default
    if (products.length > 0) {
      handleProductSelect(products[0])
    } else {
      // If no products, just open the modal
      setSelectedProduct(null)
      setApplicationStep(1)
      setShowApplication(true)
    }
  }

  const handleProductSelect = (product: LoanProduct) => {
    setSelectedProduct(product)
    setApplicationForm({
      ...applicationForm,
      amount: product.minAmount.toString(),
      term: product.minTerm.toString()
    })
    calculateLoan(product, parseFloat(product.minAmount.toString()), product.minTerm)
    setApplicationStep(1)
    setShowApplication(true)
  }

  const calculateLoan = (product: LoanProduct, amount: number, term: number) => {
    const monthlyRate = product.interestRate / 100 / 12
    const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1)
    const totalPayment = monthlyPayment * term
    const totalInterest = totalPayment - amount
    const fee = amount * (product.processingFee / 100)

    setCalculations({
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      fee
    })
  }

  const handleApplicationChange = (field: string, value: string) => {
    setApplicationForm(prev => ({ ...prev, [field]: value }))
    
    if (selectedProduct && (field === 'amount' || field === 'term')) {
      const amount = field === 'amount' ? parseFloat(value) : parseFloat(applicationForm.amount)
      const term = field === 'term' ? parseInt(value) : parseInt(applicationForm.term)
      if (!isNaN(amount) && !isNaN(term) && amount > 0 && term > 0) {
        calculateLoan(selectedProduct, amount, term)
      }
    }
  }

  const handleSubmitApplication = async () => {
    if (!selectedProduct) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/loans/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          amount: parseFloat(applicationForm.amount),
          term: parseInt(applicationForm.term),
          purpose: applicationForm.purpose,
          interest_rate: selectedProduct.interestRate,
          processing_fee: selectedProduct.processingFee,
          firstName: applicationForm.firstName,
          lastName: applicationForm.lastName,
          dateOfBirth: applicationForm.dateOfBirth,
          phone: applicationForm.phone,
          employmentStatus: applicationForm.employmentStatus,
          employerName: applicationForm.employerName,
          jobTitle: applicationForm.jobTitle,
          yearsEmployed: parseInt(applicationForm.yearsEmployed) || 0,
          annualIncome: parseFloat(applicationForm.annualIncome),
          otherIncome: parseFloat(applicationForm.otherIncome) || 0,
          existingLoans: parseFloat(applicationForm.existingLoans) || 0,
          monthlyExpenses: parseFloat(applicationForm.monthlyExpenses) || 0,
          propertyType: applicationForm.propertyType,
          propertyValue: parseFloat(applicationForm.propertyValue) || 0,
          propertyAddress: applicationForm.propertyAddress,
          vehicleMake: applicationForm.vehicleMake,
          vehicleModel: applicationForm.vehicleModel,
          vehicleYear: parseInt(applicationForm.vehicleYear) || 0,
          vehiclePrice: parseFloat(applicationForm.vehiclePrice) || 0,
          documents: applicationForm.documents
        })
      })

      if (response.ok) {
        setShowApplication(false)
        setSelectedProduct(null)
        alert('Loan application submitted successfully! You will be notified once reviewed.')
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOfferResponse = async (offerId: string, action: 'ACCEPT' | 'DECLINE') => {
    try {
      const response = await fetch('/api/loans/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId, action })
      })

      if (response.ok) {
        alert(`Offer ${action === 'ACCEPT' ? 'accepted' : 'declined'} successfully!`)
        fetchData()
      }
    } catch (error) {
      console.error('Error responding to offer:', error)
      alert('Failed to process offer')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'DISBURSED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'UNDER_REVIEW':
        return <Clock className="w-5 h-5 text-soft-gold animate-pulse" />
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'DISBURSED':
        return 'bg-green-100 text-green-700'
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-700'
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-700'
      case 'PENDING':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'personal':
        return User
      case 'business':
        return Briefcase
      case 'mortgage':
        return Home
      case 'auto':
        return Car
      case 'education':
        return GraduationCap
      default:
        return Landmark
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 3600 * 24))
    
    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days left`
  }

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'personal', name: 'Personal' },
    { id: 'business', name: 'Business' },
    { id: 'mortgage', name: 'Mortgage' },
    { id: 'auto', name: 'Auto' },
    { id: 'education', name: 'Education' }
  ]

  const filteredProducts = products
    .filter(p => category === 'all' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || 
                 p.description.toLowerCase().includes(search.toLowerCase()))

  const pendingOffers = offers.filter(o => o.status === 'PENDING')
  const pendingApplications = applications.filter(a => a.status === 'PENDING' || a.status === 'UNDER_REVIEW')

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading loan options...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Loans</h1>
          <p className="text-gray-500 text-sm mt-1">Apply for loans or manage existing applications</p>
        </div>
        <div className="flex items-center gap-4">
          {pendingOffers.length > 0 && (
            <div className="relative">
              <Gift className="w-5 h-5 text-soft-gold" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingOffers.length}
              </span>
            </div>
          )}
          {pendingApplications.length > 0 && (
            <div className="relative">
              <Clock className="w-5 h-5 text-soft-gold" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingApplications.length}
              </span>
            </div>
          )}
          {/* Apply Now Button */}
          <button
            onClick={handleApplyNow}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-xl transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Apply for a Loan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Active Loans</p>
          <p className="text-2xl font-bold text-deep-teal">
            {applications.filter(a => a.status === 'APPROVED' || a.status === 'DISBURSED').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Pending Applications</p>
          <p className="text-2xl font-bold text-soft-gold">{pendingApplications.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Special Offers</p>
          <p className="text-2xl font-bold text-sage">{pendingOffers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Borrowed</p>
          <p className="text-2xl font-bold text-deep-teal">
            {formatCurrency(applications
              .filter(a => a.status === 'APPROVED' || a.status === 'DISBURSED')
              .reduce((sum, a) => sum + a.amount, 0))}
          </p>
        </div>
      </div>

      {/* Loan Offers Section */}
      {offers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-deep-teal mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-soft-gold" />
            Special Loan Offers for You
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {offers.filter(o => o.status === 'PENDING').map((offer) => (
              <div
                key={offer.id}
                className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{offer.offerName}</h3>
                    <p className="text-sm text-white/80">{offer.productName}</p>
                  </div>
                  <Star className="w-5 h-5 text-soft-gold fill-soft-gold" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-white/70">Loan Amount</p>
                    <p className="font-bold text-xl">{formatCurrency(offer.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Interest Rate</p>
                    <p className="font-bold text-xl">{offer.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Monthly Payment</p>
                    <p className="font-semibold">{formatCurrency(offer.monthlyPayment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Term</p>
                    <p className="font-semibold">{offer.term} months</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Interest</span>
                    <span className="font-semibold">{formatCurrency(offer.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Total Payment</span>
                    <span className="font-semibold">{formatCurrency(offer.totalPayment)}</span>
                  </div>
                </div>

                {offer.message && (
                  <p className="text-xs text-white/80 mb-4 italic">"{offer.message}"</p>
                )}

                <p className="text-xs text-white/60 mb-4">
                  Offer expires: {new Date(offer.expiryDate).toLocaleDateString()} ({formatDate(offer.expiryDate)})
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOfferResponse(offer.id, 'ACCEPT')}
                    className="flex-1 bg-white text-deep-teal py-2 rounded-lg font-medium hover:bg-soft-gold hover:text-white transition-colors"
                  >
                    Accept Offer
                  </button>
                  <button
                    onClick={() => handleOfferResponse(offer.id, 'DECLINE')}
                    className="px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search loan products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat.id
                    ? 'bg-deep-teal text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loan Products Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-deep-teal mb-4">Available Loan Products</h2>
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-deep-teal mb-2">No Products Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const Icon = getProductIcon(product.category)
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-sage/20 hover:shadow-xl transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-soft-gold/10 rounded-full flex items-center justify-center group-hover:bg-soft-gold/20 transition-colors">
                      <Icon className="w-6 h-6 text-soft-gold" />
                    </div>
                  </div>

                  <h3 className="font-semibold text-deep-teal mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-medium text-deep-teal">
                        {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Term</span>
                      <span className="font-medium text-deep-teal">
                        {product.minTerm} - {product.maxTerm} months
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Interest Rate</span>
                      <span className="font-medium text-sage">{product.interestRate}% APR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Credit Score</span>
                      <span className="font-medium text-deep-teal">{product.creditScoreMin}+</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features && product.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-soft-gold/10 text-soft-gold rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Apply Now Button on each product */}
                    <button
                      onClick={() => handleProductSelect(product)}
                      className="w-full bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Applications Table */}
      {applications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-deep-teal mb-4">Your Applications</h2>
          <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Application</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-deep-teal">{app.productName}</p>
                          <p className="text-xs text-gray-500">{app.applicationNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-deep-teal">
                        {formatCurrency(app.amount)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {app.term} months
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {app.monthlyPayment ? formatCurrency(app.monthlyPayment) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/loans/${app.id}`}
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
        </div>
      )}

      {/* Loan Application Modal */}
      {showApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-deep-teal">
                    {selectedProduct ? `Apply for ${selectedProduct.name}` : 'Apply for a Loan'}
                  </h2>
                  {selectedProduct && (
                    <p className="text-sm text-gray-500 mt-1">{selectedProduct.description}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowApplication(false)
                    setSelectedProduct(null)
                    setApplicationStep(1)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Product Selection if no product selected */}
              {!selectedProduct && products.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Loan Product</label>
                  <select
                    onChange={(e) => {
                      const product = products.find(p => p.id === e.target.value)
                      if (product) handleProductSelect(product)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  >
                    <option value="">Choose a loan product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Progress Steps - only show if product selected */}
              {selectedProduct && (
                <>
                  <div className="flex items-center justify-between mt-6">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                          step <= applicationStep 
                            ? 'bg-gradient-to-r from-deep-teal to-sage text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {step < applicationStep ? <CheckCircle className="w-4 h-4" /> : step}
                        </div>
                        {step < 4 && (
                          <div className={`flex-1 h-1 mx-2 ${
                            step < applicationStep ? 'bg-gradient-to-r from-deep-teal to-sage' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-xs text-gray-500">Loan Details</span>
                    <span className="text-xs text-gray-500">Personal Info</span>
                    <span className="text-xs text-gray-500">Employment</span>
                    <span className="text-xs text-gray-500">Review</span>
                  </div>
                </>
              )}
            </div>

            {selectedProduct && (
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Step 1: Loan Details */}
                {applicationStep === 1 && (
                  <div className="space-y-6">
                    {/* Loan Calculator */}
                    <div className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Loan Calculator
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/80 mb-1">Loan Amount</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80">$</span>
                            <input
                              type="number"
                              value={applicationForm.amount}
                              onChange={(e) => handleApplicationChange('amount', e.target.value)}
                              min={selectedProduct.minAmount}
                              max={selectedProduct.maxAmount}
                              className="w-full pl-8 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-white/80 mb-1">Term (months)</label>
                          <input
                            type="number"
                            value={applicationForm.term}
                            onChange={(e) => handleApplicationChange('term', e.target.value)}
                            min={selectedProduct.minTerm}
                            max={selectedProduct.maxTerm}
                            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent"
                          />
                        </div>
                      </div>

                      {calculations && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-white/80">Monthly Payment</p>
                              <p className="font-bold text-lg">{formatCurrency(calculations.monthlyPayment)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-white/80">Total Interest</p>
                              <p className="font-bold text-lg">{formatCurrency(calculations.totalInterest)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-white/80">Processing Fee</p>
                              <p className="font-semibold">{formatCurrency(calculations.fee)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-white/80">APR</p>
                              <p className="font-bold text-lg">{selectedProduct.interestRate}%</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loan Purpose</label>
                      <textarea
                        value={applicationForm.purpose}
                        onChange={(e) => handleApplicationChange('purpose', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="Tell us what you need the loan for..."
                      />
                    </div>

                    <div className="bg-soft-gold/5 rounded-lg p-4">
                      <h4 className="font-medium text-deep-teal mb-2">Required Documents</h4>
                      <ul className="space-y-1">
                        {selectedProduct.documentsRequired && selectedProduct.documentsRequired.length > 0 ? (
                          selectedProduct.documentsRequired.map((doc, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-soft-gold" />
                              {doc}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-600 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-soft-gold" />
                            Government ID
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {applicationStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={applicationForm.firstName}
                          onChange={(e) => handleApplicationChange('firstName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={applicationForm.lastName}
                          onChange={(e) => handleApplicationChange('lastName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={applicationForm.dateOfBirth}
                          onChange={(e) => handleApplicationChange('dateOfBirth', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={applicationForm.phone}
                          onChange={(e) => handleApplicationChange('phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Employment & Financial */}
                {applicationStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                      <select
                        value={applicationForm.employmentStatus}
                        onChange={(e) => handleApplicationChange('employmentStatus', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      >
                        <option value="">Select status</option>
                        <option value="EMPLOYED">Employed Full-time</option>
                        <option value="PART_TIME">Employed Part-time</option>
                        <option value="SELF_EMPLOYED">Self-employed</option>
                        <option value="BUSINESS_OWNER">Business Owner</option>
                        <option value="RETIRED">Retired</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Employer Name</label>
                        <input
                          type="text"
                          value={applicationForm.employerName}
                          onChange={(e) => handleApplicationChange('employerName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                        <input
                          type="text"
                          value={applicationForm.jobTitle}
                          onChange={(e) => handleApplicationChange('jobTitle', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="Your position"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Years Employed</label>
                        <input
                          type="number"
                          value={applicationForm.yearsEmployed}
                          onChange={(e) => handleApplicationChange('yearsEmployed', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={applicationForm.annualIncome}
                            onChange={(e) => handleApplicationChange('annualIncome', e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={applicationForm.monthlyExpenses}
                            onChange={(e) => handleApplicationChange('monthlyExpenses', e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Existing Loans</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={applicationForm.existingLoans}
                            onChange={(e) => handleApplicationChange('existingLoans', e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {applicationStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-soft-gold/5 rounded-lg p-4">
                      <h4 className="font-medium text-deep-teal mb-3">Loan Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Product:</span>
                          <span className="font-medium text-deep-teal">{selectedProduct.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Loan Amount:</span>
                          <span className="font-medium text-deep-teal">{formatCurrency(parseFloat(applicationForm.amount))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Term:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.term} months</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="font-medium text-sage">{selectedProduct.interestRate}% APR</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Monthly Payment:</span>
                          <span className="font-bold text-deep-teal">{formatCurrency(calculations?.monthlyPayment || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-soft-gold/5 rounded-lg p-4">
                      <h4 className="font-medium text-deep-teal mb-3">Personal Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.firstName} {applicationForm.lastName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date of Birth:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.dateOfBirth}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-soft-gold/5 rounded-lg p-4">
                      <h4 className="font-medium text-deep-teal mb-3">Employment & Financial</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Employment:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.employmentStatus}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Employer:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.employerName || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Annual Income:</span>
                          <span className="font-medium text-deep-teal">{formatCurrency(parseFloat(applicationForm.annualIncome) || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">
                          By submitting this application, you agree to a credit check and verify that all information provided is accurate. 
                          Loan approval is subject to verification and underwriting. You will be notified once your application is reviewed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  if (selectedProduct && applicationStep > 1) {
                    setApplicationStep(applicationStep - 1)
                  } else {
                    setShowApplication(false)
                    setSelectedProduct(null)
                    setApplicationStep(1)
                  }
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {selectedProduct && applicationStep > 1 ? 'Previous' : 'Cancel'}
              </button>
              
              {selectedProduct && applicationStep < 4 ? (
                <button
                  onClick={() => setApplicationStep(applicationStep + 1)}
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              ) : selectedProduct && applicationStep === 4 ? (
                <button
                  onClick={handleSubmitApplication}
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
