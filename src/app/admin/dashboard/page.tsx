'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2,
  Wallet,
  ArrowRight
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-deep-teal" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'blue',
      href: '/admin/users'
    },
    {
      title: 'Total Balance',
      value: formatCurrency(stats?.totalBalance || 0),
      icon: DollarSign,
      color: 'green',
      href: '/admin/funds',
      description: 'Across all accounts'
    },
    {
      title: 'Total Volume',
      value: formatCurrency(stats?.totalVolume || 0),
      icon: TrendingUp,
      color: 'purple',
      href: '/admin/transactions',
      description: 'All time transactions'
    },
    {
      title: 'Transactions',
      value: stats?.totalTransactions || 0,
      icon: CreditCard,
      color: 'orange',
      href: '/admin/transactions'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          }

          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              {stat.description && (
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              )}
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/funds"
          className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8" />
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Funds Management</h3>
          <p className="text-green-100">Add or remove funds from user accounts</p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-semibold mb-2">User Management</h3>
          <p className="text-blue-100">Manage users and their accounts</p>
        </Link>
      </div>
    </div>
  )
}
