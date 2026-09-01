/**
 * ============================================================================
 * FILE: MiniCartSidebar.tsx
 * ============================================================================
 * 
 * @description Panel lateral de Cesta / Carrito Flotante al estilo AliExpress (Imágenes 2, 3 y 4).
 *              Permite a usuarios no registrados (invitados) y registrados visualizar
 *              sus productos agregados a la cesta en tiempo real, modificar cantidades,
 *              y ser guiados al registro/login únicamente al hacer clic en "Continuar".
 * 
 * @module Presentation/Components/Cart/MiniCartSidebar
 * ============================================================================
 */

import React from 'react';
import Image from 'next/image';
import { CartSummary } from '@/features/cart/types/cart.types';

type Props = {
  cart: CartSummary;
  isGuest: boolean;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckoutClick: () => void;
};

export default function MiniCartSidebar({
  cart,
  isGuest,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutClick,
}: Props) {
  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(cart.total || 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200/90 dark:border-slate-800 shadow-xs space-y-4 sticky top-20 text-gray-900 dark:text-slate-100">
      {/* Encabezado Cesta (Estilo AliExpress Imagen 3 y 4) */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">🛒</span>
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-slate-100">
            Cesta ({cart.itemCount})
          </h3>
        </div>
        {isGuest && (
          <span className="text-[10px] font-extrabold bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full">
            Modo Invitado
          </span>
        )}
      </div>

      {/* Resumen de Pago Estilo AliExpress (Imagen 3 y 4) */}
      <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-gray-600 dark:text-slate-400">Estimación total:</span>
          <span className="font-black text-lg text-gray-900 dark:text-slate-100">{formattedTotal}</span>
        </div>

        <button
          type="button"
          onClick={onCheckoutClick}
          disabled={cart.items.length === 0}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl text-xs font-black transition shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Continuar ({cart.itemCount})</span>
        </button>

        {isGuest && (
          <p className="text-[10px] text-gray-500 dark:text-slate-400 text-center font-medium">
            🔒 Iniciarás sesión o te registrarás al hacer clic en <strong>Continuar</strong>.
          </p>
        )}
      </div>

      {/* Lista de Artículos en Cesta */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        <p className="text-[11px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
          Artículos en tu cesta
        </p>

        {cart.items.length === 0 ? (
          <div className="py-8 text-center space-y-1">
            <span className="text-3xl">🛍️</span>
            <p className="text-xs text-gray-400 font-medium">Tu cesta está vacía.</p>
            <p className="text-[10px] text-gray-400">¡Agrega productos para verlos aquí!</p>
          </div>
        ) : (
          cart.items.map((item) => {
            const image = item.products?.image_urls?.[0];
            const title = item.products?.title || 'Producto';
            const price = item.products?.price || 0;

            return (
              <div
                key={item.id}
                className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs group"
              >
                {/* Imagen del producto */}
                <div className="w-12 h-12 relative bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200/50">
                  {image ? (
                    <Image src={image} alt={title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                  )}
                </div>

                {/* Info + Modificador de Cantidad */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100 truncate">{title}</h4>
                  <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                    ${price.toLocaleString('es-CL')}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-xs font-black text-gray-700 dark:text-slate-300 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-black px-1.5 text-gray-900 dark:text-slate-100">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-xs font-black text-gray-700 dark:text-slate-300 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Eliminar Item */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500 text-sm p-1 transition cursor-pointer"
                  title="Eliminar de la cesta"
                >
                  🗑️
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Protección del comprador estilo AliExpress */}
      <div className="pt-2 border-t border-gray-100 dark:border-slate-800 text-[10px] text-gray-500 dark:text-slate-400 space-y-1">
        <p className="font-extrabold text-gray-700 dark:text-slate-300 flex items-center gap-1">
          <span>🛡️</span>
          <span>Protección del comprador</span>
        </p>
        <p>Recibe reembolso completo de tu dinero si el artículo no llega o es diferente a la descripción.</p>
      </div>
    </div>
  );
}
