/**
 * ============================================================================
 * FILE: CartItemRow.tsx
 * ============================================================================
 * 
 * @description Componente modular para renderizar ítems del carrito de compras.
 * 
 * @module Presentation/Components/Cart/CartItemRow
 * ============================================================================
 */

import React from 'react';

type Props = {
  item: any;
  onUpdateQuantity: (input: { itemId: string; quantity: number }) => void;
  onRemove: (itemId: string) => void;
};

export default function CartItemRow({ item, onUpdateQuantity, onRemove }: Props) {
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
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex gap-4 items-center w-full sm:w-auto">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-slate-700">
          {item.products?.image_urls && item.products.image_urls.length > 0 ? (
            <img src={item.products.image_urls[0] || ''} alt={item.products.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-slate-500 text-xs font-bold">Sin foto</div>
          )}
        </div>
        <div>
          <h3 className="font-extrabold text-gray-900 dark:text-slate-100 text-base mb-1">{item.products?.title}</h3>
          <p className="text-blue-600 dark:text-blue-400 font-extrabold text-sm">{formattedItemPrice}</p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-slate-800">
        <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => onUpdateQuantity({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
            className="px-3 py-1 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold"
          >
            -
          </button>
          <span className="px-3 py-1 text-sm font-bold text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
            className="px-3 py-1 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold"
          >
            +
          </button>
        </div>

        <div className="text-right">
          <p className="font-extrabold text-gray-900 dark:text-slate-100 text-base">{formattedItemTotal}</p>
          <button 
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-rose-500 hover:text-rose-700 text-xs font-bold mt-1 transition cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
