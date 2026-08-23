/**
 * ============================================================================
 * FILE: app.constants.ts
 * ============================================================================
 * 
 * @description Constantes globales de la aplicación.
 *              Define valores configurables usados en todo el sistema.
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
 * - @/shared/constants/api.constants.ts
 * - @/shared/constants/validation.constants.ts
 * 
 * @exports
 * - APP_CONFIG
 * - USER_ROLES
 * - PRODUCT_STATUS
 * - ORDER_STATUS
 * 
 * ============================================================================
 */

/**
 * Configuración general de la aplicación
 */
export const APP_CONFIG = {
  APP_NAME: 'Marketplace SaaS',
  APP_VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'es',
  TIMEZONE: 'UTC-3',
} as const;

/**
 * Roles de usuario en el sistema
 */
export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Estados de un producto
 */
export const PRODUCT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

/**
 * Estados de una orden
 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

/**
 * Configuración de imágenes
 */
export const IMAGE_CONFIG = {
  MAX_IMAGES_PER_PRODUCT: 3,
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  THUMBNAIL_WIDTH: 300,
  THUMBNAIL_HEIGHT: 300,
} as const;

/**
 * Configuración de paginación
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;
