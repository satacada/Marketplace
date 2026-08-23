/**
 * ============================================================================
 * FILE: validation.utils.ts
 * ============================================================================
 * 
 * @description Utilidades para validación de datos.
 *              Funciones para validar emails, URLs, números, etc.
 * 
 * @module Shared/Utils
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/constants/validation.constants.ts
 * 
 * @related-files
 * - @/shared/validators/auth.validator.ts
 * - @/shared/validators/product.validator.ts
 * 
 * @exports
 * - isValidEmail
 * - isValidUrl
 * - isValidPhone
 * - isNumeric
 * - isAlphaNumeric
 * 
 * ============================================================================
 */

import { REGEX_PATTERNS } from '../constants/validation.constants';

/**
 * Valida si un string es un email válido
 */
export function isValidEmail(email: string): boolean {
  return REGEX_PATTERNS.EMAIL.test(email);
}

/**
 * Valida si un string es una URL válida
 */
export function isValidUrl(url: string): boolean {
  return REGEX_PATTERNS.URL.test(url);
}

/**
 * Valida si un string es un número de teléfono válido
 */
export function isValidPhone(phone: string): boolean {
  return REGEX_PATTERNS.PHONE.test(phone);
}

/**
 * Valida si un string es numérico
 */
export function isNumeric(str: string): boolean {
  return REGEX_PATTERNS.NUMERIC.test(str);
}

/**
 * Valida si un string es alfanumérico
 */
export function isAlphaNumeric(str: string): boolean {
  return REGEX_PATTERNS.ALPHA_NUMERIC.test(str);
}

/**
 * Valida si un string es un slug válido
 */
export function isValidSlug(slug: string): boolean {
  return REGEX_PATTERNS.SLUG.test(slug);
}

/**
 * Valida la longitud de un string
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * Valida si un número está en un rango
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}
