/**
 * ============================================================================
 * FILE: page.tsx (app/marketplace/cart)
 * ============================================================================
 * 
 * @description Vista del Carrito de Compras.
 *              Refactorizado bajo Clean Architecture, SOLID y SRP:
 *              - Lógica de estado en `useCartPage` (< 40 líneas)
 *              - Filas de ítem modulares `CartItemRow` (< 60 líneas)
 * 
 * @module Presentation/Pages/Marketplace/Cart
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Modal } from '@/components/ui/Modal';
import { useCartPage } from '@/features/cart/hooks/useCartPage';
import CartItemRow from '@/components/cart/CartItemRow';

export default function CartPage() {
  const c = useCartPage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <Header 
        cartItemCount={c.cart.itemCount} 
        cartTotal={c.cart.total} 
        ordersCount={c.ordersCount} 
      />

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100">
              Mi Carrito de Compras
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 font-medium">
              {c.cart.itemCount} {c.cart.itemCount === 1 ? 'producto seleccionado' : 'productos seleccionados'}
            </p>
          </div>
          <Link href="/marketplace" className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-bold">
            ← Seguir comprando
          </Link>
        </div>

        {c.cart.items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 text-center max-w-lg mx-auto my-12 space-y-4">
            <span className="text-6xl block">🛒</span>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">Tu carrito está vacío</h2>
            <p className="text-gray-500 text-xs font-medium">Explora nuestro catálogo y agrega tus productos favoritos.</p>
            <Link href="/marketplace" className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-extrabold transition inline-block text-xs shadow-xs">
              Explorar Marketplace
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {c.cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={c.updateQuantity}
                  onRemove={c.removeFromCart}
                />
              ))}
            </div>

            <div className="w-full lg:w-80">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 sticky top-24 space-y-4">
                <h2 className="text-lg font-black text-gray-900 dark:text-slate-100 border-b border-gray-100 dark:border-slate-800 pb-3">
                  Resumen de Compra
                </h2>
                
                <div className="space-y-2 text-xs font-medium">
                  <div className="flex justify-between text-gray-600 dark:text-slate-400">
                    <span>Productos ({c.cart.itemCount})</span>
                    <span className="font-extrabold text-gray-900 dark:text-slate-100">{c.formattedTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-slate-400">
                    <span>Envío</span>
                    <span className="font-extrabold text-emerald-600">Gratis</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={c.handleProceedToCheckout}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs transition shadow-xs cursor-pointer"
                >
                  Continuar Compra →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Autenticación Requerida para Checkout */}
      {c.showAuthModal && (
        <Modal
          isOpen={c.showAuthModal}
          onClose={() => c.setShowAuthModal(false)}
          title="Inicia sesión para continuar"
        >
          <div className="space-y-4 pt-2 text-center">
            <p className="text-xs text-gray-600 dark:text-slate-300 font-medium">
              Tus productos están guardados en el carrito de invitados. Inicia sesión o regístrate para completar tu compra con seguridad.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => c.router.push('/auth')}
                className="w-1/2 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-extrabold"
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => c.router.push('/auth/register')}
                className="w-1/2 py-2.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold"
              >
                Registrarme
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}