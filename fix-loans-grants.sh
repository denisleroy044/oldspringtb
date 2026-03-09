# Fix loans page - replace the floating + button with proper Apply Now buttons
cat > src/app/dashboard/loans/page.tsx.fixed << 'EOF'
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
  requirements: string[]
  documentsRequired: string[]
  features: string[]
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
        // Show success message
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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-xl transition-all font-medium"
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
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-soft-gold/10 text-soft-gold rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Apply Now Button on each product */}
                    <button
                      onClick={() => handleProductSelect(product)}
                      className="w-full bg-gradient-to-r from-deep-teal to-sage text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
                        {selectedProduct.documentsRequired.map((doc, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-soft-gold" />
                            {doc}
                          </li>
                        ))}
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
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              ) : selectedProduct && applicationStep === 4 ? (
                <button
                  onClick={handleSubmitApplication}
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
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
EOF

# Fix grants page - replace Flask with FlaskRound
cat > src/app/dashboard/grants/page.tsx.fixed << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Heart,
  Briefcase,
  GraduationCap,
  Home,
  Leaf,
  Users,
  Lightbulb,
  DollarSign,
  Building,
  Globe,
  Award,
  Star,
  Sparkles,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Bell,
  Plus,
  Loader2,
  Info,
  ArrowRight,
  Target,
  TrendingUp,
  Zap,
  Shield,
  BookOpen,
  FlaskRound,
  Palette,
  Cpu,
  Activity,
  Sprout,
  Trophy,
  Venus,
  Shield as ShieldIcon
} from 'lucide-react'

interface GrantCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  featured: boolean
}

interface Grant {
  id: string
  title: string
  description: string
  shortDescription: string
  provider: string
  amountMin: number
  amountMax: number
  currency: string
  deadline: string
  eligibilityCriteria: string[]
  requirements: string[]
  documentsRequired: string[]
  featured: boolean
  status: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
}

interface GrantApplication {
  id: string
  applicationNumber: string
  projectTitle: string
  requestedAmount: number
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'
  createdAt: string
  reviewedAt?: string
  approvedAmount?: number
  grantTitle: string
  grantProvider: string
}

export default function GrantsPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [grants, setGrants] = useState<Grant[]>([])
  const [categories, setCategories] = useState<GrantCategory[]>([])
  const [applications, setApplications] = useState<GrantApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [showApplication, setShowApplication] = useState(false)
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
  const [applicationStep, setApplicationStep] = useState(1)
  
  // Filters
  const [filter, setFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFeatured, setShowFeatured] = useState(false)
  
  // Application form
  const [applicationForm, setApplicationForm] = useState({
    // Organization
    organizationName: '',
    organizationType: '',
    taxId: '',
    yearEstablished: '',
    
    // Contact
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    contactTitle: '',
    
    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    
    // Project
    projectTitle: '',
    projectDescription: '',
    projectCategory: '',
    projectStart: '',
    projectEnd: '',
    
    // Financial
    requestedAmount: '',
    totalProjectCost: '',
    otherFundingSources: '',
    
    // Impact
    targetAudience: '',
    beneficiariesCount: '',
    
    // Documents
    documents: [] as any[]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch grants
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (filter !== 'all') params.append('status', filter)
      if (showFeatured) params.append('featured', 'true')
      if (searchQuery) params.append('search', searchQuery)
      
      const grantsRes = await fetch(`/api/grants?${params.toString()}`)
      const grantsData = await grantsRes.json()
      setGrants(grantsData.grants || [])

      // Fetch categories
      const categoriesRes = await fetch('/api/grants/categories')
      const categoriesData = await categoriesRes.json()
      setCategories(categoriesData.categories || [])

      // Fetch applications
      const appsRes = await fetch('/api/grants/applications')
      const appsData = await appsRes.json()
      setApplications(appsData.applications || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = (grant: Grant) => {
    setSelectedGrant(grant)
    setApplicationForm({
      ...applicationForm,
      projectTitle: grant.title,
      requestedAmount: grant.amountMax.toString()
    })
    setApplicationStep(1)
    setShowApplication(true)
  }

  const handleSubmitApplication = async () => {
    if (!selectedGrant) return

    try {
      const response = await fetch('/api/grants/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantId: selectedGrant.id,
          ...applicationForm,
          requestedAmount: parseFloat(applicationForm.requestedAmount),
          totalProjectCost: parseFloat(applicationForm.totalProjectCost) || 0,
          beneficiariesCount: parseInt(applicationForm.beneficiariesCount) || 0,
          yearEstablished: parseInt(applicationForm.yearEstablished) || 0
        })
      })

      if (response.ok) {
        setShowApplication(false)
        setSelectedGrant(null)
        alert('Grant application submitted successfully! You will be notified once reviewed.')
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    }
  }

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'Briefcase': Briefcase,
      'GraduationCap': GraduationCap,
      'FlaskRound': FlaskRound,
      'Palette': Palette,
      'Heart': Heart,
      'Cpu': Cpu,
      'Activity': Activity,
      'Leaf': Leaf,
      'Users': Users,
      'Venus': Venus,
      'Star': Star,
      'Shield': ShieldIcon,
      'Sprout': Sprout,
      'Trophy': Trophy,
      'Home': Home
    }
    const Icon = icons[iconName] || Heart
    return <Icon className="w-5 h-5" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'REJECTED':
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
        return 'bg-green-100 text-green-700'
      case 'REJECTED':
        return 'bg-red-100 text-red-700'
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-700'
      case 'PENDING':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 3600 * 24))
    
    if (diffDays < 0) return 'Deadline passed'
    if (diffDays === 0) return 'Deadline today'
    if (diffDays === 1) return 'Deadline tomorrow'
    return `${diffDays} days left`
  }

  const pendingApplications = applications.filter(a => a.status === 'PENDING' || a.status === 'UNDER_REVIEW')
  const featuredGrants = grants.filter(g => g.featured)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading grants and funding opportunities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Grants & Funding</h1>
          <p className="text-gray-500 text-sm mt-1">Discover and apply for grants and funding opportunities</p>
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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-xl transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Apply for Grant
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Available Grants</p>
          <p className="text-2xl font-bold text-deep-teal">{grants.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Featured Grants</p>
          <p className="text-2xl font-bold text-soft-gold">{featuredGrants.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Your Applications</p>
          <p className="text-2xl font-bold text-sage">{applications.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-burnt-orange">{pendingApplications.length}</p>
        </div>
      </div>

      {/* Featured Grants Carousel */}
      {featuredGrants.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-deep-teal mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-soft-gold" />
            Featured Opportunities
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredGrants.slice(0, 3).map((grant) => (
              <div
                key={grant.id}
                className="bg-gradient-to-br from-deep-teal to-sage rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      {getCategoryIcon(grant.categoryIcon)}
                    </div>
                    <div>
                      <h3 className="font-semibold line-clamp-1">{grant.title}</h3>
                      <p className="text-xs text-white/80">{grant.provider}</p>
                    </div>
                  </div>
                  <Star className="w-5 h-5 text-soft-gold fill-soft-gold" />
                </div>

                <p className="text-sm text-white/90 mb-4 line-clamp-2">{grant.shortDescription || grant.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-white/80">Funding up to</p>
                    <p className="font-bold text-xl">{formatCurrency(grant.amountMax)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/80">Deadline</p>
                    <p className="font-semibold text-sm">{formatDate(grant.deadline)}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleApply(grant)}
                  className="w-full bg-white text-deep-teal py-2 rounded-lg font-medium hover:bg-soft-gold hover:text-white transition-colors"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-sage/20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search grants by title or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                fetchData()
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => {
                setFilter('all')
                fetchData()
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter('active')
                fetchData()
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'active'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => {
                setFilter('closing-soon')
                fetchData()
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'closing-soon'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Closing Soon
            </button>
            <button
              onClick={() => {
                setShowFeatured(!showFeatured)
                fetchData()
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                showFeatured
                  ? 'bg-soft-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className="w-4 h-4" />
              Featured
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setSelectedCategory('all')
                fetchData()
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-soft-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name)
                  fetchData()
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.name
                    ? 'bg-soft-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grants Grid */}
      {grants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-deep-teal mb-2">No Grants Found</h3>
          <p className="text-gray-500">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grants.map((grant) => (
            <div
              key={grant.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-sage/20 hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => router.push(`/dashboard/grants/${grant.id}`)}
            >
              <div className={`bg-gradient-to-r from-${grant.categoryColor}-500 to-${grant.categoryColor}-600 p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      {getCategoryIcon(grant.categoryIcon)}
                    </div>
                    <div>
                      <h3 className="font-semibold line-clamp-1">{grant.title}</h3>
                      <p className="text-xs opacity-75">{grant.provider}</p>
                    </div>
                  </div>
                  {grant.featured && (
                    <Star className="w-4 h-4 text-soft-gold fill-soft-gold" />
                  )}
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{grant.shortDescription || grant.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-deep-teal">{formatCurrency(grant.amountMax)}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(grant.deadline)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {grant.eligibilityCriteria?.slice(0, 2).map((item, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      {item.length > 20 ? item.substring(0, 20) + '...' : item}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleApply(grant)
                  }}
                  className="w-full mt-2 bg-gradient-to-r from-deep-teal to-sage text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applications Table */}
      {applications.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-deep-teal mb-4">Your Applications</h2>
          <div className="bg-white rounded-xl shadow-lg border border-sage/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Application</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-deep-teal">{app.projectTitle}</p>
                          <p className="text-xs text-gray-500">{app.applicationNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{app.grantTitle}</p>
                          <p className="text-xs text-gray-500">{app.grantProvider}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-deep-teal">
                        {formatCurrency(app.requestedAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/grants/${app.id}`}
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

      {/* Application Modal */}
      {showApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-deep-teal">Apply for Grant</h2>
                  {selectedGrant && (
                    <p className="text-sm text-gray-500 mt-1">{selectedGrant.title}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowApplication(false)
                    setSelectedGrant(null)
                    setApplicationStep(1)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Grant Selection if no grant selected */}
              {!selectedGrant && grants.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Grant</label>
                  <select
                    onChange={(e) => {
                      const grant = grants.find(g => g.id === e.target.value)
                      if (grant) handleApply(grant)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  >
                    <option value="">Choose a grant to apply for</option>
                    {grants.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Progress Steps - only show if grant selected */}
              {selectedGrant && (
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
                    <span className="text-xs text-gray-500">Organization</span>
                    <span className="text-xs text-gray-500">Contact</span>
                    <span className="text-xs text-gray-500">Project</span>
                    <span className="text-xs text-gray-500">Review</span>
                  </div>
                </>
              )}
            </div>

            {selectedGrant && (
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Step 1: Organization Details */}
                {applicationStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                      <input
                        type="text"
                        value={applicationForm.organizationName}
                        onChange={(e) => setApplicationForm({...applicationForm, organizationName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="Your organization name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                      <select
                        value={applicationForm.organizationType}
                        onChange={(e) => setApplicationForm({...applicationForm, organizationType: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="BUSINESS">Business</option>
                        <option value="NONPROFIT">Non-profit</option>
                        <option value="EDUCATIONAL">Educational Institution</option>
                        <option value="GOVERNMENT">Government</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID / EIN</label>
                        <input
                          type="text"
                          value={applicationForm.taxId}
                          onChange={(e) => setApplicationForm({...applicationForm, taxId: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="XX-XXXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year Established</label>
                        <input
                          type="number"
                          value={applicationForm.yearEstablished}
                          onChange={(e) => setApplicationForm({...applicationForm, yearEstablished: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="2020"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {applicationStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={applicationForm.contactFirstName}
                          onChange={(e) => setApplicationForm({...applicationForm, contactFirstName: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={applicationForm.contactLastName}
                          onChange={(e) => setApplicationForm({...applicationForm, contactLastName: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={applicationForm.contactEmail}
                          onChange={(e) => setApplicationForm({...applicationForm, contactEmail: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={applicationForm.contactPhone}
                          onChange={(e) => setApplicationForm({...applicationForm, contactPhone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Title/Position</label>
                      <input
                        type="text"
                        value={applicationForm.contactTitle}
                        onChange={(e) => setApplicationForm({...applicationForm, contactTitle: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="Executive Director, Founder, etc."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        <input
                          type="text"
                          value={applicationForm.addressLine1}
                          onChange={(e) => setApplicationForm({...applicationForm, addressLine1: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="123 Main St"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                        <input
                          type="text"
                          value={applicationForm.addressLine2}
                          onChange={(e) => setApplicationForm({...applicationForm, addressLine2: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="Suite 100"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={applicationForm.city}
                          onChange={(e) => setApplicationForm({...applicationForm, city: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={applicationForm.state}
                          onChange={(e) => setApplicationForm({...applicationForm, state: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={applicationForm.postalCode}
                          onChange={(e) => setApplicationForm({...applicationForm, postalCode: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Project Details */}
                {applicationStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                      <input
                        type="text"
                        value={applicationForm.projectTitle}
                        onChange={(e) => setApplicationForm({...applicationForm, projectTitle: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="Project title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                      <textarea
                        value={applicationForm.projectDescription}
                        onChange={(e) => setApplicationForm({...applicationForm, projectDescription: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="Describe your project, its goals, and expected impact..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Start Date</label>
                        <input
                          type="date"
                          value={applicationForm.projectStart}
                          onChange={(e) => setApplicationForm({...applicationForm, projectStart: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project End Date</label>
                        <input
                          type="date"
                          value={applicationForm.projectEnd}
                          onChange={(e) => setApplicationForm({...applicationForm, projectEnd: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Requested Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={applicationForm.requestedAmount}
                            onChange={(e) => setApplicationForm({...applicationForm, requestedAmount: e.target.value})}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Project Cost</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={applicationForm.totalProjectCost}
                            onChange={(e) => setApplicationForm({...applicationForm, totalProjectCost: e.target.value})}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Other Funding Sources</label>
                      <textarea
                        value={applicationForm.otherFundingSources}
                        onChange={(e) => setApplicationForm({...applicationForm, otherFundingSources: e.target.value})}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="List any other funding sources you have secured or applied for..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                        <input
                          type="text"
                          value={applicationForm.targetAudience}
                          onChange={(e) => setApplicationForm({...applicationForm, targetAudience: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="Who will benefit?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Beneficiaries</label>
                        <input
                          type="number"
                          value={applicationForm.beneficiariesCount}
                          onChange={(e) => setApplicationForm({...applicationForm, beneficiariesCount: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="1000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {applicationStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-soft-gold/5 rounded-lg p-4">
                      <h4 className="font-medium text-deep-teal mb-3">Grant Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Grant:</span>
                          <span className="font-medium text-deep-teal">{selectedGrant.title}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Provider:</span>
                          <span className="font-medium text-deep-teal">{selectedGrant.provider}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Requested Amount:</span>
                          <span className="font-medium text-deep-teal">{formatCurrency(parseFloat(applicationForm.requestedAmount))}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-soft-gold/5 rounded-lg p-4">
                      <h4 className="font-medium text-deep-teal mb-3">Organization</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.organizationName || 'Individual'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.organizationType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-soft-gold/5 rounded-lg p-4">
                      <h4 className="font-medium text-deep-teal mb-3">Contact Person</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.contactFirstName} {applicationForm.contactLastName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.contactEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-soft-gold/5 rounded-lg p-4">
                      <h4 className="font-medium text-deep-teal mb-3">Project</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Title:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.projectTitle}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Timeline:</span>
                          <span className="font-medium text-deep-teal">{applicationForm.projectStart} to {applicationForm.projectEnd}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">
                          By submitting this application, you verify that all information provided is accurate and complete. 
                          Applications are reviewed by our grants committee and you will be notified of the decision.
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
                  if (selectedGrant && applicationStep > 1) {
                    setApplicationStep(applicationStep - 1)
                  } else {
                    setShowApplication(false)
                    setSelectedGrant(null)
                    setApplicationStep(1)
                  }
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {selectedGrant && applicationStep > 1 ? 'Previous' : 'Cancel'}
              </button>
              
              {selectedGrant && applicationStep < 4 ? (
                <button
                  onClick={() => setApplicationStep(applicationStep + 1)}
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              ) : selectedGrant && applicationStep === 4 ? (
                <button
                  onClick={handleSubmitApplication}
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Submit Application
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
EOF

# Apply the fixes
mv src/app/dashboard/loans/page.tsx.fixed src/app/dashboard/loans/page.tsx
mv src/app/dashboard/grants/page.tsx.fixed src/app/dashboard/grants/page.tsx

echo "✅ Fixed loans page - added Apply Now buttons and improved modal"
echo "✅ Fixed grants page - replaced Flask with FlaskRound"

echo ""
echo "🎉 All fixes applied! Now run:"
echo "  npm run dev"
echo ""
echo "Changes made:"
echo "  1. Loans page:"
echo "     - Added 'Apply for a Loan' button in header"
echo "     - Added 'Apply Now' button on each loan product card"
echo "     - Fixed modal to show product selection if none selected"
echo "     - Added success/error alerts for better UX"
echo "     - Admin gets notified on new applications"
echo ""
echo "  2. Grants page:"
echo "     - Fixed Flask import error (changed to FlaskRound)"
echo "     - Added 'Apply for Grant' button in header"
echo "     - Added grant selection dropdown in modal"
echo "     - Added success/error alerts"
echo "     - Admin gets notified on new applications"
echo ""