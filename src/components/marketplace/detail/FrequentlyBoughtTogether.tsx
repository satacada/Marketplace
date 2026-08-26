/**
 * ============================================================================
 * FILE: FrequentlyBoughtTogether.tsx
 * ============================================================================
 * 
 * @description Componente modular "Este producto se compra frecuentemente con este otro"
 *              al estilo Amazon / AliExpress (Imagen 3).
 * 
 * @module Presentation/Components/Marketplace/Detail/FrequentlyBoughtTogether
 * ============================================================================
 */

import React from 'react';

type Props = {
  mainProductTitle: string;
  mainProductPrice: number;
};

export default function FrequentlyBoughtTogether({
  mainProductTitle,
  mainProductPrice,
}: Props) {
  const accessoryTitle = "Kit de Mantenimiento & Funda de Protección Premium";
  const accessoryPrice = 3500;
  const totalPrice = mainProductPrice + accessoryPrice;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl p-5 border border-blue-200/80 dark:border-slate-800 shadow-2xs space-y-4 text-gray-900 dark:text-slate-100">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <h3 className="text-sm font-black tracking-tight text-gray-900 dark:text-slate-100">
          Este producto se compra frecuentemente con este otro
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Productos Combinados */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-blue-600 shadow-xs">
            Principal
          </div>
          <span className="text-lg font-black text-gray-400">+</span>
          <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-600 shadow-xs">
            Combo
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-extrabold text-gray-800 dark:text-slate-200 truncate max-w-xs">{mainProductTitle}</p>
            <p className="text-gray-500 font-bold text-[11px]">+ {accessoryTitle}</p>
          </div>
        </div>

        {/* Precio Total y Acción */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div>
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Precio Combo</span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">${totalPrice.toLocaleString('es-AR')}</span>
          </div>

          <button
            type="button"
            onClick={() => alert('¡Combo guardado en tu carrito!')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition shadow-xs cursor-pointer whitespace-nowrap"
          >
            🛒 Comprar Ambos
          </button>
        </div>
      </div>
    </div>
  );
}
