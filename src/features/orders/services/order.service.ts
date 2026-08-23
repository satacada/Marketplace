/**
 * ============================================================================
 * FILE: order.service.ts
 * ============================================================================
 * 
 * @description Servicio de órdenes que coordina operaciones de negocio.
 *              Valida reglas de negocio y coordina con repositorios.
 * 
 * @module Features/Orders/Services
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/repositories/order.repository
 * - @/infrastructure/repositories/cart.repository
 * - @/infrastructure/repositories/product.repository
 * - @/features/orders/types/order.types.ts
 * - @/shared/constants/app.constants.ts
 * 
 * @related-files
 * - @/features/orders/hooks/useOrders.ts
 * - @/features/orders/types/order.types.ts
 * 
 * @exports
 * - orderService (object)
 * 
 * ============================================================================
 */

import { orderRepository } from '@/infrastructure/repositories/order.repository';
import { cartRepository } from '@/infrastructure/repositories/cart.repository';
import { productRepository } from '@/infrastructure/repositories/product.repository';
import { Order, OrderItem, CreateOrderInput, OrderSummary } from '../types/order.types';
import { ORDER_STATUS } from '@/shared/constants/app.constants';

export const orderService = {
  /**
   * Crea una nueva orden desde el carrito
   */
  async createOrder(input: CreateOrderInput): Promise<OrderSummary> {
    // Validar items del carrito
    const cartItems = await cartRepository.findByBuyer(input.buyerId);
    
    if (cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Verificar stock y preparar items
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const cartItem of cartItems) {
      const product = await productRepository.findById(cartItem.product_id);
      
      if (!product || product.is_deleted) {
        throw new Error(`Producto ${cartItem.product_id} no disponible`);
      }

      if (product.stock < cartItem.quantity) {
        throw new Error(`Stock insuficiente para ${product.title}`);
      }

      orderItems.push({
        id: '', // Se generará en BD
        order_id: '', // Se asignará después
        product_id: cartItem.product_id,
        seller_id: product.seller_id,
        quantity: cartItem.quantity,
        price_at_purchase: product.price,
        created_at: new Date().toISOString(),
      });

      totalAmount += product.price * cartItem.quantity;
    }

    // Crear orden
    const orderData: Partial<Order> = {
      buyer_id: input.buyerId,
      total_amount: totalAmount,
      status: ORDER_STATUS.PENDING,
      shipping_address: input.shippingAddress,
      shipping_city: input.shippingCity,
      shipping_phone: input.shippingPhone,
      notes: input.notes,
    };

    const order = await orderRepository.createOrderWithItems(orderData, orderItems);

    // Actualizar stock de productos
    for (const item of orderItems) {
      const product = await productRepository.findById(item.product_id);
      if (product) {
        const newStock = product.stock - item.quantity;
        await productRepository.updateStock(item.product_id, newStock);
      }
    }

    // Vaciar carrito
    await cartRepository.clearCart(input.buyerId);

    // Obtener orden completa con items
    const completeOrder = await orderRepository.findByIdWithItems(order.id);

    return {
      order: completeOrder || order,
      items: orderItems,
      total: totalAmount,
      itemCount: orderItems.length,
    };
  },

  /**
   * Obtiene órdenes de un comprador
   */
  async getBuyerOrders(buyerId: string): Promise<Order[]> {
    return await orderRepository.findByBuyer(buyerId);
  },

  /**
   * Obtiene órdenes de un vendedor
   */
  async getSellerOrders(sellerId: string): Promise<Order[]> {
    return await orderRepository.findBySeller(sellerId);
  },

  /**
   * Obtiene una orden por ID con sus items
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    return await orderRepository.findByIdWithItems(orderId);
  },

  /**
   * Actualiza estado de una orden
   */
  async updateOrderStatus(orderId: string, status: string, userId?: string): Promise<Order> {
    const order = await orderRepository.findById(orderId);
    
    if (!order) {
      throw new Error('Orden no encontrada');
    }

    // Verificar permisos si se proporciona userId
    if (userId && order.buyer_id !== userId) {
      throw new Error('No tienes permiso para modificar esta orden');
    }

    return await orderRepository.updateStatus(orderId, status);
  },

  /**
   * Cancela una orden
   */
  async cancelOrder(orderId: string, buyerId: string): Promise<Order> {
    const order = await orderRepository.findByIdWithItems(orderId);
    
    if (!order) {
      throw new Error('Orden no encontrada');
    }

    if (order.buyer_id !== buyerId) {
      throw new Error('No tienes permiso para cancelar esta orden');
    }

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new Error('Solo se pueden cancelar órdenes pendientes');
    }

    // Restaurar stock de productos
    const items = await orderRepository.findOrderItems(orderId);
    for (const item of items) {
      const product = await productRepository.findById(item.product_id);
      if (product) {
        const newStock = product.stock + item.quantity;
        await productRepository.updateStock(item.product_id, newStock);
      }
    }

    return await orderRepository.updateStatus(orderId, ORDER_STATUS.CANCELLED);
  },

  /**
   * Obtiene estadísticas de ventas para un vendedor
   */
  async getSellerStats(sellerId: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalItemsSold: number;
  }> {
    return await orderRepository.getSellerStats(sellerId);
  },

  /**
   * Obtiene resumen de órdenes por comprador
   */
  async getBuyerSummary(buyerId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
  }> {
    const orders = await orderRepository.findByBuyer(buyerId);
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce(( sum, order) => sum + order.total_amount, 0);
    const pendingOrders = orders.filter(order => order.status === ORDER_STATUS.PENDING).length;

    return {
      totalOrders,
      totalSpent,
      pendingOrders,
    };
  },
};
