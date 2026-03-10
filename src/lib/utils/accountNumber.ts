export function generateAccountNumber(): string {
  return '40' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
}

export function generateCardNumber(): string {
  return '4' + Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0')
}

export function generateCVV(): string {
  return Math.floor(Math.random() * 900 + 100).toString()
}
