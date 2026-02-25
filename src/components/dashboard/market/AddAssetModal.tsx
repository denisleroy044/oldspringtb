'use client'

import { useState } from 'react'

interface Asset {
  id: string
  symbol: string
  name: string
  type: string
  price: number
  change: number
  changePercent: number
}

interface AddAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (asset: Asset, amount?: number, price?: number) => void
  asset: Asset | null
  mode: 'portfolio' | 'watchlist'
}

export function AddAssetModal({ isOpen, onClose, onAdd, asset, mode }: AddAssetModalProps) {
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState(asset?.price.toString() || '')
  const [alertPrice, setAlertPrice] = useState('')
  const [step, setStep] = useState(1)

  if (!isOpen || !asset) return null

  const handleSubmit = () => {
    if (mode === 'portfolio') {
      // For portfolio: need amount and price
      if (!amount || !price) return
      const numAmount = parseFloat(amount)
      const numPrice = parseFloat(price)
      if (isNaN(numAmount) || isNaN(numPrice) || numAmount <= 0 || numPrice <= 0) return
      
      onAdd(asset, numAmount, numPrice)
    } else {
      // For watchlist: just add the asset (alertPrice is handled separately)
      onAdd(asset)
    }
    
    // Reset and close
    setAmount('')
    setPrice(asset.price.toString())
    setAlertPrice('')
    setStep(1)
    onClose()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-deep-teal mb-4">
          {mode === 'portfolio' ? 'Add to Portfolio' : 'Add to Watchlist'}
        </h3>
        
        <div className="space-y-4">
          {/* Asset Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {asset.type === 'stock' && '📈'}
                {asset.type === 'crypto' && '₿'}
                {asset.type === 'etf' && '📊'}
                {asset.type === 'commodity' && '🛢️'}
              </div>
              <div>
                <p className="font-bold text-deep-teal">{asset.symbol}</p>
                <p className="text-sm text-gray-600">{asset.name}</p>
              </div>
            </div>
          </div>

          {mode === 'portfolio' ? (
            <>
              {/* Step 1: Amount */}
              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Shares/Units
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current price: {formatCurrency(asset.price)}
                  </p>
                </div>
              )}

              {/* Step 2: Purchase Price */}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price (per unit)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Current market price: {formatCurrency(asset.price)}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Watchlist: Add alert price (optional) */
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Alert (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="Enter alert price"
                  step="0.01"
                  min="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-gold focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll notify you when price reaches this level
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {mode === 'portfolio' && step === 1 ? (
              <>
                <button
                  onClick={() => onClose()}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => amount && setStep(2)}
                  disabled={!amount}
                  className="flex-1 bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </>
            ) : mode === 'portfolio' && step === 2 ? (
              <>
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!price}
                  className="flex-1 bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors disabled:opacity-50"
                >
                  Add to Portfolio
                </button>
              </>
            ) : (
              /* Watchlist buttons */
              <>
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-deep-teal text-white py-2 rounded-lg hover:bg-soft-gold transition-colors"
                >
                  Add to Watchlist
                </button>
              </>
            )}
          </div>

          {/* Total Value (for portfolio) */}
          {mode === 'portfolio' && amount && price && (
            <div className="mt-4 p-3 bg-soft-gold/10 rounded-lg">
              <p className="text-sm text-gray-600">Total Value:</p>
              <p className="text-xl font-bold text-soft-gold">
                {formatCurrency(parseFloat(amount) * parseFloat(price))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
