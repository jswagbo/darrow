/**
 * Centralized logging system for Darrow Legal Document Generation
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
  error?: Error
}

class Logger {
  private logLevel: LogLevel

  constructor() {
    // Set log level based on environment
    this.logLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
  }

  private formatMessage(entry: LogEntry): string {
    const level = LogLevel[entry.level]
    const timestamp = entry.timestamp
    const userId = entry.userId ? ` [User: ${entry.userId}]` : ''
    const sessionId = entry.sessionId ? ` [Session: ${entry.sessionId}]` : ''
    
    return `[${timestamp}] ${level}${userId}${sessionId}: ${entry.message}`
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    const formattedMessage = this.formatMessage(entry)
    
    // Console output with appropriate method
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.context)
        break
      case LogLevel.INFO:
        console.info(formattedMessage, entry.context)
        break
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.context)
        break
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(formattedMessage, entry.context, entry.error)
        break
    }

    // In production, you might want to send logs to a service like:
    // - Sentry for error tracking
    // - LogRocket for session replay
    // - CloudWatch for AWS deployments
    // - Custom logging service
    
    if (process.env.NODE_ENV === 'production' && entry.level >= LogLevel.ERROR) {
      this.sendToErrorService(entry)
    }
  }

  private async sendToErrorService(entry: LogEntry): Promise<void> {
    // Placeholder for error service integration
    // Example: Sentry, Bugsnag, etc.
    try {
      // await errorService.capture(entry)
    } catch (error) {
      console.error('Failed to send log to error service:', error)
    }
  }

  debug(message: string, context?: Record<string, any>, userId?: string): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId
    })
  }

  info(message: string, context?: Record<string, any>, userId?: string): void {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId
    })
  }

  warn(message: string, context?: Record<string, any>, userId?: string): void {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId
    })
  }

  error(message: string, error?: Error, context?: Record<string, any>, userId?: string): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId,
      error
    })
  }

  critical(message: string, error?: Error, context?: Record<string, any>, userId?: string): void {
    this.log({
      level: LogLevel.CRITICAL,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId,
      error
    })
  }

  // Specialized logging methods for common scenarios
  
  apiRequest(method: string, path: string, userId?: string, context?: Record<string, any>): void {
    this.info(`API ${method} ${path}`, {
      type: 'api_request',
      method,
      path,
      ...context
    }, userId)
  }

  apiResponse(method: string, path: string, status: number, duration: number, userId?: string): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO
    this.log({
      level,
      message: `API ${method} ${path} - ${status} (${duration}ms)`,
      timestamp: new Date().toISOString(),
      context: {
        type: 'api_response',
        method,
        path,
        status,
        duration
      },
      userId
    })
  }

  documentGeneration(
    docType: string, 
    status: 'started' | 'completed' | 'failed', 
    userId?: string,
    context?: Record<string, any>
  ): void {
    const level = status === 'failed' ? LogLevel.ERROR : LogLevel.INFO
    this.log({
      level,
      message: `Document generation ${status}: ${docType}`,
      timestamp: new Date().toISOString(),
      context: {
        type: 'document_generation',
        docType,
        status,
        ...context
      },
      userId
    })
  }

  rateLimitHit(userId: string, context?: Record<string, any>): void {
    this.warn('Rate limit exceeded', {
      type: 'rate_limit',
      ...context
    }, userId)
  }

  authEvent(event: 'login' | 'logout' | 'failed_login', userId?: string, context?: Record<string, any>): void {
    const level = event === 'failed_login' ? LogLevel.WARN : LogLevel.INFO
    this.log({
      level,
      message: `Auth event: ${event}`,
      timestamp: new Date().toISOString(),
      context: {
        type: 'auth_event',
        event,
        ...context
      },
      userId
    })
  }

  performance(operation: string, duration: number, context?: Record<string, any>): void {
    const level = duration > 5000 ? LogLevel.WARN : LogLevel.DEBUG
    this.log({
      level,
      message: `Performance: ${operation} took ${duration}ms`,
      timestamp: new Date().toISOString(),
      context: {
        type: 'performance',
        operation,
        duration,
        ...context
      }
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Helper function to measure performance
export function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  const startTime = Date.now()
  
  return fn().then(
    (result) => {
      const duration = Date.now() - startTime
      logger.performance(operation, duration, context)
      return result
    },
    (error) => {
      const duration = Date.now() - startTime
      logger.performance(operation, duration, { ...context, error: true })
      throw error
    }
  )
}

// Error boundary helper
export function logErrorBoundary(error: Error, errorInfo: any): void {
  logger.critical('React Error Boundary triggered', error, {
    type: 'error_boundary',
    errorInfo,
    componentStack: errorInfo?.componentStack
  })
}