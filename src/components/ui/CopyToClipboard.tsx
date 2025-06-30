'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyToClipboardProps {
  text: string
  children?: React.ReactNode
  className?: string
  variant?: 'button' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg'
  onCopy?: () => void
}

export function CopyToClipboard({ 
  text, 
  children, 
  className,
  variant = 'icon',
  size = 'md',
  onCopy
}: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setIsAnimating(true)
      onCopy?.()

      // Reset state after animation
      setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => setIsCopied(false), 1000)
      }, 200)
    } catch (error) {
      console.error('Failed to copy text:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setIsCopied(true)
        setIsAnimating(true)
        onCopy?.()
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
      }
      document.body.removeChild(textArea)
    }
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          'p-2 rounded transition-all duration-200 hover:bg-silver hover:bg-opacity-20',
          'focus:outline-none focus:ring-2 focus:ring-silver focus:ring-opacity-50',
          isAnimating && 'scale-110',
          className
        )}
        title={isCopied ? 'Copied!' : 'Copy to clipboard'}
        aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
      >
        {isCopied ? (
          <Check className={cn(sizeClasses[size], 'text-green-400 animate-scale-in')} />
        ) : (
          <Copy className={cn(sizeClasses[size], 'text-gray-light hover:text-silver')} />
        )}
      </button>
    )
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded transition-all duration-200',
          'bg-black border border-silver text-silver hover:bg-silver hover:text-black',
          'focus:outline-none focus:ring-2 focus:ring-silver focus:ring-opacity-50',
          isAnimating && 'scale-105',
          className
        )}
        disabled={isAnimating}
      >
        {isCopied ? (
          <>
            <Check className={cn(sizeClasses[size], 'text-green-400 animate-scale-in')} />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className={sizeClasses[size]} />
            <span>{children || 'Copy'}</span>
          </>
        )}
      </button>
    )
  }

  // Text variant with underline
  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1 text-silver hover:text-white transition-colors',
        'border-b border-dotted border-silver hover:border-white',
        'focus:outline-none focus:ring-2 focus:ring-silver focus:ring-opacity-50 rounded',
        isAnimating && 'animate-pulse',
        className
      )}
    >
      <span>{children || text}</span>
      {isCopied ? (
        <Check className={cn(sizeClasses[size], 'text-green-400 animate-scale-in')} />
      ) : (
        <Copy className={cn(sizeClasses[size], 'opacity-60')} />
      )}
    </button>
  )
}

/**
 * Code block with copy functionality
 */
interface CodeBlockWithCopyProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlockWithCopy({ code, language, className }: CodeBlockWithCopyProps) {
  return (
    <div className={cn('relative group', className)}>
      <pre className="bg-gray-900 border border-gray-light rounded-lg p-4 overflow-x-auto">
        <code className={`text-sm ${language ? `language-${language}` : ''}`}>
          {code}
        </code>
      </pre>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyToClipboard
          text={code}
          variant="icon"
          size="sm"
          className="bg-gray-800 border border-gray-600"
        />
      </div>
    </div>
  )
}

/**
 * Document ID with copy functionality
 */
export function DocumentIdCopy({ id, className }: { id: string; className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-2 text-sm', className)}>
      <span className="font-mono text-gray-light">{id.slice(0, 8)}...</span>
      <CopyToClipboard
        text={id}
        variant="icon"
        size="sm"
        className="opacity-60 hover:opacity-100"
      />
    </div>
  )
}

/**
 * Share URL with copy functionality
 */
interface ShareUrlCopyProps {
  url: string
  title?: string
  className?: string
}

export function ShareUrlCopy({ url, title = 'Share', className }: ShareUrlCopyProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        type="text"
        value={url}
        readOnly
        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-light rounded text-sm text-gray-light focus:outline-none"
      />
      <CopyToClipboard
        text={url}
        variant="button"
        size="sm"
      >
        {title}
      </CopyToClipboard>
    </div>
  )
}

/**
 * Legal text excerpt with copy functionality
 */
interface LegalTextCopyProps {
  text: string
  excerpt?: number
  title?: string
  className?: string
}

export function LegalTextCopy({ 
  text, 
  excerpt = 100, 
  title = 'Legal Text',
  className 
}: LegalTextCopyProps) {
  const displayText = text.length > excerpt ? `${text.slice(0, excerpt)}...` : text

  return (
    <div className={cn('card-glossy p-4 rounded-lg', className)}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-silver">{title}</h4>
        <CopyToClipboard
          text={text}
          variant="icon"
          size="sm"
        />
      </div>
      <p className="text-gray-light text-sm leading-relaxed font-mono">
        {displayText}
      </p>
    </div>
  )
}

/**
 * Hook for clipboard operations
 */
export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false)
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      return false
    }
  }

  return { copyToClipboard, isCopied }
}