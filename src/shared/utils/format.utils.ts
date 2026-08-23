/**
 * ============================================================================
 * FILE: format.utils.ts
 * ============================================================================
 * 
 * @description Utilidades para formateo de datos.
 *              Funciones para formatear moneda, fechas, números, etc.
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
 * - @/shared/utils/date.utils.ts
 * - @/shared/utils/string.utils.ts
 * 
 * @exports
 * - formatCurrency
 * - formatNumber
 * - formatPercent
 * - formatFileSize
 * 
 * ============================================================================
 */

/**
 * Formatea un valor como moneda
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'es-ES'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(num: number, locale: string = 'es-ES'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Formatea un valor como porcentaje
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formatea tamaño de archivo en bytes a formato legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formatea un número con decimales específicos
 */
export function formatDecimal(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}
