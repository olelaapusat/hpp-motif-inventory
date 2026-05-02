import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatTanggal(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd MMM yyyy', { locale: id })
  } catch {
    return dateString
  }
}

export function generateKode(prefix: string = 'MT'): string {
  const timestamp = Date.now().toString().slice(-4)
  return `${prefix}${timestamp}`
}
