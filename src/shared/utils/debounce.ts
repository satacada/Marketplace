/**
 * ============================================================================
 * FILE: debounce.ts
 * ============================================================================
 * 
 * @description Utilidad para debounce de funciones.
 *              Retrasa la ejecución de una función hasta que deje de ser llamada.
 * 
 * @module Shared/Utils
 * 
 * @author System
 * @created 2026-07-17
 * 
 * @dependencies
 * - none
 * 
 * @related-files
 * - none
 * 
 * @exports
 * - debounce (function)
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query) => search(query), 300);
 * debouncedSearch('laptop');
 * ```
 * 
 * ============================================================================
 */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
