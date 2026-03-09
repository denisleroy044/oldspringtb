import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateAccountNumber = (): string => {
  const ts = Date.now().toString().slice(-6)
  const rand = Math.floor(1000 + Math.random() * 9000).toString()
  return `${ts}${rand}`
}

export const formatCurrency = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

export const maskAccount = (number: string): string =>
  `****${number.slice(-4)}`

export const generateRef = (): string =>
  `OT${Date.now()}${Math.floor(Math.random() * 1000)}`

export const formatDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(date))
