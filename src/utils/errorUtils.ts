import { AxiosError } from 'axios';
import { toastService } from './toastService';

export interface ErrorContext {
  service: string;
  operation: string;
  params?: Record<string, unknown> | unknown;
}

export interface ErrorResult {
  userMessage: string;
  shouldRetry: boolean;
  retryDelay?: number;
  logMessage: string;
  statusCode?: number;
}

export class ApiError extends Error {
  public statusCode?: number;
  public shouldRetry: boolean;
  public retryDelay?: number;
  public userMessage: string;

  constructor(message: string, statusCode?: number, shouldRetry = false, retryDelay?: number, userMessage?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.shouldRetry = shouldRetry;
    this.retryDelay = retryDelay;
    this.userMessage = userMessage || message;
  }
}

// Global error handler that can be called from services
let globalErrorHandler: ((error: ApiError, context: ErrorContext) => void) | null = null;

export function setGlobalErrorHandler(handler: (error: ApiError, context: ErrorContext) => void) {
  globalErrorHandler = handler;
}

// Default error handler that shows toasts
function defaultErrorHandler(error: ApiError, context: ErrorContext) {
  // Log additional context for debugging
  console.log(`Error in ${context.service}.${context.operation}`, context.params);

  // Show toast for user-facing errors
  if (error.statusCode === 401) {
    // Special handling for auth errors - might want to redirect to login
    toastService.error("Authentication Required", error.userMessage);
  } else if (error.statusCode && error.statusCode >= 500) {
    toastService.error("Server Error", error.userMessage);
  } else if (error.statusCode === 429) {
    toastService.warning("Too Many Requests", error.userMessage);
  } else {
    toastService.error("Error", error.userMessage);
  }
}

// Set default handler
globalErrorHandler = defaultErrorHandler;

export function handleApiError(error: unknown, context: ErrorContext): ErrorResult {
  let userMessage = 'An unexpected error occurred. Please try again.';
  let shouldRetry = false;
  let retryDelay: number | undefined;
  let logMessage = '';
  let statusCode: number | undefined;

  if (error instanceof AxiosError) {
    statusCode = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
    const isNetworkError = !error.response && error.message.includes('Network Error');

    // Handle different error types
    if (isNetworkError) {
      userMessage = 'Network connection failed. Please check your internet connection and try again.';
      shouldRetry = true;
      retryDelay = 2000; // 2 seconds
      logMessage = `Network error in ${context.service}.${context.operation}: ${error.message}`;
    } else if (isTimeout) {
      userMessage = 'Request timed out. Please try again.';
      shouldRetry = true;
      retryDelay = 1000; // 1 second
      logMessage = `Timeout error in ${context.service}.${context.operation}: ${error.message}`;
    } else if (statusCode) {
      switch (statusCode) {
        case 400:
          userMessage = 'Invalid request. Please check your input and try again.';
          logMessage = `Bad request in ${context.service}.${context.operation}: ${error.response?.data?.message || error.message}`;
          break;
        case 401:
          userMessage = 'Your session has expired. Please log in again.';
          logMessage = `Unauthorized in ${context.service}.${context.operation}: ${error.response?.data?.message || error.message}`;
          break;
        case 403:
          userMessage = 'You do not have permission to perform this action.';
          logMessage = `Forbidden in ${context.service}.${context.operation}: ${error.response?.data?.message || error.message}`;
          break;
        case 404:
          userMessage = 'The requested resource was not found.';
          logMessage = `Not found in ${context.service}.${context.operation}: ${error.response?.data?.message || error.message}`;
          break;
        case 409:
          userMessage = 'This action conflicts with existing data. Please refresh and try again.';
          logMessage = `Conflict in ${context.service}.${context.operation}: ${error.response?.data?.message || error.message}`;
          break;
        case 422:
          userMessage = 'Validation failed. Please check your input.';
          logMessage = `Validation error in ${context.service}.${context.operation}: ${error.response?.data?.message || error.message}`;
          break;
        case 429:
          userMessage = 'Too many requests. Please wait a moment and try again.';
          shouldRetry = true;
          retryDelay = 5000; // 5 seconds
          logMessage = `Rate limited in ${context.service}.${context.operation}: ${error.response?.data?.message || error.message}`;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          userMessage = 'Server is temporarily unavailable. Please try again later.';
          shouldRetry = true;
          retryDelay = 3000; // 3 seconds
          logMessage = `Server error (${statusCode}) in ${context.service}.${context.operation}: ${error.response?.data?.message || error.message}`;
          break;
        default:
          userMessage = `An error occurred (${statusCode}). Please try again.`;
          logMessage = `HTTP ${statusCode} in ${context.service}.${context.operation}: ${error.response?.data?.message || error.message}`;
      }
    } else {
      // Other Axios errors
      userMessage = 'Request failed. Please try again.';
      logMessage = `Axios error in ${context.service}.${context.operation}: ${error.message}`;
    }
  } else if (error instanceof Error) {
    userMessage = 'An unexpected error occurred. Please try again.';
    logMessage = `Error in ${context.service}.${context.operation}: ${error.message}`;
  } else {
    userMessage = 'An unexpected error occurred. Please try again.';
    logMessage = `Unknown error in ${context.service}.${context.operation}: ${String(error)}`;
  }

  // Log the error
  console.error(logMessage, {
    context,
    originalError: error,
    statusCode,
    shouldRetry,
    retryDelay
  });

  // Create ApiError and call global handler if set
  const apiError = new ApiError(logMessage, statusCode, shouldRetry, retryDelay, userMessage);
  if (globalErrorHandler) {
    globalErrorHandler(apiError, context);
  }

  return {
    userMessage,
    shouldRetry,
    retryDelay,
    logMessage,
    statusCode
  };
}

// Retry utility function
export async function withRetry<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const errorResult = handleApiError(error, {
        ...context,
        operation: `${context.operation} (attempt ${attempt}/${maxRetries})`
      });

      if (!errorResult.shouldRetry || attempt === maxRetries) {
        throw new ApiError(errorResult.logMessage, errorResult.statusCode, false, undefined, errorResult.userMessage);
      }

      const delay = errorResult.retryDelay || baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying ${context.service}.${context.operation} in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Wrapper for service methods that need error handling
export async function wrapServiceCall<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  useRetry = false
): Promise<T> {
  try {
    if (useRetry) {
      return await withRetry(operation, context);
    } else {
      return await operation();
    }
  } catch (error) {
    const errorResult = handleApiError(error, context);
    throw new ApiError(errorResult.logMessage, errorResult.statusCode, errorResult.shouldRetry, errorResult.retryDelay, errorResult.userMessage);
  }
}