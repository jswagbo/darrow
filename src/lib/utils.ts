import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const DOCUMENT_TYPES = {
  delaware_charter: 'Delaware Charter',
  safe_post: 'YC SAFE (Post-Money)',
  offer_letter: 'Offer Letter',
  rspa: 'Restricted Stock Purchase Agreement',
  board_consent: 'Board & Stockholder Consent'
} as const

export type DocumentType = keyof typeof DOCUMENT_TYPES

export function getDocumentTypeName(type: DocumentType): string {
  return DOCUMENT_TYPES[type]
}