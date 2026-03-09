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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-xl transition-all font-medium"
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
                  className="w-full mt-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
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
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              ) : selectedGrant && applicationStep === 4 ? (
                <button
                  onClick={handleSubmitApplication}
                  className="px-6 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
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
