/**
 * ============================================================================
 * FILE: supabase.ts (LEGACY - Use infrastructure version instead)
 * ============================================================================
 * 
 * @description Archivo de compatibilidad para imports existentes.
 *              Re-exporta el cliente de Supabase desde la nueva ubicación.
 * 
 * @module Lib (Legacy)
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/database/supabase.client
 * 
 * @related-files
 * - @/infrastructure/database/supabase.client.ts
 * 
 * @exports
 * - supabase (re-exported)
 * 
 * @deprecated Use @/infrastructure/database/supabase.client instead
 * ============================================================================
 */

// Re-exportar desde la nueva ubicación para mantener compatibilidad
export { supabase } from '@/infrastructure/database/supabase.client';