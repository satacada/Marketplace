/**
 * ============================================================================
 * FILE: supabase.config.ts
 * ============================================================================
 * 
 * @description Configuración y constantes específicas de Supabase.
 *              Define buckets, políticas y configuraciones de storage.
 * 
 * @module Infrastructure/Database
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - None
 * 
 * @related-files
 * - @/infrastructure/database/supabase.client.ts
 * - @/infrastructure/storage/image.storage.ts
 * 
 * @exports
 * - SUPABASE_CONFIG
 * 
 * ============================================================================
 */

/**
 * Configuración de Supabase
 */
export const SUPABASE_CONFIG = {
  STORAGE: {
    PRODUCT_IMAGES_BUCKET: 'product-images',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
  TABLES: {
    PROFILES: 'profiles',
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    QUESTIONS: 'questions',
    CART_ITEMS: 'cart_items',
    ORDERS: 'orders',
    ORDER_ITEMS: 'order_items',
  },
} as const;
