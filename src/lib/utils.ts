import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `WF${year}${month}${day}-${random}`
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PICKED_UP: 'bg-blue-100 text-blue-800',
    WASHING: 'bg-cyan-100 text-cyan-800',
    IRONING: 'bg-purple-100 text-purple-800',
    READY: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Menunggu',
    PICKED_UP: 'Dijemput',
    WASHING: 'Dicuci',
    IRONING: 'Disetrika',
    READY: 'Siap Diambil',
    COMPLETED: 'Selesai',
  }
  return labels[status] || status
}
