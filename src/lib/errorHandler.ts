import { logger } from './logger'

/**
 * Standardized error types for the Darrow Legal Document Generation
 */
export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_DOC_TYPE = 'INVALID_DOC_TYPE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Document generation
  GENERATION_ERROR = 'GENERATION_ERROR',
  TEMPLATE_ERROR = 'TEMPLATE_ERROR',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  
  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CREATE_ERROR = 'CREATE_ERROR',
  UPDATE_ERROR = 'UPDATE_ERROR',
  DELETE_ERROR = 'DELETE_ERROR',
  
  // File operations
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  DOWNLOAD_ERROR = 'DOWNLOAD_ERROR',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  
  // External services
  STORAGE_ERROR = 'STORAGE_ERROR',
  EMAIL_ERROR = 'EMAIL_ERROR',
  
  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

export interface AppError extends Error {
  code: ErrorCode
  statusCode: number
  context?: Record<string, any>
  userId?: string
  isOperational: boolean
}

/**
 * Custom error class for application-specific errors
 */
export class ApplicationError extends Error implements AppError {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly context?: Record<string, any>
  public readonly userId?: string
  public readonly isOperational = true

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    context?: Record<string, any>,
    userId?: string
  ) {
    super(message)
    this.name = 'ApplicationError'
    this.code = code
    this.statusCode = statusCode
    this.context = context
    this.userId = userId

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError)
    }
  }
}

/**
 * Error factory functions for common error types
 */
export const ErrorFactory = {
  unauthorized(message = 'Authentication required', context?: Record<string, any>): ApplicationError {
    return new ApplicationError(message, ErrorCode.UNAUTHORIZED, 401, context)
  },

  invalidInput(message = 'Invalid input provided', context?: Record<string, any>): ApplicationError {
    return new ApplicationError(message, ErrorCode.INVALID_INPUT, 400, context)
  },

  rateLimitExceeded(message = 'Rate limit exceeded', userId?: string): ApplicationError {
    return new ApplicationError(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429, undefined, userId)
  },

  notFound(resource = 'Resource', context?: Record<string, any>): ApplicationError {
    return new ApplicationError(`${resource} not found`, ErrorCode.NOT_FOUND, 404, context)
  },

  generationError(message = 'Document generation failed', context?: Record<string, any>): ApplicationError {
    return new ApplicationError(message, ErrorCode.GENERATION_ERROR, 500, context)
  },

  databaseError(message = 'Database operation failed', context?: Record<string, any>): ApplicationError {
    return new ApplicationError(message, ErrorCode.DATABASE_ERROR, 500, context)
  },

  storageError(message = 'File storage operation failed', context?: Record<string, any>): ApplicationError {
    return new ApplicationError(message, ErrorCode.STORAGE_ERROR, 500, context)
  },

  internalError(message = 'Internal server error', context?: Record<string, any>): ApplicationError {
    return new ApplicationError(message, ErrorCode.INTERNAL_ERROR, 500, context)
  }
}

/**
 * Error handler utility functions
 */
export class ErrorHandler {
  /**
   * Handle and log errors appropriately
   */
  static handle(error: Error | ApplicationError, userId?: string): ApplicationError {
    // If it's already an ApplicationError, just log and return
    if (error instanceof ApplicationError) {
      this.logError(error)
      return error
    }

    // Convert unknown errors to ApplicationError
    const appError = this.convertToApplicationError(error, userId)
    this.logError(appError)
    return appError
  }

  /**
   * Convert unknown errors to ApplicationError
   */
  private static convertToApplicationError(error: Error, userId?: string): ApplicationError {
    // Common error patterns
    if (error.message.includes('JWT') || error.message.includes('auth')) {
      return ErrorFactory.unauthorized('Authentication failed', { originalError: error.message })
    }

    if (error.message.includes('validation') || error.message.includes('required')) {
      return ErrorFactory.invalidInput('Validation failed', { originalError: error.message })
    }

    if (error.message.includes('not found') || error.message.includes('does not exist')) {
      return ErrorFactory.notFound('Resource', { originalError: error.message })
    }

    if (error.message.includes('rate limit') || error.message.includes('too many')) {
      return ErrorFactory.rateLimitExceeded('Rate limit exceeded', userId)
    }

    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return new ApplicationError(
        'Request timeout',
        ErrorCode.TIMEOUT_ERROR,
        408,
        { originalError: error.message },
        userId
      )
    }

    // Default to internal error
    return ErrorFactory.internalError('An unexpected error occurred', {
      originalError: error.message,
      stack: error.stack
    })
  }

  /**
   * Log errors with appropriate level
   */
  private static logError(error: ApplicationError): void {
    const context = {
      code: error.code,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      ...error.context
    }

    if (error.statusCode >= 500) {
      logger.error(error.message, error, context, error.userId)
    } else if (error.statusCode >= 400) {
      logger.warn(error.message, context, error.userId)
    } else {
      logger.info(error.message, context, error.userId)
    }
  }

  /**
   * Format error for API response
   */
  static formatForApi(error: ApplicationError): {
    success: false
    error: string
    code: string
    details?: Record<string, any>
  } {
    const response: any = {
      success: false,
      error: error.message,
      code: error.code
    }

    // Include additional details in development
    if (process.env.NODE_ENV === 'development' && error.context) {
      response.details = error.context
    }

    return response
  }

  /**
   * Check if error is operational (expected) vs programming error
   */
  static isOperational(error: Error): boolean {
    if (error instanceof ApplicationError) {
      return error.isOperational
    }
    return false
  }

  /**
   * Handle uncaught exceptions and rejections
   */
  static setupGlobalHandlers(): void {
    process.on('uncaughtException', (error) => {
      logger.critical('Uncaught Exception', error, {
        type: 'uncaught_exception'
      })
      
      // In production, you might want to restart the process
      if (process.env.NODE_ENV === 'production') {
        process.exit(1)
      }
    })

    process.on('unhandledRejection', (reason, promise) => {
      logger.critical('Unhandled Rejection', reason instanceof Error ? reason : new Error(String(reason)), {
        type: 'unhandled_rejection',
        promise: promise.toString()
      })
    })
  }
}

/**
 * Async wrapper that handles errors automatically
 */
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      const appError = ErrorHandler.handle(error as Error)
      throw appError
    }
  }
}

/**
 * Validation helper that throws standardized errors
 */
export function validate(condition: boolean, message: string, context?: Record<string, any>): void {
  if (!condition) {
    throw ErrorFactory.invalidInput(message, context)
  }
}

/**
 * Auth helper that throws standardized errors
 */
export function requireAuth(user: any, message = 'Authentication required'): void {
  if (!user) {
    throw ErrorFactory.unauthorized(message)
  }
}

/**
 * Rate limit helper
 */
export function checkRateLimit(canProceed: boolean, userId?: string): void {
  if (!canProceed) {
    throw ErrorFactory.rateLimitExceeded('Rate limit exceeded', userId)
  }
}