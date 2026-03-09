import { Asset, PortfolioHolding, WatchlistItem } from '@/types/market'

// Mock market data - In production, this would come from a real API
export const mockAssets: Asset[] = [
  // Cryptocurrencies
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    price: 52341.80,
    change: 1245.60,
    changePercent: 2.43,
    marketCap: 1020000000000,
    volume: 28500000000,
    high24h: 52800.00,
    low24h: 51000.00,
    icon: '₿',
    color: '#f7931a',
    chart: [48000, 49500, 51200, 50800, 52300, 51800, 52341]
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    price: 3124.50,
    change: -45.20,
    changePercent: -1.42,
    marketCap: 375000000000,
    volume: 15200000000,
    high24h: 3200.00,
    low24h: 3100.00,
    icon: 'Ξ',
    color: '#627eea',
    chart: [3200, 3150, 3220, 3180, 3120, 3100, 3124]
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    type: 'crypto',
    price: 145.80,
    change: 8.75,
    changePercent: 6.38,
    marketCap: 62000000000,
    volume: 3500000000,
    high24h: 148.20,
    low24h: 137.50,
    icon: '◎',
    color: '#00ffa3',
    chart: [135, 138, 142, 140, 144, 143, 145]
  },
  {
    id: 'ada',
    symbol: 'ADA',
    name: 'Cardano',
    type: 'crypto',
    price: 0.89,
    change: 0.05,
    changePercent: 5.95,
    marketCap: 31500000000,
    volume: 1200000000,
    high24h: 0.91,
    low24h: 0.84,
    icon: '₳',
    color: '#0033ad',
    chart: [0.82, 0.84, 0.86, 0.85, 0.88, 0.87, 0.89]
  },
  {
    id: 'dot',
    symbol: 'DOT',
    name: 'Polkadot',
    type: 'crypto',
    price: 12.45,
    change: 0.32,
    changePercent: 2.64,
    marketCap: 15800000000,
    volume: 850000000,
    high24h: 12.80,
    low24h: 12.10,
    icon: '●',
    color: '#e6007a',
    chart: [11.80, 12.10, 12.30, 12.20, 12.50, 12.40, 12.45]
  },
  {
    id: 'link',
    symbol: 'LINK',
    name: 'Chainlink',
    type: 'crypto',
    price: 18.92,
    change: -0.28,
    changePercent: -1.46,
    marketCap: 11200000000,
    volume: 650000000,
    high24h: 19.30,
    low24h: 18.70,
    icon: '🔗',
    color: '#2a5ada',
    chart: [19.20, 19.00, 18.80, 18.90, 19.10, 18.85, 18.92]
  },

  // Stocks
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    price: 182.63,
    change: 2.34,
    changePercent: 1.29,
    marketCap: 2850000000000,
    volume: 52000000,
    high24h: 183.50,
    low24h: 180.20,
    icon: '🍎',
    color: '#555555',
    chart: [175, 177, 180, 179, 181, 182, 182]
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    type: 'stock',
    price: 788.17,
    change: 23.45,
    changePercent: 3.06,
    marketCap: 1950000000000,
    volume: 45000000,
    high24h: 795.00,
    low24h: 765.50,
    icon: '🎮',
    color: '#76b900',
    chart: [750, 765, 780, 775, 785, 790, 788]
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    type: 'stock',
    price: 420.55,
    change: -2.15,
    changePercent: -0.51,
    marketCap: 3120000000000,
    volume: 22000000,
    high24h: 425.00,
    low24h: 418.50,
    icon: '🪟',
    color: '#00a4ef',
    chart: [425, 423, 424, 422, 421, 420, 420]
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    type: 'stock',
    price: 202.64,
    change: -5.32,
    changePercent: -2.56,
    marketCap: 645000000000,
    volume: 98000000,
    high24h: 208.50,
    low24h: 201.20,
    icon: '⚡',
    color: '#e31937',
    chart: [210, 208, 205, 203, 201, 200, 202]
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'stock',
    price: 178.75,
    change: 1.25,
    changePercent: 0.70,
    marketCap: 1850000000000,
    volume: 35000000,
    high24h: 180.20,
    low24h: 177.30,
    icon: '📦',
    color: '#ff9900',
    chart: [176, 177, 178, 177.50, 178.20, 178.50, 178.75]
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    price: 152.80,
    change: 1.80,
    changePercent: 1.19,
    marketCap: 1920000000000,
    volume: 25000000,
    high24h: 153.50,
    low24h: 151.20,
    icon: '🔍',
    color: '#4285f4',
    chart: [150, 151, 152, 151.80, 152.30, 152.60, 152.80]
  },

  // ETFs
  {
    id: 'voo',
    symbol: 'VOO',
    name: 'Vanguard S&P 500',
    type: 'etf',
    price: 478.32,
    change: 3.21,
    changePercent: 0.68,
    marketCap: 985000000000,
    volume: 3800000,
    high24h: 479.50,
    low24h: 475.20,
    icon: '📊',
    color: '#041e42',
    chart: [475, 476, 477, 477.50, 478, 478.20, 478.32]
  },
  {
    id: 'qqq',
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    type: 'etf',
    price: 438.65,
    change: 5.40,
    changePercent: 1.24,
    marketCap: 235000000000,
    volume: 42000000,
    high24h: 440.00,
    low24h: 433.50,
    icon: '📈',
    color: '#1b75bc',
    chart: [433, 435, 437, 436.50, 438, 438.30, 438.65]
  },
  {
    id: 'spy',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    type: 'etf',
    price: 521.45,
    change: 3.50,
    changePercent: 0.68,
    marketCap: 412000000000,
    volume: 75000000,
    high24h: 522.50,
    low24h: 518.30,
    icon: '📉',
    color: '#003366',
    chart: [518, 519, 520, 520.50, 521, 521.30, 521.45]
  }
]

// Local storage keys
const PORTFOLIO_KEY = 'user_portfolio'
const WATCHLIST_KEY = 'user_watchlist'

// Portfolio management
export const getPortfolio = (userId: string): PortfolioHolding[] => {
  const key = `${PORTFOLIO_KEY}_${userId}`
  const stored = localStorage.getItem(key)
  if (stored) {
    return JSON.parse(stored)
  }
  
  // Default portfolio for demo
  const defaultPortfolio: PortfolioHolding[] = [
    {
      assetId: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.15,
      averagePrice: 48500.00,
      currentPrice: 52341.80,
      totalValue: 7851.27,
      profitLoss: 726.27,
      profitLossPercent: 10.20,
      type: 'crypto',
      icon: '₿',
      color: '#f7931a'
    },
    {
      assetId: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 2.5,
      averagePrice: 2950.00,
      currentPrice: 3124.50,
      totalValue: 7811.25,
      profitLoss: 436.25,
      profitLossPercent: 5.92,
      type: 'crypto',
      icon: 'Ξ',
      color: '#627eea'
    },
    {
      assetId: 'aapl',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      amount: 50,
      averagePrice: 170.00,
      currentPrice: 182.63,
      totalValue: 9131.50,
      profitLoss: 631.50,
      profitLossPercent: 7.43,
      type: 'stock',
      icon: '🍎',
      color: '#555555'
    },
    {
      assetId: 'voo',
      symbol: 'VOO',
      name: 'Vanguard S&P 500',
      amount: 25,
      averagePrice: 460.00,
      currentPrice: 478.32,
      totalValue: 11958.00,
      profitLoss: 458.00,
      profitLossPercent: 3.98,
      type: 'etf',
      icon: '📊',
      color: '#041e42'
    }
  ]
  
  localStorage.setItem(key, JSON.stringify(defaultPortfolio))
  return defaultPortfolio
}

export const savePortfolio = (userId: string, portfolio: PortfolioHolding[]) => {
  const key = `${PORTFOLIO_KEY}_${userId}`
  localStorage.setItem(key, JSON.stringify(portfolio))
}

export const addToPortfolio = (userId: string, holding: PortfolioHolding) => {
  const portfolio = getPortfolio(userId)
  const existingIndex = portfolio.findIndex(h => h.assetId === holding.assetId)
  
  if (existingIndex >= 0) {
    // Update existing holding
    const existing = portfolio[existingIndex]
    const totalAmount = existing.amount + holding.amount
    const totalCost = (existing.averagePrice * existing.amount) + (holding.averagePrice * holding.amount)
    const newAveragePrice = totalCost / totalAmount
    
    portfolio[existingIndex] = {
      ...existing,
      amount: totalAmount,
      averagePrice: newAveragePrice,
      currentPrice: holding.currentPrice,
      totalValue: totalAmount * holding.currentPrice,
      profitLoss: (totalAmount * holding.currentPrice) - totalCost,
      profitLossPercent: ((holding.currentPrice - newAveragePrice) / newAveragePrice) * 100
    }
  } else {
    // Add new holding
    portfolio.push(holding)
  }
  
  savePortfolio(userId, portfolio)
  return portfolio
}

export const removeFromPortfolio = (userId: string, assetId: string) => {
  const portfolio = getPortfolio(userId)
  const filtered = portfolio.filter(h => h.assetId !== assetId)
  savePortfolio(userId, filtered)
  return filtered
}

// Watchlist management
export const getWatchlist = (userId: string): WatchlistItem[] => {
  const key = `${WATCHLIST_KEY}_${userId}`
  const stored = localStorage.getItem(key)
  if (stored) {
    return JSON.parse(stored)
  }
  
  // Default watchlist for demo
  const defaultWatchlist: WatchlistItem[] = [
    {
      assetId: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 52341.80,
      change: 1245.60,
      changePercent: 2.43,
      type: 'crypto',
      icon: '₿',
      color: '#f7931a'
    },
    {
      assetId: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3124.50,
      change: -45.20,
      changePercent: -1.42,
      type: 'crypto',
      icon: 'Ξ',
      color: '#627eea'
    },
    {
      assetId: 'nvda',
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      price: 788.17,
      change: 23.45,
      changePercent: 3.06,
      type: 'stock',
      icon: '🎮',
      color: '#76b900'
    }
  ]
  
  localStorage.setItem(key, JSON.stringify(defaultWatchlist))
  return defaultWatchlist
}

export const saveWatchlist = (userId: string, watchlist: WatchlistItem[]) => {
  const key = `${WATCHLIST_KEY}_${userId}`
  localStorage.setItem(key, JSON.stringify(watchlist))
}

export const addToWatchlist = (userId: string, item: WatchlistItem) => {
  const watchlist = getWatchlist(userId)
  if (!watchlist.find(i => i.assetId === item.assetId)) {
    watchlist.push(item)
    saveWatchlist(userId, watchlist)
  }
  return watchlist
}

export const removeFromWatchlist = (userId: string, assetId: string) => {
  const watchlist = getWatchlist(userId)
  const filtered = watchlist.filter(i => i.assetId !== assetId)
  saveWatchlist(userId, filtered)
  return filtered
}

export const setPriceAlert = (userId: string, assetId: string, alertPrice: number) => {
  const watchlist = getWatchlist(userId)
  const item = watchlist.find(i => i.assetId === assetId)
  if (item) {
    item.alertPrice = alertPrice
    saveWatchlist(userId, watchlist)
  }
  return watchlist
}

// Market data utilities
export const getAssetById = (id: string): Asset | undefined => {
  return mockAssets.find(asset => asset.id === id)
}

export const searchAssets = (query: string): Asset[] => {
  const lowerQuery = query.toLowerCase()
  return mockAssets.filter(asset => 
    asset.name.toLowerCase().includes(lowerQuery) ||
    asset.symbol.toLowerCase().includes(lowerQuery)
  )
}

export const getTopGainers = (limit: number = 5): Asset[] => {
  return [...mockAssets]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, limit)
}

export const getTopLosers = (limit: number = 5): Asset[] => {
  return [...mockAssets]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, limit)
}

export const getMarketNews = (): MarketNews[] => {
  return [
    {
      id: '1',
      title: 'Bitcoin ETF sees record inflows as institutional adoption grows',
      source: 'Bloomberg',
      url: '#',
      publishedAt: new Date().toISOString(),
      sentiment: 'positive',
      relatedAssets: ['btc']
    },
    {
      id: '2',
      title: 'NVIDIA announces AI partnership with major cloud providers',
      source: 'Reuters',
      url: '#',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      sentiment: 'positive',
      relatedAssets: ['nvda']
    },
    {
      id: '3',
      title: 'Fed holds rates steady, signals possible cuts later this year',
      source: 'WSJ',
      url: '#',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      sentiment: 'neutral',
      relatedAssets: []
    },
    {
      id: '4',
      title: 'Apple faces antitrust lawsuit over App Store practices',
      source: 'CNBC',
      url: '#',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      sentiment: 'negative',
      relatedAssets: ['aapl']
    },
    {
      id: '5',
      title: 'Ethereum layer-2 solutions hit all-time high in TVL',
      source: 'CoinDesk',
      url: '#',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      sentiment: 'positive',
      relatedAssets: ['eth']
    }
  ]
}
