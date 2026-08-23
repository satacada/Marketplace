/**
 * ============================================================================
 * FILE: cart.types.ts
 * ============================================================================
 * 
 * @description Tipos específicos para el módulo de carrito.
 *              Define interfaces para items del carrito y operaciones.
 * 
 * @module Features/Cart/Types
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/types/common.types.ts
 * 
 * @related-files
 * - @/features/cart/services/cart.service.ts
 * - @/features/cart/hooks/useCart.ts
 * - @/infrastructure/repositories/cart.repository.ts
 * 
 * @exports
 * - CartItem
 * - Cart
 * - AddToCartInput
 * - UpdateCartItemInput
 * 
 * ============================================================================
 */

import { BaseEntity } from '@/shared/types/common.types';

/**
 * Item en el carrito
 */
export interface CartItem extends BaseEntity {
  id: string;
  buyer_id: string;
  product_id: string;
  quantity: number;
  
  // Relaciones
  products?: {
    id: string;
    title: string;
    price: number;
    stock: number;
    image_urls: string[] | null;
    is_deleted: boolean;
  } | null;
}

/**
 * Carrito completo con items
 */
export interface Cart {
  items: CartItem[];
  total: number;
  totalItems: number;
}

/**
 * Input para agregar al carrito
 */
export interface AddToCartInput {
  productId: string;
  quantity: number;
}

/**
 * Input para actualizar cantidad en carrito
 */
export interface UpdateCartItemInput {
  cartItemId: string;
  quantity: number;
}

/**
 * Resumen del carrito para checkout
 */
export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
}
