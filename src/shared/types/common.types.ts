/**
 * ============================================================================
 * FILE: common.types.ts
 * ============================================================================
 * 
 * @description Tipos comunes compartidos entre todas las features del sistema.
 *              Define tipos base para entidades, respuestas API y estados.
 * 
 * @module Shared/Types
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - None
 * 
 * @related-files
 * - @/shared/types/api.types.ts
 * - @/shared/constants/app.constants.ts
 * 
 * @exports
 * - BaseEntity
 * - ApiResponse
 * - PaginatedResponse
 * - FilterOptions
 * - SortOptions
 * 
 * ============================================================================
 */

/**
 * Entidad base con campos comunes a todas las tablas
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Respuesta estándar de API
 */
export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  message?: string;
  status: number;
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Opciones de filtro genéricas
 */
export interface FilterOptions {
  searchQuery?: string;
  categoryId?: string;
  sellerId?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Opciones de ordenamiento
 */
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Estado de carga genérico
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Opciones de paginación
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
}
