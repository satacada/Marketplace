/**
 * ============================================================================
 * FILE: order.types.ts
 * ============================================================================
 * 
 * @description Tipos específicos para el módulo de órdenes.
 *              Define interfaces para órdenes, items y estados.
 * 
 * @module Features/Orders/Types
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/types/common.types.ts
 * - @/shared/constants/app.constants.ts
 * 
 * @related-files
 * - @/features/orders/services/order.service.ts
 * - @/features/orders/hooks/useOrders.ts
 * - @/infrastructure/repositories/order.repository.ts
 * 
 * @exports
 * - Order
 * - OrderItem
 * - OrderFilters
 * - CreateOrderInput
 * 
 * ============================================================================
 */

import { BaseEntity } from '@/shared/types/common.types';
import { OrderStatus } from '@/shared/constants/app.constants';

/**
 * Orden de compra
 */
export interface Order extends BaseEntity {
  id: string;
  buyer_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address?: string;
  shipping_city?: string;
  shipping_phone?: string;
  notes?: string;
}

/**
 * Item dentro de una orden
 */
export interface OrderItem extends BaseEntity {
  id: string;
  order_id: string;
  product_id: string;
  seller_id: string;
  quantity: number;
  price_at_purchase: number;
  
  // Relaciones
  products?: {
    title: string;
    image_urls: string[] | null;
  } | null;
}

/**
 * Filtros para búsqueda de órdenes
 */
export interface OrderFilters {
  buyerId?: string;
  sellerId?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

/**
 * Input para crear orden
 */
export interface CreateOrderInput {
  buyerId: string;
  cartItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPhone?: string;
  notes?: string;
}

/**
 * Resumen de orden
 */
export interface OrderSummary {
  order: Order;
  items: OrderItem[];
  total: number;
  itemCount: number;
}
