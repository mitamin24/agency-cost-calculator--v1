// Simple error objects - no classes!
// Just plain objects with a type and message

export type AppError = {
  type: 'CONFLICT' | 'NOT_FOUND' | 'INVALID_INPUT' | 'DATABASE_ERROR'
  message: string
}

// Helper functions to create errors
export function createConflictError(message: string): AppError {
  return { type: 'CONFLICT', message }
}

export function createNotFoundError(message: string): AppError {
  return { type: 'NOT_FOUND', message }
}

export function createInvalidInputError(message: string): AppError {
  return { type: 'INVALID_INPUT', message }
}

export function createDatabaseError(message: string): AppError {
  return { type: 'DATABASE_ERROR', message }
}

// Helper to check if an error is our custom app error
export function isAppError(err: unknown): err is AppError {
  return typeof err === 'object' && err !== null && 'type' in err && 'message' in err
}
