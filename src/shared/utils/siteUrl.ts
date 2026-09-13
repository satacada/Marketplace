/**
 * ============================================================================
 * FILE: siteUrl.ts
 * ============================================================================
 * 
 * @description Utilidad centralizada para resolver dinámicamente la URL base
 *              del sitio (Vercel Producción, Vercel Preview o Localhost).
 * 
 * @module Shared/Utils
 * ============================================================================
 */

export function getSiteUrl(): string {
  // 1. Si se ejecuta en el navegador del cliente, usar siempre la URL real de la barra del navegador
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  // 2. Si está configurada la variable explícita en Vercel / Producción
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  // 3. Si se ejecuta en Vercel Serverless
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }

  // 4. Fallback para desarrollo local
  return 'http://localhost:3000';
}
