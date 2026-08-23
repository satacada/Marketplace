/**
 * ============================================================================
 * FILE: useCart.ts
 * ============================================================================
 * 
 * @description Hook personalizado para gestionar el carrito.
 *              Proporciona estado y operaciones del carrito.
 * 
 * @module Features/Cart/Hooks
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react (useState, useEffect, useCallback)
 * - @/features/cart/services/cart.service
 * - @/features/cart/types/cart.types.ts
 * 
 * @related-files
 * - @/features/cart/services/cart.service.ts
 * - @/features/cart/types/cart.types.ts
 * 
 * @exports
 * - useCart (hook)
 * 
 * @example
 * ```tsx
 * const { cart, itemCount, addToCart, removeFromCart, loading } = useCart(buyerId);
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cart.service';
import { CartSummary, AddToCartInput, UpdateCartItemInput } from '../types/cart.types';

export function useCart(buyerId: string | null) {
  const [cart, setCart] = useState<CartSummary>({
    items: [],
    subtotal: 0,
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!buyerId) {
      setCart({ items: [], subtotal: 0, total: 0, itemCount: 0 });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart(buyerId);
      setCart(cartData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar carrito');
      setCart({ items: [], subtotal: 0, total: 0, itemCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [buyerId]);

  /**
   * Agrega un producto al carrito
   */
  const addToCart = useCallback(async (input: AddToCartInput) => {
    if (!buyerId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setError(null);
      await cartService.addToCart(input, buyerId);
      await fetchCart();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al agregar al carrito';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [buyerId, fetchCart]);

  /**
   * Actualiza cantidad de un item
   */
  const updateCartItem = useCallback(async (input: UpdateCartItemInput) => {
    if (!buyerId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setError(null);
      await cartService.updateCartItem(input, buyerId);
      await fetchCart();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [buyerId, fetchCart]);

  /**
   * Elimina un item del carrito
   */
  const removeFromCart = useCallback(async (cartItemId: string) => {
    if (!buyerId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setError(null);
      await cartService.removeFromCart(cartItemId, buyerId);
      await fetchCart();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [buyerId, fetchCart]);

  /**
   * Vacía el carrito
   */
  const clearCart = useCallback(async () => {
    if (!buyerId) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setError(null);
      await cartService.clearCart(buyerId);
      await fetchCart();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al vaciar carrito';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [buyerId, fetchCart]);

  /**
   * Verifica si un producto está en el carrito
   */
  const isInCart = useCallback(async (productId: string) => {
    if (!buyerId) return false;
    return await cartService.isInCart(buyerId, productId);
  }, [buyerId]);

  /**
   * Valida el carrito para checkout
   */
  const validateForCheckout = useCallback(async () => {
    if (!buyerId) {
      return { valid: false, errors: ['Usuario no autenticado'] };
    }

    try {
      setError(null);
      return await cartService.validateCartForCheckout(buyerId);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al validar carrito';
      setError(errorMessage);
      return { valid: false, errors: [errorMessage] };
    }
  }, [buyerId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    itemCount: cart.itemCount,
    total: cart.total,
    loading,
    error,
    refresh: fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isInCart,
    validateForCheckout,
  };
}
