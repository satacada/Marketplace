/**
 * ============================================================================
 * FILE: api.constants.ts
 * ============================================================================
 * 
 * @description Constantes para operaciones de API y base de datos.
 *              Define nombres de tablas, timeouts y configuraciones de API.
 * 
 * @module Shared/Constants
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - None
 * 
 * @related-files
 * - @/shared/constants/app.constants.ts
 * - @/infrastructure/database/supabase.client.ts
 * 
 * @exports
 * - TABLE_NAMES
 * - API_TIMEOUTS
 * - ERROR_CODES
 * 
 * ============================================================================
 */

/**
 * Nombres de tablas en la base de datos
 */
export const TABLE_NAMES = {
  PROFILES: 'profiles',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  QUESTIONS: 'questions',
  CART_ITEMS: 'cart_items',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
} as const;

/**
 * Timeouts para operaciones de API
 */
export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 segundos
  UPLOAD: 60000, // 60 segundos
  QUERY: 10000, // 10 segundos
} as const;

/**
 * Códigos de error personalizados
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
} as const;

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción',
  FORBIDDEN: 'No tienes permisos para acceder a este recurso',
  NOT_FOUND: 'El recurso solicitado no existe',
  VALIDATION_ERROR: 'Error de validación en los datos proporcionados',
  DUPLICATE_ENTRY: 'Ya existe un registro con estos datos',
  NETWORK_ERROR: 'Error de conexión con el servidor',
  TIMEOUT: 'La operación excedió el tiempo límite',
} as const;
