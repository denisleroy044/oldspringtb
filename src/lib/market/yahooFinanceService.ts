import yahooFinance from 'yahoo-finance2'

// Define types for Yahoo Finance responses
interface YahooQuoteResponse {
  symbol: string
  longName?: string
  shortName?: string
  regularMarketPrice?: number
  regularMarketChange?: number
  regularMarketChangePercent?: number
  regularMarketVolume?: number
  marketCap?: number
  currency?: string
  exchange?: string
}

export interface MarketAsset {
  id: string
  symbol: string
  name: string
  type: 'stock' | 'crypto' | 'etf' | 'bond' | 'commodity' | 'index'
  price: number
  change: number
  changePercent: number
  volume?: number
  marketCap?: number
  currency?: string
  exchange?: string
  timestamp?: Date
}

export interface HistoricalData {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Popular symbols for demo/fallback
export const POPULAR_SYMBOLS = {
  stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'],
  crypto: ['BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD', 'XRP-USD'],
  etfs: ['SPY', 'QQQ', 'VOO', 'BND', 'GLD'],
  commodities: ['GC=F', 'SI=F', 'CL=F', 'HG=F', 'ZW=F'],
  indices: ['^GSPC', '^IXIC', '^DJI', '^FTSE', '^N225']
}

// Cache implementation to avoid rate limits
const cache: Map<string, { data: MarketAsset; timestamp: number }> = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Get real-time quote for a symbol
export async function getQuote(symbol: string): Promise<MarketAsset | null> {
  try {
    // Check cache first
    const cached = cache.get(symbol)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    // Fetch quote from Yahoo Finance
    const quote = await yahooFinance.quote(symbol) as YahooQuoteResponse
    
    // Determine asset type based on symbol pattern or exchange
    let type: MarketAsset['type'] = 'stock'
    if (symbol.includes('-USD')) type = 'crypto'
    else if (symbol.includes('=')) type = 'commodity'
    else if (symbol.startsWith('^')) type = 'index'
    else if (['SPY', 'QQQ', 'VOO', 'BND', 'GLD'].includes(symbol)) type = 'etf'

    const asset: MarketAsset = {
      id: symbol,
      symbol: quote.symbol,
      name: quote.longName || quote.shortName || symbol,
      type,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      currency: quote.currency,
      exchange: quote.exchange,
      timestamp: new Date()
    }

    // Store in cache
    cache.set(symbol, { data: asset, timestamp: Date.now() })
    
    return asset
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error)
    return null
  }
}

// Get multiple quotes at once
export async function getQuotes(symbols: string[]): Promise<MarketAsset[]> {
  const uniqueSymbols = [...new Set(symbols)]
  const promises = uniqueSymbols.map(symbol => getQuote(symbol))
  const results = await Promise.all(promises)
  return results.filter((result): result is MarketAsset => result !== null)
}

// Get historical data for a symbol
export async function getHistoricalData(
  symbol: string,
  period: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max' = '1mo',
  interval: '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '1d' | '1wk' | '1mo' = '1d'
): Promise<HistoricalData[]> {
  try {
    const queryOptions = {
      period1: getPeriodStart(period),
      interval: interval,
      return: 'object' as const
    }

    const result = await yahooFinance.historical(symbol, queryOptions)
    
    return result.map(item => ({
      date: new Date(item.date),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    }))
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error)
    return []
  }
}

// Search for symbols
export async function searchSymbols(query: string): Promise<Array<{ symbol: string; name: string; type: string }>> {
  try {
    const results = await yahooFinance.search(query)
    return results.quotes.map(quote => ({
      symbol: quote.symbol,
      name: quote.shortname || quote.longname || quote.symbol,
      type: quote.quoteType || 'stock'
    }))
  } catch (error) {
    console.error('Error searching symbols:', error)
    return []
  }
}

// Helper function to calculate period start
function getPeriodStart(period: string): Date {
  const now = new Date()
  switch (period) {
    case '1d': return new Date(now.setDate(now.getDate() - 1))
    case '5d': return new Date(now.setDate(now.getDate() - 5))
    case '1mo': return new Date(now.setMonth(now.getMonth() - 1))
    case '3mo': return new Date(now.setMonth(now.getMonth() - 3))
    case '6mo': return new Date(now.setMonth(now.getMonth() - 6))
    case '1y': return new Date(now.setFullYear(now.getFullYear() - 1))
    case '2y': return new Date(now.setFullYear(now.getFullYear() - 2))
    case '5y': return new Date(now.setFullYear(now.getFullYear() - 5))
    default: return new Date(now.setMonth(now.getMonth() - 1))
  }
}
