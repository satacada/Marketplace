/**
 * ============================================================================
 * FILE: product-filters.types.ts
 * ============================================================================
 * 
 * @description Tipos para filtros avanzados de productos.
 * 
 * @module Features/Products/Types
 * 
 * @author System
 * @created 2026-07-17
 * 
 * @dependencies
 * - none
 * 
 * @related-files
 * - @/features/products/types/product.types.ts
 * 
 * @exports
 * - AdvancedProductFilters
 * - PriceRange
 * - SortOption
 * 
 * ============================================================================
 */

export interface PriceRange {
  min: number;
  max: number;
}

export type SortOption = 
  | 'relevance' 
  | 'price_asc' 
  | 'price_desc' 
  | 'rating_desc' 
  | 'newest';

export interface AdvancedProductFilters {
  searchQuery?: string;
  categoryId?: string;
  sellerId?: string;
  priceRange?: PriceRange;
  minRating?: number;
  hasFreeShipping?: boolean;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}
