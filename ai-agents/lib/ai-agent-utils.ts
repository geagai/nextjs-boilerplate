// Utility functions for the AI-Agents submodule

/**
 * Debounce helper – delays invoking `fn` until after `delay` ms have elapsed
 * since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
} 