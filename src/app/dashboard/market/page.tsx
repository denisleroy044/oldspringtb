'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useMarket } from '@/context/MarketContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'

export default function MarketPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { 
    assets, 
    watchlist, 
    portfolio, 
    loading, 
    error, 
    lastUpdated,
    addToWatchlist,
    removeFromWatchlist,
    refreshData,
    searchAssets 
  } = useMarket()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio' | 'watchlist'>('market')
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [buyAmount, setBuyAmount] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Handle search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setSearching(true)
        const results = await searchAssets(searchQuery)
        setSearchResults(results)
        setSearching(false)
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery, searchAssets])

  const handleBuyClick = (asset: any) => {
    setSelectedAsset(asset)
    setShowBuyModal(true)
  }

  const handleBuyConfirm = () => {
    const amount = parseFloat(buyAmount)
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' })
      return
    }

    setMessage({ type: 'success', text: `Successfully purchased ${amount} shares of ${selectedAsset.symbol}` })
    setShowBuyModal(false)
    setBuyAmount('')
    setSelectedAsset(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatCompact = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value)
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getAssetIcon = (type: string) => {
    switch(type) {
      case 'stock': return '📈'
      case 'crypto': return '₿'
      case 'etf': return '📊'
      case 'bond': return '📉'
      case 'commodity': return '🛢️'
      case 'index': return '📊'
      default: return '💹'
    }
  }

  if (loading && assets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading market data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <ScrollAnimation animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-deep-teal mb-2">Markets</h1>
              <p className="text-gray-600">Track stocks, crypto, ETFs, and commodities in real-time</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg">
                {error} - Showing cached data
              </div>
            )}

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks, crypto, ETFs... (e.g., AAPL, BTC-USD, SPY)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              {searching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  Searching...
                </span>
              )}
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.symbol}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      onClick={() => {
                        setSearchQuery('')
                        setSearchResults([])
                        // You could navigate to asset detail or add to watchlist
                      }}
                    >
                      <div>
                        <span className="font-medium text-deep-teal">{result.symbol}</span>
                        <span className="text-sm text-gray-600 ml-2">{result.name}</span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {result.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => refreshData()}
              className="mb-4 text-sm text-deep-teal hover:text-soft-gold transition-colors flex items-center gap-2"
            >
              <span>↻</span> Refresh Data
            </button>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {[
                { id: 'market', label: 'Market', icon: '📊' },
                { id: 'watchlist', label: 'Watchlist', icon: '👁️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-soft-gold text-deep-teal'
                      : 'border-transparent text-gray-500 hover:text-deep-teal'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Market Tab */}
            {activeTab === 'market' && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{getAssetIcon(asset.type)}</span>
                              <div>
                                <p className="font-medium text-gray-900">{asset.symbol}</p>
                                <p className="text-sm text-gray-500">{asset.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                            {asset.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            {formatCurrency(asset.price)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getChangeColor(asset.change)}`}>
                            {asset.change > 0 ? '+' : ''}{formatCurrency(asset.change)} ({asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            {asset.volume ? formatCompact(asset.volume) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleBuyClick(asset)}
                              className="text-deep-teal hover:text-soft-gold transition-colors mr-3"
                            >
                              Buy
                            </button>
                            <button
                              onClick={() => {
                                if (watchlist.includes(asset.symbol)) {
                                  removeFromWatchlist(asset.symbol)
                                } else {
                                  addToWatchlist(asset.symbol)
                                }
                              }}
                              className={`transition-colors ${
                                watchlist.includes(asset.symbol)
                                  ? 'text-soft-gold hover:text-deep-teal'
                                  : 'text-gray-400 hover:text-deep-teal'
                              }`}
                            >
                              {watchlist.includes(asset.symbol) ? '✓ Watching' : '👁️ Watch'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Watchlist Tab */}
            {activeTab === 'watchlist' && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-deep-teal">Your Watchlist</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assets
                        .filter(asset => watchlist.includes(asset.symbol))
                        .map((asset) => (
                          <tr key={asset.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-2xl mr-3">{getAssetIcon(asset.type)}</span>
                                <div>
                                  <p className="font-medium text-gray-900">{asset.symbol}</p>
                                  <p className="text-sm text-gray-500">{asset.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                              {asset.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                              {formatCurrency(asset.price)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getChangeColor(asset.change)}`}>
                              {asset.change > 0 ? '+' : ''}{formatCurrency(asset.change)} ({asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() => handleBuyClick(asset)}
                                className="text-deep-teal hover:text-soft-gold transition-colors mr-3"
                              >
                                Buy
                              </button>
                              <button
                                onClick={() => removeFromWatchlist(asset.symbol)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      {watchlist.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            Your watchlist is empty. Add assets from the Market tab.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ScrollAnimation>
        </main>
        <DashboardFooter />
      </div>

      {/* Buy Modal */}
      {showBuyModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-deep-teal mb-4">Buy {selectedAsset.symbol}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Price
                </label>
                <input
                  type="text"
                  value={formatCurrency(selectedAsset.price)}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Shares
                </label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                  required
                />
              </div>

              {buyAmount && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="font-bold text-deep-teal">
                      {formatCurrency(parseFloat(buyAmount) * selectedAsset.price)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBuyConfirm}
                  className="flex-1 bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors"
                >
                  Confirm Purchase
                </button>
                <button
                  onClick={() => {
                    setShowBuyModal(false)
                    setSelectedAsset(null)
                    setBuyAmount('')
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
