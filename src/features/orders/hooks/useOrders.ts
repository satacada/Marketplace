/**
 * ============================================================================
 * FILE: useOrders.ts
 * ============================================================================
 * 
 * @description Hook personalizado para gestionar órdenes.
 *              Proporciona estado y operaciones de órdenes.
 * 
 * @module Features/Orders/Hooks
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react (useState, useEffect, useCallback)
 * - @/features/orders/services/order.service
 * - @/features/orders/types/order.types.ts
 * 
 * @related-files
 * - @/features/orders/services/order.service.ts
 * - @/features/orders/types/order.types.ts
 * 
 * @exports
 * - useOrders (hook)
 * 
 * @example
 * ```tsx
 * const { orders, loading, createOrder, cancelOrder } = useOrders('buyer', userId);
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/order.service';
import { Order, CreateOrderInput, OrderSummary } from '../types/order.types';

type OrderType = 'buyer' | 'seller';

export function useOrders(type: OrderType = 'buyer', userId: string | null = null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let data: Order[];
      if (type === 'buyer') {
        data = await orderService.getBuyerOrders(userId);
      } else {
        data = await orderService.getSellerOrders(userId);
      }

      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar órdenes');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [type, userId]);

  /**
   * Crea una nueva orden
   */
  const createOrder = useCallback(async (input: CreateOrderInput) => {
    try {
      setError(null);
      const orderSummary = await orderService.createOrder(input);
      setOrders(prev => [orderSummary.order, ...prev]);
      return { success: true, order: orderSummary };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear orden';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtiene una orden por ID
   */
  const getOrderById = useCallback(async (orderId: string) => {
    try {
      setError(null);
      const order = await orderService.getOrderById(orderId);
      return { success: true, order };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener orden';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualiza estado de una orden
   */
  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    try {
      setError(null);
      const updatedOrder = await orderService.updateOrderStatus(orderId, status, userId || undefined);
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      return { success: true, order: updatedOrder };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar estado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [userId]);

  /**
   * Cancela una orden
   */
  const cancelOrder = useCallback(async (orderId: string) => {
    if (!userId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setError(null);
      const cancelledOrder = await orderService.cancelOrder(orderId, userId);
      setOrders(prev => prev.map(o => o.id === orderId ? cancelledOrder : o));
      return { success: true, order: cancelledOrder };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cancelar orden';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [userId]);

  /**
   * Obtiene estadísticas
   */
  const getStats = useCallback(async () => {
    if (!userId) {
      return null;
    }

    try {
      setError(null);
      if (type === 'seller') {
        return await orderService.getSellerStats(userId);
      } else {
        return await orderService.getBuyerSummary(userId);
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener estadísticas');
      return null;
    }
  }, [type, userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getStats,
  };
}
