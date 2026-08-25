'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/features/cart/hooks/useCart';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function CartPage() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || null;

  const { cart, removeFromCart, updateQuantity } = useCart(userId);
  const { orders } = useOrders('buyer', userId);
  const router = useRouter();

  // Estado para Modal de inicio de sesión diferido
  const [showModal, setShowModal] = useState(false);

  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(cart.total || 0);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }
    router.push('/marketplace/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header estandarizado con Widget de Carrito */}
      <Header 
        cartItemCount={cart.itemCount} 
        cartTotal={cart.total} 
        ordersCount={orders.length} 
      />

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Mi Carrito de Compras</h1>
            <p className="text-sm text-gray-500 mt-1">
              {cart.itemCount} {cart.itemCount === 1 ? 'producto seleccionado' : 'productos seleccionados'}
            </p>
          </div>
          <Link href="/marketplace" className="text-blue-600 hover:text-blue-700 font-medium transition text-sm flex items-center gap-1">
            <span>←</span> Seguir comprando
          </Link>
        </div>

        {cart.items.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-lg mx-auto my-12">
            <span className="text-6xl block mb-4">🛒</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 text-sm mb-6">Explora nuestro catálogo y agrega tus productos favoritos.</p>
            <Link href="/marketplace" className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold transition inline-block shadow-sm">
              Explorar Marketplace
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Lista de productos en el carrito */}
            <div className="flex-1 space-y-4">
              {cart.items.map((item) => {
                const itemTotal = (item.products?.price || 0) * item.quantity;
                const formattedItemPrice = new Intl.NumberFormat('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                  maximumFractionDigits: 0,
                }).format(item.products?.price || 0);

                const formattedItemTotal = new Intl.NumberFormat('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                  maximumFractionDigits: 0,
                }).format(itemTotal);

                return (
                  <div key={item.id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center w-full sm:w-auto">
                      <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        {item.products?.image_urls && item.products.image_urls.length > 0 ? (
                          <img src={item.products.image_urls[0] || ''} alt={item.products.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base mb-1">{item.products?.title}</h3>
                        <p className="text-blue-600 font-extrabold text-sm">{formattedItemPrice}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      {/* Control de cantidad */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-base">{formattedItemTotal}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold mt-1 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen de compra */}
            <div className="w-full lg:w-80">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Resumen de Compra</h2>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Productos ({cart.itemCount})</span>
                    <span className="font-semibold text-gray-800">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-blue-600">{formattedTotal}</span>
                </div>

                <Button
                  onClick={handleProceedToCheckout}
                  fullWidth
                  variant="primary"
                  className="py-3.5 text-base font-bold shadow-sm"
                >
                  Proceder al Pago
                </Button>
                
                <p className="text-xs text-gray-400 mt-4 text-center">
                  🔒 Compra 100% protegida y segura
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Registro / Iniciar Sesión Diferido */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="sm"
      >
        <div className="text-center p-6 rounded-t-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-6xl mb-3">🔒</div>
          <h3 className="text-2xl font-bold text-gray-900">
            Registro / Iniciar Sesión
          </h3>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-center whitespace-pre-line leading-relaxed mb-6">
            Para proceder al pago y coordinar el envío de tus productos, necesitas ingresar a tu cuenta o registrarte de forma gratuita.
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setShowModal(false)}
              variant="secondary"
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setShowModal(false);
                router.push('/auth');
              }}
              variant="primary"
              fullWidth
            >
              Iniciar Sesión / Registrarse
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}