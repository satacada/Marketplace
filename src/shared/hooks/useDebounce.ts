/**
 * ============================================================================
 * FILE: useDebounce.ts
 * ============================================================================
 * 
 * @description Hook personalizado para debouncing de valores.
 *              Retarda la actualización de un valor hasta que deje de cambiar.
 * 
 * @module Shared/Hooks
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react (useState, useEffect)
 * 
 * @related-files
 * - @/shared/hooks/useLocalStorage.ts
 * 
 * @exports
 * - useDebounce (hook)
 * 
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
