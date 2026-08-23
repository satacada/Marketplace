/**
 * ============================================================================
 * FILE: useAdvancedProducts.ts
 * ============================================================================
 * 
 * @description Hook personalizado para productos con filtros avanzados.
 *              Soporta paginación, ordenamiento y filtros complejos.
 * 
 * @module Features/Products/Hooks
 * 
 * @author System
 * @created 2026-07-17
 * 
 * @dependencies
 * - react (useState, useEffect, useCallback, useMemo)
 * - @/features/products/services/product.service
 * - @/features/products/types/product-filters.types
 * 
 * @related-files
 * - @/features/products/services/product.service.ts
 * - @/features/products/types/product-filters.types.ts
 * 
 * @exports
 * - useAdvancedProducts (hook)
 * 
 * @example
 * ```tsx
 * const { products, loading, total, loadMore } = useAdvancedProducts({
 *   searchQuery: 'laptop',
 *   sortBy: 'price_asc'
 * });
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../services/product.service';
import { Product } from '../types/product.types';
import { AdvancedProductFilters, SortOption } from '../types/product-filters.types';

export function useAdvancedProducts(initialFilters: Partial<AdvancedProductFilters> = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdvancedProductFilters>({
    page: 1,
    limit: 20,
    ...initialFilters
  });

  // Memoizar filters para evitar re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.searchQuery,
    filters.categoryId,
    filters.priceRange?.min,
    filters.priceRange?.max,
    filters.minRating,
    filters.hasFreeShipping,
    filters.sortBy,
    filters.page,
    filters.limit,
  ]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await productService.getAdvancedProducts(memoizedFilters);
      setProducts(result.products);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  const loadMore = useCallback(() => {
    if (products.length < total) {
      setPage(prev => prev + 1);
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  }, [products.length, total]);

  const updateFilters = useCallback((newFilters: Partial<AdvancedProductFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Reset page when filters change
      if (newFilters.searchQuery !== undefined || newFilters.categoryId !== undefined) {
        updated.page = 1;
      }
      return updated;
    });
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    updateFilters({ sortBy });
  }, [updateFilters]);

  const setSearchQuery = useCallback((searchQuery: string) => {
    updateFilters({ searchQuery });
  }, [updateFilters]);

  const setCategoryId = useCallback((categoryId: string) => {
    updateFilters({ categoryId });
  }, [updateFilters]);

  const setPriceRange = useCallback((priceRange: { min: number; max: number }) => {
    updateFilters({ priceRange });
  }, [updateFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    total,
    page,
    filters,
    loadMore,
    hasMore: products.length < total,
    updateFilters,
    setSortBy,
    setSearchQuery,
    setCategoryId,
    setPriceRange,
    refresh: fetchProducts,
  };
}
