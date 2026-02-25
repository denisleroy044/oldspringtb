'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { MarketAsset } from '@/lib/market/yahooFinanceService'

interface MarketContextType {
  assets: MarketAsset[]
  watchlist: string[]
  portfolio: { symbol: string; holdings: number; averagePrice: number }[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  refreshData: () => Promise<void>
  searchAssets: (query: string) => Promise<any[]>
}

const MarketContext = createContext<MarketContextType | undefined>(undefined)

const DEFAULT_WATCHLIST = ['AAPL', 'GOOGL', 'MSFT', 'BTC-USD', 'ETH-USD', 'SPY']

export function MarketProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<MarketAsset[]>([])
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_WATCHLIST)
  const [portfolio, setPortfolio] = useState<{ symbol: string; holdings: number; averagePrice: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchMarketData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/market?action=quotes')
      const result = await response.json()

      if (result.success) {
        setAssets(result.data)
        setLastUpdated(new Date(result.timestamp))
      } else {
        setError(result.error || 'Failed to fetch market data')
      }
    } catch (err) {
      setError('Network error while fetching market data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const addToWatchlist = (symbol: string) => {
    setWatchlist(prev => {
      if (prev.includes(symbol)) return prev
      return [...prev, symbol]
    })
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol))
  }

  const refreshData = async () => {
    await fetchMarketData()
  }

  const searchAssets = async (query: string) => {
    try {
      const response = await fetch(`/api/market?action=search&query=${encodeURIComponent(query)}`)
      const result = await response.json()
      return result.success ? result.data : []
    } catch (err) {
      console.error('Search error:', err)
      return []
    }
  }

  return (
    <MarketContext.Provider value={{
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
    }}>
      {children}
    </MarketContext.Provider>
  )
}

export function useMarket() {
  const context = useContext(MarketContext)
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider')
  }
  return context
}
