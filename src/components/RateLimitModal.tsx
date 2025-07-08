'use client'

import { useState } from 'react'
import { X, AlertTriangle, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RateLimitModalProps {
  isOpen: boolean
  onClose: () => void
  docsCreated: number
  docsRemaining: number
  resetTime?: Date
}

export default function RateLimitModal({
  isOpen,
  onClose,
  docsCreated,
  docsRemaining,
  resetTime
}: RateLimitModalProps) {
  if (!isOpen) return null

  const isAtLimit = docsRemaining <= 0
  const resetTimeFormatted = resetTime 
    ? new Date(resetTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'tomorrow'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-black border border-silver rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-light">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-900 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {isAtLimit ? 'Daily Limit Reached' : 'Usage Warning'}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-light hover:bg-opacity-20 transition-colors"
          >
            <X className="w-5 h-5 text-gray-light" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isAtLimit ? (
            <div className="space-y-4">
              <p className="text-gray-light">
                Document limits have been disabled. You can create unlimited documents.
              </p>
              
              <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium">Reset Time</span>
                </div>
                <p className="text-gray-light text-sm">
                  Your document creation limit will reset at <strong className="text-white">{resetTimeFormatted}</strong>.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white font-medium">What you can do:</h3>
                <ul className="text-gray-light text-sm space-y-1">
                  <li>• Edit your existing documents</li>
                  <li>• Download your previously created documents</li>
                  <li>• Wait for the limit to reset tomorrow</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-light">
                You have <strong className="text-white">{docsRemaining} document{docsRemaining !== 1 ? 's' : ''}</strong> remaining today.
              </p>
              
              <div className="bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Usage Tip</span>
                </div>
                <p className="text-gray-light text-sm">
                  Plan your document creation carefully. Each generated document counts toward your daily limit.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-light">
          <button
            onClick={onClose}
            className="w-full btn-silver-outline py-2 px-4 rounded-lg font-medium"
          >
            {isAtLimit ? 'I Understand' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Usage Indicator Component - shows remaining documents in header/sidebar
 */
interface UsageIndicatorProps {
  docsCreated: number
  docsRemaining: number
  className?: string
  compact?: boolean
}

export function UsageIndicator({ 
  docsCreated, 
  docsRemaining, 
  className,
  compact = false 
}: UsageIndicatorProps) {
  const total = 999999
  const percentage = (docsCreated / total) * 100
  
  const getStatusColor = () => {
    if (docsRemaining === 0) return 'text-red-400'
    if (docsRemaining === 1) return 'text-yellow-400'
    return 'text-green-400'
  }
  
  const getProgressColor = () => {
    if (docsRemaining === 0) return 'bg-red-500'
    if (docsRemaining === 1) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="w-8 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={cn('h-full transition-all duration-300', getProgressColor())}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={cn('text-xs font-medium', getStatusColor())}>
          {docsRemaining}/{total}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('bg-black border border-gray-light rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-light text-sm">Daily Usage</span>
        <span className={cn('text-sm font-medium', getStatusColor())}>
          {docsRemaining} remaining
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
        <div 
          className={cn('h-full transition-all duration-300', getProgressColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-light">
        <span>{docsCreated} created</span>
        <span>{total} total</span>
      </div>
      
      {docsRemaining === 0 && (
        <p className="text-xs text-red-400 mt-2">
          Limit reached. Resets tomorrow.
        </p>
      )}
    </div>
  )
}