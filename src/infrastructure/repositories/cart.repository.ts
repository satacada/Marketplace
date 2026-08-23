/**
 * ============================================================================
 * FILE: cart.repository.ts
 * ============================================================================
 * 
 * @description Repositorio para operaciones del carrito en Supabase.
 *              Maneja CRUD de items del carrito con validaciones.
 * 
 * @module Infrastructure/Repositories
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/repositories/base.repository
 * - @/infrastructure/database/supabase.client
 * - @/features/cart/types/cart.types.ts
 * 
 * @related-files
 * - @/features/cart/services/cart.service.ts
 * - @/features/cart/types/cart.types.ts
 * 
 * @exports
 * - CartRepository (class)
 * - cartRepository (instance)
 * 
 * ============================================================================
 */

import { BaseRepository } from './base.repository';
import { supabase } from '@/infrastructure/database/supabase.client';
import { CartItem } from '@/features/cart/types/cart.types';

export class CartRepository extends BaseRepository<CartItem> {
  constructor() {
    super('cart_items');
  }

  /**
   * Obtiene todos los items del carrito de un comprador
   */
  async findByBuyer(buyerId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, products(*)')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Obtiene un item específico del carrito
   */
  async findByBuyerAndProduct(buyerId: string, productId: string): Promise<CartItem | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, products(*)')
      .eq('buyer_id', buyerId)
      .eq('product_id', productId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      this.handleError(error);
    }
    return data;
  }

  /**
   * Agrega o actualiza un item en el carrito (upsert)
   */
  async upsertCartItem(buyerId: string, productId: string, quantity: number): Promise<CartItem> {
    const { data, error } = await supabase
      .from(this.tableName)
      .upsert(
        { buyer_id: buyerId, product_id: productId, quantity },
        { onConflict: 'buyer_id,product_id' }
      )
      .select('*, products(*)')
      .single();

    if (error) this.handleError(error);
    return data;
  }

  /**
   * Actualiza cantidad de un item
   */
  async updateQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ quantity })
      .eq('id', cartItemId)
      .select('*, products(*)')
      .single();

    if (error) this.handleError(error);
    return data;
  }

  /**
   * Elimina un item del carrito
   */
  async removeItem(cartItemId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', cartItemId);

    if (error) this.handleError(error);
  }

  /**
   * Vacía el carrito de un comprador
   */
  async clearCart(buyerId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('buyer_id', buyerId);

    if (error) this.handleError(error);
  }

  /**
   * Cuenta items en el carrito de un comprador
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
   * Verifica si un producto está en el carrito
   */
  async isInCart(buyerId: string, productId: string): Promise<boolean> {
    const item = await this.findByBuyerAndProduct(buyerId, productId);
    return item !== null;
  }
}

export const cartRepository = new CartRepository();
