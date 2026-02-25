export interface Asset {
  id: string
  symbol: string
  name: string
  type: 'crypto' | 'stock' | 'etf'
  price: number
  change: number
  changePercent: number
  marketCap?: number
  volume?: number
  high24h?: number
  low24h?: number
  icon: string
  color: string
  chart?: number[]
}

export interface PortfolioHolding {
  assetId: string
  symbol: string
  name: string
  amount: number
  averagePrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercent: number
  type: 'crypto' | 'stock' | 'etf'
  icon: string
  color: string
}

export interface WatchlistItem {
  assetId: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  alertPrice?: number
  type: 'crypto' | 'stock' | 'etf'
  icon: string
  color: string
}

export interface MarketNews {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  sentiment: 'positive' | 'negative' | 'neutral'
  relatedAssets: string[]
}
