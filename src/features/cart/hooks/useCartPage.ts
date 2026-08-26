/**
 * ============================================================================
 * FILE: useCartPage.ts
 * ============================================================================
 * 
 * @description Custom Hook para la gestión del carrito de compras y control
 *              de checkout autenticado o diferido (SOLID / SRP).
 * 
 * @module Features/Cart/Hooks/useCartPage
 * ============================================================================
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrders } from '@/features/orders/hooks/useOrders';

export function useCartPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || null;

  const { cart, removeFromCart, updateQuantity } = useCart(userId);
  const { orders } = useOrders('buyer', userId);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(cart.total || 0);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    router.push('/marketplace/checkout');
  };

  return {
    cart,
    ordersCount: orders.length,
    formattedTotal,
    removeFromCart,
    updateQuantity,
    showAuthModal,
    setShowAuthModal,
    handleProceedToCheckout,
    router,
  };
}
