/**
 * ============================================================================
 * FILE: order.repository.ts
 * ============================================================================
 * 
 * @description Repositorio para operaciones de órdenes en Supabase.
 *              Maneja CRUD de órdenes y items con relaciones.
 * 
 * @module Infrastructure/Repositories
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/repositories/base.repository
 * - @/infrastructure/database/supabase.client
 * - @/features/orders/types/order.types.ts
 * 
 * @related-files
 * - @/features/orders/services/order.service.ts
 * - @/features/orders/types/order.types.ts
 * 
 * @exports
 * - OrderRepository (class)
 * - orderRepository (instance)
 * 
 * ============================================================================
 */

import { BaseRepository } from './base.repository';
import { supabase } from '@/infrastructure/database/supabase.client';
import { Order, OrderItem, OrderFilters } from '@/features/orders/types/order.types';

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super('orders');
  }

  /**
   * Obtiene órdenes de un comprador con items
   */
  async findByBuyer(buyerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, order_items(*, products(title, image_urls))')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Obtiene órdenes que incluyen productos de un vendedor
   */
  async findBySeller(sellerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, order_items(*, products(title, image_urls))')
      .in('order_items.seller_id', [sellerId])
      .order('created_at', { ascending: false });

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Obtiene una orden con sus items
   */
  async findByIdWithItems(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, order_items(*, products(title, image_urls))')
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      this.handleError(error);
    }
    return data;
  }

  /**
   * Crea una orden con sus items (transacción)
   */
  async createOrderWithItems(
    orderData: Partial<Order>,
    items: OrderItem[]
  ): Promise<Order> {
    // Crear la orden
    const { data: order, error: orderError } = await supabase
      .from(this.tableName)
      .insert(orderData)
      .select()
      .single();

    if (orderError) this.handleError(orderError);

    // Crear los items de la orden
    const itemsWithOrderId = items.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) this.handleError(itemsError);

    return order;
  }

  /**
   * Actualiza estado de una orden
   */
  async updateStatus(orderId: string, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) this.handleError(error);
    return data;
  }

  /**
   * Obtiene items de una orden
   */
  async findOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*, products(*)')
      .eq('order_id', orderId);

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Busca órdenes con filtros
   */
  async search(filters: OrderFilters): Promise<Order[]> {
    let query = supabase
      .from(this.tableName)
      .select('*, order_items(*, products(title, image_urls))');

    if (filters.buyerId) {
      query = query.eq('buyer_id', filters.buyerId);
    }

    if (filters.sellerId) {
      query = query.in('order_items.seller_id', [filters.sellerId]);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Cuenta órdenes por comprador
   */
  async countByBuyer(buyerId: string): Promise<number> {
    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('buyer_id', buyerId);

    if (error) this.handleError(error);
    return count || 0;
  }

  /**
   * Obtiene estadísticas de ventas para un vendedor
   */
  async getSellerStats(sellerId: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalItemsSold: number;
  }> {
    const { data, error } = await supabase
      .from('order_items')
      .select('order_id, quantity, price_at_purchase')
      .eq('seller_id', sellerId);

    if (error) this.handleError(error);

    const items = data || [];
    const totalOrders = new Set(items.map(item => item.order_id)).size;
    const totalRevenue = items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
    const totalItemsSold = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      totalOrders,
      totalRevenue,
      totalItemsSold,
    };
  }
}

export const orderRepository = new OrderRepository();
