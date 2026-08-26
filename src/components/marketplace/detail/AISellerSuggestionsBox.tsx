/**
 * ============================================================================
 * FILE: AISellerSuggestionsBox.tsx
 * ============================================================================
 * 
 * @description Componente modular "Sugerencias de IA para mejorar la publicación"
 *              orientado al vendedor (Imagen 3).
 * 
 * @module Presentation/Components/Marketplace/Detail/AISellerSuggestionsBox
 * ============================================================================
 */

import React from 'react';

type Props = {
  isOwnProduct: boolean;
};

export default function AISellerSuggestionsBox({ isOwnProduct }: Props) {
  if (!isOwnProduct) return null;

  return (
    <div className="bg-amber-50/70 dark:bg-amber-950/40 rounded-3xl p-5 border border-amber-200 dark:border-amber-900/60 shadow-2xs space-y-3 text-amber-900 dark:text-amber-200">
      <div className="flex items-center gap-2">
        <span className="text-xl">💡</span>
        <h3 className="text-xs font-black tracking-tight uppercase">
          Sugerencias de IA para mejorar esta publicación
        </h3>
      </div>

      <ul className="space-y-1.5 text-xs font-semibold pl-6 list-disc text-amber-800 dark:text-amber-300">
        <li>Agrega al menos 2 fotos adicionales mostrando el producto en uso para aumentar las conversiones en un +25%.</li>
        <li>Completa la tabla de dimensiones en la descripción para reducir las consultas repetitivas de compradores.</li>
        <li>Destaca las políticas de garantía o envío rápido para obtener la insignia de Vendedor Destacado.</li>
      </ul>
    </div>
  );
}
