'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

interface Asset {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  icon: string
  color: string
}

export function MarketWatch() {
  const { user } = useAuth()
  const [assets, setAssets] = useState<Asset[]>([])
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [portfolioChange, setPortfolioChange] = useState(0)
  const [watchlistCount, setWatchlistCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load mock data - in production, this would come from your API/database
    const mockAssets: Asset[] = [
      {
        id: 'btc',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 52341.80,
        change: 1245.60,
        changePercent: 2.43,
        icon: '₿',
        color: '#f7931a'
      },
      {
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3124.50,
        change: -45.20,
        changePercent: -1.42,
        icon: 'Ξ',
        color: '#627eea'
      },
      {
        id: 'aapl',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 182.63,
        change: 2.34,
        changePercent: 1.29,
        icon: '🍎',
        color: '#555555'
      },
      {
        id: 'nvda',
        symbol: 'NVDA',
        name: 'NVIDIA',
        price: 788.17,
        change: 23.45,
        changePercent: 3.06,
        icon: '🎮',
        color: '#76b900'
      }
    ]

    // Load user's portfolio data from localStorage (in production, this would be from your database)
    if (user) {
      const savedPortfolio = localStorage.getItem(`portfolio_${user.id}`)
      if (savedPortfolio) {
        const portfolio = JSON.parse(savedPortfolio)
        setPortfolioValue(portfolio.totalValue || 12450.75)
        setPortfolioChange(portfolio.change || 2.34)
      } else {
        // Default mock data
        setPortfolioValue(12450.75)
        setPortfolioChange(2.34)
      }

      const savedWatchlist = localStorage.getItem(`watchlist_${user.id}`)
      if (savedWatchlist) {
        const watchlist = JSON.parse(savedWatchlist)
        setWatchlistCount(watchlist.length || 8)
      } else {
        setWatchlistCount(8)
      }
    }

    setAssets(mockAssets)
    setLoading(false)
  }, [user])

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 10) return price.toFixed(2)
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: price > 1000 ? 0 : 2 
    })
  }

  const formatLargePrice = (price: number) => {
    if (price > 1000) {
      return `$${(price / 1000).toFixed(1)}K`
    }
    return `$${price.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2b4c7a] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="font-semibold">Market Watch</h3>
          </div>
          <Link 
            href="/dashboard/market" 
            className="text-xs text-white/80 hover:text-white transition flex items-center"
          >
            View All
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Portfolio Value</p>
            <p className="text-lg font-bold text-[#1e3a5f]">${portfolioValue.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">24h Change</p>
            <p className={`text-sm font-semibold ${portfolioChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioChange >= 0 ? '+' : ''}{portfolioChange}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Watchlist</p>
            <p className="text-sm font-semibold text-[#e68a2e]">{watchlistCount} items</p>
          </div>
        </div>
      </div>

      {/* Top Movers */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-600">TOP MOVERS</p>
      </div>

      {/* Asset List */}
      <div className="divide-y divide-gray-100">
        {assets.slice(0, 3).map((asset) => (
          <Link
            key={asset.id}
            href={`/dashboard/market?asset=${asset.id}`}
            className="block px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: asset.color }}
                >
                  {asset.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{asset.symbol}</p>
                  <p className="text-xs text-gray-400">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {asset.price > 1000 ? formatLargePrice(asset.price) : `$${asset.price.toFixed(2)}`}
                </p>
                <p className={`text-xs ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Gainers</span>
          <span className="font-medium text-green-600">12</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Losers</span>
          <span className="font-medium text-red-600">8</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Volume</span>
          <span className="font-medium">$2.4B</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Updated</span>
          <span className="font-medium">1 min ago</span>
        </div>
      </div>

      {/* Footer Link */}
      <Link
        href="/dashboard/market"
        className="block px-4 py-2 text-center text-sm text-[#1e3a5f] hover:text-[#2b4c7a] font-medium border-t border-gray-200 hover:bg-gray-50 transition"
      >
        Go to Market Watch →
      </Link>
    </div>
  )
}
