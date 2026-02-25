'use client'

import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { AddAssetModal } from '@/components/dashboard/market/AddAssetModal'
import { 
  Asset, 
  PortfolioHolding, 
  WatchlistItem,
  MarketNews 
} from '@/types/market'
import {
  mockAssets,
  getPortfolio,
  addToPortfolio,
  removeFromPortfolio,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  setPriceAlert,
  getTopGainers,
  getTopLosers,
  getMarketNews,
  getAssetById
} from '@/lib/market/marketUtils'

function MarketContent() {
  const { user } = useDashboardContext()
  const { user: authUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'markets' | 'portfolio' | 'watchlist'>('markets')
  const [selectedView, setSelectedView] = useState<'all' | 'crypto' | 'stocks' | 'etf'>('all')
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [gainers, setGainers] = useState<Asset[]>([])
  const [losers, setLosers] = useState<Asset[]>([])
  const [news, setNews] = useState<MarketNews[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [addModalMode, setAddModalMode] = useState<'portfolio' | 'watchlist'>('portfolio')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [showAssetDetails, setShowAssetDetails] = useState(false)

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('sidebarChange' as any, handleSidebarChange)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Load user data
    if (authUser) {
      setPortfolio(getPortfolio(authUser.id))
      setWatchlist(getWatchlist(authUser.id))
    }

    // Load market data
    setGainers(getTopGainers())
    setLosers(getTopLosers())
    setNews(getMarketNews())

    return () => {
      window.removeEventListener('sidebarChange' as any, handleSidebarChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [authUser])

  if (!authUser) {
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  const filteredAssets = mockAssets.filter(asset => {
    if (selectedView !== 'all' && asset.type !== selectedView) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return asset.name.toLowerCase().includes(query) || asset.symbol.toLowerCase().includes(query)
    }
    return true
  })

  const handleAddToPortfolio = (asset: Asset, amount?: number, price?: number) => {
    if (amount && price && authUser) {
      const totalValue = amount * asset.price
      const profitLoss = (asset.price - price) * amount
      const profitLossPercent = ((asset.price - price) / price) * 100

      const newHolding: PortfolioHolding = {
        assetId: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        amount,
        averagePrice: price,
        currentPrice: asset.price,
        totalValue,
        profitLoss,
        profitLossPercent,
        type: asset.type,
        icon: asset.icon,
        color: asset.color
      }

      const updated = addToPortfolio(authUser.id, newHolding)
      setPortfolio(updated)
    }
  }

  const handleAddToWatchlist = (asset: Asset, amount?: number, price?: number, alertPrice?: number) => {
    if (!authUser) return
    
    const newItem: WatchlistItem = {
      assetId: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      price: asset.price,
      change: asset.change,
      changePercent: asset.changePercent,
      alertPrice,
      type: asset.type,
      icon: asset.icon,
      color: asset.color
    }

    const updated = addToWatchlist(authUser.id, newItem)
    setWatchlist(updated)
  }

  const handleRemoveFromPortfolio = (assetId: string) => {
    if (!authUser) return
    const updated = removeFromPortfolio(authUser.id, assetId)
    setPortfolio(updated)
  }

  const handleRemoveFromWatchlist = (assetId: string) => {
    if (!authUser) return
    const updated = removeFromWatchlist(authUser.id, assetId)
    setWatchlist(updated)
  }

  const handleSetAlert = (assetId: string, price: number) => {
    if (!authUser) return
    const updated = setPriceAlert(authUser.id, assetId, price)
    setWatchlist(updated)
  }

  const openAddToPortfolio = () => {
    setAddModalMode('portfolio')
    setShowAddModal(true)
  }

  const openAddToWatchlist = () => {
    setAddModalMode('watchlist')
    setShowAddModal(true)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const calculatePortfolioValue = () => {
    return portfolio.reduce((sum, h) => sum + h.totalValue, 0)
  }

  const calculatePortfolioProfitLoss = () => {
    return portfolio.reduce((sum, h) => sum + h.profitLoss, 0)
  }

  const calculatePortfolioProfitLossPercent = () => {
    const totalValue = calculatePortfolioValue()
    const totalCost = portfolio.reduce((sum, h) => sum + (h.averagePrice * h.amount), 0)
    if (totalCost === 0) return 0
    return ((totalValue - totalCost) / totalCost) * 100
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 flex flex-col ${
        !isMobile && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
      }`}>
        <Header />
        <main className="flex-1 pt-20 lg:pt-24 px-4 lg:px-6 pb-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">Market Watch</h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">Track markets, manage portfolio, and set alerts</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={openAddToPortfolio}
                className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#2b4c7a] transition flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add to Portfolio
              </button>
              <button
                onClick={openAddToWatchlist}
                className="px-4 py-2 bg-white text-[#1e3a5f] border-2 border-[#1e3a5f] rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Watchlist
              </button>
            </div>
          </div>

          {/* Market Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Total Portfolio Value</p>
              <p className="text-xl font-bold text-[#1e3a5f]">${formatCurrency(calculatePortfolioValue())}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Total P&L</p>
              <p className={`text-xl font-bold ${calculatePortfolioProfitLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatePortfolioProfitLoss() >= 0 ? '+' : ''}{formatCurrency(calculatePortfolioProfitLoss())}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500 mb-1">P&L %</p>
              <p className={`text-xl font-bold ${calculatePortfolioProfitLossPercent() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatePortfolioProfitLossPercent() >= 0 ? '+' : ''}{calculatePortfolioProfitLossPercent().toFixed(2)}%
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Watchlist Alerts</p>
              <p className="text-xl font-bold text-[#e68a2e]">{watchlist.filter(w => w.alertPrice).length}</p>
            </div>
          </div>

          {/* Main Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-4 lg:px-6">
              <nav className="flex space-x-4 lg:space-x-6" aria-label="Tabs">
                {[
                  { id: 'markets', name: 'Markets', icon: '📊' },
                  { id: 'portfolio', name: 'My Portfolio', icon: '💼' },
                  { id: 'watchlist', name: 'Watchlist', icon: '⭐' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 lg:py-4 px-1 border-b-2 font-medium text-xs lg:text-sm transition flex items-center space-x-1 lg:space-x-2 ${
                      activeTab === tab.id
                        ? 'border-[#1e3a5f] text-[#1e3a5f]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 lg:p-6">
              {/* Markets Tab */}
              {activeTab === 'markets' && (
                <div>
                  {/* Market Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex space-x-2">
                      {[
                        { id: 'all', name: 'All Markets' },
                        { id: 'crypto', name: 'Crypto' },
                        { id: 'stocks', name: 'Stocks' },
                        { id: 'etf', name: 'ETFs' }
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setSelectedView(filter.id as any)}
                          className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition ${
                            selectedView === filter.id
                              ? 'bg-[#1e3a5f] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {filter.name}
                        </button>
                      ))}
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search markets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-48 lg:w-64 pl-8 lg:pl-9 pr-3 lg:pr-4 py-1.5 lg:py-2 text-xs lg:text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a5f] transition"
                      />
                      <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 absolute left-2.5 lg:left-3 top-2 lg:top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Market Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                          <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                          <th className="hidden lg:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h Volume</th>
                          <th className="hidden lg:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                          <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredAssets.map((asset) => (
                          <tr key={asset.id} className="hover:bg-gray-50 transition">
                            <td className="px-3 lg:px-4 py-2 lg:py-3">
                              <div className="flex items-center space-x-2 lg:space-x-3">
                                <div 
                                  className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold flex-shrink-0"
                                  style={{ backgroundColor: asset.color }}
                                >
                                  {asset.icon}
                                </div>
                                <div>
                                  <p className="text-xs lg:text-sm font-medium text-gray-900">{asset.name}</p>
                                  <p className="text-xs text-gray-500">{asset.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm font-medium">
                              ${formatCurrency(asset.price)}
                            </td>
                            <td className="px-3 lg:px-4 py-2 lg:py-3 text-right">
                              <span className={`text-xs lg:text-sm ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                              </span>
                            </td>
                            <td className="hidden lg:table-cell px-4 py-3 text-right text-sm text-gray-600">
                              ${(asset.volume! / 1000000).toFixed(1)}M
                            </td>
                            <td className="hidden lg:table-cell px-4 py-3 text-right text-sm text-gray-600">
                              ${(asset.marketCap! / 1000000000).toFixed(2)}B
                            </td>
                            <td className="px-3 lg:px-4 py-2 lg:py-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedAsset(asset)
                                  setShowAssetDetails(true)
                                }}
                                className="text-[#1e3a5f] hover:text-[#2b4c7a] text-xs lg:text-sm font-medium mr-2 lg:mr-3"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => {
                                  setAddModalMode('portfolio')
                                  setSelectedAsset(asset)
                                  setShowAddModal(true)
                                }}
                                className="text-green-600 hover:text-green-700 text-xs lg:text-sm font-medium"
                              >
                                Buy
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <div>
                  {portfolio.length === 0 ? (
                    <div className="text-center py-8 lg:py-12">
                      <div className="text-4xl lg:text-5xl mb-3 lg:mb-4">💼</div>
                      <p className="text-gray-500 mb-2">Your portfolio is empty</p>
                      <p className="text-xs lg:text-sm text-gray-400 mb-4">Start building your portfolio by adding assets</p>
                      <button
                        onClick={openAddToPortfolio}
                        className="px-4 lg:px-6 py-2 lg:py-3 bg-[#1e3a5f] text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-[#2b4c7a] transition"
                      >
                        Add Your First Asset
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase">Holdings</th>
                            <th className="hidden lg:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase">P&L</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {portfolio.map((holding) => (
                            <tr key={holding.assetId} className="hover:bg-gray-50 transition">
                              <td className="px-3 lg:px-4 py-2 lg:py-3">
                                <div className="flex items-center space-x-2 lg:space-x-3">
                                  <div 
                                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold"
                                    style={{ backgroundColor: holding.color }}
                                  >
                                    {holding.icon}
                                  </div>
                                  <div>
                                    <p className="text-xs lg:text-sm font-medium text-gray-900">{holding.name}</p>
                                    <p className="text-xs text-gray-500">{holding.symbol}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm font-medium">
                                {holding.amount} {holding.symbol}
                              </td>
                              <td className="hidden lg:table-cell px-4 py-3 text-right text-sm text-gray-600">
                                ${formatCurrency(holding.averagePrice)}
                              </td>
                              <td className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm text-gray-600">
                                ${formatCurrency(holding.currentPrice)}
                              </td>
                              <td className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm font-medium">
                                ${formatCurrency(holding.totalValue)}
                              </td>
                              <td className="px-3 lg:px-4 py-2 lg:py-3 text-right">
                                <span className={`text-xs lg:text-sm ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ${formatCurrency(Math.abs(holding.profitLoss))}
                                  <br />
                                  <span className="text-xs">
                                    ({holding.profitLoss >= 0 ? '+' : ''}{holding.profitLossPercent.toFixed(2)}%)
                                  </span>
                                </span>
                              </td>
                              <td className="px-3 lg:px-4 py-2 lg:py-3 text-right">
                                <button
                                  onClick={() => handleRemoveFromPortfolio(holding.assetId)}
                                  className="text-red-600 hover:text-red-700 text-xs lg:text-sm font-medium"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Watchlist Tab */}
              {activeTab === 'watchlist' && (
                <div>
                  {watchlist.length === 0 ? (
                    <div className="text-center py-8 lg:py-12">
                      <div className="text-4xl lg:text-5xl mb-3 lg:mb-4">⭐</div>
                      <p className="text-gray-500 mb-2">Your watchlist is empty</p>
                      <p className="text-xs lg:text-sm text-gray-400 mb-4">Track assets you're interested in</p>
                      <button
                        onClick={openAddToWatchlist}
                        className="px-4 lg:px-6 py-2 lg:py-3 bg-[#1e3a5f] text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-[#2b4c7a] transition"
                      >
                        Add to Watchlist
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase">24h Change</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase">Alert</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {watchlist.map((item) => (
                            <tr key={item.assetId} className="hover:bg-gray-50 transition">
                              <td className="px-3 lg:px-4 py-2 lg:py-3">
                                <div className="flex items-center space-x-2 lg:space-x-3">
                                  <div 
                                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold"
                                    style={{ backgroundColor: item.color }}
                                  >
                                    {item.icon}
                                  </div>
                                  <div>
                                    <p className="text-xs lg:text-sm font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.symbol}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm font-medium">
                                ${formatCurrency(item.price)}
                              </td>
                              <td className="px-3 lg:px-4 py-2 lg:py-3 text-right">
                                <span className={`text-xs lg:text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                                </span>
                              </td>
                              <td className="px-3 lg:px-4 py-2 lg:py-3 text-right">
                                {item.alertPrice ? (
                                  <span className="text-[#e68a2e] text-xs lg:text-sm">
                                    ${formatCurrency(item.alertPrice)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-xs lg:text-sm">None</span>
                                )}
                              </td>
                              <td className="px-3 lg:px-4 py-2 lg:py-3 text-right">
                                <button
                                  onClick={() => {
                                    const asset = getAssetById(item.assetId)
                                    if (asset) {
                                      setSelectedAsset(asset)
                                      setShowAssetDetails(true)
                                    }
                                  }}
                                  className="text-[#1e3a5f] hover:text-[#2b4c7a] text-xs lg:text-sm font-medium mr-2 lg:mr-3"
                                >
                                  Details
                                </button>
                                <button
                                  onClick={() => handleRemoveFromWatchlist(item.assetId)}
                                  className="text-red-600 hover:text-red-700 text-xs lg:text-sm font-medium"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Market Movers & News */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
            {/* Top Gainers */}
            <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center">
                <span className="text-green-500 mr-2">📈</span>
                Top Gainers
              </h3>
              <div className="space-y-2 lg:space-y-3">
                {gainers.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: asset.color }}
                      >
                        {asset.icon}
                      </div>
                      <span className="text-xs lg:text-sm font-medium">{asset.symbol}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs lg:text-sm font-medium">${asset.price.toFixed(2)}</span>
                      <span className="text-xs text-green-600 ml-2">
                        +{asset.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center">
                <span className="text-red-500 mr-2">📉</span>
                Top Losers
              </h3>
              <div className="space-y-2 lg:space-y-3">
                {losers.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: asset.color }}
                      >
                        {asset.icon}
                      </div>
                      <span className="text-xs lg:text-sm font-medium">{asset.symbol}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs lg:text-sm font-medium">${asset.price.toFixed(2)}</span>
                      <span className="text-xs text-red-600 ml-2">
                        {asset.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market News */}
            <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center">
                <span className="text-blue-500 mr-2">📰</span>
                Market News
              </h3>
              <div className="space-y-2 lg:space-y-3">
                {news.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                    <p className="text-xs lg:text-sm font-medium text-gray-900 mb-1">{item.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{item.source}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                        item.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <DashboardFooter />
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedAsset(null)
        }}
        onAdd={(asset, amount, price, alertPrice) => {
          if (addModalMode === 'portfolio') {
            handleAddToPortfolio(asset, amount, price)
          } else {
            handleAddToWatchlist(asset, undefined, undefined, alertPrice)
          }
        }}
        mode={addModalMode}
      />

      {/* Asset Details Modal */}
      {showAssetDetails && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div 
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white text-base lg:text-lg font-bold"
                  style={{ backgroundColor: selectedAsset.color }}
                >
                  {selectedAsset.icon}
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900">{selectedAsset.name}</h3>
                  <p className="text-xs lg:text-sm text-gray-500">{selectedAsset.symbol}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAssetDetails(false)}
                className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 lg:p-6">
              {/* Price Info */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Current Price</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">${formatCurrency(selectedAsset.price)}</p>
                </div>
                <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">24h Change</p>
                  <p className={`text-lg lg:text-2xl font-bold ${selectedAsset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Market Stats */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                  <p className="text-sm lg:text-base font-semibold">${(selectedAsset.marketCap! / 1000000000).toFixed(2)}B</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">24h Volume</p>
                  <p className="text-sm lg:text-base font-semibold">${(selectedAsset.volume! / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">24h High</p>
                  <p className="text-sm lg:text-base font-semibold">${formatCurrency(selectedAsset.high24h!)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">24h Low</p>
                  <p className="text-sm lg:text-base font-semibold">${formatCurrency(selectedAsset.low24h!)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 lg:space-x-3">
                <button
                  onClick={() => {
                    setShowAssetDetails(false)
                    setAddModalMode('portfolio')
                    setShowAddModal(true)
                  }}
                  className="flex-1 px-3 lg:px-4 py-2 lg:py-3 bg-[#1e3a5f] text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-[#2b4c7a] transition"
                >
                  Buy
                </button>
                <button
                  onClick={() => {
                    setShowAssetDetails(false)
                    setAddModalMode('watchlist')
                    setShowAddModal(true)
                  }}
                  className="flex-1 px-3 lg:px-4 py-2 lg:py-3 border-2 border-[#1e3a5f] text-[#1e3a5f] rounded-lg text-xs lg:text-sm font-medium hover:bg-gray-50 transition"
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MarketPage() {
  return (
    <DashboardProvider>
      <MarketContent />
    </DashboardProvider>
  )
}
