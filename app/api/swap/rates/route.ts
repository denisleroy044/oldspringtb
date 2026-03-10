import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Cache rates in memory for 5 minutes
let ratesCache: any = null
let lastFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const from = searchParams.get('from') || 'USD'
    const to = searchParams.get('to')
    const amount = parseFloat(searchParams.get('amount') || '1')

    // Check if we should use cache
    const now = Date.now()
    if (ratesCache && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json(ratesCache)
    }

    // Try to get rates from database first
    let queryText = `
      SELECT from_currency, to_currency, rate, bid, ask, updated_at
      FROM exchange_rates
    `
    
    if (to) {
      queryText += ` WHERE from_currency = $1 AND to_currency = $2`
      const result = await query(queryText, [from, to])
      
      if (result.rows.length > 0) {
        const rate = result.rows[0]
        const convertedAmount = amount * parseFloat(rate.rate)
        
        return NextResponse.json({
          from,
          to,
          rate: parseFloat(rate.rate),
          bid: parseFloat(rate.bid || rate.rate),
          ask: parseFloat(rate.ask || rate.rate),
          convertedAmount,
          timestamp: rate.updated_at,
          source: rate.source || 'database'
        })
      }
    }

    // If not in database, fetch from external API
    try {
      const apiKey = process.env.EXCHANGE_RATE_API_KEY
      let apiUrl = ''
      
      if (to) {
        apiUrl = `https://api.exchangerate-api.com/v4/latest/${from}`
      } else {
        apiUrl = `https://api.exchangerate-api.com/v4/latest/${from}`
      }

      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.rates) {
        // Cache all rates
        ratesCache = {
          base: data.base,
          rates: data.rates,
          date: data.date,
          timestamp: new Date().toISOString()
        }
        lastFetch = now

        // Store in database for future use
        for (const [currency, rate] of Object.entries(data.rates)) {
          await query(
            `INSERT INTO exchange_rates (from_currency, to_currency, rate, source, updated_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (from_currency, to_currency) DO UPDATE SET
             rate = EXCLUDED.rate,
             source = EXCLUDED.source,
             updated_at = NOW()`,
            [from, currency, rate, 'api']
          ).catch(err => console.error('Failed to store rate:', err))
        }

        if (to) {
          const rate = data.rates[to]
          const convertedAmount = amount * rate
          
          return NextResponse.json({
            from,
            to,
            rate,
            convertedAmount,
            timestamp: data.date,
            source: 'api'
          })
        }

        return NextResponse.json(ratesCache)
      }
    } catch (apiError) {
      console.error('Failed to fetch from external API:', apiError)
    }

    // Fallback to default rates
    const defaultRates: Record<string, number> = {
      'USD': 1,
      'EUR': 0.92,
      'GBP': 0.79,
      'JPY': 148.50,
      'CAD': 1.35,
      'CHF': 0.88,
      'AUD': 1.52,
      'CNY': 7.19,
      'BTC': 65420,
      'ETH': 3520
    }

    if (to) {
      const rate = defaultRates[to] / defaultRates[from]
      const convertedAmount = amount * rate
      
      return NextResponse.json({
        from,
        to,
        rate,
        convertedAmount,
        timestamp: new Date().toISOString(),
        source: 'default'
      })
    }

    return NextResponse.json({
      base: from,
      rates: defaultRates,
      timestamp: new Date().toISOString(),
      source: 'default'
    })

  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 })
  }
}
