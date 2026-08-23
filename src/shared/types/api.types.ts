/**
 * ============================================================================
 * FILE: api.types.ts
 * ============================================================================
 * 
 * @description Tipos específicos para operaciones de API y comunicación
 *              con servicios externos (Supabase, Storage, etc.)
 * 
 * @module Shared/Types
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/types/common.types.ts
 * 
 * @related-files
 * - @/infrastructure/database/supabase.client.ts
 * - @/infrastructure/storage/image.storage.ts
 * 
 * @exports
 * - SupabaseError
 * - StorageUploadResult
 * - QueryOptions
 * 
 * ============================================================================
 */

import { BaseEntity } from './common.types';

/**
 * Error estándar de Supabase
 */
export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

/**
 * Resultado de subida de archivo a Storage
 */
export interface StorageUploadResult {
  path: string;
  fullPath: string;
  error?: SupabaseError;
}

/**
 * Opciones de consulta a base de datos
 */
export interface QueryOptions {
  select?: string;
  filters?: Record<string, any>;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
}

/**
 * Metadatos de archivo
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

/**
 * Resultado de operación de base de datos
 */
export interface DbResult<T> {
  data: T | null;
  error: SupabaseError | null;
}
