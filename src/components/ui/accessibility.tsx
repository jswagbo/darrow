'use client'

import { useEffect } from 'react'

/**
 * Skip Link Component for keyboard navigation
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-silver text-black px-4 py-2 rounded z-50 font-medium transition-all"
    >
      Skip to main content
    </a>
  )
}

/**
 * Screen Reader Only text component
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

/**
 * Focus trap for modals and dialogs
 */
export function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])
}

/**
 * Announce changes to screen readers
 */
export function LiveRegion({ 
  children, 
  politeness = 'polite' 
}: { 
  children: React.ReactNode
  politeness?: 'polite' | 'assertive' 
}) {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  )
}

/**
 * Enhanced button with better accessibility
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  loading?: boolean
  loadingText?: string
  variant?: 'default' | 'outline' | 'ghost'
}

export function AccessibleButton({ 
  children, 
  loading = false, 
  loadingText = 'Loading...',
  disabled,
  className = '',
  ...props 
}: AccessibleButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-describedby={loading ? 'loading-state' : undefined}
      className={`focus-visible:ring-2 focus-visible:ring-silver focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
    >
      {loading ? (
        <>
          <span aria-hidden="true">Loading...</span>
          <span id="loading-state" className="sr-only">
            {loadingText}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

/**
 * Enhanced input with proper labeling
 */
interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  description?: string
  required?: boolean
}

export function AccessibleInput({ 
  label, 
  error, 
  description, 
  required = false,
  id,
  className = '',
  ...props 
}: AccessibleInputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined
  const descriptionId = description ? `${inputId}-description` : undefined

  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-white"
      >
        {label}
        {required && (
          <span className="text-red-400 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-light">
          {description}
        </p>
      )}
      
      <input
        {...props}
        id={inputId}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        className={`
          w-full px-4 py-3 bg-black border border-gray-light rounded-lg text-white 
          placeholder-gray-light focus:border-silver focus:ring-2 focus:ring-silver 
          focus:ring-opacity-20 outline-none transition-colors
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
      />
      
      {error && (
        <p id={errorId} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Enhanced select with proper accessibility
 */
interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string; disabled?: boolean }[]
  error?: string
  description?: string
  placeholder?: string
}

export function AccessibleSelect({
  label,
  options,
  error,
  description,
  placeholder,
  id,
  className = '',
  ...props
}: AccessibleSelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${selectId}-error` : undefined
  const descriptionId = description ? `${selectId}-description` : undefined

  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="block text-sm font-medium text-white">
        {label}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-light">
          {description}
        </p>
      )}
      
      <select
        {...props}
        id={selectId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        className={`
          w-full px-4 py-3 bg-black border border-gray-light rounded-lg text-white 
          focus:border-silver focus:ring-2 focus:ring-silver focus:ring-opacity-20 
          outline-none transition-colors
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p id={errorId} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Progress indicator with accessibility
 */
export function AccessibleProgress({ 
  value, 
  max = 100, 
  label,
  className = ''
}: { 
  value: number
  max?: number
  label: string
  className?: string
}) {
  const percentage = (value / max) * 100

  return (
    <div className={className}>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white">{label}</span>
        <span className="text-silver">{percentage.toFixed(0)}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="w-full bg-gray-800 rounded-full h-2"
      >
        <div
          className="bg-silver h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Hook for managing focus on route changes
 */
export function useFocusOnRouteChange() {
  useEffect(() => {
    const handleRouteChange = () => {
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        mainContent.focus()
      }
    }

    // Focus main content on route change
    handleRouteChange()
  }, [])
}