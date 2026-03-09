export function generateTransferReference(): string {
  const prefix = 'TRF'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  const checksum = Math.floor(Math.random() * 900 + 100).toString()
  
  return `${prefix}${timestamp}${random}${checksum}`
}

export function generateReceiptNumber(): string {
  const prefix = 'RCPT'
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 9000 + 1000).toString()
  
  return `${prefix}-${year}${month}${day}-${random}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'receipt' = 'receipt'): string {
  const d = new Date(date)
  
  switch(format) {
    case 'short':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    case 'long':
      return d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    case 'receipt':
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
  }
}
