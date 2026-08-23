/**
 * ============================================================================
 * FILE: string.utils.ts
 * ============================================================================
 * 
 * @description Utilidades para manipulación de strings.
 *              Funciones para capitalizar, slugify, truncar, etc.
 * 
 * @module Shared/Utils
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - None
 * 
 * @related-files
 * - @/shared/utils/format.utils.ts
 * 
 * @exports
 * - capitalize
 * - capitalizeWords
 * - slugify
 * - truncate
 * - removeAccents
 * 
 * ============================================================================
 */

/**
 * Capitaliza la primera letra de un string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalizeWords(str: string): string {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Convierte un string a slug (URL-friendly)
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Trunca un string a una longitud máxima
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Remueve acentos de un string
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Convierte un string a kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convierte un string a camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, c => c.toLowerCase());
}

/**
 * Convierte un string a PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, c => c.toUpperCase());
}

/**
 * Genera un string aleatorio
 */
export function randomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Normaliza un string (remueve espacios extra, acentos, etc.)
 */
export function normalizeString(str: string): string {
  return removeAccents(str).trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Verifica si un string contiene otro string (case-insensitive)
 */
export function includesCaseInsensitive(str: string, search: string): boolean {
  return normalizeString(str).includes(normalizeString(search));
}
