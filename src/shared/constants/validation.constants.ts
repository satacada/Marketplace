/**
 * ============================================================================
 * FILE: validation.constants.ts
 * ============================================================================
 * 
 * @description Constantes para validación de datos.
 *              Define longitudes mínimas/máximas y patrones de validación.
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
 * - @/shared/validators/auth.validator.ts
 * - @/shared/validators/product.validator.ts
 * 
 * @exports
 * - VALIDATION_RULES
 * - REGEX_PATTERNS
 * 
 * ============================================================================
 */

/**
 * Reglas de validación por campo
 */
export const VALIDATION_RULES = {
  // Auth
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  
  // Product
  PRODUCT_TITLE_MIN_LENGTH: 3,
  PRODUCT_TITLE_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MIN_LENGTH: 10,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 2000,
  PRODUCT_NAME_MIN_LENGTH: 2,
  PRODUCT_NAME_MAX_LENGTH: 50,
  
  // Profile
  STORE_NAME_MIN_LENGTH: 2,
  STORE_NAME_MAX_LENGTH: 50,
  
  // General
  MAX_TEXT_LENGTH: 500,
} as const;

/**
 * Patrones de expresiones regulares
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^\+?[\d\s-]{10,}$/,
  NUMERIC: /^\d+$/,
  ALPHA_NUMERIC: /^[a-zA-Z0-9\s]+$/,
  SLUG: /^[a-z0-9-]+$/,
} as const;
