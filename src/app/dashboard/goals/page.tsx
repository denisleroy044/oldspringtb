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
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all"
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
                      className="h-full bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer rounded-full"
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
                    className="h-full bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer rounded-full"
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-deep-teal to-sage btn-shimmer btn-shimmer text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
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
