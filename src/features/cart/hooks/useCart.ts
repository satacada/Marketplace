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
import { getLocalStorageItem, setLocalStorageItem } from '@/shared/utils/localStorage';

type GuestCartItem = {
  productId: string;
  title: string;
  price: number;
  image_url: string | null;
  quantity: number;
  seller_id: string;
};

const GUEST_CART_KEY = 'guest_cart';

export function useCart(buyerId: string | null = null) {
  const [cart, setCart] = useState<CartSummary>({
    items: [],
    subtotal: 0,
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  // Cargar carrito de localStorage para usuarios no registrados con auto-recuperación de precio
  const loadGuestCart = useCallback(async () => {
    if (buyerId) {
      setIsGuest(false);
      return;
    }

    let guestCartData = getLocalStorageItem<GuestCartItem[]>(GUEST_CART_KEY, []);
    
    // Auto-recuperación: si hay ítems con precio 0 o ausente en localStorage, consultar precio real en Supabase
    const zeroPriceItemIds = guestCartData
      .filter(item => !item.price || item.price === 0)
      .map(item => item.productId);

    if (zeroPriceItemIds.length > 0) {
      try {
        const { supabase } = await import('@/infrastructure/database/supabase.client');
        const { data: priceData } = await supabase
          .from('products')
          .select('id, price')
          .in('id', zeroPriceItemIds);

        if (priceData && priceData.length > 0) {
          const priceMap = new Map(priceData.map(p => [p.id, Number(p.price) || 0]));
          let updated = false;
          guestCartData = guestCartData.map(item => {
            if ((!item.price || item.price === 0) && priceMap.has(item.productId)) {
              updated = true;
              return { ...item, price: priceMap.get(item.productId)! };
            }
            return item;
          });

          if (updated) {
            setLocalStorageItem(GUEST_CART_KEY, guestCartData);
          }
        }
      } catch (err) {
        console.error('Error al auto-recuperar precios de carrito de invitado:', err);
      }
    }

    const items = guestCartData.map(item => ({
      id: `guest-${item.productId}`,
      buyer_id: 'guest',
      product_id: item.productId,
      quantity: item.quantity,
      created_at: new Date().toISOString(),
      products: {
        id: item.productId,
        title: item.title,
        price: item.price || 0,
        stock: 99,
        image_urls: item.image_url ? [item.image_url] : [],
        is_deleted: false,
      },
    }));

    const subtotal = items.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    setCart({
      items,
      subtotal,
      total: subtotal,
      itemCount,
    });
    setIsGuest(true);
  }, [buyerId]);

  const fetchCart = useCallback(async () => {
    // Si es usuario no registrado, usar localStorage
    if (!buyerId) {
      await loadGuestCart();
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
  }, [buyerId, loadGuestCart]);

  /**
   * Agrega un producto al carrito
   */
  const addToCart = useCallback(async (input: AddToCartInput, productInfo?: { title: string; price?: number; image_url: string | null; seller_id: string }) => {
    // Si es usuario no registrado, usar localStorage
    if (!buyerId) {
      try {
        const guestCart = getLocalStorageItem<GuestCartItem[]>(GUEST_CART_KEY, []);
        const existingItem = guestCart.find(item => item.productId === input.productId);
        
        if (existingItem) {
          existingItem.quantity += input.quantity;
          if (productInfo?.price && (!existingItem.price || existingItem.price === 0)) {
            existingItem.price = productInfo.price;
          }
        } else {
          if (productInfo) {
            guestCart.push({
              productId: input.productId,
              title: productInfo.title,
              price: productInfo.price || 0,
              image_url: productInfo.image_url,
              quantity: input.quantity,
              seller_id: productInfo.seller_id,
            });
          }
        }
        
        setLocalStorageItem(GUEST_CART_KEY, guestCart);
        await loadGuestCart();
        return { success: true };
      } catch (err: any) {
        const errorMessage = err.message || 'Error al agregar al carrito';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
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
  }, [buyerId, fetchCart, loadGuestCart]);

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
    // Si es usuario no registrado, usar localStorage
    if (!buyerId) {
      try {
        const guestCart = getLocalStorageItem<GuestCartItem[]>(GUEST_CART_KEY, []);
        const productId = cartItemId.replace('guest-', '');
        const updatedCart = guestCart.filter(item => item.productId !== productId);
        
        setLocalStorageItem(GUEST_CART_KEY, updatedCart);
        loadGuestCart();
        return { success: true };
      } catch (err: any) {
        const errorMessage = err.message || 'Error al eliminar item';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
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
  }, [buyerId, fetchCart, loadGuestCart]);

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

  // Cargar carrito de invitado al montar
  useEffect(() => {
    if (!buyerId) {
      loadGuestCart();
    }
  }, [buyerId, loadGuestCart]);

  /**
   * Actualiza la cantidad de un item por ID e importe
   */
  const updateQuantity = useCallback(async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    if (!buyerId) {
      try {
        const guestCart = getLocalStorageItem<GuestCartItem[]>(GUEST_CART_KEY, []);
        const productId = itemId.replace('guest-', '');
        const item = guestCart.find(i => i.productId === productId);
        if (item) {
          item.quantity = quantity;
          setLocalStorageItem(GUEST_CART_KEY, guestCart);
          loadGuestCart();
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return await updateCartItem({ cartItemId: itemId, quantity });
  }, [buyerId, loadGuestCart, updateCartItem]);

  return {
    cart,
    itemCount: cart.itemCount,
    total: cart.total,
    loading,
    error,
    refresh: fetchCart,
    addToCart,
    updateCartItem,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    validateForCheckout,
  };
}
