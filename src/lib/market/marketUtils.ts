export interface MarketAsset {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume?: number
  marketCap?: number
  pe?: number
  dividend?: number
  yield?: number
  week52High?: number
  week52Low?: number
}

export interface MarketIndex {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
}

export interface MarketNews {
  id: string
  title: string
  summary: string
  source: string
  url: string
  imageUrl?: string
  publishedAt: string
  relatedSymbols?: string[]
}

export interface HistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface MarketSector {
  name: string
  change: number
  changePercent: number
  topStocks: string[]
}

// Mock data for development
const mockStocks: MarketAsset[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.34,
    changePercent: 1.35,
    volume: 52400000,
    marketCap: 2750000000000,
    pe: 28.5,
    dividend: 0.92,
    yield: 0.52,
    week52High: 182.34,
    week52Low: 143.90
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.89,
    change: -1.23,
    changePercent: -0.85,
    volume: 23100000,
    marketCap: 1850000000000,
    pe: 25.3,
    dividend: 0,
    yield: 0,
    week52High: 148.56,
    week52Low: 115.23
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.45,
    change: 3.67,
    changePercent: 0.98,
    volume: 19200000,
    marketCap: 2850000000000,
    pe: 32.1,
    dividend: 2.48,
    yield: 0.65,
    week52High: 384.30,
    week52Low: 275.50
  }
]

const mockIndices: MarketIndex[] = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    value: 4785.32,
    change: 23.45,
    changePercent: 0.49
  },
  {
    symbol: '^DJI',
    name: 'Dow Jones',
    value: 37856.91,
    change: 124.78,
    changePercent: 0.33
  },
  {
    symbol: '^IXIC',
    name: 'NASDAQ',
    value: 15897.45,
    change: -45.23,
    changePercent: -0.28
  }
]

const mockNews: MarketNews[] = [
  {
    id: '1',
    title: 'Fed Signals Rate Cuts Ahead',
    summary: 'Federal Reserve indicates potential rate cuts later this year, boosting market optimism.',
    source: 'Financial Times',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
    publishedAt: new Date().toISOString(),
    relatedSymbols: ['SPY', 'QQQ']
  },
  {
    id: '2',
    title: 'Tech Stocks Rally on AI Optimism',
    summary: 'Technology sector leads gains as AI developments drive investor interest.',
    source: 'Wall Street Journal',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    relatedSymbols: ['AAPL', 'MSFT', 'GOOGL']
  },
  {
    id: '3',
    title: 'Oil Prices Surge on Supply Concerns',
    summary: 'Crude oil prices jump as geopolitical tensions raise supply disruption fears.',
    source: 'Bloomberg',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    relatedSymbols: ['XOM', 'CVX']
  }
]

export const getMarketData = (symbol: string): MarketAsset | undefined => {
  return mockStocks.find(s => s.symbol === symbol)
}

export const getMarketIndices = (): MarketIndex[] => {
  return mockIndices
}

export const getMarketNews = (): MarketNews[] => {
  return mockNews
}

export const getTopGainers = (): MarketAsset[] => {
  return [...mockStocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5)
}

export const getTopLosers = (): MarketAsset[] => {
  return [...mockStocks]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5)
}

export const getMostActive = (): MarketAsset[] => {
  return [...mockStocks]
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, 5)
}

export const searchStocks = (query: string): MarketAsset[] => {
  return mockStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  )
}

export const getHistoricalData = (symbol: string, days: number = 30): HistoricalData[] => {
  // Generate mock historical data
  const data: HistoricalData[] = []
  const basePrice = mockStocks.find(s => s.symbol === symbol)?.price || 100
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const change = (Math.random() - 0.5) * 5
    const close = basePrice * (1 + (Math.random() - 0.5) * 0.1)
    const open = close * (1 + (Math.random() - 0.5) * 0.02)
    const high = Math.max(open, close) * (1 + Math.random() * 0.02)
    const low = Math.min(open, close) * (1 - Math.random() * 0.02)
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 10000000) + 1000000
    })
  }
  
  return data
}

export const getSectorPerformance = (): MarketSector[] => {
  return [
    {
      name: 'Technology',
      change: 1.2,
      changePercent: 0.8,
      topStocks: ['AAPL', 'MSFT', 'GOOGL']
    },
    {
      name: 'Healthcare',
      change: 0.5,
      changePercent: 0.3,
      topStocks: ['JNJ', 'PFE', 'UNH']
    },
    {
      name: 'Financials',
      change: -0.3,
      changePercent: -0.2,
      topStocks: ['JPM', 'BAC', 'WFC']
    },
    {
      name: 'Energy',
      change: 1.8,
      changePercent: 1.2,
      topStocks: ['XOM', 'CVX', 'COP']
    }
  ]
}

export const formatMarketCap = (cap: number): string => {
  if (cap >= 1e12) return `${(cap / 1e12).toFixed(2)}T`
  if (cap >= 1e9) return `${(cap / 1e9).toFixed(2)}B`
  if (cap >= 1e6) return `${(cap / 1e6).toFixed(2)}M`
  return cap.toString()
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

export const formatChange = (change: number): string => {
  return (change > 0 ? '+' : '') + formatPrice(change)
}

export const formatChangePercent = (changePercent: number): string => {
  return (changePercent > 0 ? '+' : '') + changePercent.toFixed(2) + '%'
}
