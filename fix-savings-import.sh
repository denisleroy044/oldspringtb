# Create a clean fixed version of savings page
cat > src/app/dashboard/savings/page.tsx.clean << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  PiggyBank,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  Loader2,
  Edit,
  Trash2,
  Home,
  Car,
  Heart,
  Gift,
  Plane,
  Shield,
  Smartphone,
  Target,
  Award,
  Sparkles,
  Star,
  Zap,
  BarChart,
  PieChart,
  Filter,
  Search,
  RefreshCw,
  Wrench
} from 'lucide-react'

interface Savings {
  id: string
  name: string
  description?: string
  targetAmount: number
  currentAmount: number
  startDate: string
  targetDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  progress: number
  autoSave: boolean
  autoSaveAmount?: number
  autoSaveFrequency?: string
  autoSaveDay?: number
  icon: string
  color: string
  createdAt: string
  completedAt?: string
  contributions?: any[]
}

interface SavingsTemplate {
  id: string
  name: string
  description: string
  defaultTargetAmount: number
  icon: string
  color: string
}

export default function SavingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [savings, setSavings] = useState<Savings[]>([])
  const [templates, setTemplates] = useState<SavingsTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedSavings, setSelectedSavings] = useState<Savings | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<SavingsTemplate | null>(null)
  const [showContributeModal, setShowContributeModal] = useState(false)
  const [contributeAmount, setContributeAmount] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    priority: 'medium',
    icon: 'PiggyBank',
    color: '#10b981',
    autoSave: false,
    autoSaveAmount: '',
    autoSaveFrequency: 'monthly',
    autoSaveDay: '1'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch savings
      const savingsRes = await fetch('/api/savings')
      const savingsData = await savingsRes.json()
      setSavings(savingsData.savings || [])

      // Fetch templates
      const templatesRes = await fetch('/api/savings/templates')
      const templatesData = await templatesRes.json()
      setTemplates(templatesData.templates || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'PiggyBank': PiggyBank,
      'Shield': Shield,
      'Plane': Plane,
      'Car': Car,
      'Home': Home,
      'Heart': Heart,
      'Smartphone': Smartphone,
      'Gift': Gift,
      'Wrench': Wrench,
      'Target': Target
    }
    const Icon = icons[iconName] || PiggyBank
    return <Icon className="w-5 h-5" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-orange-100 text-orange-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'paused':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateDaysLeft = (targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculateMonthlyNeeded = (targetAmount: number, targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    const monthsDiff = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth())
    return monthsDiff > 0 ? targetAmount / monthsDiff : targetAmount
  }

  const handleUseTemplate = (template: SavingsTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      ...formData,
      name: template.name,
      description: template.description,
      targetAmount: template.defaultTargetAmount.toString(),
      icon: template.icon,
      color: template.color
    })
    setShowTemplateModal(false)
    setShowCreateModal(true)
  }

  const handleCreateSavings = async () => {
    try {
      const response = await fetch('/api/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          targetAmount: parseFloat(formData.targetAmount),
          startDate: formData.startDate,
          targetDate: formData.targetDate,
          priority: formData.priority,
          icon: formData.icon,
          color: formData.color,
          autoSave: formData.autoSave,
          autoSaveAmount: formData.autoSave ? parseFloat(formData.autoSaveAmount) : null,
          autoSaveFrequency: formData.autoSave ? formData.autoSaveFrequency : null,
          autoSaveDay: formData.autoSave ? parseInt(formData.autoSaveDay) : null
        })
      })

      if (response.ok) {
        setShowCreateModal(false)
        setSelectedTemplate(null)
        setFormData({
          name: '',
          description: '',
          targetAmount: '',
          startDate: new Date().toISOString().split('T')[0],
          targetDate: '',
          priority: 'medium',
          icon: 'PiggyBank',
          color: '#10b981',
          autoSave: false,
          autoSaveAmount: '',
          autoSaveFrequency: 'monthly',
          autoSaveDay: '1'
        })
        fetchData()
      }
    } catch (error) {
      console.error('Error creating savings:', error)
    }
  }

  const handleContribute = async () => {
    if (!selectedSavings || !contributeAmount) return

    try {
      const response = await fetch('/api/savings/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          savingsId: selectedSavings.id,
          amount: parseFloat(contributeAmount)
        })
      })

      if (response.ok) {
        setShowContributeModal(false)
        setSelectedSavings(null)
        setContributeAmount('')
        fetchData()
      }
    } catch (error) {
      console.error('Error adding contribution:', error)
    }
  }

  const filteredSavings = savings.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalTargetAmount = savings.reduce((sum, s) => sum + s.targetAmount, 0)
  const totalCurrentAmount = savings.reduce((sum, s) => sum + s.currentAmount, 0)
  const activeSavings = savings.filter(s => s.status === 'active').length
  const completedSavings = savings.filter(s => s.status === 'completed').length

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading your savings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Savings Goals</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your savings goals</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-deep-teal text-deep-teal rounded-lg hover:bg-deep-teal hover:text-white transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Use Template
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            New Savings Goal
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Goals</p>
          <p className="text-2xl font-bold text-deep-teal">{savings.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Active Goals</p>
          <p className="text-2xl font-bold text-soft-gold">{activeSavings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-sage">{completedSavings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Saved</p>
          <p className="text-2xl font-bold text-deep-teal">{formatCurrency(totalCurrentAmount)}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-sage/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search savings goals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'active'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'completed'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Savings Grid */}
      {filteredSavings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <PiggyBank className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-deep-teal mb-2">No Savings Goals Found</h3>
          <p className="text-gray-500 mb-6">Create your first savings goal to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Create a Savings Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSavings.map((saving) => {
            const Icon = getIcon(saving.icon)
            const daysLeft = calculateDaysLeft(saving.targetDate)
            const monthlyNeeded = calculateMonthlyNeeded(saving.targetAmount - saving.currentAmount, saving.targetDate)
            
            return (
              <div
                key={saving.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-sage/20 hover:shadow-xl transition-all"
              >
                <div className={`p-4 bg-gradient-to-r from-${saving.color}-500 to-${saving.color}-600 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Icon />
                      </div>
                      <div>
                        <h3 className="font-semibold">{saving.name}</h3>
                        <p className="text-xs opacity-75">{saving.description || 'Savings goal'}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(saving.priority)}`}>
                      {saving.priority}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Progress</span>
                    <span className="text-sm font-medium text-deep-teal">{saving.progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-deep-teal to-sage rounded-full"
                      style={{ width: `${saving.progress}%` }}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Target</span>
                      <span className="font-medium text-deep-teal">{formatCurrency(saving.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current</span>
                      <span className="font-medium text-green-600">{formatCurrency(saving.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Remaining</span>
                      <span className="font-medium text-soft-gold">{formatCurrency(saving.targetAmount - saving.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Target Date</span>
                      <span className="font-medium text-deep-teal">{formatDate(saving.targetDate)}</span>
                    </div>
                    {daysLeft > 0 && saving.status === 'active' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Days Left</span>
                          <span className="font-medium text-sage">{daysLeft} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Monthly Needed</span>
                          <span className="font-medium text-orange-600">{formatCurrency(monthlyNeeded)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {saving.autoSave && (
                    <div className="mb-4 p-2 bg-soft-gold/5 rounded-lg">
                      <div className="flex items-center gap-2 text-xs">
                        <RefreshCw className="w-3 h-3 text-soft-gold" />
                        <span className="text-gray-600">
                          Auto-save {formatCurrency(saving.autoSaveAmount || 0)} {saving.autoSaveFrequency}
                          {saving.autoSaveDay ? ` on day ${saving.autoSaveDay}` : ''}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(saving.status)}`}>
                      {saving.status}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {saving.status === 'active' && (
                        <button
                          onClick={() => {
                            setSelectedSavings(saving)
                            setShowContributeModal(true)
                          }}
                          className="text-sm text-soft-gold hover:text-deep-teal font-medium"
                        >
                          Add Funds
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/dashboard/savings/${saving.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-deep-teal">Choose a Savings Template</h2>
            </div>
            <div className="p-6 grid gap-4 md:grid-cols-2">
              {templates.map((template) => {
                const Icon = getIcon(template.icon)
                return (
                  <button
                    key={template.id}
                    onClick={() => handleUseTemplate(template)}
                    className="p-4 border border-gray-200 rounded-xl hover:border-soft-gold hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-soft-gold/10 rounded-full flex items-center justify-center group-hover:bg-soft-gold/20">
                        <Icon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-deep-teal">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <p className="text-xs text-soft-gold mt-2">
                          Target: {formatCurrency(template.defaultTargetAmount)}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-deep-teal">
                {selectedTemplate ? `Create ${selectedTemplate.name}` : 'Create Savings Goal'}
              </h2>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="e.g., Emergency Fund"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  placeholder="Describe your savings goal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t">
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.autoSave}
                    onChange={(e) => setFormData({...formData, autoSave: e.target.checked})}
                    className="w-4 h-4 text-soft-gold focus:ring-soft-gold rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Auto-Save</span>
                </label>

                {formData.autoSave && (
                  <div className="space-y-4 pl-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={formData.autoSaveAmount}
                          onChange={(e) => setFormData({...formData, autoSaveAmount: e.target.value})}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                      <select
                        value={formData.autoSaveFrequency}
                        onChange={(e) => setFormData({...formData, autoSaveFrequency: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month/Week</label>
                      <input
                        type="number"
                        value={formData.autoSaveDay}
                        onChange={(e) => setFormData({...formData, autoSaveDay: e.target.value})}
                        min="1"
                        max="31"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                        placeholder="1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        For weekly: 1-7 (1=Monday, 7=Sunday)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setSelectedTemplate(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSavings}
                disabled={!formData.name || !formData.targetAmount || !formData.targetDate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContributeModal && selectedSavings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-deep-teal">Add to {selectedSavings.name}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-soft-gold/5 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Current Progress</span>
                  <span className="font-medium text-deep-teal">
                    {formatCurrency(selectedSavings.currentAmount)} / {formatCurrency(selectedSavings.targetAmount)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-deep-teal to-sage rounded-full"
                    style={{ width: `${selectedSavings.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Add</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {[50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setContributeAmount(amt.toString())}
                    className="flex-1 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-soft-gold hover:text-white transition-colors"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setShowContributeModal(false)
                  setSelectedSavings(null)
                  setContributeAmount('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContribute}
                disabled={!contributeAmount || parseFloat(contributeAmount) <= 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                Add Contribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
EOF

# Replace the original file
mv src/app/dashboard/savings/page.tsx.clean src/app/dashboard/savings/page.tsx

echo "✅ Fixed savings page - removed Tool, added Wrench"

# Also check goals page to make sure it's clean
cat > src/app/dashboard/goals/page.tsx.clean << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  Loader2,
  Edit,
  Trash2,
  PiggyBank,
  Home,
  Car,
  Heart,
  Briefcase,
  GraduationCap,
  Gift,
  Plane,
  Shield,
  Umbrella,
  Smartphone,
  Award,
  Sparkles,
  Star,
  Zap,
  BarChart,
  PieChart,
  Filter,
  Search,
  Wrench
} from 'lucide-react'

interface Goal {
  id: string
  category: string
  name: string
  description?: string
  targetAmount: number
  currentAmount: number
  startDate: string
  targetDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  progress: number
  autoSave: boolean
  autoSaveAmount?: number
  autoSaveFrequency?: string
  icon: string
  color: string
  createdAt: string
  completedAt?: string
  milestones?: any[]
  recentContributions?: any[]
}

export default function GoalsPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showContributeModal, setShowContributeModal] = useState(false)
  const [contributeAmount, setContributeAmount] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/goals')
      const data = await response.json()
      setGoals(data.goals || [])
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'Shield': Shield,
      'Plane': Plane,
      'Car': Car,
      'Home': Home,
      'Heart': Heart,
      'GraduationCap': GraduationCap,
      'Umbrella': Umbrella,
      'Smartphone': Smartphone,
      'Gift': Gift,
      'Wrench': Wrench,
      'Target': Target,
      'PiggyBank': PiggyBank,
      'Briefcase': Briefcase
    }
    const Icon = icons[iconName] || Target
    return <Icon className="w-5 h-5" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700'
      case 'high':
        return 'bg-orange-100 text-orange-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'paused':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateDaysLeft = (targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleContribute = async () => {
    if (!selectedGoal || !contributeAmount) return

    try {
      const response = await fetch('/api/goals/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: selectedGoal.id,
          amount: parseFloat(contributeAmount)
        })
      })

      if (response.ok) {
        setShowContributeModal(false)
        setSelectedGoal(null)
        setContributeAmount('')
        fetchGoals()
      }
    } catch (error) {
      console.error('Error adding contribution:', error)
    }
  }

  const filteredGoals = goals.filter(goal => {
    if (filter !== 'all' && goal.status !== filter) return false
    if (search && !goal.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const activeGoals = goals.filter(g => g.status === 'active').length
  const completedGoals = goals.filter(g => g.status === 'completed').length

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-deep-teal mx-auto mb-4" />
          <p className="text-gray-500">Loading your goals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-deep-teal">Financial Goals</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your financial goals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Total Goals</p>
          <p className="text-2xl font-bold text-deep-teal">{goals.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Active Goals</p>
          <p className="text-2xl font-bold text-soft-gold">{activeGoals}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-sage">{completedGoals}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-sage/20">
          <p className="text-sm text-gray-500 mb-1">Overall Progress</p>
          <p className="text-2xl font-bold text-deep-teal">
            {((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-sage/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search goals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'active'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'completed'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('paused')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'paused'
                  ? 'bg-deep-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paused
            </button>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-sage/20">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-deep-teal mb-2">No Goals Found</h3>
          <p className="text-gray-500 mb-6">Create your first financial goal to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Create a Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGoals.map((goal) => {
            const Icon = getIcon(goal.icon)
            const daysLeft = calculateDaysLeft(goal.targetDate)
            
            return (
              <div
                key={goal.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-sage/20 hover:shadow-xl transition-all"
              >
                <div className={`p-4 bg-gradient-to-r from-${goal.color}-500 to-${goal.color}-600 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Icon />
                      </div>
                      <div>
                        <h3 className="font-semibold">{goal.name}</h3>
                        <p className="text-xs opacity-75">{goal.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Progress</span>
                    <span className="text-sm font-medium text-deep-teal">{goal.progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-deep-teal to-sage rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Target</span>
                      <span className="font-medium text-deep-teal">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current</span>
                      <span className="font-medium text-green-600">{formatCurrency(goal.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Remaining</span>
                      <span className="font-medium text-soft-gold">{formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Target Date</span>
                      <span className="font-medium text-deep-teal">{formatDate(goal.targetDate)}</span>
                    </div>
                    {daysLeft > 0 && goal.status === 'active' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Days Left</span>
                        <span className="font-medium text-sage">{daysLeft} days</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {goal.status === 'active' && (
                        <button
                          onClick={() => {
                            setSelectedGoal(goal)
                            setShowContributeModal(true)
                          }}
                          className="text-sm text-soft-gold hover:text-deep-teal font-medium"
                        >
                          Add Funds
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/dashboard/goals/${goal.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Contribute Modal */}
      {showContributeModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-deep-teal">Add to {selectedGoal.name}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-soft-gold/5 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Current Progress</span>
                  <span className="font-medium text-deep-teal">
                    {formatCurrency(selectedGoal.currentAmount)} / {formatCurrency(selectedGoal.targetAmount)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-deep-teal to-sage rounded-full"
                    style={{ width: `${selectedGoal.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Add</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {[50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setContributeAmount(amt.toString())}
                    className="flex-1 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-soft-gold hover:text-white transition-colors"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setShowContributeModal(false)
                  setSelectedGoal(null)
                  setContributeAmount('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContribute}
                disabled={!contributeAmount || parseFloat(contributeAmount) <= 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                Add Contribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
EOF

# Replace goals page
mv src/app/dashboard/goals/page.tsx.clean src/app/dashboard/goals/page.tsx

echo "✅ Fixed goals page - removed Tool, added Wrench"

# Clear cache and restart
rm -rf .next
echo "✅ Cache cleared"

echo ""
echo "🎉 All fixes applied! Now run: npm run dev"
echo ""