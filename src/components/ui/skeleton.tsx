'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ 
  className, 
  variant = 'default',
  width,
  height,
  lines = 1,
  ...props 
}: SkeletonProps) {
  const baseClasses = "skeleton bg-gray-800 animate-pulse"
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              "h-4 rounded",
              index === lines - 1 ? "w-3/4" : "w-full"
            )}
            style={{ 
              width: index === lines - 1 ? '75%' : width,
              height: height || '1rem'
            }}
          />
        ))}
      </div>
    )
  }
  
  const variantClasses = {
    default: "rounded",
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-none"
  }
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  )
}

// Specific skeleton components for common use cases
export function DocumentCardSkeleton() {
  return (
    <div className="card-glossy p-6 rounded-lg animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="space-y-2">
            <Skeleton variant="text" width={150} height={16} />
            <Skeleton variant="text" width={100} height={12} />
          </div>
        </div>
        <Skeleton variant="text" width={60} height={12} />
      </div>
      
      <Skeleton variant="text" lines={2} className="mb-4" />
      
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={80} height={12} />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={32} height={32} className="rounded" />
          <Skeleton variant="rectangular" width={32} height={32} className="rounded" />
          <Skeleton variant="rectangular" width={32} height={32} className="rounded" />
        </div>
      </div>
    </div>
  )
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="card-glossy p-6 rounded-lg animate-fade-in">
          <Skeleton variant="text" width={100} height={12} className="mb-2" />
          <Skeleton variant="text" width={60} height={32} />
        </div>
      ))}
    </div>
  )
}

export function EditorSkeleton() {
  return (
    <div className="border border-gray-light rounded-lg bg-black animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-light">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width={32} height={32} className="rounded" />
        ))}
      </div>
      
      {/* Editor Content */}
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" lines={3} />
        <Skeleton variant="text" width="80%" height={16} />
        <Skeleton variant="text" lines={2} />
        <Skeleton variant="text" width="90%" height={16} />
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-light">
        <Skeleton variant="text" width={100} height={12} />
      </div>
    </div>
  )
}

export function DocumentListSkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="40%" height={12} />
          </div>
          <Skeleton variant="text" width={80} height={12} />
          <Skeleton variant="text" width={100} height={12} />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width={24} height={24} className="rounded" />
            <Skeleton variant="rectangular" width={24} height={24} className="rounded" />
            <Skeleton variant="rectangular" width={24} height={24} className="rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Skeleton variant="text" width={120} height={16} className="mb-2" />
        <Skeleton variant="rectangular" width="100%" height={48} className="rounded-lg" />
      </div>
      
      <div>
        <Skeleton variant="text" width={140} height={16} className="mb-2" />
        <Skeleton variant="rectangular" width="100%" height={200} className="rounded-lg" />
        <Skeleton variant="text" width={200} height={12} className="mt-2" />
      </div>
      
      <div className="flex justify-between items-center pt-6 border-t border-gray-light">
        <Skeleton variant="text" width={150} height={12} />
        <Skeleton variant="rectangular" width={140} height={40} className="rounded" />
      </div>
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between py-6 animate-fade-in">
      <div>
        <Skeleton variant="text" width={200} height={24} className="mb-2" />
        <Skeleton variant="text" width={300} height={16} />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton variant="rectangular" width={100} height={24} className="rounded" />
        <Skeleton variant="rectangular" width={140} height={40} className="rounded" />
      </div>
    </div>
  )
}