/**
 * ============================================================================
 * FILE: useMediaQuery.ts
 * ============================================================================
 * 
 * @description Hook personalizado para detectar media queries CSS.
 *              Responde a cambios en el tamaño de pantalla.
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
 * - useMediaQuery (hook)
 * 
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
