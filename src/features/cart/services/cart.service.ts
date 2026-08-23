/**
 * ============================================================================
 * FILE: cart.service.ts
 * ============================================================================
 * 
 * @description Servicio del carrito que coordina operaciones de negocio.
 *              Valida reglas de negocio y coordina con repositorios.
 * 
 * @module Features/Cart/Services
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/repositories/cart.repository
 * - @/infrastructure/repositories/product.repository
 * - @/features/cart/types/cart.types.ts
 * 
 * @related-files
 * - @/features/cart/hooks/useCart.ts
 * - @/features/cart/types/cart.types.ts
 * 
 * @exports
 * - cartService (object)
 * 
 * ============================================================================
 */

import { cartRepository } from '@/infrastructure/repositories/cart.repository';
import { productRepository } from '@/infrastructure/repositories/product.repository';
import { CartItem, AddToCartInput, UpdateCartItemInput, CartSummary } from '../types/cart.types';

export const cartService = {
  /**
   * Agrega un producto al carrito
   */
  async addToCart(input: AddToCartInput, buyerId: string): Promise<CartItem> {
    // Verificar que el producto existe y tiene stock
    const product = await productRepository.findById(input.productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.stock <= 0) {
      throw new Error('Producto sin stock disponible');
    }

    if (product.is_deleted) {
      throw new Error('Producto no disponible');
    }

    // Verificar si ya está en el carrito
    const existingItem = await cartRepository.findByBuyerAndProduct(buyerId, input.productId);
    
    if (existingItem) {
      // Actualizar cantidad
      const newQuantity = existingItem.quantity + input.quantity;
      if (newQuantity > product.stock) {
        throw new Error('Cantidad excede el stock disponible');
      }
      return await cartRepository.updateQuantity(existingItem.id, newQuantity);
    }

    // Crear nuevo item
    return await cartRepository.upsertCartItem(buyerId, input.productId, input.quantity);
  },

  /**
   * Obtiene el carrito completo de un comprador
   */
  async getCart(buyerId: string): Promise<CartSummary> {
    const items = await cartRepository.findByBuyer(buyerId);
    
    // Filtrar items de productos eliminados o sin stock
    const validItems = items.filter(item => 
      item.products && !item.products.is_deleted && item.products.stock > 0
    );

    const subtotal = validItems.reduce((sum, item) => {
      return sum + (item.products?.price || 0) * item.quantity;
    }, 0);

    const itemCount = validItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: validItems,
      subtotal,
      total: subtotal,
      itemCount,
    };
  },

  /**
   * Actualiza cantidad de un item en el carrito
   */
  async updateCartItem(input: UpdateCartItemInput, buyerId: string): Promise<CartItem> {
    const cartItem = await cartRepository.findById(input.cartItemId);
    
    if (!cartItem) {
      throw new Error('Item no encontrado');
    }

    if (cartItem.buyer_id !== buyerId) {
      throw new Error('No tienes permiso para modificar este item');
    }

    // Verificar stock disponible
    const product = await productRepository.findById(cartItem.product_id);
    if (product && input.quantity > product.stock) {
      throw new Error('Cantidad excede el stock disponible');
    }

    if (input.quantity <= 0) {
      await cartRepository.removeItem(input.cartItemId);
      return cartItem;
    }

    return await cartRepository.updateQuantity(input.cartItemId, input.quantity);
  },

  /**
   * Elimina un item del carrito
   */
  async removeFromCart(cartItemId: string, buyerId: string): Promise<void> {
    const cartItem = await cartRepository.findById(cartItemId);
    
    if (!cartItem) {
      throw new Error('Item no encontrado');
    }

    if (cartItem.buyer_id !== buyerId) {
      throw new Error('No tienes permiso para eliminar este item');
    }

    await cartRepository.removeItem(cartItemId);
  },

  /**
   * Vacía el carrito de un comprador
   */
  async clearCart(buyerId: string): Promise<void> {
    await cartRepository.clearCart(buyerId);
  },

  /**
   * Verifica si un producto está en el carrito
   */
  async isInCart(buyerId: string, productId: string): Promise<boolean> {
    return await cartRepository.isInCart(buyerId, productId);
  },

  /**
   * Obtiene cantidad de items en el carrito
   */
  async getCartItemCount(buyerId: string): Promise<number> {
    return await cartRepository.countByBuyer(buyerId);
  },

  /**
   * Valida que el carrito esté listo para checkout
   */
  async validateCartForCheckout(buyerId: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const cart = await this.getCart(buyerId);
    const errors: string[] = [];

    if (cart.items.length === 0) {
      errors.push('El carrito está vacío');
    }

    for (const item of cart.items) {
      if (!item.products) {
        errors.push(`Producto ${item.product_id} no encontrado`);
        continue;
      }

      if (item.products.is_deleted) {
        errors.push(`Producto "${item.products.title}" ya no está disponible`);
      }

      if (item.products.stock < item.quantity) {
        errors.push(`Stock insuficiente para "${item.products.title}"`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};
