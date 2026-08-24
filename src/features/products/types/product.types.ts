/**
 * ============================================================================
 * FILE: product.types.ts
 * ============================================================================
 * 
 * @description Tipos específicos para el módulo de productos.
 *              Define interfaces para productos, categorías y filtros.
 * 
 * @module Features/Products/Types
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/types/common.types.ts
 * - @/shared/constants/app.constants.ts
 * 
 * @related-files
 * - @/features/products/services/product.service.ts
 * - @/features/products/hooks/useProducts.ts
 * - @/infrastructure/repositories/product.repository.ts
 * 
 * @exports
 * - Product
 * - Category
 * - ProductFilters
 * - CreateProductInput
 * - UpdateProductInput
 * 
 * ============================================================================
 */

import { BaseEntity } from '@/shared/types/common.types';
import { ProductStatus } from '@/shared/constants/app.constants';

/**
 * Producto en el marketplace
 */
export interface Product extends BaseEntity {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  image_urls: string[] | null;
  category_id: string | null;
  status: ProductStatus;
  is_deleted: boolean;
  
  // Relaciones (joins)
  categories?: Category | null;
  profiles?: {
    store_name: string | null;
  } | null;
}

/**
 * Categoría de producto
 */
export interface Category extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  level: number;
  is_active: boolean;
}

/**
 * Filtros para búsqueda de productos
 */
export interface ProductFilters {
  searchQuery?: string;
  categoryId?: string;
  sellerId?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  includeFavoriteCount?: boolean;
}

/**
 * Input para crear producto
 */
export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId?: string;
  images?: File[];
}

/**
 * Input para actualizar producto
 */
export interface UpdateProductInput {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  images?: File[];
  status?: ProductStatus;
}

/**
 * Input para actualización de stock
 */
export interface UpdateStockInput {
  productId: string;
  quantity: number;
}
