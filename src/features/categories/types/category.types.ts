/**
 * ============================================================================
 * FILE: category.types.ts
 * ============================================================================
 * 
 * @description Tipos específicos para el módulo de categorías.
 *              Define interfaces para categorías y operaciones jerárquicas.
 * 
 * @module Features/Categories/Types
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/types/common.types.ts
 * 
 * @related-files
 * - @/features/categories/services/category.service.ts
 * - @/features/categories/hooks/useCategories.ts
 * - @/infrastructure/repositories/category.repository.ts
 * 
 * @exports
 * - Category
 * - CategoryTree
 * - CreateCategoryInput
 * - UpdateCategoryInput
 * 
 * ============================================================================
 */

import { BaseEntity } from '@/shared/types/common.types';

/**
 * Categoría de producto
 * Nota: Algunos campos están comentados hasta que se agreguen a la DB
 */
export interface Category extends BaseEntity {
  id: string;
  name: string;
  // description?: string; // No existe en DB actual
  parent_id?: string;
  level: number;
  // is_active: boolean; // No existe en DB actual
  // sort_order?: number; // No existe en DB actual
  created_at: string;

  // Relaciones
  parent?: Category | null;
  children?: Category[];
  product_count?: number;
}

/**
 * Árbol de categorías jerárquico
 */
export interface CategoryTree extends Category {
  children: CategoryTree[];
}

/**
 * Input para crear categoría
 */
export interface CreateCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
  level: number;
  sortOrder?: number;
}

/**
 * Input para actualizar categoría
 */
export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Filtros para categorías
 */
export interface CategoryFilters {
  level?: number;
  parentId?: string;
  isActive?: boolean;
  searchQuery?: string;
}
