/**
 * ============================================================================
 * FILE: MiniCartDrawer.tsx
 * ============================================================================
 * 
 * @description Panel Lateral Emergente Deslizante (Slide-Over Drawer) para la Cesta.
 *              No ocupa espacio en la grilla del catálogo (los productos mantienen su ancho completo).
 *              Permite ver items de la cesta en modo emergente sin salir del catálogo.
 * 
 * @module Presentation/Components/Cart/MiniCartDrawer
 * ============================================================================
 */

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CartSummary } from '@/features/cart/types/cart.types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cart: CartSummary;
  isGuest: boolean;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckoutClick: () => void;
};

export default function MiniCartDrawer({
  isOpen,
  onClose,
  cart,
  isGuest,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutClick,
}: Props) {
  const router = useRouter();

  if (!isOpen) return null;

  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(cart.total || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Fondo Oscuro Semi-transparente de fondo (Backdrop) */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Contenedor del Drawer Emergente Deslizante */}
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between text-gray-900 dark:text-slate-100 p-6 space-y-6">
          
          {/* Header del Drawer */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100">
                  Cesta ({cart.itemCount})
                </h3>
                {isGuest && (
                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400">
                    Modo Invitado (No registrado)
                  </span>
                )}
              </div>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 text-lg font-black transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Lista de Artículos en la Cesta */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {cart.items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <span className="text-5xl block">🛍️</span>
                <p className="text-sm font-extrabold text-gray-600 dark:text-slate-300">Tu cesta está vacía</p>
                <p className="text-xs text-gray-400">¡Explora los productos y agrega tus favoritos!</p>
              </div>
            ) : (
              cart.items.map((item) => {
                const image = item.products?.image_urls?.[0];
                const title = item.products?.title || 'Producto';
                const price = item.products?.price || 0;

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="w-14 h-14 relative bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200/50">
                      {image ? (
                        <Image src={image} alt={title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100 truncate">{title}</h4>
                      <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                        ${price.toLocaleString('es-CL')}
                      </p>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs font-black flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-black px-2 text-gray-900 dark:text-slate-100">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs font-black flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 text-base p-1 transition cursor-pointer"
                      title="Eliminar de la cesta"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del Drawer con Estimación Total y Botones de Acción */}
          <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-600 dark:text-slate-400">Estimación total:</span>
              <span className="font-black text-xl text-gray-900 dark:text-slate-100">{formattedTotal}</span>
            </div>

            <button
              type="button"
              onClick={onCheckoutClick}
              disabled={cart.items.length === 0}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl text-xs font-black transition shadow-sm cursor-pointer text-center"
            >
              Continuar ({cart.itemCount})
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                router.push('/marketplace/cart');
              }}
              className="w-full py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-2xl text-xs font-extrabold transition cursor-pointer text-center"
            >
              Ir a la Cesta completa →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
