'use client'

import { useState } from 'react'
import { Asset } from '@/types/market'
import { searchAssets } from '@/lib/market/marketUtils'

interface AddAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (asset: Asset, amount?: number, price?: number) => void
  mode: 'portfolio' | 'watchlist'
}

export function AddAssetModal({ isOpen, onClose, onAdd, mode }: AddAssetModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [amount, setAmount] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [alertPrice, setAlertPrice] = useState('')
  const [step, setStep] = useState<'search' | 'details'>('search')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 1) {
      const results = searchAssets(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    setStep('details')
    if (mode === 'portfolio') {
      setPurchasePrice(asset.price.toString())
    }
  }

  const handleAdd = () => {
    if (!selectedAsset) return
    
    if (mode === 'portfolio') {
      const numAmount = parseFloat(amount)
      const numPrice = parseFloat(purchasePrice)
      if (numAmount > 0 && numPrice > 0) {
        onAdd(selectedAsset, numAmount, numPrice)
      }
    } else {
      const numAlert = alertPrice ? parseFloat(alertPrice) : undefined
      onAdd(selectedAsset, undefined, undefined, numAlert)
    }
    
    // Reset and close
    setSelectedAsset(null)
    setAmount('')
    setPurchasePrice('')
    setAlertPrice('')
    setSearchQuery('')
    setSearchResults([])
    setStep('search')
    onClose()
  }

  const handleClose = () => {
    setSelectedAsset(null)
    setAmount('')
    setPurchasePrice('')
    setAlertPrice('')
    setSearchQuery('')
    setSearchResults([])
    setStep('search')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === 'portfolio' ? 'Add to Portfolio' : 'Add to Watchlist'}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {step === 'search' ? (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search by name or symbol..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                  autoFocus
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Search Results */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleSelectAsset(asset)}
                    className="w-full p-3 hover:bg-gray-50 rounded-lg transition flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: asset.color }}
                      >
                        {asset.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        <p className="text-xs text-gray-500">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${asset.price.toLocaleString()}</p>
                      <p className={`text-xs ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}

                {searchQuery.length > 1 && searchResults.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No assets found</p>
                    <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Details step
            selectedAsset && (
              <div className="space-y-4">
                {/* Selected Asset */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: selectedAsset.color }}
                  >
                    {selectedAsset.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedAsset.name}</p>
                    <p className="text-sm text-gray-500">{selectedAsset.symbol}</p>
                  </div>
                </div>

                {mode === 'portfolio' ? (
                  // Portfolio form
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="any"
                        min="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedAsset.type === 'crypto' ? 'Enter number of coins' : 'Enter number of shares'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Price (per unit)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(e.target.value)}
                          placeholder="0.00"
                          step="any"
                          min="0"
                          className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  // Watchlist form
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Alert (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={alertPrice}
                        onChange={(e) => setAlertPrice(e.target.value)}
                        placeholder="Enter alert price"
                        step="any"
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] transition"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      We'll notify you when the price reaches this level
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setStep('search')}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={mode === 'portfolio' ? (!amount || !purchasePrice) : false}
                    className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2b4c7a] transition disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
